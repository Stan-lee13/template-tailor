import { useEffect, useMemo, useState } from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Trash2, Copy, Eye, EyeOff, GripVertical, Save, History, BookmarkPlus, Monitor, Tablet, Smartphone, RefreshCw } from 'lucide-react';
import { SECTION_LIST, getSection, withDefaults } from '@/studio/sections/registry';
import SectionInspector from '@/components/studio/SectionInspector';
import { logActivity, saveRevision } from '@/lib/activity';
import { useQueryClient } from '@tanstack/react-query';

type Page = { id: string; path: string; title: string };
type Section = { id: string; page_id: string | null; section_key: string; type: string; position: number; enabled: boolean; content: Record<string, unknown>; updated_at: string };
type Revision = { id: string; created_at: string; label: string | null; snapshot: any };

export default function SiteEditor() {
  const [pages, setPages] = useState<Page[]>([]);
  const [pageId, setPageId] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const selected = useMemo(() => sections.find((s) => s.id === selectedId) || null, [sections, selectedId]);
  const currentPage = useMemo(() => pages.find((p) => p.id === pageId) || null, [pages, pageId]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_pages').select('id,path,title').order('path');
      const list = (data as Page[]) || [];
      setPages(list);
      if (list.length && !pageId) setPageId(list.find((p) => p.path === '/')?.id || list[0].id);
    })();
  }, []);

  useEffect(() => {
    if (!pageId) return;
    (async () => {
      const { data } = await supabase.from('site_sections').select('*').eq('page_id', pageId).order('position');
      setSections((data as Section[]) || []);
      setSelectedId(null);
    })();
  }, [pageId]);

  const refreshPreview = () => setPreviewKey((k) => k + 1);

  const persist = async (patch: Partial<Section> & { id: string }) => {
    setSaving(true);
    const clean = { ...patch } as any; delete clean.id;
    const { error } = await supabase.from('site_sections').update(clean).eq('id', patch.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    await saveRevision('section', patch.id, patch);
    await logActivity('section.update', 'section', patch.id, { keys: Object.keys(clean) });
    qc.invalidateQueries({ queryKey: ['section_content'] });
    qc.invalidateQueries({ queryKey: ['page_sections'] });
    refreshPreview();
  };

  const updateSelected = (content: Record<string, unknown>) => {
    if (!selected) return;
    setSections((rows) => rows.map((r) => (r.id === selected.id ? { ...r, content } : r)));
  };

  const commitSelected = async () => {
    if (!selected) return;
    await persist({ id: selected.id, content: selected.content });
    toast.success('Saved');
  };

  const toggleEnabled = async (s: Section) => {
    setSections((rows) => rows.map((r) => (r.id === s.id ? { ...r, enabled: !r.enabled } : r)));
    await persist({ id: s.id, enabled: !s.enabled });
  };

  const duplicate = async (s: Section) => {
    const { data, error } = await supabase.from('site_sections').insert({
      page_id: s.page_id, section_key: `${s.section_key}_copy_${Date.now().toString(36)}`,
      type: s.type, content: s.content as any, position: s.position + 1, enabled: s.enabled,
    }).select().single();
    if (error) return toast.error(error.message);
    await logActivity('section.duplicate', 'section', data.id);
    setSections((r) => [...r, data as Section].sort((a, b) => a.position - b.position));
    toast.success('Duplicated');
  };

  const remove = async (s: Section) => {
    if (!confirm(`Delete section "${s.section_key}"?`)) return;
    const { error } = await supabase.from('site_sections').delete().eq('id', s.id);
    if (error) return toast.error(error.message);
    await logActivity('section.delete', 'section', s.id);
    setSections((r) => r.filter((x) => x.id !== s.id));
    if (selectedId === s.id) setSelectedId(null);
    refreshPreview();
  };

  const addSection = async (type: string, contentOverride?: Record<string, unknown>) => {
    const def = getSection(type); if (!def) return;
    const nextPos = (sections.at(-1)?.position ?? 0) + 10;
    const { data, error } = await supabase.from('site_sections').insert({
      page_id: pageId, section_key: `${type}_${Date.now().toString(36)}`, type, position: nextPos, enabled: true,
      content: (contentOverride ?? def.defaults) as any,
    }).select().single();
    if (error) return toast.error(error.message);
    await logActivity('section.create', 'section', data.id, { type });
    setSections((r) => [...r, data as Section]);
    setSelectedId(data.id); setPickerOpen(false);
    qc.invalidateQueries({ queryKey: ['section_content'] });
    qc.invalidateQueries({ queryKey: ['page_sections'] });
    refreshPreview();
  };

  const saveAsTemplate = async (s: Section) => {
    const name = prompt('Template name?'); if (!name) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('section_templates').insert({ name, type: s.type, content: s.content as any, created_by: user?.id });
    if (error) return toast.error(error.message);
    toast.success('Saved as template');
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e; if (!over || active.id === over.id) return;
    const oldIdx = sections.findIndex((s) => s.id === active.id);
    const newIdx = sections.findIndex((s) => s.id === over.id);
    const next = arrayMove(sections, oldIdx, newIdx).map((s, i) => ({ ...s, position: (i + 1) * 10 }));
    setSections(next);
    await Promise.all(next.map((s) => supabase.from('site_sections').update({ position: s.position }).eq('id', s.id)));
    await logActivity('section.reorder', 'page', pageId || undefined);
    qc.invalidateQueries({ queryKey: ['section_content'] });
    qc.invalidateQueries({ queryKey: ['page_sections'] });
    refreshPreview();
  };

  const deviceWidth = device === 'desktop' ? '100%' : device === 'tablet' ? '820px' : '390px';
  const previewSrc = currentPage ? `${currentPage.path}?studio_preview=1&k=${previewKey}` : '/';

  return (
    <StudioLayout>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="font-outfit font-medium text-3xl" style={{ color: '#0A0A0A', letterSpacing: '-0.02em' }}>Site editor</h1>
          <p className="font-inter text-sm" style={{ color: '#666' }}>Edit every section on every page. Changes go live instantly.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={pageId || ''} onChange={(e) => setPageId(e.target.value)} className="px-3 py-2 rounded-md border font-inter text-sm" style={{ borderColor: '#E2DDD3' }}>
            {pages.map((p) => <option key={p.id} value={p.id}>{p.title || p.path}</option>)}
          </select>
          <div className="flex rounded-md border overflow-hidden" style={{ borderColor: '#E2DDD3' }}>
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
              <button key={d} onClick={() => setDevice(d)} className="px-2.5 py-2" style={{ background: device === d ? '#0A0A0A' : '#fff', color: device === d ? '#fff' : '#0A0A0A' }}>
                {d === 'desktop' ? <Monitor size={14} /> : d === 'tablet' ? <Tablet size={14} /> : <Smartphone size={14} />}
              </button>
            ))}
          </div>
          <button onClick={refreshPreview} className="p-2 rounded-md border" style={{ borderColor: '#E2DDD3' }}><RefreshCw size={14} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[280px,1fr,340px] gap-4">
        {/* Section list */}
        <aside className="rounded-xl p-3 max-h-[80vh] overflow-y-auto" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-inter text-xs uppercase tracking-wider" style={{ color: '#888' }}>Sections</span>
            <button onClick={() => setPickerOpen(true)} className="inline-flex items-center gap-1 px-2 py-1 rounded font-inter text-xs" style={{ background: '#F97316', color: '#0A0A0A' }}><Plus size={12} />Add</button>
          </div>
          {sections.length === 0 ? (
            <p className="font-inter text-xs text-gray-500 p-2">No sections yet. Click "Add" to create one.</p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-1">
                  {sections.map((s) => <SortableRow key={s.id} s={s} selected={selectedId === s.id} onSelect={() => setSelectedId(s.id)} onToggle={() => toggleEnabled(s)} onDuplicate={() => duplicate(s)} onRemove={() => remove(s)} onTemplate={() => saveAsTemplate(s)} />)}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </aside>

        {/* Preview */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#0A0A0A', border: '1px solid #E2DDD3', minHeight: '80vh' }}>
          <div className="flex justify-center py-4">
            <iframe key={previewKey} src={previewSrc} title="Preview" style={{ width: deviceWidth, height: '78vh', background: '#fff', border: 'none', borderRadius: 8, transition: 'width 0.2s' }} />
          </div>
        </div>

        {/* Inspector */}
        <aside className="rounded-xl p-4 max-h-[80vh] overflow-y-auto" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-inter text-xs uppercase tracking-wider" style={{ color: '#888' }}>{selected.type}</p>
                  <h3 className="font-outfit text-lg font-medium">{getSection(selected.type)?.label || selected.section_key}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setHistoryOpen(true)} title="Version history" className="p-2 rounded hover:bg-gray-100"><History size={14} /></button>
                  <button onClick={commitSelected} disabled={saving} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-inter text-xs font-medium disabled:opacity-50" style={{ background: '#F97316', color: '#0A0A0A' }}><Save size={12} />{saving ? '…' : 'Save'}</button>
                </div>
              </div>
              {getSection(selected.type) && (
                <SectionInspector def={getSection(selected.type)!} value={withDefaults(selected.type, selected.content)} onChange={updateSelected} />
              )}
              {historyOpen && <RevisionPanel sectionId={selected.id} onRestore={async (snap) => { updateSelected(snap.content ?? snap); setHistoryOpen(false); await persist({ id: selected.id, content: snap.content ?? snap }); }} onClose={() => setHistoryOpen(false)} />}
            </div>
          ) : (
            <p className="font-inter text-sm text-gray-500">Select a section on the left to edit its content.</p>
          )}
        </aside>
      </div>

      {pickerOpen && <SectionPicker onPick={addSection} onClose={() => setPickerOpen(false)} />}
    </StudioLayout>
  );
}

