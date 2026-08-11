import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileCode, Layers, Puzzle, Image as ImageIcon, Plus, GripVertical, Eye, EyeOff, Trash2, Copy, BookmarkPlus, Upload } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SECTION_LIST, getSection } from '@/studio/sections/registry';
import type { Section } from '@/studio/lib/sectionMutations';
import { toast } from 'sonner';

type Page = { id: string; path: string; title: string };
type Tab = 'pages' | 'sections' | 'components' | 'media';

type Template = { id: string; name: string; type: string; content: any };
type Asset = { id: string; storage_bucket: string; storage_path: string; filename: string; mime: string | null };

export default function LeftPanel(props: {
  pages: Page[];
  pageId: string | null;
  setPageId: (id: string) => void;
  sections: Section[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (next: Section[]) => void;
  onToggle: (s: Section) => void;
  onDuplicate: (s: Section) => void;
  onRemove: (s: Section) => void;
  onSaveTemplate: (s: Section) => void;
  onAddSection: (type: string, content?: Record<string, unknown>) => void;
  canEdit: boolean;
}) {
  const [tab, setTab] = useState<Tab>('sections');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'pages', label: 'Pages', icon: FileCode },
    { id: 'sections', label: 'Sections', icon: Layers },
    { id: 'components', label: 'Add', icon: Puzzle },
    { id: 'media', label: 'Media', icon: ImageIcon },
  ];

  return (
    <div className="flex flex-col h-full bg-black border-r border-white/10">
      <div className="grid grid-cols-4 border-b border-white/10 bg-white/[0.02]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-col items-center gap-2 py-4 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${tab === t.id ? 'text-[#C9A227] bg-[#C9A227]/5' : 'text-white/20 hover:text-white/60'}`}
          >
            <t.icon size={14} strokeWidth={tab === t.id ? 3 : 2} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {tab === 'pages' && <PagesTab pages={props.pages} pageId={props.pageId} setPageId={props.setPageId} />}
        {tab === 'sections' && (
          <SectionsTab
            sections={props.sections}
            selectedId={props.selectedId}
            onSelect={props.onSelect}
            onReorder={props.onReorder}
            onToggle={props.onToggle}
            onDuplicate={props.onDuplicate}
            onRemove={props.onRemove}
            onSaveTemplate={props.onSaveTemplate}
            canEdit={props.canEdit}
          />
        )}
        {tab === 'components' && <ComponentsTab onAdd={props.onAddSection} canEdit={props.canEdit} />}
        {tab === 'media' && <MediaTab />}
      </div>
    </div>
  );
}

