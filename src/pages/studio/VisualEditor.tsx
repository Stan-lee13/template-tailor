import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Monitor, Tablet, Smartphone, Undo2, Redo2, Save, Upload, RefreshCw,
  ArrowLeft, LogOut, Loader2, Check,
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
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ background: '#0A0A0A' }}>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Visual Editor — RetentionFirm Studio</title>
      </Helmet>

      {/* Top bar */}
      <header className="flex items-center justify-between px-4 h-14 border-b shrink-0" style={{ background: '#0A0A0A', borderColor: '#1a1a1a', color: '#f1ece4' }}>
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/studio" className="p-2 rounded hover:bg-white/5" title="Back to Studio">
            <ArrowLeft size={16} />
          </Link>
          <div className="font-outfit font-semibold text-sm truncate">
            Retention<span style={{ color: '#F97316' }}>.</span>Visual
          </div>
          <select
            value={pageId || ''}
            onChange={(e) => setPageId(e.target.value)}
            className="hidden md:block ml-2 px-2 py-1 rounded-md text-xs font-inter"
            style={{ background: '#1a1a1a', color: '#f1ece4', border: '1px solid #2a2a2a' }}
          >
            {pages.map((p) => <option key={p.id} value={p.id}>{p.title || p.path}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Device toggle */}
          <div className="flex rounded-md overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className="px-2.5 py-1.5"
                style={{ background: device === d ? '#F97316' : 'transparent', color: device === d ? '#0A0A0A' : '#f1ece4' }}
                title={d}
              >
                {d === 'desktop' ? <Monitor size={13} /> : d === 'tablet' ? <Tablet size={13} /> : <Smartphone size={13} />}
              </button>
            ))}
          </div>

          {/* Undo / Redo */}
          <button onClick={() => history.undo()} disabled={!history.canUndo} title="Undo" className="p-2 rounded disabled:opacity-30 hover:bg-white/5"><Undo2 size={14} /></button>
          <button onClick={() => history.redo()} disabled={!history.canRedo} title="Redo" className="p-2 rounded disabled:opacity-30 hover:bg-white/5"><Redo2 size={14} /></button>

          <button onClick={() => setReloadKey((k) => k + 1)} title="Refresh preview" className="p-2 rounded hover:bg-white/5"><RefreshCw size={14} /></button>

          {/* Save state */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 text-[11px] font-inter" style={{ color: 'rgba(241,236,228,0.6)' }}>
            {saveState === 'saving' && (<><Loader2 size={12} className="animate-spin" /> Saving…</>)}
            {saveState === 'saved' && (<><Check size={12} color="#10B981" /> Saved</>)}
            {saveState === 'idle' && <span>Autosave on</span>}
            {saveState === 'error' && <span style={{ color: '#ef4444' }}>Save error</span>}
          </div>

          {/* Publish */}
          {canEdit && (
            <button
              onClick={publishNow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-inter text-xs font-semibold"
              style={{ background: '#F97316', color: '#0A0A0A' }}
            >
              <Upload size={12} /> Publish
            </button>
          )}

          <button
            onClick={async () => { await signOut(); navigate('/studio/login'); }}
            className="p-2 rounded hover:bg-white/5 hidden md:block"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Main grid */}
      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: 'minmax(240px, 260px) 1fr minmax(300px, 340px)' }}>
        {/* Left */}
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

        {/* Center preview */}
        <PreviewFrame path={currentPage?.path || '/'} device={device} reloadKey={reloadKey} />

        {/* Right inspector */}
        <aside className="overflow-y-auto" style={{ background: '#fff', borderLeft: '1px solid #E2DDD3' }}>
          {selected ? (
            <div className="p-4 space-y-3">
              <div className="pb-3 border-b" style={{ borderColor: '#E2DDD3' }}>
                <p className="font-inter text-[10px] uppercase tracking-wider" style={{ color: '#888' }}>{selected.type}</p>
                <h3 className="font-outfit text-base font-medium">{getSection(selected.type)?.label || selected.section_key}</h3>
                <p className="font-inter text-[10px] mt-1" style={{ color: '#aaa' }}>
                  Edits autosave and update the preview automatically.
                </p>
              </div>
              {getSection(selected.type) ? (
                <SectionInspector
                  def={getSection(selected.type)!}
                  value={withDefaults(selected.type, selected.content)}
                  onChange={canEdit ? onInspectorChange : () => toast.error('You have read-only access')}
                />
              ) : (
                <p className="font-inter text-sm text-gray-500">Unknown section type — no editor available.</p>
              )}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: '#fff7ed' }}>
                <Save size={18} color="#F97316" />
              </div>
              <h3 className="font-outfit text-base font-medium mb-1">Select a section</h3>
              <p className="font-inter text-xs text-gray-500">
                Pick a section from the left panel to edit its content, or open the "Add" tab to insert a new one.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
