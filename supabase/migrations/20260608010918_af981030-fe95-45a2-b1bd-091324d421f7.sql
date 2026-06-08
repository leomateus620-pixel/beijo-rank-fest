
-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles are public" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- PARTIES
CREATE TABLE public.parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  city TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.parties TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.parties TO authenticated;
GRANT ALL ON public.parties TO service_role;
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parties are public" ON public.parties FOR SELECT USING (true);
CREATE POLICY "anyone authed can create party" ON public.parties FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "creator can update party" ON public.parties FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "creator can delete party" ON public.parties FOR DELETE USING (auth.uid() = created_by);

-- PARTY MEMBERS
CREATE TABLE public.party_members (
  party_id UUID NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (party_id, user_id)
);
GRANT SELECT ON public.party_members TO anon, authenticated;
GRANT INSERT, DELETE ON public.party_members TO authenticated;
GRANT ALL ON public.party_members TO service_role;
ALTER TABLE public.party_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members public read" ON public.party_members FOR SELECT USING (true);
CREATE POLICY "users join self" ON public.party_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users leave self" ON public.party_members FOR DELETE USING (auth.uid() = user_id);

-- FRIENDSHIPS
CREATE TABLE public.friendships (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, friend_id),
  CHECK (user_id <> friend_id)
);
GRANT SELECT, INSERT, DELETE ON public.friendships TO authenticated;
GRANT ALL ON public.friendships TO service_role;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own friendships" ON public.friendships FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "users add friends" ON public.friendships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users remove friends" ON public.friendships FOR DELETE USING (auth.uid() = user_id);

-- KISSES
CREATE TABLE public.kisses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_nickname TEXT,
  city TEXT NOT NULL,
  party_id UUID REFERENCES public.parties(id) ON DELETE SET NULL,
  photo_path TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX kisses_user_idx ON public.kisses(user_id);
CREATE INDEX kisses_city_idx ON public.kisses(city);
CREATE INDEX kisses_party_idx ON public.kisses(party_id);
CREATE INDEX kisses_created_idx ON public.kisses(created_at DESC);
GRANT SELECT ON public.kisses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.kisses TO authenticated;
GRANT ALL ON public.kisses TO service_role;
ALTER TABLE public.kisses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "kisses public read for counts" ON public.kisses FOR SELECT USING (true);
CREATE POLICY "users insert own kisses" ON public.kisses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own kisses" ON public.kisses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users delete own kisses" ON public.kisses FOR DELETE USING (auth.uid() = user_id);

-- PROFILE AUTO-CREATE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INT := 0;
BEGIN
  base_username := lower(regexp_replace(
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'user'),
    '[^a-z0-9]', '', 'g'
  ));
  IF base_username = '' THEN base_username := 'user'; END IF;
  final_username := base_username;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
  END LOOP;

  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', final_username),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
