import { useEffect, useMemo, useState } from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Trash2, Copy, Eye, EyeOff, GripVertical, Save, History, BookmarkPlus, Monitor, Tablet, Smartphone, RefreshCw, Layout, X } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-12 gap-6 flex-wrap">
        <div>
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">Structure <span className="text-gradient-warm">Editor</span></h1>
          <p className="text-white/40 font-medium">Architect your retention flows with precision.</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={pageId || ''}
            onChange={(e) => setPageId(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest focus:outline-none focus:border-[#C56A4A]/50 transition-all cursor-pointer"
          >
            {pages.map((p) => <option key={p.id} value={p.id} className="bg-black">{p.title || p.path}</option>)}
          </select>
          <div className="flex p-1 rounded-2xl bg-white/5 border border-white/5">
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className="w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-300"
                style={{ background: device === d ? '#C56A4A' : 'transparent', color: device === d ? '#000000' : 'rgba(255,255,255,0.4)' }}
              >
                {d === 'desktop' ? <Monitor size={14} /> : d === 'tablet' ? <Tablet size={14} /> : <Smartphone size={14} />}
              </button>
            ))}
          </div>
          <button onClick={refreshPreview} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"><RefreshCw size={14} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[300px,1fr,380px] gap-8">
        {/* Section list */}
        <aside className="rounded-[2.5rem] p-6 max-h-[80vh] overflow-y-auto bg-black border border-white/10 scrollbar-hide">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Flow Architect</span>
            <button
              onClick={() => setPickerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-[#C56A4A] text-black hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(197,106,74,0.1)]"
            >
              <Plus size={12} strokeWidth={3} /> Inject
            </button>
          </div>
          {sections.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
              <p className="text-xs font-medium text-white/30 leading-relaxed">No modules deployed. Use "Inject" to start building.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-3">
                  {sections.map((s) => <SortableRow key={s.id} s={s} selected={selectedId === s.id} onSelect={() => setSelectedId(s.id)} onToggle={() => toggleEnabled(s)} onDuplicate={() => duplicate(s)} onRemove={() => remove(s)} onTemplate={() => saveAsTemplate(s)} />)}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </aside>

        {/* Preview */}
        <div className="rounded-[2.5rem] overflow-hidden bg-[#050505] border border-white/10 min-h-[80vh] relative flex items-center justify-center p-8">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff10 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <iframe key={previewKey} src={previewSrc} title="Preview" className="rounded-2xl shadow-2xl transition-all duration-500 bg-white" style={{ width: deviceWidth, height: '75vh', border: 'none' }} />
        </div>

        {/* Inspector */}
        <aside className="rounded-[2.5rem] p-8 max-h-[80vh] overflow-y-auto bg-black border border-white/10 scrollbar-hide">
          {selected ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-8 border-b border-white/5">
                <div>
                  <div className="px-2 py-0.5 rounded bg-[#C56A4A]/10 text-[#C56A4A] text-[8px] font-black uppercase tracking-[0.2em] mb-2 inline-block">
                    {selected.type}
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">{getSection(selected.type)?.label || selected.section_key}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setHistoryOpen(true)} title="Timeline" className="p-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all"><History size={14} /></button>
                  <button
                    onClick={commitSelected}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-[#C56A4A] text-black disabled:opacity-50 hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(197,106,74,0.1)]"
                  >
                    <Save size={12} strokeWidth={3} /> {saving ? '...' : 'Deploy'}
                  </button>
                </div>
              </div>
              <div className="inspector-dark-theme">
                {getSection(selected.type) && (
                  <SectionInspector def={getSection(selected.type)!} value={withDefaults(selected.type, selected.content)} onChange={updateSelected} />
                )}
              </div>
              {historyOpen && <RevisionPanel sectionId={selected.id} onRestore={async (snap) => { updateSelected(snap.content ?? snap); setHistoryOpen(false); await persist({ id: selected.id, content: snap.content ?? snap }); }} onClose={() => setHistoryOpen(false)} />}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <Layout size={24} className="text-[#C56A4A]" />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight mb-2">Module Standby</h3>
              <p className="text-xs font-medium text-white/30 leading-relaxed">Select a module from the architect to begin structural configuration.</p>
            </div>
          )}
        </aside>
      </div>

      {pickerOpen && <SectionPicker onPick={addSection} onClose={() => setPickerOpen(false)} />}
    </StudioLayout>
  );
}

function SortableRow({ s, selected, onSelect, onToggle, onDuplicate, onRemove, onTemplate }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: s.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const def = getSection(s.type);
  return (
    <li ref={setNodeRef} style={style} className="group" onClick={onSelect}>
      <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${selected ? 'bg-[#C56A4A] border-[#C56A4A] text-black shadow-[0_0_20px_rgba(197,106,74,0.2)]' : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5 hover:text-white'}`}>
        <button {...attributes} {...listeners} className="cursor-grab p-1 text-inherit opacity-20 hover:opacity-100" onClick={(e) => e.stopPropagation()}><GripVertical size={14} /></button>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-black uppercase tracking-tight truncate ${!s.enabled && 'opacity-30'}`}>{def?.label || s.section_key}</p>
          <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${selected ? 'text-black/40' : 'text-white/10'}`}>{s.section_key}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onToggle(); }} title={s.enabled ? 'Disable' : 'Enable'} className={`p-1.5 rounded-lg transition-colors ${selected ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}>{s.enabled ? <Eye size={14} strokeWidth={3} /> : <EyeOff size={14} strokeWidth={3} className="opacity-40" />}</button>
          <button onClick={(e) => { e.stopPropagation(); onTemplate(); }} title="Blueprint" className={`p-1.5 rounded-lg transition-colors ${selected ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}><BookmarkPlus size={14} strokeWidth={3} /></button>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Clone" className={`p-1.5 rounded-lg transition-colors ${selected ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}><Copy size={14} strokeWidth={3} /></button>
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Purge" className={`p-1.5 rounded-lg transition-colors ${selected ? 'hover:bg-rose-500 hover:text-white' : 'hover:bg-rose-500/20 hover:text-rose-500'}`}><Trash2 size={14} strokeWidth={3} /></button>
        </div>
      </div>
    </li>
  );
}