function PagesTab({ pages, pageId, setPageId }: { pages: Page[]; pageId: string | null; setPageId: (id: string) => void }) {
  return (
    <ul className="p-4 space-y-2">
      <div className="px-4 mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Site Nodes</span>
      </div>
      {pages.map((p) => (
        <li key={p.id}>
          <button
            onClick={() => setPageId(p.id)}
            className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 group ${pageId === p.id ? 'bg-[#C9A227] text-black shadow-[0_0_20px_rgba(201, 162, 39,0.2)]' : 'bg-white/[0.02] border border-white/5 text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            <div className="text-xs font-black uppercase tracking-tight truncate">{p.title || p.path}</div>
            <div className={`text-[9px] font-black uppercase tracking-widest mt-1 truncate ${pageId === p.id ? 'text-black/40' : 'text-white/10 group-hover:text-[#C9A227]'}`}>{p.path}</div>
          </button>
        </li>
      ))}
      {pages.length === 0 && <li className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-white/10">Zero nodes detected.</li>}
    </ul>
  );
}

function SectionsTab(props: {
  sections: Section[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (next: Section[]) => void;
  onToggle: (s: Section) => void;
  onDuplicate: (s: Section) => void;
  onRemove: (s: Section) => void;
  onSaveTemplate: (s: Section) => void;
  canEdit: boolean;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = props.sections.findIndex((s) => s.id === active.id);
    const newIdx = props.sections.findIndex((s) => s.id === over.id);
    const next = arrayMove(props.sections, oldIdx, newIdx).map((s, i) => ({ ...s, position: (i + 1) * 10 }));
    props.onReorder(next);
  };

  if (props.sections.length === 0) {
    return <p className="p-4 text-xs text-gray-500 font-inter">No sections. Open the "Add" tab to insert one.</p>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={props.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <ul className="p-2 space-y-1">
          {props.sections.map((s) => (
            <SortableRow
              key={s.id}
              s={s}
              selected={props.selectedId === s.id}
              canEdit={props.canEdit}
              onSelect={() => props.onSelect(s.id)}
              onToggle={() => props.onToggle(s)}
              onDuplicate={() => props.onDuplicate(s)}
              onRemove={() => props.onRemove(s)}
              onTemplate={() => props.onSaveTemplate(s)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ s, selected, canEdit, onSelect, onToggle, onDuplicate, onRemove, onTemplate }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: s.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const def = getSection(s.type);
  return (
    <li ref={setNodeRef} style={style} className="group" onClick={onSelect}>
      <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${selected ? 'bg-[#C9A227] border-[#C9A227] text-black shadow-[0_0_20px_rgba(201, 162, 39,0.2)]' : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5 hover:text-white'}`}>
        {canEdit && <button {...attributes} {...listeners} className="cursor-grab p-1 text-inherit opacity-20 hover:opacity-100" onClick={(e) => e.stopPropagation()}><GripVertical size={14} /></button>}
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-black uppercase tracking-tight truncate ${!s.enabled && 'opacity-30'}`}>{def?.label || s.section_key}</p>
          <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${selected ? 'text-black/40' : 'text-white/10'}`}>{s.section_key}</p>
        </div>
        {canEdit && (
          <div className="flex items-center gap-1">
            <button onClick={(e) => { e.stopPropagation(); onToggle(); }} title={s.enabled ? 'Disable' : 'Enable'} className={`p-1.5 rounded-lg transition-colors ${selected ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}>{s.enabled ? <Eye size={14} strokeWidth={3} /> : <EyeOff size={14} strokeWidth={3} className="opacity-40" />}</button>
            <button onClick={(e) => { e.stopPropagation(); onTemplate(); }} title="Blueprint" className={`p-1.5 rounded-lg transition-colors ${selected ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}><BookmarkPlus size={14} strokeWidth={3} /></button>
            <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Clone" className={`p-1.5 rounded-lg transition-colors ${selected ? 'hover:bg-black/10' : 'hover:bg-white/10'}`}><Copy size={14} strokeWidth={3} /></button>
            <button onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Purge" className={`p-1.5 rounded-lg transition-colors ${selected ? 'hover:bg-rose-500 hover:text-white' : 'hover:bg-rose-500/20 hover:text-rose-500'}`}><Trash2 size={14} strokeWidth={3} /></button>
          </div>
        )}
      </div>
    </li>
  );
}

function ComponentsTab({ onAdd, canEdit }: { onAdd: (type: string, content?: Record<string, unknown>) => void; canEdit: boolean }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  useEffect(() => {
    supabase.from('section_templates').select('*').order('created_at', { ascending: false }).then(({ data }) => setTemplates((data as any) || []));
  }, []);

  if (!canEdit) return <div className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-white/10">Access denied for node deployment.</div>;

  return (
    <div className="p-6 space-y-12">
      <section>
        <div className="px-4 mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">System Nodes</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {SECTION_LIST.map((def) => (
            <button
              key={def.key}
              onClick={() => onAdd(def.type)}
              className="group text-left p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#C9A227]/30 hover:bg-[#C9A227]/5 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-lg bg-[#C9A227]/10 flex items-center justify-center text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-black transition-all">
                  <Plus size={14} strokeWidth={3} />
                </div>
                <span className="text-xs font-black uppercase tracking-tight text-white group-hover:text-[#C9A227] transition-colors">{def.label}</span>
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
          <div className="grid grid-cols-1 gap-3">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => onAdd(t.type, t.content)}
                className="group text-left p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#C9A227]/30 hover:bg-[#C9A227]/5 transition-all duration-300"
              >
                <span className="text-xs font-black uppercase tracking-tight text-white group-hover:text-[#C9A227] transition-colors">{t.name}</span>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/10 mt-1">{getSection(t.type)?.label || t.type}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MediaTab() {
  const [assets, setAssets] = useState<(Asset & { url?: string | null })[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false }).limit(60);
    const rows = (data as Asset[]) || [];
    const withUrls = await Promise.all(rows.map(async (a) => {
      const { data } = await supabase.storage.from(a.storage_bucket).createSignedUrl(a.storage_path, 60 * 60 * 24 * 7);
      return { ...a, url: data?.signedUrl ?? null };
    }));
    setAssets(withUrls);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('site-media').upload(path, file, { cacheControl: '31536000', upsert: false });
      if (upErr) throw upErr;
      const { data: { user } } = await supabase.auth.getUser();
      const { error: insErr } = await supabase.from('media_assets').insert({
        storage_bucket: 'site-media', storage_path: path, filename: file.name, mime: file.type,
        size_bytes: file.size, uploaded_by: user?.id,
      });
      if (insErr) throw insErr;
      toast.success('Uploaded');
      await load();
    } catch (e: any) { toast.error(e.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied — paste into an image field');
  };

  return (
    <div className="p-6">
      <div className="px-4 mb-6">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Asset Cluster</span>
      </div>
      <label className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#C9A227] text-black text-[10px] font-black uppercase tracking-widest cursor-pointer mb-8 hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(201, 162, 39,0.2)]">
        <Upload size={14} strokeWidth={3} /> {uploading ? 'Uploading...' : 'Inject Asset'}
        <input type="file" accept="image/*,video/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </label>
      
      {loading ? (
        <div className="flex items-center justify-center py-12 text-[10px] font-black uppercase tracking-widest text-white/10 animate-pulse">Syncing assets...</div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12 text-[10px] font-black uppercase tracking-widest text-white/10">Zero assets detected.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {assets.map((a) => (
            <button
              key={a.id}
              onClick={() => a.url && copyUrl(a.url)}
              className="aspect-square rounded-2xl border border-white/5 overflow-hidden relative group bg-white/[0.02] hover:border-[#C9A227]/30 transition-all duration-500"
              title={`Copy Protocol URL: ${a.filename}`}
            >
              {a.url && a.mime?.startsWith('image/') ? (
                <img src={a.url} alt={a.filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              ) : (
                <div className="h-full flex items-center justify-center p-4 text-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20 truncate">{a.filename}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-[#C9A227]">Copy URL</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
