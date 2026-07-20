import { useEffect, useState } from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { logActivity } from '@/lib/activity';

type NavItem = { id: string; parent_id: string | null; location: string; label: string; href: string; position: number; enabled: boolean; external: boolean };

const LOCATIONS = [
  { key: 'header', title: 'Header' },
  { key: 'footer_resources', title: 'Footer — Resources' },
  { key: 'footer_solutions', title: 'Footer — Solutions' },
  { key: 'footer_company', title: 'Footer — Company' },
  { key: 'footer_legal', title: 'Footer — Legal' },
];

function Row({ item, onChange, onDelete }: { item: NavItem; onChange: (patch: Partial<NavItem>) => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <div ref={setNodeRef} style={{ ...style, background: '#fff', border: '1px solid #E2DDD3' }} className="flex items-center gap-2 px-3 py-2 rounded-md">
      <button {...attributes} {...listeners} className="p-1 cursor-grab" title="Drag"><GripVertical size={14} color="#888" /></button>
      <input value={item.label} onChange={(e) => onChange({ label: e.target.value })} placeholder="Label" className="flex-1 min-w-[80px] px-2 py-1.5 rounded border font-inter text-sm" style={{ borderColor: '#E2DDD3' }} />
      <input value={item.href} onChange={(e) => onChange({ href: e.target.value })} placeholder="/path or https://" className="flex-1 min-w-[120px] px-2 py-1.5 rounded border font-inter text-sm" style={{ borderColor: '#E2DDD3' }} />
      <label className="flex items-center gap-1 font-inter text-xs" style={{ color: '#666' }}>
        <input type="checkbox" checked={item.enabled} onChange={(e) => onChange({ enabled: e.target.checked })} /> On
      </label>
      <button onClick={onDelete} className="p-1.5 rounded hover:bg-red-50" title="Delete"><Trash2 size={14} color="#dc2626" /></button>
    </div>
  );
}

function Group({ location, title, items, reload }: { location: string; title: string; items: NavItem[]; reload: () => void }) {
  const [rows, setRows] = useState<NavItem[]>(items);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setRows(items); }, [items]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const oldIndex = rows.findIndex((r) => r.id === e.active.id);
    const newIndex = rows.findIndex((r) => r.id === e.over!.id);
    setRows(arrayMove(rows, oldIndex, newIndex));
  };

  const addRow = async () => {
    const newRow = { location, label: 'New link', href: '/', position: rows.length, enabled: true, external: false, parent_id: null };
    const { data, error } = await supabase.from('nav_items').insert(newRow).select().single();
    if (error) return toast.error(error.message);
    setRows((r) => [...r, data as NavItem]);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const updates = rows.map((r, i) => ({ id: r.id, position: i, label: r.label, href: r.href, enabled: r.enabled, location: r.location, parent_id: r.parent_id, external: r.external }));
      const { error } = await supabase.from('nav_items').upsert(updates);
      if (error) throw error;
      await logActivity('nav_items.save', 'nav', undefined, { location, count: updates.length });
      toast.success(`${title} saved`);
      reload();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  const deleteRow = async (id: string) => {
    const { error } = await supabase.from('nav_items').delete().eq('id', id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <section className="rounded-xl p-5" style={{ background: '#fafaf7', border: '1px solid #E2DDD3' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-outfit font-medium">{title}</h3>
        <div className="flex gap-2">
          <button onClick={addRow} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded font-inter text-xs" style={{ background: '#0A0A0A', color: '#f1ece4' }}><Plus size={12} /> Add</button>
          <button onClick={saveAll} disabled={saving} className="px-2.5 py-1.5 rounded font-inter text-xs font-medium disabled:opacity-50" style={{ background: '#F97316', color: '#0A0A0A' }}>{saving ? 'Saving…' : 'Save order'}</button>
        </div>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {rows.length === 0 && <p className="font-inter text-xs" style={{ color: '#888' }}>No items. Add one to get started.</p>}
            {rows.map((r) => (
              <Row key={r.id} item={r} onChange={(patch) => setRows((rs) => rs.map((x) => x.id === r.id ? { ...x, ...patch } : x))} onDelete={() => deleteRow(r.id)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}

export default function NavigationEditor() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('nav_items').select('*').order('location').order('position');
    setItems((data as NavItem[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  return (
    <StudioLayout>
      <div className="mb-6">
        <h1 className="font-outfit font-medium text-3xl sm:text-4xl mb-1" style={{ color: '#0A0A0A', letterSpacing: '-0.02em' }}>Navigation</h1>
        <p className="font-inter text-sm" style={{ color: '#666' }}>Manage header and footer menus. Drag to reorder, then save.</p>
      </div>
      {loading ? <p className="font-inter text-sm">Loading…</p> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {LOCATIONS.map((l) => (
            <Group key={l.key} location={l.key} title={l.title} items={items.filter((i) => i.location === l.key)} reload={load} />
          ))}
        </div>
      )}
    </StudioLayout>
  );
}
