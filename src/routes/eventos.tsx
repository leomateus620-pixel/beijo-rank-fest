import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, EventCard, RankingList, SectionHeader } from "@/components/beijocheck/brand";
import { Button } from "@/components/ui/button";
import { events, users } from "@/data/beijocheck.mock";

export const Route = createFileRoute("/eventos")({
  head: () => ({ meta: [{ title: "Eventos — BeijoCheck" }] }),
  component: EventosPage,
});

export default function EventosPage() {
  const event = events[0];
  return (
    <AppShell>
      <section
        className={`relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br ${event.gradient} p-6 text-white shadow-[0_28px_90px_rgba(225,29,72,.34)] sm:p-8`}
      >
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="relative max-w-3xl">
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-black backdrop-blur">
            Evento em destaque · {event.ranking}
          </span>
          <h1 className="mt-6 text-5xl font-black sm:text-7xl">{event.name}</h1>
          <p className="mt-3 text-lg text-white/85">
            {event.city} · {event.date} · {event.vibe}
          </p>
          <div className="mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { l: "Beijos registrados", v: event.kisses },
              { l: "Usuários ativos", v: event.activeUsers },
              { l: "Ranking interno", v: "#1" },
              { l: "Cidade", v: event.city },
            ].map((s) => (
              <div key={s.l} className="rounded-3xl bg-white/18 p-4 backdrop-blur">
                <div className="text-2xl font-black">{s.v}</div>
                <div className="text-xs font-bold uppercase tracking-wide text-white/75">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button className="h-12 rounded-full bg-white px-6 font-black text-red-600 hover:bg-white/90">
              Participar do evento
            </Button>
            <Button
              asChild
              className="h-12 rounded-full border border-white/40 bg-white/15 px-6 font-black text-white backdrop-blur hover:bg-white/25"
            >
              <Link to="/registrar">Registrar beijo</Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="mt-8 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <RankingList title="Ranking interno" items={users.slice(0, 5)} />
        <div>
          <SectionHeader eyebrow="Destaques" title="Cards do evento" />
          <div className="grid gap-4 sm:grid-cols-2">
            {users.slice(0, 2).map((u, i) => (
              <div
                key={u.id}
                className="rounded-[1.8rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(159,18,57,.08)]"
              >
                <img src={u.avatar} alt={u.name} className="h-20 w-20 rounded-3xl object-cover" />
                <h3 className="mt-4 text-2xl font-black">
                  {i === 0 ? "Rainha da pista" : "Rising do evento"}
                </h3>
                <p className="text-muted-foreground">
                  {u.name} · {u.kisses} confirmações · {u.badge}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-10">
        <SectionHeader eyebrow="Agenda" title="Eventos em alta" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
