import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import StudioLayout from '@/components/studio/StudioLayout';
import TiptapEditor, { TiptapEditorHandle } from '@/components/studio/TiptapEditor';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useStudioAI } from '@/hooks/useStudioAI';
import { markdownToHtml } from '@/lib/markdown';
import { slugify } from '@/lib/slug';
import { runSeoChecklist } from '@/lib/seo-checklist';
import { uploadPostMedia, getMediaUrl } from '@/lib/storage';
import { toast } from 'sonner';
import { ArrowLeft, Check, X, Upload, ExternalLink, Sparkles } from 'lucide-react';


type Status = 'draft' | 'scheduled' | 'published';

interface PostState {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content_json: any;
  content_html: string;
  featured_image_url: string | null;
  featured_image_alt: string;
  status: Status;
  scheduled_for: string | null;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  focus_keyword: string;
  og_image_url: string | null;
  canonical_url: string;
  schema_jsonld: string;
}

const empty: PostState = {
  title: '', slug: '', excerpt: '', content_json: {}, content_html: '',
  featured_image_url: null, featured_image_alt: '',
  status: 'draft', scheduled_for: null, published_at: null,
  meta_title: '', meta_description: '', focus_keyword: '',
  og_image_url: null, canonical_url: '', schema_jsonld: '',
};

