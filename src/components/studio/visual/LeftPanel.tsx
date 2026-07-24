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
    <div className="flex flex-col h-full" style={{ background: '#fff', borderRight: '1px solid #E2DDD3' }}>
      <div className="grid grid-cols-4 border-b" style={{ borderColor: '#E2DDD3' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex flex-col items-center gap-1 py-2.5 text-[10px] uppercase tracking-wider font-inter transition-colors"
            style={{
              background: tab === t.id ? '#000000' : 'transparent',
              color: tab === t.id ? '#FFFFFF' : '#555',
              fontWeight: tab === t.id ? 600 : 400,
            }}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
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
    <ul className="p-2 space-y-1">
      {pages.map((p) => (
        <li key={p.id}>
          <button
            onClick={() => setPageId(p.id)}
            className="w-full text-left px-3 py-2 rounded-md font-inter text-sm transition-colors"
            style={{
              background: pageId === p.id ? '#fff7ed' : 'transparent',
              color: '#000000',
              borderLeft: pageId === p.id ? '3px solid #00D4FF' : '3px solid transparent',
            }}
          >
            <div className="font-medium truncate">{p.title || p.path}</div>
            <div className="text-[10px] text-gray-500 truncate">{p.path}</div>
          </button>
        </li>
      ))}
      {pages.length === 0 && <li className="p-3 text-xs text-gray-500 font-inter">No pages yet — create one from the Pages editor.</li>}
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
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  const def = getSection(s.type);
  return (
    <li ref={setNodeRef} style={style} className={`rounded-md border ${selected ? 'ring-2 ring-orange-500' : ''}`} onClick={onSelect}>
      <div className="flex items-center gap-1 p-2" style={{ background: selected ? '#fff7ed' : '#fff', borderColor: '#E2DDD3' }}>
        {canEdit && <button {...attributes} {...listeners} className="cursor-grab p-1" onClick={(e) => e.stopPropagation()}><GripVertical size={12} color="#aaa" /></button>}
        <div className="flex-1 min-w-0">
          <p className="font-inter text-xs font-medium truncate" style={{ opacity: s.enabled ? 1 : 0.5 }}>{def?.label || s.section_key}</p>
          <p className="font-inter text-[9px]" style={{ color: '#888' }}>{s.section_key}</p>
        </div>
        {canEdit && (
          <>
            <button onClick={(e) => { e.stopPropagation(); onToggle(); }} title={s.enabled ? 'Hide' : 'Show'} className="p-1 rounded hover:bg-gray-100">{s.enabled ? <Eye size={12} /> : <EyeOff size={12} color="#aaa" />}</button>
            <button onClick={(e) => { e.stopPropagation(); onTemplate(); }} title="Save as template" className="p-1 rounded hover:bg-gray-100"><BookmarkPlus size={12} /></button>
            <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} title="Duplicate" className="p-1 rounded hover:bg-gray-100"><Copy size={12} /></button>
            <button onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Delete" className="p-1 rounded hover:bg-red-50"><Trash2 size={12} color="#dc2626" /></button>
          </>
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

  if (!canEdit) return <p className="p-4 text-xs text-gray-500 font-inter">You don't have permission to add sections.</p>;

  return (
    <div className="p-3 space-y-4">
      <div>
        <p className="font-inter text-[10px] uppercase tracking-wider mb-2" style={{ color: '#888' }}>Section types</p>
        <div className="grid grid-cols-1 gap-1.5">
          {SECTION_LIST.map((def) => (
            <button
              key={def.key}
              onClick={() => onAdd(def.type)}
              className="text-left p-2.5 rounded-md border font-inter transition-colors hover:border-orange-500 hover:bg-orange-50"
              style={{ borderColor: '#E2DDD3' }}
            >
              <div className="flex items-center gap-2">
                <Plus size={12} color="#00D4FF" />
                <span className="text-sm font-medium">{def.label}</span>
              </div>
              <p className="text-[10px] mt-0.5 text-gray-500 line-clamp-2">{def.description}</p>
            </button>
          ))}
        </div>
      </div>

      {templates.length > 0 && (
        <div>
          <p className="font-inter text-[10px] uppercase tracking-wider mb-2" style={{ color: '#888' }}>Saved templates</p>
          <div className="grid grid-cols-1 gap-1.5">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => onAdd(t.type, t.content)}
                className="text-left p-2.5 rounded-md border font-inter hover:border-orange-500 hover:bg-orange-50"
                style={{ borderColor: '#E2DDD3' }}
              >
                <span className="text-sm font-medium">{t.name}</span>
                <p className="text-[10px] text-gray-500">{getSection(t.type)?.label || t.type}</p>
              </button>
            ))}
          </div>
        </div>
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
    <div className="p-3">
      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-inter text-xs cursor-pointer mb-3" style={{ background: '#000000', color: '#fff' }}>
        <Upload size={12} /> {uploading ? 'Uploading…' : 'Upload'}
        <input type="file" accept="image/*,video/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </label>
      {loading ? (
        <p className="text-xs text-gray-500 font-inter">Loading…</p>
      ) : assets.length === 0 ? (
        <p className="text-xs text-gray-500 font-inter">No media yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {assets.map((a) => (
            <button
              key={a.id}
              onClick={() => a.url && copyUrl(a.url)}
              className="aspect-square rounded-md border overflow-hidden hover:ring-2 hover:ring-orange-500 relative group"
              style={{ borderColor: '#E2DDD3', background: '#f5f5f5' }}
              title={`Click to copy URL: ${a.filename}`}
            >
              {a.url && a.mime?.startsWith('image/') ? (
                <img src={a.url} alt={a.filename} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="text-[10px] p-1 text-center text-gray-500">{a.filename}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