function SectionPicker({ onPick, onClose }: { onPick: (type: string, override?: Record<string, unknown>) => void; onClose: () => void }) {
  const [templates, setTemplates] = useState<{ id: string; name: string; type: string; content: any }[]>([]);
  useEffect(() => { supabase.from('section_templates').select('*').order('created_at', { ascending: false }).then(({ data }) => setTemplates((data as any) || [])); }, []);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose}>
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-black border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/10 bg-white/[0.02]">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">Inject Module</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">Select architecture protocol</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
          <section>
            <div className="px-4 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">System Protocols</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SECTION_LIST.map((def) => (
                <button
                  key={def.key}
                  onClick={() => onPick(def.type)}
                  className="group text-left p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#C56A4A]/30 hover:bg-[#C56A4A]/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-[#C56A4A]/10 flex items-center justify-center text-[#C56A4A] group-hover:bg-[#C56A4A] group-hover:text-black transition-all">
                      <Plus size={14} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight text-white group-hover:text-[#C56A4A] transition-colors">{def.label}</span>
                  </div>
                  <p className="text-[10px] font-medium leading-relaxed text-white/20 line-clamp-2">{def.description}</p>
                </button>
              ))}
            </div>
          </section>

          {templates.length > 0 && (
            <section>
              <div className="px-4 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Saved Blueprints</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onPick(t.type, t.content)}
                    className="group text-left p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#C56A4A]/30 hover:bg-[#C56A4A]/5 transition-all duration-300"
                  >
                    <span className="text-xs font-black uppercase tracking-tight text-white group-hover:text-[#C56A4A] transition-colors">{t.name}</span>
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/10 mt-1">{getSection(t.type)?.label || t.type}</p>
                  </button>
                ))}
              </div>
            </section>
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-black border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/10 bg-white/[0.02]">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">Version Timeline</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">Select node state for restoration</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <ul className="divide-y divide-white/5">
            {items.length === 0 && (
              <li className="p-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/10">Zero states detected in timeline.</p>
              </li>
            )}
            {items.map((r) => (
              <li key={r.id} className="p-8 flex items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors group">
                <div>
                  <p className="text-xs font-black text-white group-hover:text-[#C56A4A] transition-colors">{new Date(r.created_at).toLocaleString()}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/10 mt-1">{r.label || 'SYSTEM_AUTO_SAVE'}</p>
                </div>
                <button
                  onClick={() => onRestore(r.snapshot)}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-black hover:bg-[#C56A4A] hover:border-[#C56A4A] transition-all duration-500"
                >
                  Restore State
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
