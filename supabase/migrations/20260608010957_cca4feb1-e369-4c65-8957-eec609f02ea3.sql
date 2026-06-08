
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Storage: users manage only their own folder (user_id/...)
CREATE POLICY "kiss photos owner read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'kiss-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "kiss photos owner insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'kiss-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "kiss photos owner update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'kiss-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "kiss photos owner delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'kiss-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
