
CREATE POLICY "post-media public read" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'post-media');
CREATE POLICY "post-media staff insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'post-media' AND public.is_staff(auth.uid()));
CREATE POLICY "post-media staff update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'post-media' AND public.is_staff(auth.uid()));
CREATE POLICY "post-media staff delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'post-media' AND public.is_staff(auth.uid()));
