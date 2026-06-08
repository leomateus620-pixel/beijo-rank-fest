import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { getGlobalRanking, getCities } from "@/lib/rankings.functions";
import { Trophy, Sparkles, MapPin, Share2 } from "lucide-react";

const globalQO = queryOptions({ queryKey: ["ranking", "global"], queryFn: () => getGlobalRanking() });
const citiesQO = queryOptions({ queryKey: ["cities"], queryFn: () => getCities() });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BeijoCheck — Quem beija mais da sua cidade?" },
      { name: "description", content: "Registre seus beijos, dispute o ranking da sua cidade ou festa e compartilhe seu BeijoCard." },
      { property: "og:title", content: "BeijoCheck — Quem beija mais?" },
      { property: "og:description", content: "O ranking de beijos da sua cidade, festa e turma de amigos." },
    ],
  }),
  loader: ({ context }) => Promise.all([
    context.queryClient.ensureQueryData(globalQO),
    context.queryClient.ensureQueryData(citiesQO),
  ]),
  component: Landing,
  errorComponent: () => <div className="p-8 text-center">Algo deu errado.</div>,
  notFoundComponent: () => <div className="p-8 text-center">Página não encontrada.</div>,
});

function Landing() {
  const { data: global } = useSuspenseQuery(globalQO);
  const { data: cities } = useSuspenseQuery(citiesQO);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4">
        {/* HERO */}
        <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 text-center relative">
          <div className="text-7xl sm:text-8xl mb-6 animate-kiss inline-block">💋</div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
            Quem <span className="text-gradient-lipstick italic">beija mais</span>?
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
            Registre seus beijos com selfie, dispute o ranking da sua cidade ou festa, e compartilhe seu <strong className="text-foreground">BeijoCard</strong> nas redes.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="rounded-full bg-gradient-lipstick text-primary-foreground hover:opacity-90 text-base h-12 px-8">
              <Link to="/auth">Entrar e começar 💋</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-8 text-base border-primary/30">
              <Link to="/ranking">Ver ranking</Link>
            </Button>
          </div>
        </section>

        {/* FEATURES */}
        <section className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            { icon: Sparkles, title: "Selfie como prova", desc: "Sem foto, não conta. A galera quer ver." },
            { icon: MapPin, title: "Ranking local", desc: "Bata a meta da sua cidade ou da festa do role." },
            { icon: Share2, title: "Compartilhe", desc: "Card pronto pro story. Bora gabar." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-3xl bg-card border border-border/60 p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-gradient-lipstick text-primary-foreground flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </section>

        {/* TOP 10 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2"><Trophy className="text-primary" /> Top 10 global</h2>
            <Link to="/ranking" className="text-sm text-primary font-medium hover:underline">Ver tudo →</Link>
          </div>
          <div className="rounded-3xl bg-card border border-border/60 overflow-hidden">
            {global.rows.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                Ninguém beijou ainda. <Link to="/auth" className="text-primary font-semibold">Seja o primeiro 💋</Link>
              </div>
            ) : (
              <ol>
                {global.rows.slice(0, 10).map((r, i) => (
                  <li key={r.user_id} className="flex items-center gap-4 p-4 border-b border-border/40 last:border-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i < 3 ? "bg-gradient-lipstick text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{i + 1}</div>
                    {r.avatar_url ? (
                      <img src={r.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center text-lg">💋</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{r.display_name}</div>
                      <div className="text-xs text-muted-foreground truncate">@{r.username}{r.city ? ` · ${r.city}` : ""}</div>
                    </div>
                    <div className="font-bold text-primary text-lg">{r.count}</div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        {/* CITIES */}
        {cities.cities.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-6">Cidades em chamas 🔥</h2>
            <div className="flex flex-wrap gap-2">
              {cities.cities.map((c) => (
                <Link key={c.city} to="/ranking" search={{ tab: "cidade", city: c.city }} className="rounded-full bg-card border border-border/60 px-4 py-2 text-sm hover:border-primary/60 transition-colors">
                  <span className="font-semibold">{c.city}</span> <span className="text-muted-foreground">· {c.count}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <footer className="border-t border-border/60 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          Feito com 💋 · BeijoCheck {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
