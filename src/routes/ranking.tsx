import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getGlobalRanking, getCityRanking, getFriendsRanking } from "@/lib/rankings.functions";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const search = z.object({
  tab: z.enum(["global", "cidade", "amigos"]).optional(),
  city: z.string().optional(),
});

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking — BeijoCheck" }] }),
  validateSearch: search,
  component: RankingPage,
});

function RankingPage() {
  const { tab, city } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [cityInput, setCityInput] = useState(city ?? "");
  const [authed, setAuthed] = useState(false);

  useEffect(() => { supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session)); }, []);

  const currentTab = tab ?? "global";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-8 h-8 text-primary" />
          <h1 className="text-3xl sm:text-4xl font-bold">Ranking</h1>
        </div>

        <Tabs value={currentTab} onValueChange={(v) => navigate({ search: { tab: v as "global" | "cidade" | "amigos", city: cityInput || undefined }, replace: true })}>
          <TabsList className="rounded-full bg-secondary p-1 h-auto">
            <TabsTrigger value="global" className="rounded-full px-5 py-2">Global</TabsTrigger>
            <TabsTrigger value="cidade" className="rounded-full px-5 py-2">Cidade</TabsTrigger>
            <TabsTrigger value="amigos" className="rounded-full px-5 py-2">Amigos</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-6"><GlobalList /></TabsContent>

          <TabsContent value="cidade" className="mt-6">
            <form onSubmit={(e) => { e.preventDefault(); navigate({ search: { tab: "cidade", city: cityInput }, replace: true }); }} className="flex gap-2 mb-4">
              <Input placeholder="Digite a cidade" value={cityInput} onChange={(e) => setCityInput(e.target.value)} className="rounded-full bg-card" />
              <Button type="submit" className="rounded-full bg-gradient-lipstick text-primary-foreground">Buscar</Button>
            </form>
            {city ? <CityList city={city} /> : <p className="text-muted-foreground text-center py-8">Digite uma cidade pra ver o ranking 💋</p>}
          </TabsContent>

          <TabsContent value="amigos" className="mt-6">
            {!authed ? (
              <p className="text-muted-foreground text-center py-8">
                <Link to="/auth" className="text-primary font-semibold">Entre</Link> pra ver o ranking dos seus amigos.
              </p>
            ) : <FriendsList />}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function RankingList({ qk, fn }: { qk: unknown[]; fn: () => Promise<{ rows: Array<{ user_id: string; count: number; display_name: string; username: string; avatar_url: string | null; city: string | null }> }> }) {
  const { data, isLoading } = useQuery({ queryKey: qk, queryFn: fn });
  if (isLoading) return <p className="text-center text-muted-foreground py-8">Carregando…</p>;
  if (!data?.rows.length) return <p className="text-center text-muted-foreground py-8">Sem beijos por aqui ainda 😶</p>;
  return (
    <ol className="rounded-3xl bg-card border border-border/60 overflow-hidden">
      {data.rows.map((r, i) => (
        <li key={r.user_id} className="flex items-center gap-4 p-4 border-b border-border/40 last:border-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i < 3 ? "bg-gradient-lipstick text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{i + 1}</div>
          {r.avatar_url ? <img src={r.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center">💋</div>}
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{r.display_name}</div>
            <div className="text-xs text-muted-foreground truncate">@{r.username}{r.city ? ` · ${r.city}` : ""}</div>
          </div>
          <div className="font-bold text-primary text-xl">{r.count}</div>
        </li>
      ))}
    </ol>
  );
}

function GlobalList() { return <RankingList qk={["ranking", "global"]} fn={() => getGlobalRanking()} />; }
function CityList({ city }: { city: string }) { return <RankingList qk={["ranking", "city", city]} fn={() => getCityRanking({ data: { city } })} />; }
function FriendsList() { return <RankingList qk={["ranking", "friends"]} fn={() => getFriendsRanking()} />; }
