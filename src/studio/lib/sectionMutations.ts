import { supabase } from '@/integrations/supabase/client';
import { logActivity, saveRevision } from '@/lib/activity';
import { getSection } from '@/studio/sections/registry';

export type Section = {
  id: string;
  page_id: string | null;
  section_key: string;
  type: string;
  position: number;
  enabled: boolean;
  content: Record<string, unknown>;
  updated_at: string;
};

export async function fetchPageSections(pageId: string): Promise<Section[]> {
  const { data } = await supabase.from('site_sections').select('*').eq('page_id', pageId).order('position');
  return (data as Section[]) || [];
}

export async function updateSectionContent(id: string, content: Record<string, unknown>) {
  const { error } = await supabase.from('site_sections').update({ content: content as any }).eq('id', id);
  if (error) throw error;
  await saveRevision('section', id, { content });
  await logActivity('section.update', 'section', id, { via: 'visual_editor' });
}

export async function setSectionEnabled(id: string, enabled: boolean) {
  const { error } = await supabase.from('site_sections').update({ enabled }).eq('id', id);
  if (error) throw error;
  await logActivity(enabled ? 'section.show' : 'section.hide', 'section', id);
}

export async function duplicateSection(s: Section): Promise<Section> {
  const { data, error } = await supabase.from('site_sections').insert({
    page_id: s.page_id,
    section_key: `${s.section_key}_copy_${Date.now().toString(36)}`,
    type: s.type,
    content: s.content as any,
    position: s.position + 1,
    enabled: s.enabled,
  }).select().single();
  if (error) throw error;
  await logActivity('section.duplicate', 'section', data.id);
  return data as Section;
}

export async function deleteSection(id: string) {
  const { error } = await supabase.from('site_sections').delete().eq('id', id);
  if (error) throw error;
  await logActivity('section.delete', 'section', id);
}

export async function addSection(pageId: string | null, type: string, contentOverride?: Record<string, unknown>, afterPos?: number): Promise<Section | null> {
  const def = getSection(type);
  if (!def) return null;
  const { data, error } = await supabase.from('site_sections').insert({
    page_id: pageId,
    section_key: `${type}_${Date.now().toString(36)}`,
    type,
    position: (afterPos ?? 0) + 10,
    enabled: true,
    content: (contentOverride ?? def.defaults) as any,
  }).select().single();
  if (error) throw error;
  await logActivity('section.create', 'section', data.id, { type });
  return data as Section;
}

export async function reorderSections(sections: Section[]) {
  await Promise.all(sections.map((s) => supabase.from('site_sections').update({ position: s.position }).eq('id', s.id)));
  await logActivity('section.reorder', 'page', sections[0]?.page_id || undefined);
}

export async function saveSectionAsTemplate(s: Section, name: string) {
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('section_templates').insert({
    name, type: s.type, content: s.content as any, created_by: user?.id,
  });
  if (error) throw error;
}
