
-- Explicit GRANTs (RLS policies already exist)
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_revisions TO authenticated;
GRANT ALL ON public.post_revisions TO service_role;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- Cron: publish scheduled posts every minute
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'publish-due-posts') THEN
    PERFORM cron.unschedule('publish-due-posts');
  END IF;
END $$;

SELECT cron.schedule('publish-due-posts', '* * * * *', $$SELECT public.publish_due_posts();$$);