function SortableRow({ s, selected, onSelect, onToggle, onDuplicate, onRemove, onTemplate }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: s.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  const def = getSection(s.type);
  return (
    <li ref={setNodeRef} style={style} className={`rounded-md border ${selected ? 'ring-2 ring-orange-500' : ''}`} onClick={onSelect}>
      <div className="flex items-center gap-1 p-2" style={{ background: selected ? '#fff7ed' : '#fff', borderColor: '#E2DDD3' }}>
        <button {...attributes} {...listeners} className="cursor-grab p-1"><GripVertical size={14} color="#aaa" /></button>
        <div className="flex-1 min-w-0">
          <p className="font-inter text-sm font-medium truncate" style={{ opacity: s.enabled ? 1 : 0.5 }}>{def?.label || s.section_key}</p>
          <p className="font-inter text-[10px]" style={{ color: '#888' }}>{s.section_key}</p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onToggle(); }} title={s.enabled ? 'Hide' : 'Show'} className="p-1 rounded hover:bg-gray-100">{s.enabled ? <Eye size={14} /> : <EyeOff size={14} color="#aaa" />}</button>
        <button onClick={(e) => { e.stopPropagation(); onTemplate(); }} title="Save as template" className="p-1 rounded hover:bg-gray-100"><BookmarkPlus size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Duplicate" className="p-1 rounded hover:bg-gray-100"><Copy size={14} /></button>
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Delete" className="p-1 rounded hover:bg-red-50"><Trash2 size={14} color="#dc2626" /></button>
      </div>
    </li>
  );
}

