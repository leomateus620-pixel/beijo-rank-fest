import { createFileRoute, Link } from "@tanstack/react-router";
import { Radio, ShieldCheck, Trophy, Users } from "lucide-react";
import { AppShell } from "@/components/beijocheck/brand";
import { activeEvent, events, users } from "@/data/beijocheck.mock";

export const Route = createFileRoute("/eventos")({
  head: () => ({ meta: [{ title: "Eventos — BeijoCheck" }] }),
  component: EventosPage,
});

function EventosPage() {
  return (
    <AppShell>
      <section className="text-white">
        <header className="pt-2">
          <p className="text-xs font-black uppercase tracking-[.22em] text-red-300">motor social</p>
          <h1 className="text-fluid-title mt-1">Eventos</h1>
          <p className="mt-2 max-w-sm text-sm font-semibold text-white/62">
            Entre no evento, veja quem está presente e acompanhe o ranking ao vivo.
          </p>
        </header>

        <section className="relative mt-5 overflow-hidden rounded-[2.1rem] bg-zinc-900 p-5 card-shadow-premium">
          <img
            src={activeEvent.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-72"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/58 to-black/8" />
          <div className="relative z-10 min-h-[22rem] content-end">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/24 px-3 py-1.5 text-[11px] font-black uppercase text-white backdrop-blur">
              <Radio className="h-3.5 w-3.5" /> Ao vivo agora
            </span>
            <h2 className="mt-3 max-w-xs text-5xl font-black leading-[.88] tracking-[-.06em]">
              {activeEvent.name}
            </h2>
            <p className="mt-3 text-sm font-bold text-white/72">
              {activeEvent.venue} · {activeEvent.city} · {activeEvent.date}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <EventMetric icon={Users} label="ativos" value={activeEvent.activeUsers} />
              <EventMetric icon={Trophy} label="ranking" value={activeEvent.ranking} />
              <EventMetric icon={ShieldCheck} label="mútuos" value={`${activeEvent.kisses}`} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                to="/explorar"
                className="rounded-full bg-white px-4 py-3 text-center text-sm font-black text-red-600"
              >
                Entrar no evento
              </Link>
              <Link
                to="/ranking"
                className="rounded-full border border-white/18 bg-white/10 px-4 py-3 text-center text-sm font-black backdrop-blur"
              >
                Ver ranking ao vivo
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[1.8rem] border border-white/10 bg-white/8 p-4 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.2em] text-red-300">
                Ranking do evento
              </p>
              <h2 className="text-2xl font-black tracking-[-.04em]">Top da pista</h2>
            </div>
            <Link to="/ranking" className="text-sm font-black text-white/62">
              Ver tudo ›
            </Link>
          </div>
          <ol className="mt-4 grid gap-2">
            {users.slice(0, 3).map((user, index) => (
              <li key={user.id} className="flex items-center gap-3 rounded-3xl bg-black/22 p-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl beijo-gradient text-sm font-black">
                  #{index + 1}
                </span>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-11 w-11 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">
                    {user.name}, {user.age}
                  </p>
                  <p className="truncate text-xs font-bold text-white/48">
                    {user.kisses} BeijoChecks · {user.localHighlight}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-6 grid gap-4 pb-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.2em] text-red-300">
                agenda
              </p>
              <h2 className="text-3xl font-black tracking-[-.05em]">Próximas entradas sociais</h2>
            </div>
          </div>
          {events.map((event) => (
            <EventDiscoveryCard key={event.id} event={event} />
          ))}
        </section>
      </section>
    </AppShell>
  );
}

function EventMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[1.2rem] bg-black/32 p-3 backdrop-blur">
      <Icon className="h-4 w-4 text-red-200" />
      <div className="mt-2 truncate text-lg font-black">{value}</div>
      <div className="truncate text-[10px] font-black uppercase text-white/46">{label}</div>
    </div>
  );
}

function EventDiscoveryCard({ event }: { event: (typeof events)[number] }) {
  return (
    <article className="relative overflow-hidden rounded-[1.75rem] bg-zinc-900 p-4 card-shadow-premium">
      <img
        src={event.image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-58"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-black/18" />
      <div className="relative z-10 grid min-h-[11rem] content-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="rounded-full bg-white/12 px-3 py-1 text-[11px] font-black uppercase backdrop-blur">
              {event.status}
            </span>
            <h3 className="mt-3 text-3xl font-black tracking-[-.05em]">{event.name}</h3>
            <p className="mt-1 text-sm font-bold text-white/62">
              {event.city} · {event.participants} participantes
            </p>
          </div>
          <span className="shrink-0 rounded-2xl bg-white px-3 py-2 text-xs font-black text-red-600">
            {event.date}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to="/explorar"
            className="rounded-full bg-white px-4 py-2.5 text-center text-xs font-black text-red-600"
          >
            Entrar
          </Link>
          <Link
            to="/ranking"
            className="rounded-full border border-white/14 bg-white/10 px-4 py-2.5 text-center text-xs font-black"
          >
            Ranking ao vivo
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventosPage;
