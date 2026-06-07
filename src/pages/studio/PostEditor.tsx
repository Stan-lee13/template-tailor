import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import StudioLayout from '@/components/studio/StudioLayout';
import TiptapEditor from '@/components/studio/TiptapEditor';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { slugify } from '@/lib/slug';
import { runSeoChecklist } from '@/lib/seo-checklist';
import { uploadPostMedia, getMediaUrl } from '@/lib/storage';
import { toast } from 'sonner';
import { ArrowLeft, Check, X, Upload, ExternalLink } from 'lucide-react';

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
  return <span className="font-inter text-[10px] tabular-nums" style={{ color: over ? '#dc2626' : '#888' }}>{value}/{max}</span>;
}

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <Link to="/studio/posts" className="inline-flex items-center gap-1.5 font-inter text-sm" style={{ color: '#666' }}>
          <ArrowLeft size={14} /> Posts
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {p.status === 'published' && p.slug && (
            <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md font-inter text-xs" style={{ color: '#666' }}>
              View live <ExternalLink size={12} />
            </a>
          )}
          <button onClick={() => save()} disabled={saving} className="px-4 py-2 rounded-md font-inter text-sm border" style={{ borderColor: '#0A0A0A', color: '#0A0A0A', background: 'transparent' }}>
            {saving ? '…' : 'Save draft'}
          </button>
          {p.status === 'published' ? (
            <button onClick={handleUnpublish} className="px-4 py-2 rounded-md font-inter text-sm" style={{ background: '#0A0A0A', color: '#f1ece4' }}>Unpublish</button>
          ) : (
            <button onClick={handlePublish} className="px-4 py-2 rounded-md font-inter text-sm font-medium" style={{ background: '#F97316', color: '#0A0A0A' }}>
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: '#E2DDD3' }}>
        {(['content', 'seo', 'settings'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2.5 font-inter text-sm capitalize border-b-2 -mb-px"
            style={{ borderColor: tab === t ? '#0A0A0A' : 'transparent', color: tab === t ? '#0A0A0A' : '#888', fontWeight: tab === t ? 600 : 400 }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'content' && (
        <div className="space-y-5">
          <input value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} placeholder="Post title"
            className="w-full font-outfit font-medium bg-transparent focus:outline-none"
            style={{ fontSize: 'clamp(28px, 4vw, 40px)', color: '#0A0A0A', letterSpacing: '-0.02em' }} />
          <textarea value={p.excerpt} onChange={(e) => setP({ ...p, excerpt: e.target.value })} placeholder="Excerpt (1–2 sentences shown on listings)"
            rows={2}
            className="w-full px-0 font-inter text-base bg-transparent focus:outline-none resize-none"
            style={{ color: '#444' }} />
          <TiptapEditor initialJson={p.content_json} onChange={(json, html) => setP((s) => ({ ...s, content_json: json, content_html: html }))} />
        </div>
      )}

      {tab === 'seo' && (
        <div className="space-y-5 max-w-2xl">
          <div className="rounded-xl p-5" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
            <h3 className="font-outfit font-medium mb-3" style={{ color: '#0A0A0A' }}>SEO checklist</h3>
            <ul className="space-y-2">
              {checklist.map((c) => (
                <li key={c.id} className="flex items-start gap-2 font-inter text-sm">
                  <span className="mt-0.5">{c.pass ? <Check size={16} color="#10B981" /> : <X size={16} color="#dc2626" />}</span>
                  <span style={{ color: '#333' }}>{c.label} {c.hint && <span style={{ color: '#888' }}>· {c.hint}</span>}</span>
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
            <div className="space-y-3">
              {ogPreview && <img src={ogPreview} alt="OG preview" className="rounded-lg max-h-40 object-cover" />}
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => ogRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md font-inter text-xs border" style={{ borderColor: '#E2DDD3' }}>
                  <Upload size={12} /> {p.og_image_url ? 'Replace' : 'Upload'}
                </button>
                {p.og_image_url && (
                  <button onClick={async () => { setP((s) => ({ ...s, og_image_url: null })); if (p.id) await save({ og_image_url: null }, true); }} className="font-inter text-xs" style={{ color: '#dc2626' }}>
                    Remove
                  </button>
                )}
                <input ref={ogRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadOg(f); e.target.value = ''; }} />
              </div>
              <p className="font-inter text-xs" style={{ color: '#888' }}>Recommended 1200×630. Shown when this post is shared on social.</p>
            </div>
          </Field>
          <Field label="Canonical URL">
            <input value={p.canonical_url} onChange={(e) => setP({ ...p, canonical_url: e.target.value })} placeholder="https://retentionfirm.com/blog/..." className={inputCls} />
          </Field>
          <Field label="Schema markup (JSON-LD)">
            <textarea value={p.schema_jsonld} onChange={(e) => setP({ ...p, schema_jsonld: e.target.value })} rows={8} placeholder='{ "@context": "https://schema.org", "@type": "Article", ... }'
              className={inputCls + ' font-mono text-xs'} />
            <p className="font-inter text-xs mt-1" style={{ color: '#888' }}>Leave blank to auto-generate Article schema.</p>
          </Field>
        </div>
      )}

      {tab === 'settings' && (
        <div className="space-y-5 max-w-2xl">
          <Field label="URL slug">
            <div className="flex items-center">
              <span className="font-inter text-sm pr-1" style={{ color: '#888' }}>/blog/</span>
              <input value={p.slug} onChange={(e) => { setSlugTouched(true); setP({ ...p, slug: slugify(e.target.value) }); }} className={inputCls} />
            </div>
          </Field>
          <Field label="Featured image">
            <div className="space-y-3">
              {featuredPreview && <img src={featuredPreview} alt="" className="rounded-lg max-h-40 object-cover" />}
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md font-inter text-xs border" style={{ borderColor: '#E2DDD3' }}>
                  <Upload size={12} /> {p.featured_image_url ? 'Replace' : 'Upload'}
                </button>
                {p.featured_image_url && <button onClick={async () => { setP((s) => ({ ...s, featured_image_url: null })); if (p.id) await save({ featured_image_url: null }, true); }} className="font-inter text-xs" style={{ color: '#dc2626' }}>Remove</button>}
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
              <button onClick={handleSchedule} className="mt-2 px-3 py-1.5 rounded font-inter text-xs" style={{ background: '#4169E1', color: '#fff' }}>Schedule this post</button>
            )}
          </Field>
        </div>
      )}

      {/* Checklist modal */}
      {showChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowChecklist(false)}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-outfit font-medium text-xl mb-2" style={{ color: '#0A0A0A' }}>Pre-publish checklist</h3>
            <p className="font-inter text-sm mb-5" style={{ color: '#666' }}>Resolve these before publishing:</p>
            <ul className="space-y-3 mb-6">
              {checklist.map((c) => (
                <li key={c.id} className="flex items-start gap-2 font-inter text-sm">
                  {c.pass ? <Check size={16} color="#10B981" className="mt-0.5" /> : <X size={16} color="#dc2626" className="mt-0.5" />}
                  <span style={{ color: '#333' }}>{c.label}{c.hint && <span style={{ color: '#888' }}> · {c.hint}</span>}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowChecklist(false)} className="px-4 py-2 rounded-md font-inter text-sm border" style={{ borderColor: '#E2DDD3' }}>Close</button>
              <button onClick={() => { setShowChecklist(false); setTab('seo'); }} className="px-4 py-2 rounded-md font-inter text-sm" style={{ background: '#0A0A0A', color: '#f1ece4' }}>Fix in SEO tab</button>
            </div>
          </div>
        </div>
      )}
    </StudioLayout>
  );
}

const inputCls = 'w-full px-3 py-2.5 rounded-md font-inter text-sm border focus:outline-none focus:border-black bg-white';

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center justify-between mb-1.5">
        <span className="font-inter text-xs uppercase tracking-wider" style={{ color: '#555' }}>{label}</span>
      </label>
      {children}
    </div>
  );
}