function SectionPicker({ onPick, onClose }: { onPick: (type: string, override?: Record<string, unknown>) => void; onClose: () => void }) {
  const [templates, setTemplates] = useState<{ id: string; name: string; type: string; content: any }[]>([]);
  useEffect(() => { supabase.from('section_templates').select('*').order('created_at', { ascending: false }).then(({ data }) => setTemplates((data as any) || [])); }, []);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" style={{ background: '#fff' }} onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b" style={{ borderColor: '#E2DDD3' }}><h3 className="font-outfit font-medium text-lg">Add a section</h3></div>
        <div className="p-4 space-y-4">
          <div>
            <p className="font-inter text-xs uppercase tracking-wider mb-2" style={{ color: '#888' }}>Section types</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SECTION_LIST.map((def) => (
                <button key={def.key} onClick={() => onPick(def.type)} className="text-left p-3 rounded-md border hover:border-orange-500" style={{ borderColor: '#E2DDD3' }}>
                  <p className="font-inter font-medium text-sm">{def.label}</p>
                  <p className="font-inter text-xs" style={{ color: '#888' }}>{def.description}</p>
                </button>
              ))}
            </div>
          </div>
          {templates.length > 0 && (
            <div>
              <p className="font-inter text-xs uppercase tracking-wider mb-2" style={{ color: '#888' }}>Saved templates</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {templates.map((t) => (
                  <button key={t.id} onClick={() => onPick(t.type, t.content)} className="text-left p-3 rounded-md border hover:border-orange-500" style={{ borderColor: '#E2DDD3' }}>
                    <p className="font-inter font-medium text-sm">{t.name}</p>
                    <p className="font-inter text-xs" style={{ color: '#888' }}>{getSection(t.type)?.label || t.type}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RevisionPanel({ sectionId, onRestore, onClose }: { sectionId: string; onRestore: (snap: any) => void; onClose: () => void }) {
  const [items, setItems] = useState<Revision[]>([]);
  useEffect(() => {
    supabase.from('site_revisions').select('*').eq('entity_type', 'section').eq('entity_id', sectionId).order('created_at', { ascending: false }).limit(20).then(({ data }) => setItems((data as Revision[]) || []));
  }, [sectionId]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto" style={{ background: '#fff' }} onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: '#E2DDD3' }}>
          <h3 className="font-outfit font-medium">Version history</h3>
          <button onClick={onClose} className="text-sm">×</button>
        </div>
        <ul className="divide-y" style={{ borderColor: '#E2DDD3' }}>
          {items.length === 0 && <li className="p-4 font-inter text-sm text-gray-500">No versions yet.</li>}
          {items.map((r) => (
            <li key={r.id} className="p-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-inter text-sm">{new Date(r.created_at).toLocaleString()}</p>
                {r.label && <p className="font-inter text-xs text-gray-500">{r.label}</p>}
              </div>
              <button onClick={() => onRestore(r.snapshot)} className="px-3 py-1.5 rounded-md font-inter text-xs" style={{ background: '#0A0A0A', color: '#fff' }}>Restore</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
