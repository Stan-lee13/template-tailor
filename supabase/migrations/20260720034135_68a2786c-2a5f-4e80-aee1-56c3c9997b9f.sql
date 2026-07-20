
-- Helper: content managers should also be considered "staff-ish" for edits
CREATE OR REPLACE FUNCTION public.can_edit_site(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','editor','content_manager','owner')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_owner_or_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','owner')
  );
$$;

REVOKE EXECUTE ON FUNCTION public.can_edit_site(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_owner_or_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_edit_site(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_owner_or_admin(uuid) TO authenticated, service_role;

-- Page status enum
DO $$ BEGIN
  CREATE TYPE public.page_status AS ENUM ('draft','published','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============ site_settings (singleton) ============
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE,
  brand JSONB NOT NULL DEFAULT '{}'::jsonb,
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo JSONB NOT NULL DEFAULT '{}'::jsonb,
  social JSONB NOT NULL DEFAULT '{}'::jsonb,
  contact JSONB NOT NULL DEFAULT '{}'::jsonb,
  announcement JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings staff write" ON public.site_settings FOR ALL TO authenticated
  USING (public.can_edit_site(auth.uid())) WITH CHECK (public.can_edit_site(auth.uid()));

-- ============ site_pages ============
CREATE TABLE public.site_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  status public.page_status NOT NULL DEFAULT 'draft',
  noindex BOOLEAN NOT NULL DEFAULT false,
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  is_system BOOLEAN NOT NULL DEFAULT false, -- system pages cannot be deleted
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);
GRANT SELECT ON public.site_pages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_pages TO authenticated;
GRANT ALL ON public.site_pages TO service_role;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages public read published" ON public.site_pages FOR SELECT
  USING (status = 'published' OR public.can_edit_site(auth.uid()));
CREATE POLICY "pages staff write" ON public.site_pages FOR INSERT TO authenticated
  WITH CHECK (public.can_edit_site(auth.uid()));
CREATE POLICY "pages staff update" ON public.site_pages FOR UPDATE TO authenticated
  USING (public.can_edit_site(auth.uid())) WITH CHECK (public.can_edit_site(auth.uid()));
CREATE POLICY "pages admin delete" ON public.site_pages FOR DELETE TO authenticated
  USING (public.is_owner_or_admin(auth.uid()) AND NOT is_system);

-- ============ site_sections ============
CREATE TABLE public.site_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.site_pages(id) ON DELETE CASCADE, -- null = global
  section_key TEXT NOT NULL, -- e.g. 'hero', 'services'
  type TEXT NOT NULL,        -- registry type key
  position INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);
CREATE INDEX idx_site_sections_page ON public.site_sections(page_id, position);
CREATE UNIQUE INDEX idx_site_sections_page_key ON public.site_sections(COALESCE(page_id::text,'__global__'), section_key);
GRANT SELECT ON public.site_sections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_sections TO authenticated;
GRANT ALL ON public.site_sections TO service_role;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sections public read enabled" ON public.site_sections FOR SELECT
  USING (
    enabled = true
    OR public.can_edit_site(auth.uid())
  );
CREATE POLICY "sections staff write" ON public.site_sections FOR ALL TO authenticated
  USING (public.can_edit_site(auth.uid())) WITH CHECK (public.can_edit_site(auth.uid()));

-- ============ section_templates ============
CREATE TABLE public.section_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  thumbnail_url TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.section_templates TO authenticated;
GRANT ALL ON public.section_templates TO service_role;
ALTER TABLE public.section_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "templates staff read" ON public.section_templates FOR SELECT TO authenticated
  USING (public.can_edit_site(auth.uid()));
CREATE POLICY "templates staff write" ON public.section_templates FOR ALL TO authenticated
  USING (public.can_edit_site(auth.uid())) WITH CHECK (public.can_edit_site(auth.uid()));

-- ============ media_folders + media_assets ============
CREATE TABLE public.media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.media_folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_folders TO authenticated;
GRANT SELECT ON public.media_folders TO anon;
GRANT ALL ON public.media_folders TO service_role;
ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "folders public read" ON public.media_folders FOR SELECT USING (true);
CREATE POLICY "folders staff write" ON public.media_folders FOR ALL TO authenticated
  USING (public.can_edit_site(auth.uid())) WITH CHECK (public.can_edit_site(auth.uid()));

CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES public.media_folders(id) ON DELETE SET NULL,
  storage_bucket TEXT NOT NULL DEFAULT 'site-media',
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime TEXT,
  width INT,
  height INT,
  size_bytes BIGINT,
  alt TEXT,
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_media_assets_folder ON public.media_assets(folder_id);
GRANT SELECT ON public.media_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media public read" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "media staff write" ON public.media_assets FOR ALL TO authenticated
  USING (public.can_edit_site(auth.uid())) WITH CHECK (public.can_edit_site(auth.uid()));

-- ============ site_revisions ============
CREATE TABLE public.site_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'page' | 'section' | 'settings' | 'nav'
  entity_id UUID,
  snapshot JSONB NOT NULL,
  label TEXT,
  author_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_revisions_entity ON public.site_revisions(entity_type, entity_id, created_at DESC);
GRANT SELECT, INSERT ON public.site_revisions TO authenticated;
GRANT ALL ON public.site_revisions TO service_role;
ALTER TABLE public.site_revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "revisions staff read" ON public.site_revisions FOR SELECT TO authenticated
  USING (public.can_edit_site(auth.uid()));
CREATE POLICY "revisions staff insert" ON public.site_revisions FOR INSERT TO authenticated
  WITH CHECK (public.can_edit_site(auth.uid()));

-- ============ activity_log ============
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_created ON public.activity_log(created_at DESC);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity admin read" ON public.activity_log FOR SELECT TO authenticated
  USING (public.is_owner_or_admin(auth.uid()));
CREATE POLICY "activity staff insert" ON public.activity_log FOR INSERT TO authenticated
  WITH CHECK (public.can_edit_site(auth.uid()));

-- ============ nav_items ============
CREATE TABLE public.nav_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.nav_items(id) ON DELETE CASCADE,
  location TEXT NOT NULL, -- 'header' | 'footer_resources' | 'footer_company' | 'footer_legal' | 'footer_support'
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  external BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_nav_location_pos ON public.nav_items(location, position);
GRANT SELECT ON public.nav_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.nav_items TO authenticated;
GRANT ALL ON public.nav_items TO service_role;
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nav public read" ON public.nav_items FOR SELECT USING (enabled OR public.can_edit_site(auth.uid()));
CREATE POLICY "nav staff write" ON public.nav_items FOR ALL TO authenticated
  USING (public.can_edit_site(auth.uid())) WITH CHECK (public.can_edit_site(auth.uid()));

-- ============ updated_at triggers ============
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_site_pages_updated BEFORE UPDATE ON public.site_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_site_sections_updated BEFORE UPDATE ON public.site_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_nav_items_updated BEFORE UPDATE ON public.nav_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Storage policies for site-media bucket ============
CREATE POLICY "site-media public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'site-media');
CREATE POLICY "site-media staff insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-media' AND public.can_edit_site(auth.uid()));
CREATE POLICY "site-media staff update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-media' AND public.can_edit_site(auth.uid()));
CREATE POLICY "site-media staff delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-media' AND public.can_edit_site(auth.uid()));

-- ============ Seed: singleton settings + core pages ============
INSERT INTO public.site_settings (singleton, brand, theme, seo, social, contact, announcement)
VALUES (
  true,
  jsonb_build_object(
    'name','RetentionFirm','tagline','Retention growth partner for ecommerce brands',
    'logo_url',null,'favicon_url','/favicon.ico'
  ),
  jsonb_build_object(
    'primary','#F97316','background','#f1ece4','foreground','#0A0A0A',
    'accent','#4169E1','success','#10B981',
    'font_heading','Outfit','font_body','Inter'
  ),
  jsonb_build_object(
    'default_meta_title','RetentionFirm — Retention Growth Partner',
    'default_meta_description','We help ecommerce brands turn one-time buyers into lifetime revenue.',
    'default_og_image',null
  ),
  jsonb_build_object('linkedin',null,'twitter',null,'instagram',null),
  jsonb_build_object('email','hello@retentionfirm.com','phone',null,'address',null),
  jsonb_build_object('enabled',false,'text','','href','','variant','info')
)
ON CONFLICT (singleton) DO NOTHING;

-- Seed core pages
INSERT INTO public.site_pages (path, title, status, is_system, published_at) VALUES
  ('/','Home','published',true,now()),
  ('/about','About','published',true,now()),
  ('/contact','Contact','published',true,now()),
  ('/blog','Blog','published',true,now()),
  ('/thank-you','Thank You','published',true,now()),
  ('/solutions/ecommerce-brands','Ecommerce Brands','published',true,now()),
  ('/solutions/publishers','Publishers','published',true,now()),
  ('/solutions/retail','Retail','published',true,now()),
  ('/case-studies','Case Studies','published',true,now()),
  ('/integrations','Integrations','published',true,now()),
  ('/partners','Partners','published',true,now()),
  ('/careers','Careers','published',true,now()),
  ('/pricing','Pricing','published',true,now()),
  ('/privacy','Privacy Policy','published',true,now()),
  ('/terms','Terms of Service','published',true,now()),
  ('/cookies','Cookies','published',true,now()),
  ('/compliance','Compliance','published',true,now()),
  ('/legal/ccpa-opt-out','CCPA Opt-Out','published',true,now()),
  ('/legal/privacy-choices','Your Privacy Choices','published',true,now()),
  ('/legal/database-opt-out','Database Opt-Out','published',true,now())
ON CONFLICT (path) DO NOTHING;

-- Seed nav_items (header + footer)
INSERT INTO public.nav_items (location, label, href, position) VALUES
  ('header','About','/about',10),
  ('header','Services','/#services',20),
  ('header','Case Studies','/case-studies',30),
  ('header','Blog','/blog',40),
  ('header','Contact','/contact',50),
  ('footer_resources','Ecommerce Brands','/solutions/ecommerce-brands',10),
  ('footer_resources','Publishers','/solutions/publishers',20),
  ('footer_resources','Retail','/solutions/retail',30),
  ('footer_resources','Case Studies','/case-studies',40),
  ('footer_support','Integrations','/integrations',10),
  ('footer_support','Pricing','/pricing',20),
  ('footer_support','Contact','/contact',30),
  ('footer_company','About Us','/about',10),
  ('footer_company','Careers','/careers',20),
  ('footer_company','Partners','/partners',30),
  ('footer_company','Blog','/blog',40),
  ('footer_legal','Privacy Policy','/privacy',10),
  ('footer_legal','Terms of Service','/terms',20),
  ('footer_legal','Cookies','/cookies',30),
  ('footer_legal','Compliance','/compliance',40),
  ('footer_legal','Your Privacy Choices','/legal/privacy-choices',50),
  ('footer_legal','CCPA Opt-Out','/legal/ccpa-opt-out',60),
  ('footer_legal','Database Opt-Out','/legal/database-opt-out',70);
