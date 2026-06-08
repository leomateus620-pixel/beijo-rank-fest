import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/beijocheck/brand";
import {
  EventLiveCard,
  MutualConfirmationBadge,
  MyRankingPositionCard,
} from "@/components/beijocheck/social";
import { activeEvent, users } from "@/data/beijocheck.mock";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Compass, MapPin, ShieldCheck, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "BeijoCheck — Ranking social com confirmação mútua" }] }),
  component: IndexPage,
});

function IndexPage() {
  return (
    <AppShell>
      <section className="grid min-w-0 gap-4 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
        <article className="card-3d hover-lift relative min-w-0 overflow-hidden p-4 sm:p-7">
          <div className="absolute right-[-4rem] top-[-4rem] h-48 w-48 rounded-full bg-red-200/45 blur-3xl" />
          <div className="relative z-10">
            <div className="mb-3 flex flex-wrap gap-2">
              <MutualConfirmationBadge compact />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600">
                <MapPin className="h-3.5 w-3.5" /> {activeEvent.city} · {activeEvent.name}
              </span>
            </div>
            <p className="text-xs font-black uppercase tracking-[.24em] text-red-500">
              Ranking social por cidade, evento e região
            </p>
            <h1 className="mt-2 max-w-2xl text-balance text-fluid-hero font-black leading-[.95] text-red-950">
              O ranking está rolando agora
            </h1>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-muted-foreground sm:text-base">
              {activeEvent.city} em disputa. Acompanhe sua posição e os destaques próximos.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <Button
                asChild
                className="tap-press h-11 rounded-full bg-gradient-lipstick px-4 font-black text-white shadow-[0_16px_42px_rgba(225,29,72,.22)]"
              >
                <Link to="/explorar">
                  <Compass className="mr-2 h-5 w-5" /> Explorar agora
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="tap-press h-11 rounded-full border-red-200 bg-white px-4 font-black text-red-600 hover:bg-red-50"
              >
                <Link to="/ranking">
                  <Trophy className="mr-2 h-5 w-5" /> Ver ranking
                </Link>
              </Button>
            </div>
          </div>
        </article>

        <div className="grid min-w-0 gap-4">
          <Link to="/ranking" className="tap-press block">
            <MyRankingPositionCard compact />
          </Link>
          <div className="card-3d hover-lift p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black text-red-950">Só conta com confirmação mútua</p>
                <p className="text-sm font-semibold text-muted-foreground">
                  Ranking validado antes de pontuar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[.85fr_1.15fr]">
        <Link to="/eventos" className="tap-press block min-w-0">
          <EventLiveCard event={activeEvent} />
        </Link>
        <article className="card-3d hover-lift min-w-0 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[.22em] text-red-500">
                Destaques próximos
              </p>
              <h2 className="text-[clamp(1.25rem,5.5vw,1.7rem)] font-black leading-tight">
                3 perfis em alta
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="tap-press hidden rounded-full border-red-200 bg-white font-black text-red-600 sm:inline-flex"
            >
              <Link to="/explorar">
                Ver todos <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-3">
            {users.slice(0, 3).map((user) => (
              <Link
                key={user.id}
                to="/explorar"
                search={{ focus: user.id }}
                className="group tap-press grid min-w-0 grid-cols-[4.25rem_1fr] items-center gap-3 rounded-3xl border border-white/60 bg-white/65 p-2.5 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-lg sm:block"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-16 w-16 rounded-2xl object-cover transition group-hover:scale-[1.02] sm:h-24 sm:w-full"
                />
                <div className="min-w-0 sm:mt-3">
                  <div className="truncate font-black">
                    {user.name}, {user.age}
                  </div>
                  <div className="truncate text-xs font-bold text-red-600">
                    {user.localHighlight}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </AppShell>
  );
}
