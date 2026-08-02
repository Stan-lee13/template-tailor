import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Monitor, Tablet, Smartphone, Undo2, Redo2, Save, Upload, RefreshCw,
  ArrowLeft, LogOut, Loader2, Check, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getSection, withDefaults } from '@/studio/sections/registry';
import SectionInspector from '@/components/studio/SectionInspector';
import LeftPanel from '@/components/studio/visual/LeftPanel';
import PreviewFrame from '@/components/studio/visual/PreviewFrame';
import { useHistory } from '@/components/studio/visual/HistoryStack';
import {
  Section, fetchPageSections, updateSectionContent,
  setSectionEnabled, duplicateSection, deleteSection, addSection,
  reorderSections, saveSectionAsTemplate,
} from '@/studio/lib/sectionMutations';

type Page = { id: string; path: string; title: string };
type Device = 'desktop' | 'tablet' | 'mobile';

export default function VisualEditor() {
  const { canEdit, isAdmin, user, signOut } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [pages, setPages] = useState<Page[]>([]);
  const [pageId, setPageId] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>('desktop');
  const [reloadKey, setReloadKey] = useState(0);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const savedTimer = useRef<number | null>(null);
  const debounceRef = useRef<number | null>(null);

  const selected = useMemo(() => sections.find((s) => s.id === selectedId) || null, [sections, selectedId]);
  const currentPage = useMemo(() => pages.find((p) => p.id === pageId) || null, [pages, pageId]);

  // Load pages
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_pages').select('id,path,title').order('path');
      const list = (data as Page[]) || [];
      setPages(list);
      if (list.length && !pageId) setPageId(list.find((p) => p.path === '/')?.id || list[0].id);
    })();
  }, []);

  // Load sections when page changes
  useEffect(() => {
    if (!pageId) return;
    (async () => {
      const list = await fetchPageSections(pageId);
      setSections(list);
      setSelectedId(null);
      history.clear();
    })();
  }, [pageId]);

  const invalidateAndPreview = () => {
    qc.invalidateQueries({ queryKey: ['section_content'] });
    qc.invalidateQueries({ queryKey: ['page_sections'] });
    setReloadKey((k) => k + 1);
  };

  const markSaved = () => {
    setSaveState('saved');
    if (savedTimer.current) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaveState('idle'), 1500);
  };

  // Apply content to DB + local state without pushing to history (used by undo/redo)
  const applyContentRaw = async (sectionId: string, content: Record<string, unknown>) => {
    setSections((rows) => rows.map((r) => (r.id === sectionId ? { ...r, content } : r)));
    setSaveState('saving');
    try {
      await updateSectionContent(sectionId, content);
      markSaved();
      invalidateAndPreview();
    } catch (e: any) {
      setSaveState('error');
      toast.error(e.message || 'Save failed');
    }
  };

  const history = useHistory(applyContentRaw);

  // Debounced autosave that also records history
  const scheduleAutosave = (sectionId: string, prev: Record<string, unknown>, next: Record<string, unknown>) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    setSaveState('saving');
    debounceRef.current = window.setTimeout(async () => {
      try {
        await updateSectionContent(sectionId, next);
        history.push({ sectionId, prev, next });
        markSaved();
        invalidateAndPreview();
      } catch (e: any) {
        setSaveState('error');
        toast.error(e.message || 'Save failed');
      }
    }, 700);
  };

  const onInspectorChange = (nextContent: Record<string, unknown>) => {
    if (!selected) return;
    const prev = selected.content ?? {};
    setSections((rows) => rows.map((r) => (r.id === selected.id ? { ...r, content: nextContent } : r)));
    scheduleAutosave(selected.id, prev, nextContent);
  };

  const publishNow = async () => {
    if (!selected) {
      toast.info('Autosave is on — every edit is already live. Selecting a section lets you force-publish.');
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    setSaveState('saving');
    try {
      await updateSectionContent(selected.id, selected.content);
      markSaved();
      invalidateAndPreview();
      toast.success('Published live');
    } catch (e: any) {
      setSaveState('error');
      toast.error(e.message || 'Publish failed');
    }
  };

  const onToggle = async (s: Section) => {
    const next = !s.enabled;
    setSections((rows) => rows.map((r) => (r.id === s.id ? { ...r, enabled: next } : r)));
    try {
      await setSectionEnabled(s.id, next);
      invalidateAndPreview();
    } catch (e: any) { toast.error(e.message); }
  };

  const onDuplicate = async (s: Section) => {
    try {
      const created = await duplicateSection(s);
      setSections((r) => [...r, created].sort((a, b) => a.position - b.position));
      invalidateAndPreview();
      toast.success('Duplicated');
    } catch (e: any) { toast.error(e.message); }
  };

  const onRemove = async (s: Section) => {
    if (!confirm(`Delete "${getSection(s.type)?.label || s.section_key}"?`)) return;
    try {
      await deleteSection(s.id);
      setSections((r) => r.filter((x) => x.id !== s.id));
      if (selectedId === s.id) setSelectedId(null);
      invalidateAndPreview();
    } catch (e: any) { toast.error(e.message); }
  };

  const onAddSection = async (type: string, content?: Record<string, unknown>) => {
    try {
      const lastPos = sections.at(-1)?.position ?? 0;
      const created = await addSection(pageId, type, content, lastPos);
      if (!created) return;
      setSections((r) => [...r, created]);
      setSelectedId(created.id);
      invalidateAndPreview();
      toast.success('Section added');
    } catch (e: any) { toast.error(e.message); }
  };

  const onReorder = async (next: Section[]) => {
    setSections(next);
    try {
      await reorderSections(next);
      invalidateAndPreview();
    } catch (e: any) { toast.error(e.message); }
  };

  const onSaveTemplate = async (s: Section) => {
    const name = prompt('Template name?');
    if (!name) return;
    try {
      await saveSectionAsTemplate(s, name);
      toast.success('Saved as template');
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-black selection:bg-[#00D4FF] selection:text-black">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Visual Engine — RetentionFirm Studio</title>
      </Helmet>

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 h-16 border-b border-white/5 shrink-0 bg-black">
        <div className="flex items-center gap-6 min-w-0">
          <Link to="/studio" className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors" title="Back to Command Center">
            <ArrowLeft size={16} />
          </Link>
          <div className="text-sm font-black tracking-tighter text-white">
            VISUAL<span className="text-[#00D4FF]">.</span>ENGINE
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <select
            value={pageId || ''}
            onChange={(e) => setPageId(e.target.value)}
            className="hidden md:block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-white border-none focus:ring-1 focus:ring-[#00D4FF]/50 transition-all cursor-pointer"
          >
            {pages.map((p) => <option key={p.id} value={p.id} className="bg-black">{p.title || p.path}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-4">
          {/* Device toggle */}
          <div className="flex p-1 rounded-2xl bg-white/5 border border-white/5">
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className="w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-300"
                style={{ 
                  background: device === d ? '#00D4FF' : 'transparent', 
                  color: device === d ? '#000000' : 'rgba(255,255,255,0.4)' 
                }}
                title={d}
              >
                {d === 'desktop' ? <Monitor size={14} /> : d === 'tablet' ? <Tablet size={14} /> : <Smartphone size={14} />}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
            <button onClick={() => history.undo()} disabled={!history.canUndo} title="Undo" className="p-2.5 rounded-xl disabled:opacity-20 text-white hover:bg-white/5 transition-colors"><Undo2 size={14} /></button>
            <button onClick={() => history.redo()} disabled={!history.canRedo} title="Redo" className="p-2.5 rounded-xl disabled:opacity-20 text-white hover:bg-white/5 transition-colors"><Redo2 size={14} /></button>
          </div>

          <button onClick={() => setReloadKey((k) => k + 1)} title="Refresh Engine" className="p-2.5 rounded-xl text-white hover:bg-white/5 transition-colors"><RefreshCw size={14} /></button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Save state */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40">
            {saveState === 'saving' && (<><Loader2 size={12} className="animate-spin text-[#00D4FF]" /> Synchronizing</>)}
            {saveState === 'saved' && (<><Check size={12} className="text-emerald-500" /> Live</>)}
            {saveState === 'idle' && <span>Auto-Sync Active</span>}
            {saveState === 'error' && <span className="text-rose-500">Sync Error</span>}
          </div>

          {/* Publish */}
          {canEdit && (
            <button
              onClick={publishNow}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-[#00D4FF] text-black hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            >
              <Upload size={12} /> Deploy
            </button>
          )}

          <button
            onClick={async () => { await signOut(); navigate('/studio/login'); }}
            className="p-2.5 rounded-xl text-white/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all hidden md:block"
            title="Disconnect"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Main grid */}
      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: 'minmax(280px, 300px) 1fr minmax(340px, 380px)' }}>
        {/* Left */}
        <div className="border-r border-white/5 bg-black">
          <LeftPanel
            pages={pages}
            pageId={pageId}
            setPageId={setPageId}
            sections={sections}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onReorder={onReorder}
            onToggle={onToggle}
            onDuplicate={onDuplicate}
            onRemove={onRemove}
            onSaveTemplate={onSaveTemplate}
            onAddSection={onAddSection}
            canEdit={canEdit}
          />
        </div>

        {/* Center preview */}
        <div className="bg-[#050505] relative flex items-center justify-center p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff10 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <PreviewFrame path={currentPage?.path || '/'} device={device} reloadKey={reloadKey} />
        </div>

        {/* Right inspector */}
        <aside className="overflow-y-auto bg-black border-l border-white/5 scrollbar-hide">
          {selected ? (
            <div className="p-8 space-y-8">
              <div className="pb-8 border-b border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-2 py-0.5 rounded bg-[#00D4FF]/10 text-[#00D4FF] text-[8px] font-black uppercase tracking-[0.2em]">
                    {selected.type}
                  </div>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mb-2">{getSection(selected.type)?.label || selected.section_key}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                  Real-time engine updates active
                </p>
              </div>
              
              <div className="inspector-dark-theme">
                {getSection(selected.type) ? (
                  <SectionInspector
                    def={getSection(selected.type)!}
                    value={withDefaults(selected.type, selected.content)}
                    onChange={canEdit ? onInspectorChange : () => toast.error('Access Denied: Read-Only Mode')}
                  />
                ) : (
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xs font-black text-white/40 uppercase tracking-widest leading-relaxed">
                      Unknown system type.<br/>Manual override required.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6 animate-pulse">
                <Sparkles size={24} className="text-[#00D4FF]" />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight mb-2">Engine Standby</h3>
              <p className="text-xs font-medium text-white/30 leading-relaxed">
                Select a system from the navigator to initiate configuration or deploy new assets.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
