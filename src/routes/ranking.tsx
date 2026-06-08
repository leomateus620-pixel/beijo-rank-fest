import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/beijocheck/brand";
import { RankingPodium, ShareRankingCard } from "@/components/beijocheck/social";
import { cityComparison, events, regions, users } from "@/data/beijocheck.mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ShareProfileRankingActions } from "@/components/beijocheck/share";
import { BadgeCheck, Flame, ShieldCheck, Trophy } from "lucide-react";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking — BeijoCheck" }] }),
  component: RankingPage,
});

const tabs = ["Geral", "Cidade", "Evento", "Região"];

function RankingPage() {
  return (
    <AppShell>
      <section className="grid min-w-0 gap-3 lg:grid-cols-[.95fr_1.05fr] lg:items-start">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/78 px-3 py-1.5 text-[11px] font-black uppercase tracking-[.18em] text-red-600 shadow-sm backdrop-blur">
            <BadgeCheck className="h-4 w-4" /> BeijoCheck validado
          </p>
          <h1 className="mt-2 text-balance text-[clamp(1.85rem,8vw,3.2rem)] font-black leading-[.95] text-red-950">
            Ranking BeijoCheck
          </h1>
          <p className="mt-1 max-w-xl text-sm font-semibold text-muted-foreground sm:text-base">
            Cidade, evento e região em tempo real.
          </p>
        </div>

        <article className="relative overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/84 p-4 shadow-[0_24px_70px_rgba(159,18,57,.12)] backdrop-blur-xl">
          <div className="absolute right-[-3rem] top-[-3rem] h-36 w-36 rounded-full bg-red-200/70 blur-3xl" />
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[.22em] text-red-500">
                Minha posição
              </p>
              <div className="mt-2 flex flex-wrap items-end gap-3">
                <span className="text-5xl font-black leading-none text-red-600">#18</span>
                <span className="mb-2 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-600">
                  +2 hoje
                </span>
              </div>
              <p className="mt-1 font-bold text-muted-foreground">Santa Rosa · Festa Neon</p>
              <p className="text-sm font-black text-red-600">128 BeijoChecks</p>
            </div>
            <Trophy className="h-10 w-10 shrink-0 text-orange-500" />
          </div>
          <div className="relative z-10 mt-3 max-w-xs">
            <ShareProfileRankingActions
              user={users[0]}
              position={18}
              compact
              triggerLabel="Compartilhar ranking"
            />
          </div>
        </article>
      </section>

      <Tabs defaultValue="Geral" className="mt-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="scrollbar-hide flex h-auto max-w-full justify-start gap-2 overflow-x-auto rounded-[1.35rem] border border-white/70 bg-white/72 p-1.5 shadow-sm backdrop-blur-xl">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="shrink-0 rounded-full px-4 py-2.5 text-sm font-black text-red-950/70 transition data-[state=active]:bg-gradient-lipstick data-[state=active]:text-white data-[state=active]:shadow-[0_10px_28px_rgba(225,29,72,.22)]"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-5">
            <RankingTab tab={tab} />
          </TabsContent>
        ))}
      </Tabs>
    </AppShell>
  );
}

function getRows(tab: string) {
  return tab === "Cidade"
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
            kisses: u.kisses,
          }));
}

function RankingTab({ tab }: { tab: string }) {
  const rows = getRows(tab);
  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[.22em] text-red-500">
            Top 3 · {tab}
          </p>
          <h2 className="text-[clamp(1.3rem,5.5vw,1.8rem)] font-black leading-tight">
            Pódio em alta
          </h2>
        </div>
        <span className="hidden items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600 sm:inline-flex">
          <Flame className="h-4 w-4" /> Em alta na região
        </span>
      </div>

      {tab === "Geral" ? (
        <RankingPodium users={users} />
      ) : (
        <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
          {rows.slice(0, 3).map((row, index) => (
            <PodiumGeneric key={row.name} item={row} index={index} />
          ))}
        </div>
      )}

      <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-[1fr_21rem]">
        <div className="max-w-full overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/82 shadow-[0_18px_50px_rgba(159,18,57,.08)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 border-b border-red-100 px-4 py-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.2em] text-red-500">
                Classificação completa
              </p>
              <h3 className="font-black">Ranking compacto</h3>
            </div>
            <ShieldCheck className="h-5 w-5 text-red-500" />
          </div>
          {rows.map((row, index) => (
            <RankingRow key={row.name} row={row} index={index} />
          ))}
        </div>
        <ShareRankingCard />
      </div>
    </section>
  );
}

function RankingRow({ row, index }: { row: ReturnType<typeof getRows>[number]; index: number }) {
  const isMe = index === 17;
  return (
    <div
      className={cn(
        "grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-b border-red-50 px-4 py-3 last:border-0",
        isMe && "bg-orange-50/65",
      )}
    >
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-sm font-black text-red-600">
        #{index + 1}
      </span>
      <div className="flex min-w-0 items-center gap-3">
        {"avatar" in row && row.avatar && (
          <img src={row.avatar} alt={row.name} className="h-10 w-10 rounded-2xl object-cover" />
        )}
        <div className="min-w-0">
          <div className="truncate font-black">{row.name}</div>
          <div className="truncate text-xs font-semibold text-muted-foreground">{row.meta}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-black text-red-600">{row.points}</div>
        <div
          className={cn(
            "text-[11px] font-black",
            row.growth >= 0 ? "text-green-600" : "text-red-500",
          )}
        >
          {row.growth >= 0 ? "+" : ""}
          {row.growth}
        </div>
      </div>
    </div>
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
    <article
      className={cn(
        "relative min-w-0 overflow-hidden rounded-[1.35rem] border border-white/70 p-2.5 text-center shadow-[0_16px_44px_rgba(159,18,57,.1)] sm:rounded-[1.75rem] sm:p-4",
        index === 0
          ? "order-2 bg-gradient-to-br from-red-600 to-orange-400 text-white sm:-translate-y-3"
          : index === 1
            ? "order-1 bg-white/84"
            : "order-3 bg-white/84",
      )}
    >
      <div className="absolute right-2 top-2 text-3xl opacity-20 sm:text-5xl">
        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
      </div>
      <div
        className={cn(
          "mx-auto grid rounded-[1.1rem] place-items-center font-black",
          index === 0
            ? "h-16 w-16 bg-white/20 text-2xl sm:h-20 sm:w-20"
            : "h-12 w-12 bg-red-50 text-lg text-red-600 sm:h-16 sm:w-16 sm:text-2xl",
        )}
      >
        #{index + 1}
      </div>
      <h3 className="mt-2 truncate text-sm font-black sm:text-lg">{item.name}</h3>
      <p
        className={cn(
          "truncate text-[10px] font-bold sm:text-xs",
          index === 0 ? "text-white/78" : "text-muted-foreground",
        )}
      >
        {item.meta}
      </p>
      <div className="mt-2 rounded-full bg-white/18 px-2 py-1 text-[10px] font-black sm:text-xs">
        {item.points} BeijoChecks
      </div>
    </article>
  );
}
