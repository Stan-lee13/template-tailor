import { supabase } from '@/integrations/supabase/client';

export async function logActivity(action: string, entity_type?: string, entity_id?: string, meta?: Record<string, unknown>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('activity_log').insert({
      actor_id: user.id,
      action,
      entity_type,
      entity_id,
      meta: (meta || {}) as any,
    });
  } catch { /* ignore */ }
}

export async function saveRevision(entity_type: 'page' | 'section' | 'settings' | 'nav', entity_id: string | null, snapshot: unknown, label?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('site_revisions').insert({
      entity_type,
      entity_id,
      snapshot: snapshot as any,
      label,
      author_id: user?.id,
    });
  } catch { /* ignore */ }
}
