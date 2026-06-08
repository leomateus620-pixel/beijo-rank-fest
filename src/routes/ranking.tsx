import { createFileRoute } from "@tanstack/react-router";
import { AppShell, CitySelector, Icons, SectionHeader } from "@/components/beijocheck/brand";
import {
  MyRankingPositionCard,
  RankingPodium,
  ShareRankingCard,
} from "@/components/beijocheck/social";
import { cityComparison, events, regions, users } from "@/data/beijocheck.mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ShareProfileRankingActions } from "@/components/beijocheck/share";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking — BeijoCheck" }] }),
  component: RankingPage,
});

function RankingPage() {
  const tabs = ["Geral", "Cidade", "Evento", "Região"];
  return (
    <AppShell>
      <section className="min-w-0 rounded-[2.1rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-400 p-6 text-white shadow-[0_28px_90px_rgba(225,29,72,.3)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Icons.Trophy className="h-10 w-10" />
            <div>
              <p className="text-sm font-black uppercase tracking-[.24em] text-white/75">
                Ranking validado
              </p>
              <h1 className="text-balance break-words text-[clamp(2.15rem,9vw,3.75rem)] font-black leading-tight">
                Competição pronta para compartilhar
              </h1>
              <p className="mt-2 max-w-2xl text-white/80">
                Top 3 com destaque, variação de posição, badges e filtros por cidade, evento e
                região.
              </p>
            </div>
          </div>
          <ShareProfileRankingActions user={users[0]} compact className="bg-white/20 text-white" />
        </div>
      </section>

      <section className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <MyRankingPositionCard />
        <ShareRankingCard />
      </section>

      <Tabs defaultValue="Geral" className="mt-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="scrollbar-hide flex h-auto max-w-full justify-start gap-2 overflow-x-auto rounded-[1.5rem] bg-white/70 p-2 backdrop-blur-xl">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="shrink-0 rounded-full px-5 py-3 font-black data-[state=active]:bg-gradient-lipstick data-[state=active]:text-white"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <CitySelector />
        </div>
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
    tab === "Cidade"
      ? cityComparison.map((c, i) => ({
          name: c.name,
          points: c.pontos,
          meta: "Cidade",
          growth: 20 - i * 2,
          status: i < 2 ? "Em alta hoje" : "Estável",
          badge: i === 0 ? "Cidade líder" : "Disputando",
        }))
      : tab === "Evento"
        ? events.map((e, i) => ({
            name: e.name,
            points: e.kisses,
            meta: `${e.city} · ${e.participants} participantes`,
            growth: 17 - i,
            status: e.status === "ativo" ? "Ranking ao vivo" : e.livePosition,
            badge: e.ranking,
          }))
        : tab === "Região"
          ? regions.map((r, i) => ({
              name: r,
              points: 720 - i * 90,
              meta: "Região",
              growth: 14 - i,
              status: i === 0 ? "Líder regional" : "Disputando",
              badge: i === 0 ? "Novo destaque" : "Top regional",
            }))
          : users.map((u) => ({
              name: u.name,
              points: u.points,
              meta: `${u.city} · ${u.event}`,
              growth: u.growth,
              status: u.localHighlight,
              badge: u.badge,
              avatar: u.avatar,
            }));
  return (
    <section>
      <SectionHeader eyebrow={tab} title="Top 3 com presença visual" />
      {tab === "Geral" ? (
        <RankingPodium users={users} />
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {rows.slice(0, 3).map((r, i) => (
            <PodiumGeneric key={r.name} item={r} index={i} />
          ))}
        </div>
      )}
      <SectionHeader eyebrow="Lista competitiva" title="Classificação completa" />
      <div className="mt-4 max-w-full overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(159,18,57,.08)]">
        <div className="hidden grid-cols-[80px_1fr_120px_160px_160px] gap-4 border-b border-red-100 px-5 py-4 text-xs font-black uppercase tracking-wide text-muted-foreground md:grid">
          <span>Posição</span>
          <span>Nome</span>
          <span>Pontos</span>
          <span>Variação</span>
          <span>Badge</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.name}
            className={cn(
              "grid gap-3 border-b border-red-50 p-4 last:border-0 md:grid-cols-[80px_1fr_120px_160px_160px] md:items-center md:gap-4 md:px-5",
              i === 17 && "bg-orange-50/60",
            )}
          >
            <div className="flex items-center justify-between md:block">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 font-black text-red-600">
                #{i + 1}
              </span>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600 md:hidden">
                {r.badge}
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              {"avatar" in r && r.avatar && (
                <img src={r.avatar} alt={r.name} className="h-11 w-11 rounded-2xl object-cover" />
              )}
              <div className="min-w-0">
                <div className="truncate font-black">{r.name}</div>
                <div className="truncate text-sm text-muted-foreground">{r.meta}</div>
              </div>
            </div>
            <div className="font-black text-red-600">{r.points} pts</div>
            <div className={cn("font-bold", r.growth >= 0 ? "text-green-600" : "text-red-500")}>
              {r.growth >= 0 ? "subiu" : "caiu"} {Math.abs(r.growth)} posições
            </div>
            <div className="hidden rounded-full bg-orange-50 px-3 py-1 text-center text-xs font-black text-orange-600 md:block">
              {r.status} · {r.badge}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PodiumGeneric({
  item,
  index,
}: {
  item: { name: string; meta: string; points: number; growth: number; badge: string };
  index: number;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/70 p-5 shadow-[0_18px_50px_rgba(159,18,57,.1)]",
        index === 0
          ? "bg-gradient-to-br from-red-600 to-orange-400 text-white md:-translate-y-3"
          : "bg-white/80",
      )}
    >
      <div className="absolute right-4 top-3 text-6xl opacity-20">
        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
      </div>
      <div
        className={cn(
          "grid h-14 w-14 place-items-center rounded-2xl text-2xl font-black",
          index === 0 ? "bg-white/20" : "bg-red-50 text-red-600",
        )}
      >
        #{index + 1}
      </div>
      <h3 className="mt-5 text-2xl font-black">{item.name}</h3>
      <p className={cn("text-sm", index === 0 ? "text-white/80" : "text-muted-foreground")}>
        {item.meta}
      </p>
      <div className="mt-4 flex items-end justify-between">
        <strong className="text-4xl font-black">{item.points}</strong>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-black",
            index === 0 ? "bg-white/20" : "bg-green-50 text-green-600",
          )}
        >
          subiu {Math.abs(item.growth)}
        </span>
      </div>
      <div className="mt-4 rounded-2xl bg-white/15 p-3 text-sm font-black">{item.badge}</div>
    </div>
  );
}
