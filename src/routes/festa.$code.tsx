import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2, Users } from "lucide-react";
import { getPartyByCode } from "@/lib/parties.functions";
import { joinPartyByCode } from "@/lib/parties.functions";
import { getPartyRanking } from "@/lib/rankings.functions";

export const Route = createFileRoute("/festa/$code")({
  head: ({ params }) => ({ meta: [{ title: `Festa ${params.code} — BeijoCheck` }] }),
  component: FestaPage,
});

function FestaPage() {
  const { code } = Route.useParams();
  const navigate = useNavigate();
  const getPartyFn = useServerFn(getPartyByCode);
  const getRankFn = useServerFn(getPartyRanking);
  const joinFn = useServerFn(joinPartyByCode);
  const [joining, setJoining] = useState(false);

  const { data: party } = useQuery({ queryKey: ["party", code], queryFn: () => getPartyFn({ data: { code } }) });
  const partyId = party?.party?.id;
  const { data: rank } = useQuery({ queryKey: ["ranking", "party", partyId], queryFn: () => getRankFn({ data: { partyId: partyId! } }), enabled: !!partyId });

  async function join() {
    setJoining(true);
    try { await joinFn({ data: { code } }); toast.success("Você entrou!"); navigate({ to: "/registrar" }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Erro"); }
    finally { setJoining(false); }
  }

  function share() {
    const url = window.location.href;
    if (navigator.share) navigator.share({ title: `BeijoCheck — ${party?.party?.name}`, text: `Bora pra ${party?.party?.name} e disputar o ranking 💋 Código: ${code}`, url }).catch(() => {});
    else { navigator.clipboard.writeText(url); toast.success("Link copiado!"); }
  }

  if (party && !party.party) {
    return <div className="min-h-screen"><SiteHeader /><div className="text-center py-20"><p className="text-2xl">Festa não encontrada 😢</p><Link to="/festas" className="text-primary mt-4 inline-block">← Voltar</Link></div></div>;
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="rounded-3xl bg-gradient-lipstick text-primary-foreground p-8 mb-8">
          <div className="text-xs font-mono opacity-80">CÓDIGO {code}</div>
          <h1 className="text-4xl font-bold mt-2">{party?.party?.name ?? "..."}</h1>
          {party?.party?.city && <div className="mt-1 opacity-90">{party.party.city}</div>}
          <div className="mt-6 flex gap-2">
            <Button onClick={join} disabled={joining} variant="secondary" className="rounded-full">
              <Users className="w-4 h-4 mr-1" /> Entrar
            </Button>
            <Button onClick={share} variant="secondary" className="rounded-full">
              <Share2 className="w-4 h-4 mr-1" /> Compartilhar
            </Button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Ranking da festa 🏆</h2>
        {!rank?.rows.length ? (
          <p className="text-muted-foreground py-8 text-center">Ninguém beijou aqui ainda. <Link to="/registrar" className="text-primary font-semibold">Inaugura aí 💋</Link></p>
        ) : (
          <ol className="rounded-3xl bg-card border border-border/60 overflow-hidden">
            {rank.rows.map((r, i) => (
              <li key={r.user_id} className="flex items-center gap-4 p-4 border-b border-border/40 last:border-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i < 3 ? "bg-gradient-lipstick text-primary-foreground" : "bg-secondary"}`}>{i + 1}</div>
                {r.avatar_url ? <img src={r.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center">💋</div>}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{r.display_name}</div>
                  <div className="text-xs text-muted-foreground truncate">@{r.username}</div>
                </div>
                <div className="font-bold text-primary text-xl">{r.count}</div>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}
