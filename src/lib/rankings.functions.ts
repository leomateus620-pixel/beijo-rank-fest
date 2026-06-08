import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Row = {
  user_id: string;
  count: number;
  display_name: string;
  username: string;
  avatar_url: string | null;
  city: string | null;
};

type KissRow = { user_id: string };
type ProfileRow = {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  city: string | null;
};

function aggregate(kisses: KissRow[], profiles: ProfileRow[]): Row[] {
  const counts = new Map<string, number>();
  for (const k of kisses) counts.set(k.user_id, (counts.get(k.user_id) ?? 0) + 1);
  const pmap = new Map(profiles.map((p) => [p.id, p]));
  return Array.from(counts.entries())
    .map(([user_id, count]) => {
      const p = pmap.get(user_id);
      return p
        ? {
            user_id,
            count,
            display_name: p.display_name,
            username: p.username,
            avatar_url: p.avatar_url,
            city: p.city,
          }
        : null;
    })
    .filter((r): r is Row => !!r)
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);
}

export const getGlobalRanking = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: kisses } = await supabaseAdmin.from("kisses").select("user_id");
  if (!kisses?.length) return { rows: [] as Row[] };
  const ids = Array.from(new Set(kisses.map((k) => k.user_id)));
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, display_name, username, avatar_url, city")
    .in("id", ids);
  return { rows: aggregate(kisses, profiles ?? []) };
});

export const getCityRanking = createServerFn({ method: "GET" })
  .inputValidator((d: { city: string }) => z.object({ city: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: kisses } = await supabaseAdmin
      .from("kisses")
      .select("user_id")
      .ilike("city", data.city);
    if (!kisses?.length) return { rows: [] as Row[] };
    const ids = Array.from(new Set(kisses.map((k) => k.user_id)));
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, username, avatar_url, city")
      .in("id", ids);
    return { rows: aggregate(kisses, profiles ?? []) };
  });

export const getPartyRanking = createServerFn({ method: "GET" })
  .inputValidator((d: { partyId: string }) => z.object({ partyId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: kisses } = await supabaseAdmin
      .from("kisses")
      .select("user_id")
      .eq("party_id", data.partyId);
    if (!kisses?.length) return { rows: [] as Row[] };
    const ids = Array.from(new Set(kisses.map((k) => k.user_id)));
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, username, avatar_url, city")
      .in("id", ids);
    return { rows: aggregate(kisses, profiles ?? []) };
  });

export const getCities = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("kisses").select("city");
  const counts = new Map<string, number>();
  (data ?? []).forEach((k) => {
    if (k.city) counts.set(k.city, (counts.get(k.city) ?? 0) + 1);
  });
  return {
    cities: Array.from(counts.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
  };
});

export const getFriendsRanking = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: fr } = await supabase
      .from("friendships")
      .select("friend_id")
      .eq("user_id", userId);
    const ids = [userId, ...(fr ?? []).map((f) => f.friend_id)];
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: kisses } = await supabaseAdmin
      .from("kisses")
      .select("user_id")
      .in("user_id", ids);
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, display_name, username, avatar_url, city")
      .in("id", ids);
    return { rows: aggregate(kisses ?? [], profiles ?? []) };
  });
