import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppShell, Icons, SectionHeader } from "@/components/beijocheck/brand";
import { cityComparison, events, regions, users } from "@/data/beijocheck.mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking completo — BeijoCheck" }] }),
  component: RankingPage,
});

function RankingPage() {
  const tabs = ["Geral", "Cidades", "Eventos", "Regiões", "Usuários"];
  return (
    <AppShell>
      <section className="rounded-[2.1rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-400 p-6 text-white shadow-[0_28px_90px_rgba(225,29,72,.3)] sm:p-8">
        <div className="flex items-center gap-3">
          <Icons.Trophy className="h-10 w-10" />
          <div>
            <p className="text-sm font-black uppercase tracking-[.24em] text-white/75">
              Ranking completo
            </p>
            <h1 className="text-4xl font-black sm:text-6xl">Pódio, cidades e eventos</h1>
          </div>
        </div>
      </section>
      <Tabs defaultValue="Geral" className="mt-8">
        <TabsList className="flex h-auto w-full justify-start gap-2 overflow-x-auto rounded-[1.5rem] bg-white/70 p-2 backdrop-blur-xl">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="rounded-full px-5 py-3 font-black data-[state=active]:bg-gradient-lipstick data-[state=active]:text-white"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <RankingTab tab={tab} />
          </TabsContent>
        ))}
      </Tabs>
    </AppShell>
  );
}

function RankingTab({ tab }: { tab: string }) {
  const rows =
    tab === "Cidades"
      ? cityComparison.map((c, i) => ({
          name: c.name,
          points: c.pontos,
          meta: "Cidade",
          growth: 20 - i * 2,
          status: i < 2 ? "Em alta" : "Estável",
        }))
      : tab === "Eventos"
        ? events.map((e, i) => ({
            name: e.name,
            points: e.kisses,
            meta: e.city,
            growth: 17 - i,
            status: e.ranking,
          }))
        : tab === "Regiões"
          ? regions.map((r, i) => ({
              name: r,
              points: 720 - i * 90,
              meta: "Região",
              growth: 14 - i,
              status: i === 0 ? "Líder" : "Disputando",
            }))
          : users.map((u) => ({
              name: u.name,
              points: u.points,
              meta: `${u.city} · ${u.event}`,
              growth: u.growth,
              status: u.badge,
              avatar: u.avatar,
            }));
  return (
    <section>
      <SectionHeader eyebrow={tab} title="Top 3 em destaque" />
      <div className="grid gap-4 md:grid-cols-3">
        {rows.slice(0, 3).map((r, i) => (
          <div
            key={r.name}
            className={cn(
              "relative overflow-hidden rounded-[2rem] border border-white/70 p-5 shadow-[0_18px_50px_rgba(159,18,57,.1)]",
              i === 0
                ? "bg-gradient-to-br from-red-600 to-orange-400 text-white md:-translate-y-3"
                : "bg-white/80",
            )}
          >
            <div className="absolute right-4 top-3 text-6xl opacity-20">
              {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
            </div>
            <div
              className={cn(
                "grid h-14 w-14 place-items-center rounded-2xl text-2xl font-black",
                i === 0 ? "bg-white/20" : "bg-red-50 text-red-600",
              )}
            >
              #{i + 1}
            </div>
            <h3 className="mt-5 text-2xl font-black">{r.name}</h3>
            <p className={cn("text-sm", i === 0 ? "text-white/80" : "text-muted-foreground")}>
              {r.meta}
            </p>
            <div className="mt-4 flex items-end justify-between">
              <strong className="text-4xl font-black">{r.points}</strong>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-black",
                  i === 0 ? "bg-white/20" : "bg-green-50 text-green-600",
                )}
              >
                ↑ {Math.abs(r.growth)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <SectionHeader eyebrow="Lista responsiva" title="Classificação completa" />
      <div className="mt-4 overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(159,18,57,.08)]">
        <div className="hidden grid-cols-[80px_1fr_120px_120px_140px] gap-4 border-b border-red-100 px-5 py-4 text-xs font-black uppercase tracking-wide text-muted-foreground md:grid">
          <span>Posição</span>
          <span>Nome</span>
          <span>Pontos</span>
          <span>Crescimento</span>
          <span>Status</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.name}
            className="grid gap-3 border-b border-red-50 p-4 last:border-0 md:grid-cols-[80px_1fr_120px_120px_140px] md:items-center md:gap-4 md:px-5"
          >
            <div className="flex items-center justify-between md:block">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 font-black text-red-600">
                #{i + 1}
              </span>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600 md:hidden">
                {r.status}
              </span>
            </div>
            <div>
              <div className="font-black">{r.name}</div>
              <div className="text-sm text-muted-foreground md:hidden">{r.meta}</div>
            </div>
            <div className="font-black text-red-600">{r.points} pts</div>
            <div className={cn("font-bold", r.growth >= 0 ? "text-green-600" : "text-red-500")}>
              {r.growth >= 0 ? "↑" : "↓"} {Math.abs(r.growth)}%
            </div>
            <div className="hidden rounded-full bg-orange-50 px-3 py-1 text-center text-xs font-black text-orange-600 md:block">
              {r.status}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
