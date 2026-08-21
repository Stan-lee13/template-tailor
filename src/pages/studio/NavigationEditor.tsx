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
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 group">
      <button {...attributes} {...listeners} className="p-2 cursor-grab text-white/20 hover:text-white transition-colors" title="Drag"><GripVertical size={16} /></button>
      <input
        value={item.label}
        onChange={(e) => onChange({ label: e.target.value })}
        placeholder="Label"
        className="flex-1 min-w-[80px] px-4 py-2 rounded-xl bg-black/40 border border-white/5 text-white font-black text-xs uppercase tracking-widest focus:outline-none focus:border-[#C56A4A]/50 transition-all"
      />
      <input
        value={item.href}
        onChange={(e) => onChange({ href: e.target.value })}
        placeholder="/path or https://"
        className="flex-1 min-w-[120px] px-4 py-2 rounded-xl bg-black/40 border border-white/5 text-white font-black text-[10px] tracking-widest focus:outline-none focus:border-[#C56A4A]/50 transition-all"
      />
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={item.enabled}
          onChange={(e) => onChange({ enabled: e.target.checked })}
          className="w-4 h-4 rounded border-white/20 bg-black text-[#C56A4A] focus:ring-[#C56A4A]"
        />
        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Live</span>
      </label>
      <button onClick={onDelete} className="p-2 rounded-xl text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all" title="Delete"><Trash2 size={16} /></button>
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
      toast.success(`${title} matrix updated`);
      reload();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  const deleteRow = async (id: string) => {
    const { error } = await supabase.from('nav_items').delete().eq('id', id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  return (
    <section className="rounded-[2.5rem] p-8 bg-black border border-white/10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
        <div className="flex gap-3">
          <button onClick={addRow} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-white/5 text-white hover:bg-white/10 transition-all"><Plus size={14} strokeWidth={3} /> Inject</button>
          <button onClick={saveAll} disabled={saving} className="px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-[#C56A4A] text-black hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(197,106,74,0.1)] disabled:opacity-50">{saving ? '...' : 'Sync Order'}</button>
        </div>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {rows.length === 0 && <p className="text-xs font-medium text-white/20 text-center py-8 border border-dashed border-white/10 rounded-3xl">No nodes active in this cluster.</p>}
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
      <div className="mb-12">
        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">Navigation <span className="text-gradient-warm">Matrix</span></h1>
        <p className="text-white/40 font-medium">Map the neural pathways of your retention engine.</p>
      </div>
      {loading ? (
        <div className="flex items-center gap-3 text-white/20 font-black text-xs uppercase tracking-widest">
          <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-[#C56A4A] animate-spin" />
          Synchronizing Map...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {LOCATIONS.map((l) => (
            <Group key={l.key} location={l.key} title={l.title} items={items.filter((i) => i.location === l.key)} reload={load} />
          ))}
        </div>
      )}
    </StudioLayout>
  );
}