function Counter({ value, max }: { value: number; max: number }) {
  const over = value > max;
  return <span className={`text-[9px] font-black uppercase tracking-widest tabular-nums ${over ? 'text-rose-500' : 'text-white/20'}`}>{value}/{max}</span>;
}

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ai = useStudioAI();
  const [p, setP] = useState<PostState>(empty);
  const [tab, setTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);
  const [ogPreview, setOgPreview] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const ogRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<TiptapEditorHandle>(null);

  // Publish post context to AI assistant
  useEffect(() => {
    const wordCount = p.content_html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    ai.setContext({
      title: p.title,
      focusKeyword: p.focus_keyword,
      excerpt: p.excerpt,
      metaTitle: p.meta_title,
      metaDescription: p.meta_description,
      wordCount,
    });
    return () => ai.setContext(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.title, p.focus_keyword, p.excerpt, p.meta_title, p.meta_description, p.content_html]);

  // Register editor insert + field setter for the AI assistant
  useEffect(() => {
    ai.registerInsertHandler((md: string) => {
      const html = markdownToHtml(md);
      return editorRef.current?.insertHtml(html) ?? false;
    });
    ai.registerFieldSetter((field, value) => {
      const clean = value.replace(/^["“]|["”]$/g, '').trim();
      if (field === 'metaTitle') setP((s) => ({ ...s, meta_title: clean }));
      else if (field === 'metaDescription') setP((s) => ({ ...s, meta_description: clean }));
      else if (field === 'excerpt') setP((s) => ({ ...s, excerpt: clean }));
      else if (field === 'title') setP((s) => ({ ...s, title: clean }));
      else return false;
      return true;
    });
    return () => { ai.registerInsertHandler(null); ai.registerFieldSetter(null); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Load
  useEffect(() => {
    if (!id || id === 'new') return;
    (async () => {
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
      if (error || !data) { toast.error('Post not found'); navigate('/studio/posts'); return; }
      setP({
        id: data.id,
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content_json: data.content_json || {},
        content_html: data.content_html || '',
        featured_image_url: data.featured_image_url,
        featured_image_alt: data.featured_image_alt || '',
        status: data.status as Status,
        scheduled_for: data.scheduled_for,
        published_at: data.published_at,
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        focus_keyword: data.focus_keyword || '',
        og_image_url: data.og_image_url,
        canonical_url: data.canonical_url || '',
        schema_jsonld: data.schema_jsonld ? JSON.stringify(data.schema_jsonld, null, 2) : '',
      });
      setSlugTouched(true);
      setLoading(false);
    })();
  }, [id, navigate]);

  useEffect(() => {
    (async () => setFeaturedPreview(await getMediaUrl(p.featured_image_url)))();
  }, [p.featured_image_url]);
  useEffect(() => {
    (async () => setOgPreview(await getMediaUrl(p.og_image_url)))();
  }, [p.og_image_url]);

  // Auto-slug
  useEffect(() => {
    if (!slugTouched && p.title) setP((s) => ({ ...s, slug: slugify(s.title) }));
  }, [p.title, slugTouched]);

  const checklist = useMemo(() => runSeoChecklist({
    title: p.title, slug: p.slug, excerpt: p.excerpt,
    metaDescription: p.meta_description, focusKeyword: p.focus_keyword,
    featuredImageUrl: p.featured_image_url, featuredImageAlt: p.featured_image_alt,
    contentHtml: p.content_html,
  }), [p]);
  const allPass = checklist.every((c) => c.pass);

  const buildPayload = (overrides: Partial<PostState> = {}) => {
    const merged = { ...p, ...overrides };
    let schema: any = null;
    if (merged.schema_jsonld.trim()) {
      try { schema = JSON.parse(merged.schema_jsonld); } catch { /* keep null, error later */ }
    }
    return {
      title: merged.title || 'Untitled',
      slug: merged.slug || slugify(merged.title) || `untitled-${Date.now()}`,
      excerpt: merged.excerpt || null,
      content_json: merged.content_json,
      content_html: merged.content_html,
      featured_image_url: merged.featured_image_url,
      featured_image_alt: merged.featured_image_alt || null,
      status: merged.status,
      scheduled_for: merged.status === 'scheduled' ? merged.scheduled_for : null,
      published_at: merged.published_at,
      meta_title: merged.meta_title || null,
      meta_description: merged.meta_description || null,
      focus_keyword: merged.focus_keyword || null,
      og_image_url: merged.og_image_url,
      canonical_url: merged.canonical_url || null,
      schema_jsonld: schema,
      author_id: user!.id,
    };
  };

  const save = async (overrides: Partial<PostState> = {}, silent = false) => {
    if (saving) return;
    setSaving(true);
    try {
      const payload = buildPayload(overrides);
      if (p.id) {
        const { error } = await supabase.from('posts').update(payload).eq('id', p.id);
        if (error) throw error;
        await supabase.from('post_revisions').insert({ post_id: p.id, content_json: payload.content_json, title: payload.title, author_id: user!.id });
        setP((s) => ({ ...s, ...overrides }));
        if (!silent) toast.success('Saved');
      } else {
        const { data, error } = await supabase.from('posts').insert(payload).select('id').single();
        if (error) throw error;
        if (!silent) toast.success('Created');
        navigate(`/studio/posts/${data.id}`, { replace: true });
      }
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!allPass) { setShowChecklist(true); return; }
    await save({ status: 'published', published_at: new Date().toISOString() });
  };

  const handleSchedule = async () => {
    if (!p.scheduled_for) return toast.error('Set a date first');
    if (new Date(p.scheduled_for) <= new Date()) return toast.error('Schedule must be in the future');
    await save({ status: 'scheduled' });
  };

  const handleUnpublish = async () => save({ status: 'draft', published_at: null });

  const uploadFeatured = async (f: File) => {
    try {
      const path = await uploadPostMedia(f);
      setP((s) => ({ ...s, featured_image_url: path }));
      toast.success('Image uploaded');
      if (p.id) await save({ featured_image_url: path }, true);
    } catch (e: any) { toast.error(e.message); }
  };
  const uploadOg = async (f: File) => {
    try {
      const path = await uploadPostMedia(f);
      setP((s) => ({ ...s, og_image_url: path }));
      toast.success('OG image uploaded');
      if (p.id) await save({ og_image_url: path }, true);
    } catch (e: any) { toast.error(e.message); }
  };

  if (loading) return <StudioLayout><p className="font-inter text-sm" style={{ color: '#666' }}>Loading…</p></StudioLayout>;

  return (
    <StudioLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <Link to="/studio/posts" className="p-3 rounded-2xl bg-white/5 text-white/40 hover:text-white transition-all">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">Content <span className="text-[#00D4FF]">Architect</span></h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => ai.openPanel()} 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all"
          >
            <Sparkles size={12} className="text-[#00D4FF]" /> AI Assistant
          </button>

          {p.status === 'published' && p.slug && (
            <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-all">
              Live Preview <ExternalLink size={12} />
            </a>
          )}
          <button 
            onClick={() => save()} 
            disabled={saving} 
            className="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all"
          >
            {saving ? '...' : 'Save Pipeline'}
          </button>
          {p.status === 'published' ? (
            <button onClick={handleUnpublish} className="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">Recall</button>
          ) : (
            <button 
              onClick={handlePublish} 
              className="px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-[#00D4FF] text-black hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            >
              Deploy Live
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-10 p-1.5 rounded-2xl bg-white/5 border border-white/5 w-fit">
        {(['content', 'seo', 'settings'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${tab === t ? 'bg-[#00D4FF] text-black' : 'text-white/30 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'content' && (
        <div className="space-y-8 max-w-4xl">
          <input 
            value={p.title} 
            onChange={(e) => setP({ ...p, title: e.target.value })} 
            placeholder="System Title"
            className="w-full font-black bg-transparent focus:outline-none text-white tracking-tighter"
            style={{ fontSize: 'clamp(32px, 5vw, 64px)' }} 
          />
          <textarea 
            value={p.excerpt} 
            onChange={(e) => setP({ ...p, excerpt: e.target.value })} 
            placeholder="Core retention summary (1–2 sentences for listing optimization)"
            rows={2}
            className="w-full px-0 font-medium text-xl bg-transparent focus:outline-none resize-none text-white/40 leading-relaxed"
          />
          <div className="pt-8 border-t border-white/5">
            <TiptapEditor 
              ref={editorRef} 
              initialJson={p.content_json} 
              onChange={(json, html) => setP((s) => ({ ...s, content_json: json, content_html: html }))} 
            />
          </div>
        </div>
      )}

      {tab === 'seo' && (
        <div className="space-y-8 max-w-2xl">
          <div className="rounded-[2.5rem] p-10 bg-white/[0.02] border border-white/10">
            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-6">SEO Protocol</h3>
            <ul className="space-y-4">
              {checklist.map((c) => (
                <li key={c.id} className="flex items-start gap-3">
                  <span className="mt-0.5">{c.pass ? <Check size={16} className="text-[#00D4FF]" strokeWidth={3} /> : <X size={16} className="text-rose-500" strokeWidth={3} />}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-white/40">{c.label} {c.hint && <span className="text-white/10 lowercase tracking-normal font-medium">· {c.hint}</span>}</span>
                </li>
              ))}
            </ul>
          </div>

          <Field label={<>Meta title <Counter value={p.meta_title.length} max={60} /></>}>
            <input value={p.meta_title} onChange={(e) => setP({ ...p, meta_title: e.target.value })} maxLength={80} className={inputCls} />
          </Field>
          <Field label={<>Meta description <Counter value={p.meta_description.length} max={160} /></>}>
            <textarea value={p.meta_description} onChange={(e) => setP({ ...p, meta_description: e.target.value })} maxLength={200} rows={3} className={inputCls} />
          </Field>
          <Field label="Focus keyword">
            <input value={p.focus_keyword} onChange={(e) => setP({ ...p, focus_keyword: e.target.value })} className={inputCls} placeholder="e.g. customer retention" />
          </Field>
          <Field label="Open Graph image">
            <div className="space-y-6">
              {ogPreview && (
                <div className="rounded-[2rem] border border-white/10 overflow-hidden bg-white/[0.02] max-w-md">
                  <img src={ogPreview} alt="OG preview" className="w-full h-auto object-cover" />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <button onClick={() => ogRef.current?.click()} className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#00D4FF] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                  <Upload size={14} strokeWidth={3} /> {p.og_image_url ? 'Replace' : 'Upload'}
                </button>
                {p.og_image_url && (
                  <button onClick={async () => { setP((s) => ({ ...s, og_image_url: null })); if (p.id) await save({ og_image_url: null }, true); }} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-white transition-colors">
                    Remove
                  </button>
                )}
                <input ref={ogRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadOg(f); e.target.value = ''; }} />
              </div>
              <p className="text-[10px] font-medium text-white/20">Recommended 1200×630. Shown when this post is shared on social.</p>
            </div>
          </Field>
          <Field label="Canonical URL">
            <input value={p.canonical_url} onChange={(e) => setP({ ...p, canonical_url: e.target.value })} placeholder="https://retentionfirm.com/blog/..." className={inputCls} />
          </Field>
          <Field label="Schema markup (JSON-LD)">
            <textarea value={p.schema_jsonld} onChange={(e) => setP({ ...p, schema_jsonld: e.target.value })} rows={8} placeholder='{ "@context": "https://schema.org", "@type": "Article", ... }'
              className={inputCls + ' font-mono text-xs'} />
            <p className="text-[10px] font-medium text-white/20 mt-3">Leave blank to auto-generate Article schema.</p>
          </Field>
        </div>
      )}

      {tab === 'settings' && (
        <div className="space-y-8 max-w-2xl">
          <Field label="URL slug">
            <div className="flex items-center">
              <span className="text-sm font-black text-white/10 pr-3">/blog/</span>
              <input value={p.slug} onChange={(e) => { setSlugTouched(true); setP({ ...p, slug: slugify(e.target.value) }); }} className={inputCls} />
            </div>
          </Field>
          <Field label="Featured image">
            <div className="space-y-6">
              {featuredPreview && (
                <div className="rounded-[2rem] border border-white/10 overflow-hidden bg-white/[0.02] max-w-md">
                  <img src={featuredPreview} alt="" className="w-full h-auto object-cover" />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#00D4FF] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                  <Upload size={14} strokeWidth={3} /> {p.featured_image_url ? 'Replace' : 'Upload'}
                </button>
                {p.featured_image_url && <button onClick={async () => { setP((s) => ({ ...s, featured_image_url: null })); if (p.id) await save({ featured_image_url: null }, true); }} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-white transition-colors">Remove</button>}
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFeatured(f); e.target.value = ''; }} />
              </div>
            </div>
          </Field>
          <Field label="Alt text">
            <input value={p.featured_image_alt} onChange={(e) => setP({ ...p, featured_image_alt: e.target.value })} className={inputCls} placeholder="Describe the image for screen readers" />
          </Field>
          <Field label="Schedule publication">
            <input type="datetime-local" value={p.scheduled_for ? new Date(p.scheduled_for).toISOString().slice(0, 16) : ''}
              onChange={(e) => setP({ ...p, scheduled_for: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className={inputCls} />
            {p.scheduled_for && p.status !== 'scheduled' && (
              <button onClick={handleSchedule} className="mt-4 px-8 py-4 rounded-2xl bg-[#00D4FF] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(0,212,255,0.2)]">Schedule Pipeline</button>
            )}
          </Field>
        </div>
      )}

      {/* Checklist modal */}
      {showChecklist && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setShowChecklist(false)}>
          <div className="w-full max-w-md bg-black border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]" onClick={(e) => e.stopPropagation()}>
            <div className="px-10 py-8 border-b border-white/10 bg-white/[0.02]">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Pre-publish Checklist</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">Resolve protocol errors before deployment</p>
            </div>
            <div className="p-10 space-y-6">
              <ul className="space-y-4">
                {checklist.map((c) => (
                  <li key={c.id} className="flex items-start gap-3">
                    {c.pass ? <Check size={16} className="text-[#00D4FF] mt-0.5" strokeWidth={3} /> : <X size={16} className="text-rose-500 mt-0.5" strokeWidth={3} />}
                    <span className="text-xs font-black uppercase tracking-widest text-white/40">{c.label}{c.hint && <span className="text-white/10 lowercase tracking-normal font-medium"> · {c.hint}</span>}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowChecklist(false)} className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">Close</button>
                <button onClick={() => { setShowChecklist(false); setTab('seo'); }} className="flex-1 px-6 py-4 rounded-2xl bg-[#00D4FF] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all duration-500">Fix Protocol</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudioLayout>
  );
}

const inputCls = 'w-full px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/10 text-white font-black text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-all duration-300 placeholder:text-white/10';

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">
        {label}
      </label>
      {children}
    </div>
  );
}
