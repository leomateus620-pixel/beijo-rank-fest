import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const recordKiss = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      photo_path: string;
      city: string;
      party_id?: string | null;
      partner_nickname?: string | null;
      is_public?: boolean;
    }) =>
      z
        .object({
          photo_path: z.string().min(1).max(500),
          city: z.string().trim().min(1).max(80),
          party_id: z.string().uuid().nullish(),
          partner_nickname: z.string().trim().max(40).nullish(),
          is_public: z.boolean().optional(),
        })
        .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // simple rate limit: max 30 in last hour
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count } = await supabase
      .from("kisses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", since);
    if ((count ?? 0) >= 30) throw new Error("Calma aí, beijoqueiro(a)! Limite de 30 por hora 😅");
    const { data: row, error } = await supabase
      .from("kisses")
      .insert({
        user_id: userId,
        photo_path: data.photo_path,
        city: data.city,
        party_id: data.party_id ?? null,
        partner_nickname: data.partner_nickname ?? null,
        is_public: data.is_public ?? false,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const myStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: all } = await supabase
      .from("kisses")
      .select("id, city, party_id, partner_nickname, created_at, is_public")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    const total = all?.length ?? 0;
    const cities = new Set((all ?? []).map((k) => k.city)).size;
    const parties = new Set((all ?? []).filter((k) => k.party_id).map((k) => k.party_id)).size;
    return { total, cities, parties, recent: (all ?? []).slice(0, 20) };
  });

export const addFriend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { username: string }) =>
    z.object({ username: z.string().trim().toLowerCase().min(1).max(40) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: friend } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .eq("username", data.username)
      .maybeSingle();
    if (!friend) throw new Error("Usuário não encontrado");
    if (friend.id === userId) throw new Error("Você não pode adicionar a si mesmo");
    const { error } = await supabase
      .from("friendships")
      .insert({ user_id: userId, friend_id: friend.id });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
    return friend;
  });

export const listFriends = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: fr } = await supabase
      .from("friendships")
      .select("friend_id")
      .eq("user_id", userId);
    const ids = (fr ?? []).map((f) => f.friend_id);
    if (!ids.length) return { friends: [] };
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, city")
      .in("id", ids);
    return { friends: profiles ?? [] };
  });

export const removeFriend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { friendId: string }) => z.object({ friendId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase
      .from("friendships")
      .delete()
      .eq("user_id", userId)
      .eq("friend_id", data.friendId);
    return { ok: true };
  });
