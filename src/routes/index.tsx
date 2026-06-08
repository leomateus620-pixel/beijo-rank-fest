import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AppShell,
  EventCard,
  MetricCard,
  RankingList,
  SectionHeader,
  UserCard,
} from "@/components/beijocheck/brand";
import {
  EventLiveCard,
  MutualConfirmationBadge,
  MyRankingPositionCard,
  SafetyTrustBar,
} from "@/components/beijocheck/social";
import { activeEvent, metrics, myRankingPosition, users, events } from "@/data/beijocheck.mock";
import { Button } from "@/components/ui/button";
import { Compass, HeartHandshake, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "BeijoCheck — Ranking social com confirmação mútua" }] }),
  component: IndexPage,
});

function IndexPage() {
  return (
    <AppShell>
      <section className="grid min-w-0 gap-5 xl:grid-cols-[1.15fr_.85fr] xl:items-stretch">
        <div className="relative min-w-0 overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-400 p-5 text-white shadow-[0_32px_100px_rgba(225,29,72,.35)] sm:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute bottom-0 right-8 hidden text-[10rem] opacity-10 sm:block">
            💋
          </div>
          <div className="relative z-10 max-w-2xl min-w-0">
            <div className="mb-5 flex flex-wrap gap-2">
              <MutualConfirmationBadge />
              <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-black backdrop-blur">
                {activeEvent.city} ao vivo
              </span>
            </div>
            <h1 className="text-fluid-hero text-balance break-words font-black leading-[.95] sm:leading-[.9]">
              Abra, explore e suba no ranking da noite
            </h1>
            <p className="mt-5 max-w-xl text-base font-semibold text-white/85 sm:text-lg">
              Descubra pessoas e eventos próximos, envie BeijoChecks com validação mútua e acompanhe
              sua posição por cidade, evento e região.
            </p>
            <div className="mt-7 grid min-w-0 gap-3 sm:flex sm:flex-wrap">
              <Button
                asChild
                className="h-13 rounded-full bg-white px-6 font-black text-red-600 hover:bg-white/90"
              >
                <Link to="/explorar">
                  <Compass className="mr-2 h-5 w-5" /> Explorar agora
                </Link>
              </Button>
              <Button
                asChild
                className="h-13 rounded-full border border-white/40 bg-white/15 px-6 font-black text-white backdrop-blur hover:bg-white/25"
              >
                <Link to="/registrar">
                  <HeartHandshake className="mr-2 h-5 w-5" /> Registrar BeijoCheck
                </Link>
              </Button>
              <Button
                asChild
                className="h-13 rounded-full border border-white/40 bg-white/15 px-6 font-black text-white backdrop-blur hover:bg-white/25"
              >
                <Link to="/ranking">
                  <Trophy className="mr-2 h-5 w-5" /> Ver ranking
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <EventLiveCard event={activeEvent} />
      </section>

      <section className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <MyRankingPositionCard />
        <div className="min-w-0 rounded-[1.8rem] border border-white/70 bg-white/80 p-4 sm:p-5 shadow-[0_18px_50px_rgba(159,18,57,.08)]">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[.24em] text-red-500">
                Perto de você
              </p>
              <h2 className="text-balance text-[clamp(1.55rem,7vw,1.875rem)] font-black">
                Destaques para explorar
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="hidden rounded-full border-red-200 font-black text-red-600 sm:inline-flex"
            >
              <Link to="/explorar">Ver todos</Link>
            </Button>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-3">
            {users.slice(0, 3).map((user) => (
              <Link
                key={user.id}
                to="/explorar"
                className="group min-w-0 rounded-3xl bg-red-50 p-3 transition hover:-translate-y-1 hover:bg-red-100/70"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-28 w-full rounded-2xl object-cover transition group-hover:scale-[1.02]"
                />
                <div className="mt-3 font-black">
                  {user.name}, {user.age}
                </div>
                <div className="text-xs font-bold text-red-600">
                  {user.distance} · {user.localHighlight}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid min-w-0 gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="mt-8 grid min-w-0 gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <div>
          <SectionHeader
            eyebrow="Evento ativo"
            title="Ranking ao vivo para entrar agora"
            action="Ver eventos"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {events.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
        <div>
          <SectionHeader eyebrow="Competição" title="Quem está em alta" action="Compartilhar" />
          <RankingList title="Top local validado" items={users.slice(0, 5)} />
        </div>
      </section>

      <section className="mt-8 grid min-w-0 gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <SafetyTrustBar />
        <div className="min-w-0 rounded-[1.8rem] border border-white/70 bg-white/80 p-4 sm:p-5 shadow-[0_18px_50px_rgba(159,18,57,.08)]">
          <p className="text-xs font-black uppercase tracking-[.24em] text-red-500">
            Como funciona
          </p>
          <h2 className="mt-1 text-3xl font-black">BeijoCheck confirmado gera pontos</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["1", "Explore perfis com várias fotos"],
              ["2", "Envie interesse ou BeijoCheck"],
              ["3", "Só pontua com confirmação mútua"],
            ].map(([n, text]) => (
              <div key={n} className="rounded-3xl bg-red-50 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-lipstick font-black text-white">
                  {n}
                </div>
                <p className="mt-3 font-black text-red-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader
          eyebrow="Perfis em destaque"
          title="Abra durante o evento e veja quem está em alta"
          action="Explorar"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.slice(0, 3).map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </section>

      <div className="mt-8 rounded-[1.8rem] border border-white/70 bg-white/80 p-5 text-center shadow-[0_18px_50px_rgba(159,18,57,.08)]">
        <Sparkles className="mx-auto h-8 w-8 text-red-500" />
        <p className="mt-2 font-black">
          Você controla sua visibilidade. Sem conteúdo explícito. Denúncia e bloqueio sempre
          disponíveis.
        </p>
        <p className="text-sm text-muted-foreground">
          {myRankingPosition.nextTarget} para virar destaque do evento.
        </p>
      </div>
    </AppShell>
  );
}
