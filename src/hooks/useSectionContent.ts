import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { withDefaults, getSection } from '@/studio/sections/registry';

export type SectionRow = {
  id: string;
  page_id: string | null;
  section_key: string;
  type: string;
  position: number;
  enabled: boolean;
  content: Record<string, unknown>;
  updated_at: string;
};

/**
 * Fetch a single section's content by page path + section_key.
 * Falls back to registry defaults so the live site keeps rendering
 * even if the row is missing or disabled.
 */
export function useSectionContent<T = Record<string, unknown>>(pagePath: string, sectionKey: string, type: string): T {
  const { data } = useQuery({
    queryKey: ['section_content', pagePath, sectionKey],
    queryFn: async () => {
      // Look up page id from path (nullable — global sections don't have a page).
      const { data: page } = await supabase.from('site_pages').select('id').eq('path', pagePath).maybeSingle();
      const pageId = page?.id ?? null;

      let q = supabase.from('site_sections').select('*').eq('section_key', sectionKey).eq('enabled', true).limit(1);
      q = pageId ? q.eq('page_id', pageId) : q.is('page_id', null);
      const { data: row } = await q.maybeSingle();
      return row as SectionRow | null;
    },
    staleTime: 30_000,
  });

  return withDefaults(type, (data?.content as Record<string, unknown>) ?? null) as T;
}

/**
 * Fetch all sections for a page (used by the Studio editor).
 */
export function usePageSections(pageId: string | null) {
  return useQuery({
    queryKey: ['page_sections', pageId],
    queryFn: async () => {
      if (!pageId) return [];
      const { data } = await supabase.from('site_sections').select('*').eq('page_id', pageId).order('position');
      return (data || []) as SectionRow[];
    },
    enabled: !!pageId,
    staleTime: 10_000,
  });
}

export { getSection };
