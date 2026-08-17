import { useEffect, useState } from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';
import { defaultSettings, type SiteSettings } from '@/hooks/useSiteData';
import { toast } from 'sonner';
import { logActivity, saveRevision } from '@/lib/activity';
import { Save } from 'lucide-react';

const inputCls = 'w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-all duration-300 placeholder:text-white/10';

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">{label}</label>
      {children}
      {hint && <p className="text-[10px] font-medium text-white/20 ml-4">{hint}</p>}
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
        const asObj = (v: unknown) => (v && typeof v === 'object' ? v as object : {});
        setSettings({
          id: data.id,
          brand: { ...defaultSettings.brand, ...asObj(data.brand) },
          theme: { ...defaultSettings.theme, ...asObj(data.theme) },
          seo: { ...defaultSettings.seo, ...asObj(data.seo) },
          social: { ...defaultSettings.social, ...asObj(data.social) },
          contact: { ...defaultSettings.contact, ...asObj(data.contact) },
          announcement: { ...defaultSettings.announcement, ...asObj(data.announcement) },
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
      toast.success('System parameters updated');
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends Exclude<keyof SiteSettings, 'id'>>(k: K, v: Partial<SiteSettings[K]>) =>
    setSettings((s) => ({ ...s, [k]: { ...(s[k] as object), ...v } as SiteSettings[K] }));

  if (loading) return <StudioLayout><div className="flex items-center gap-3 text-white/20 font-black text-xs uppercase tracking-widest"><div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-[#00D4FF] animate-spin" /> Calibrating...</div></StudioLayout>;

  return (
    <StudioLayout>
      <div className="flex items-center justify-between mb-12 gap-6 flex-wrap">
        <div>
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">Core <span className="text-gradient-cyan">Parameters</span></h1>
          <p className="text-white/40 font-medium">Calibrate your retention engine's global identity.</p>
        </div>
        <button 
          onClick={save} 
          disabled={saving} 
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#00D4FF] text-black hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(0,212,255,0.2)] disabled:opacity-50"
        >
          <Save size={18} strokeWidth={3} /> {saving ? 'SYNCING...' : 'SAVE PARAMETERS'}
        </button>
      </div>

      <div className="space-y-12">
        {/* Brand */}
        <section className="rounded-[2.5rem] p-10 bg-black border border-white/10">
          <h2 className="text-2xl font-black text-white tracking-tight mb-8">Identity Matrix</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="Brand Name"><input className={inputCls} value={settings.brand.name || ''} onChange={(e) => set('brand', { name: e.target.value })} placeholder="e.g. RETENTIONFIRM" /></Field>
            <Field label="Primary Tagline"><input className={inputCls} value={settings.brand.tagline || ''} onChange={(e) => set('brand', { tagline: e.target.value })} placeholder="e.g. THE RETENTION ENGINE" /></Field>
            <Field label="Logo Asset URL"><input className={inputCls} value={settings.brand.logo_url || ''} onChange={(e) => set('brand', { logo_url: e.target.value })} placeholder="https://..." /></Field>
            <Field label="Favicon Asset URL"><input className={inputCls} value={settings.brand.favicon_url || ''} onChange={(e) => set('brand', { favicon_url: e.target.value })} placeholder="https://..." /></Field>
          </div>
        </section>

        {/* Theme */}
        <section className="rounded-[2.5rem] p-10 bg-black border border-white/10">
          <h2 className="text-2xl font-black text-white tracking-tight mb-8">Visual DNA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(['primary','background','foreground','accent','success'] as const).map((k) => (
              <Field key={k} label={`${k} Chroma`}>
                <div className="flex gap-4 items-center">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                    <input type="color" value={settings.theme[k] || '#000000'} onChange={(e) => set('theme', { [k]: e.target.value } as any)} className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer" />
                  </div>
                  <input className={inputCls} value={settings.theme[k] || ''} onChange={(e) => set('theme', { [k]: e.target.value } as any)} />
                </div>
              </Field>
            ))}
            <Field label="Typography Heading"><input className={inputCls} value={settings.theme.font_heading || ''} onChange={(e) => set('theme', { font_heading: e.target.value })} placeholder="Outfit" /></Field>
            <Field label="Typography Body"><input className={inputCls} value={settings.theme.font_body || ''} onChange={(e) => set('theme', { font_body: e.target.value })} placeholder="Inter" /></Field>
          </div>
        </section>

        {/* SEO */}
        <section className="rounded-[2.5rem] p-10 bg-black border border-white/10">
          <h2 className="text-2xl font-black text-white tracking-tight mb-8">Search Intelligence</h2>
          <div className="grid grid-cols-1 gap-8">
            <Field label="Global Meta Title"><input className={inputCls} value={settings.seo.default_meta_title || ''} onChange={(e) => set('seo', { default_meta_title: e.target.value })} /></Field>
            <Field label="Global Meta Description"><textarea className={inputCls} rows={3} value={settings.seo.default_meta_description || ''} onChange={(e) => set('seo', { default_meta_description: e.target.value })} /></Field>
            <Field label="Global OG Asset URL"><input className={inputCls} value={settings.seo.default_og_image || ''} onChange={(e) => set('seo', { default_og_image: e.target.value })} /></Field>
          </div>
        </section>

        {/* Announcement */}
        <section className="rounded-[2.5rem] p-10 bg-black border border-white/10">
          <h2 className="text-2xl font-black text-white tracking-tight mb-8">Global Broadcast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="Broadcast Status">
              <label className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 cursor-pointer group transition-all hover:bg-white/10">
                <input type="checkbox" checked={!!settings.announcement.enabled} onChange={(e) => set('announcement', { enabled: e.target.checked })} className="w-5 h-5 rounded-lg border-white/20 bg-black text-[#00D4FF] focus:ring-[#00D4FF]" />
                <span className="text-sm font-black text-white/40 group-hover:text-white transition-colors">ACTIVATE SITE-WIDE BROADCAST</span>
              </label>
            </Field>
            <Field label="Signal Variant">
              <select className={inputCls} value={settings.announcement.variant || 'info'} onChange={(e) => set('announcement', { variant: e.target.value as any })}>
                <option value="info" className="bg-black">CRITICAL (DARK)</option>
                <option value="promo" className="bg-black">PROMOTIONAL (CYAN)</option>
                <option value="warning" className="bg-black">ALERT (ROSE)</option>
              </select>
            </Field>
            <Field label="Broadcast Message"><input className={inputCls} value={settings.announcement.text || ''} onChange={(e) => set('announcement', { text: e.target.value })} /></Field>
            <Field label="Destination URL"><input className={inputCls} value={settings.announcement.href || ''} onChange={(e) => set('announcement', { href: e.target.value })} /></Field>
          </div>
        </section>

        <div className="flex justify-end pt-8">
          <button 
            onClick={save} 
            disabled={saving} 
            className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#00D4FF] text-black hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(0,212,255,0.2)] disabled:opacity-50"
          >
            <Save size={18} strokeWidth={3} /> {saving ? 'SYNCING...' : 'SAVE ALL PARAMETERS'}
          </button>
        </div>
      </div>
    </StudioLayout>
  );
}
