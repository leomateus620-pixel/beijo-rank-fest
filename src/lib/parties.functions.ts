import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export const createParty = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { name: string; city?: string }) =>
    z.object({ name: z.string().trim().min(1).max(80), city: z.string().trim().max(80).optional() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    for (let i = 0; i < 5; i++) {
      const code = genCode();
      const { data: row, error } = await supabase
        .from("parties")
        .insert({ name: data.name, city: data.city ?? null, code, created_by: userId })
        .select("id, code")
        .single();
      if (!error && row) {
        await supabase.from("party_members").insert({ party_id: row.id, user_id: userId });
        return row;
      }
    }
    throw new Error("Não consegui gerar código único, tenta de novo.");
  });

export const joinPartyByCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { code: string }) => z.object({ code: z.string().trim().toUpperCase().min(4).max(10) }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: party } = await supabase.from("parties").select("id, name, code").eq("code", data.code).maybeSingle();
    if (!party) throw new Error("Festa não encontrada");
    await supabase.from("party_members").insert({ party_id: party.id, user_id: userId }).select();
    return party;
  });

export const myParties = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: members } = await supabase.from("party_members").select("party_id").eq("user_id", userId);
    const ids = (members ?? []).map((m) => m.party_id);
    if (!ids.length) return { parties: [] };
    const { data: parties } = await supabase.from("parties").select("id, name, code, city, created_at").in("id", ids).order("created_at", { ascending: false });
    return { parties: parties ?? [] };
  });

export const getPartyByCode = createServerFn({ method: "GET" })
  .inputValidator((d: { code: string }) => z.object({ code: z.string().trim().toUpperCase().min(4).max(10) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: party } = await supabaseAdmin.from("parties").select("id, name, code, city, created_at").eq("code", data.code).maybeSingle();
    return { party };
  });
