import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/beijocheck/brand";
import {
  EventLiveCard,
  MutualConfirmationBadge,
  MyRankingPositionCard,
} from "@/components/beijocheck/social";
import { activeEvent, users } from "@/data/beijocheck.mock";
import { Button } from "@/components/ui/button";
import { Compass, MapPin, ShieldCheck, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "BeijoCheck — Ranking social com confirmação mútua" }] }),
  component: IndexPage,
});

function IndexPage() {
  return (
    <AppShell>
      <section className="grid min-w-0 gap-4 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
        <div className="relative min-w-0 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/84 p-4 shadow-[0_24px_70px_rgba(159,18,57,.12)] backdrop-blur-xl sm:p-7">
          <div className="absolute right-[-4rem] top-[-4rem] h-48 w-48 rounded-full bg-red-200/55 blur-3xl" />
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
            <h1 className="mt-2 max-w-2xl text-balance text-[clamp(1.95rem,9.2vw,4rem)] font-black leading-[.92] text-red-950">
              Quem está em alta perto de você?
            </h1>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-muted-foreground sm:text-lg">
              Explore perfis, entre no evento e acompanhe sua posição.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <Button
                asChild
                className="h-11 rounded-full bg-gradient-lipstick px-4 font-black text-white shadow-[0_16px_42px_rgba(225,29,72,.22)]"
              >
                <Link to="/explorar">
                  <Compass className="mr-2 h-5 w-5" /> Explorar agora
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-red-200 bg-white px-4 font-black text-red-600 hover:bg-red-50"
              >
                <Link to="/ranking">
                  <Trophy className="mr-2 h-5 w-5" /> Ver ranking
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid min-w-0 gap-4">
          <MyRankingPositionCard compact />
          <div className="rounded-[1.65rem] border border-white/70 bg-white/78 p-4 shadow-[0_18px_50px_rgba(159,18,57,.08)] backdrop-blur-xl">
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
        <EventLiveCard event={activeEvent} />
        <div className="min-w-0 rounded-[1.65rem] border border-white/70 bg-white/80 p-4 shadow-[0_18px_50px_rgba(159,18,57,.08)] backdrop-blur-xl sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.22em] text-red-500">
                Destaques próximos
              </p>
              <h2 className="text-[clamp(1.35rem,6vw,1.8rem)] font-black leading-tight">
                3 perfis em alta
              </h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="hidden rounded-full border-red-200 bg-white font-black text-red-600 sm:inline-flex"
            >
              <Link to="/explorar">Ver todos</Link>
            </Button>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-3">
            {users.slice(0, 3).map((user) => (
              <Link
                key={user.id}
                to="/explorar"
                className="group grid min-w-0 grid-cols-[4.25rem_1fr] items-center gap-3 rounded-3xl bg-red-50/70 p-2.5 transition hover:-translate-y-1 hover:bg-red-100/70 sm:block"
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
                    {user.distance} · {user.localHighlight}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
