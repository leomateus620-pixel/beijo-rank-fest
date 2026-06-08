import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, RankingList, SectionHeader } from "@/components/beijocheck/brand";
import { EventLiveCard } from "@/components/beijocheck/social";
import { activeEvent, events, users } from "@/data/beijocheck.mock";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Radio, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/eventos")({
  head: () => ({ meta: [{ title: "Eventos — BeijoCheck" }] }),
  component: EventosPage,
});

export default function EventosPage() {
  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <EventLiveCard event={activeEvent} />
        <article className="card-3d hover-lift p-4 sm:p-5">
          <p className="text-xs font-black uppercase tracking-[.24em] text-red-500">
            Viralização local
          </p>
          <h1 className="mt-2 text-balance text-[clamp(1.6rem,6vw,2.5rem)] font-black leading-tight">
            Eventos movimentam o ranking
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Entre no evento, explore perfis e acompanhe o ranking ao vivo — só com confirmação
            mútua.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Info icon={Users} label="Participantes" value={activeEvent.participants} />
            <Info icon={Trophy} label="Ranking" value={activeEvent.ranking} />
            <Info icon={MapPin} label="Cidade" value={activeEvent.city} />
            <Info icon={Radio} label="Status" value="Ao vivo" />
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <RankingList title="Ranking do evento" items={users.slice(0, 5)} />
        <div>
          <SectionHeader eyebrow="Destaques" title="Destaques da pista" />
          <div className="grid gap-4 sm:grid-cols-2">
            {users.slice(0, 2).map((u, i) => (
              <article key={u.id} className="card-3d hover-lift p-4 sm:p-5">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="h-20 w-20 rounded-3xl object-cover sm:h-24 sm:w-24"
                />
                <h3 className="mt-4 text-xl font-black sm:text-2xl">
                  {i === 0 ? "Destaque da pista" : "Subindo no evento"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {u.name} · {u.kisses} BeijoChecks · {u.badge}
                </p>
                <Button
                  asChild
                  className="tap-press mt-4 rounded-full bg-gradient-lipstick font-black text-white"
                >
                  <Link to="/explorar">Explorar perfil</Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader
          eyebrow="Agenda"
          title="Eventos em alta, próximos e encerrados"
          action="Criar alerta"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventStatusCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function EventStatusCard({ event }: { event: (typeof events)[number] }) {
  return (
    <article className="card-3d hover-lift overflow-hidden p-0">
      <div className={cn("relative min-h-40 bg-gradient-to-br p-5 text-white", event.gradient)}>
        <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">
          {event.status}
        </span>
        <CalendarDays className="h-8 w-8" />
        <h3 className="mt-8 text-3xl font-black">{event.name}</h3>
        <p className="font-semibold text-white/85">
          {event.venue} · {event.city}
        </p>
      </div>
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <Mini label="Data" value={event.date} />
          <Mini label="Participantes" value={event.participants} />
          <Mini label="BeijoChecks" value={event.kisses} />
          <Mini label="Ranking" value={event.livePosition} />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button className="rounded-full bg-gradient-lipstick font-black text-white">
            Entrar no evento
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-red-200 font-black text-red-600"
          >
            <Link to="/ranking">Ver ranking ao vivo</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl bg-red-50 p-4">
      <Icon className="h-5 w-5 text-red-500" />
      <div className="mt-3 text-2xl font-black text-red-600">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-red-50/70 p-3">
      <div className="text-lg font-black text-red-600">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
