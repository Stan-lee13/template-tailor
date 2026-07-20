import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type SiteSettings = {
  id?: string;
  brand: {
    name?: string; tagline?: string; logo_url?: string | null; favicon_url?: string | null;
  };
  theme: {
    primary?: string; background?: string; foreground?: string;
    accent?: string; success?: string;
    font_heading?: string; font_body?: string;
  };
  seo: { default_meta_title?: string; default_meta_description?: string; default_og_image?: string | null };
  social: { linkedin?: string | null; twitter?: string | null; instagram?: string | null };
  contact: { email?: string; phone?: string | null; address?: string | null };
  announcement: { enabled?: boolean; text?: string; href?: string; variant?: 'info' | 'promo' | 'warning' };
};

export const defaultSettings: SiteSettings = {
  brand: { name: 'RetentionFirm', tagline: 'Retention growth partner for ecommerce brands', favicon_url: '/favicon.ico' },
  theme: { primary: '#F97316', background: '#f1ece4', foreground: '#0A0A0A', accent: '#4169E1', success: '#10B981', font_heading: 'Outfit', font_body: 'Inter' },
  seo: { default_meta_title: 'RetentionFirm — Retention Growth Partner', default_meta_description: 'We help ecommerce brands turn one-time buyers into lifetime revenue.' },
  social: { linkedin: null, twitter: null, instagram: null },
  contact: { email: 'hello@retentionfirm.com' },
  announcement: { enabled: false, text: '', href: '', variant: 'info' },
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ['site_settings'],
    queryFn: async (): Promise<SiteSettings> => {
      const { data } = await supabase.from('site_settings').select('*').maybeSingle();
      if (!data) return defaultSettings;
      return {
        id: data.id,
        brand: { ...defaultSettings.brand, ...(data.brand as object || {}) },
        theme: { ...defaultSettings.theme, ...(data.theme as object || {}) },
        seo: { ...defaultSettings.seo, ...(data.seo as object || {}) },
        social: { ...defaultSettings.social, ...(data.social as object || {}) },
        contact: { ...defaultSettings.contact, ...(data.contact as object || {}) },
        announcement: { ...defaultSettings.announcement, ...(data.announcement as object || {}) },
      };
    },
    staleTime: 60_000,
  });
}

export type NavItem = {
  id: string;
  parent_id: string | null;
  location: string;
  label: string;
  href: string;
  position: number;
  enabled: boolean;
  external: boolean;
};

export function useNavItems(location: string) {
  return useQuery({
    queryKey: ['nav_items', location],
    queryFn: async () => {
      const { data } = await supabase
        .from('nav_items')
        .select('*')
        .eq('location', location)
        .eq('enabled', true)
        .order('position');
      return (data || []) as NavItem[];
    },
    staleTime: 60_000,
  });
}

export function useAllNavItems() {
  return useQuery({
    queryKey: ['nav_items_all'],
    queryFn: async () => {
      const { data } = await supabase.from('nav_items').select('*').order('location').order('position');
      return (data || []) as NavItem[];
    },
    staleTime: 30_000,
  });
}
