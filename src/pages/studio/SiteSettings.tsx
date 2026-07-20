import { useEffect, useState } from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';
import { defaultSettings, type SiteSettings } from '@/hooks/useSiteData';
import { toast } from 'sonner';
import { logActivity, saveRevision } from '@/lib/activity';
import { Save } from 'lucide-react';

const inputCls = 'w-full px-3 py-2 rounded-md font-inter text-sm border focus:outline-none focus:border-black bg-white';
const styleBorder = { borderColor: '#E2DDD3' } as const;

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block font-inter text-xs uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>{label}</label>
      {children}
      {hint && <p className="font-inter text-xs mt-1" style={{ color: '#888' }}>{hint}</p>}
    </div>
  );
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').maybeSingle();
      if (data) {
        setSettings({
          id: data.id,
          brand: { ...defaultSettings.brand, ...(data.brand as object || {}) },
          theme: { ...defaultSettings.theme, ...(data.theme as object || {}) },
          seo: { ...defaultSettings.seo, ...(data.seo as object || {}) },
          social: { ...defaultSettings.social, ...(data.social as object || {}) },
          contact: { ...defaultSettings.contact, ...(data.contact as object || {}) },
          announcement: { ...defaultSettings.announcement, ...(data.announcement as object || {}) },
        });
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        brand: settings.brand,
        theme: settings.theme,
        seo: settings.seo,
        social: settings.social,
        contact: settings.contact,
        announcement: settings.announcement,
      } as any;
      let error;
      if (settings.id) {
        ({ error } = await supabase.from('site_settings').update(payload).eq('id', settings.id));
      } else {
        const { data, error: err } = await supabase.from('site_settings').insert(payload).select().single();
        error = err;
        if (data) setSettings((s) => ({ ...s, id: data.id }));
      }
      if (error) throw error;
      await saveRevision('settings', settings.id || null, payload, 'Manual save');
      await logActivity('site_settings.update', 'settings', settings.id);
      toast.success('Settings saved');
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof SiteSettings>(k: K, v: Partial<SiteSettings[K]>) =>
    setSettings((s) => ({ ...s, [k]: { ...s[k], ...v } as SiteSettings[K] }));

  if (loading) return <StudioLayout><p className="font-inter text-sm">Loading…</p></StudioLayout>;

  return (
    <StudioLayout>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-outfit font-medium text-3xl sm:text-4xl mb-1" style={{ color: '#0A0A0A', letterSpacing: '-0.02em' }}>Site settings</h1>
          <p className="font-inter text-sm" style={{ color: '#666' }}>Global brand, theme, SEO, and contact information.</p>
        </div>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-inter text-sm font-medium disabled:opacity-50" style={{ background: '#F97316', color: '#0A0A0A' }}>
          <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Brand */}
        <section className="rounded-xl p-5 sm:p-6" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
          <h2 className="font-outfit text-lg font-medium mb-4">Brand</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Brand name"><input className={inputCls} style={styleBorder} value={settings.brand.name || ''} onChange={(e) => set('brand', { name: e.target.value })} /></Field>
            <Field label="Tagline"><input className={inputCls} style={styleBorder} value={settings.brand.tagline || ''} onChange={(e) => set('brand', { tagline: e.target.value })} /></Field>
            <Field label="Logo URL"><input className={inputCls} style={styleBorder} value={settings.brand.logo_url || ''} onChange={(e) => set('brand', { logo_url: e.target.value })} /></Field>
            <Field label="Favicon URL"><input className={inputCls} style={styleBorder} value={settings.brand.favicon_url || ''} onChange={(e) => set('brand', { favicon_url: e.target.value })} /></Field>
          </div>
        </section>

        {/* Theme */}
        <section className="rounded-xl p-5 sm:p-6" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
          <h2 className="font-outfit text-lg font-medium mb-4">Theme</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(['primary','background','foreground','accent','success'] as const).map((k) => (
              <Field key={k} label={k}>
                <div className="flex gap-2 items-center">
                  <input type="color" value={settings.theme[k] || '#000000'} onChange={(e) => set('theme', { [k]: e.target.value } as any)} className="w-10 h-9 rounded border" style={styleBorder} />
                  <input className={inputCls} style={styleBorder} value={settings.theme[k] || ''} onChange={(e) => set('theme', { [k]: e.target.value } as any)} />
                </div>
              </Field>
            ))}
            <Field label="Heading font"><input className={inputCls} style={styleBorder} value={settings.theme.font_heading || ''} onChange={(e) => set('theme', { font_heading: e.target.value })} /></Field>
            <Field label="Body font"><input className={inputCls} style={styleBorder} value={settings.theme.font_body || ''} onChange={(e) => set('theme', { font_body: e.target.value })} /></Field>
          </div>
        </section>

        {/* SEO */}
        <section className="rounded-xl p-5 sm:p-6" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
          <h2 className="font-outfit text-lg font-medium mb-4">SEO defaults</h2>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Default meta title"><input className={inputCls} style={styleBorder} value={settings.seo.default_meta_title || ''} onChange={(e) => set('seo', { default_meta_title: e.target.value })} /></Field>
            <Field label="Default meta description"><textarea className={inputCls} style={styleBorder} rows={2} value={settings.seo.default_meta_description || ''} onChange={(e) => set('seo', { default_meta_description: e.target.value })} /></Field>
            <Field label="Default OG image URL"><input className={inputCls} style={styleBorder} value={settings.seo.default_og_image || ''} onChange={(e) => set('seo', { default_og_image: e.target.value })} /></Field>
          </div>
        </section>

        {/* Announcement */}
        <section className="rounded-xl p-5 sm:p-6" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
          <h2 className="font-outfit text-lg font-medium mb-4">Announcement bar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Enabled">
              <label className="flex items-center gap-2 font-inter text-sm">
                <input type="checkbox" checked={!!settings.announcement.enabled} onChange={(e) => set('announcement', { enabled: e.target.checked })} />
                Show bar site-wide
              </label>
            </Field>
            <Field label="Variant">
              <select className={inputCls} style={styleBorder} value={settings.announcement.variant || 'info'} onChange={(e) => set('announcement', { variant: e.target.value as any })}>
                <option value="info">Info (dark)</option>
                <option value="promo">Promo (orange)</option>
                <option value="warning">Warning (red)</option>
              </select>
            </Field>
            <Field label="Text"><input className={inputCls} style={styleBorder} value={settings.announcement.text || ''} onChange={(e) => set('announcement', { text: e.target.value })} /></Field>
            <Field label="Link URL (optional)"><input className={inputCls} style={styleBorder} value={settings.announcement.href || ''} onChange={(e) => set('announcement', { href: e.target.value })} /></Field>
          </div>
        </section>

        {/* Social & contact */}
        <section className="rounded-xl p-5 sm:p-6" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
          <h2 className="font-outfit text-lg font-medium mb-4">Social & contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="LinkedIn URL"><input className={inputCls} style={styleBorder} value={settings.social.linkedin || ''} onChange={(e) => set('social', { linkedin: e.target.value })} /></Field>
            <Field label="Twitter/X URL"><input className={inputCls} style={styleBorder} value={settings.social.twitter || ''} onChange={(e) => set('social', { twitter: e.target.value })} /></Field>
            <Field label="Instagram URL"><input className={inputCls} style={styleBorder} value={settings.social.instagram || ''} onChange={(e) => set('social', { instagram: e.target.value })} /></Field>
            <Field label="Contact email"><input className={inputCls} style={styleBorder} value={settings.contact.email || ''} onChange={(e) => set('contact', { email: e.target.value })} /></Field>
            <Field label="Phone"><input className={inputCls} style={styleBorder} value={settings.contact.phone || ''} onChange={(e) => set('contact', { phone: e.target.value })} /></Field>
            <Field label="Address"><input className={inputCls} style={styleBorder} value={settings.contact.address || ''} onChange={(e) => set('contact', { address: e.target.value })} /></Field>
          </div>
        </section>

        <div className="flex justify-end">
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-inter text-sm font-medium disabled:opacity-50" style={{ background: '#F97316', color: '#0A0A0A' }}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </StudioLayout>
  );
}
