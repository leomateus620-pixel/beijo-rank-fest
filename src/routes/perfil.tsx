import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { AppShell, EventCard, MatchButton, SectionHeader } from "@/components/beijocheck/brand";
import { events, users, weeklyEvolution } from "@/data/beijocheck.mock";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — BeijoCheck" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const user = users[0];
  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-[.75fr_1.25fr]">
        <div className="overflow-hidden rounded-[2.1rem] border border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(159,18,57,.09)]">
          <div className="h-36 bg-gradient-to-br from-red-600 via-rose-600 to-orange-400" />
          <div className="-mt-16 p-6 text-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="mx-auto h-32 w-32 rounded-[2rem] border-4 border-white object-cover shadow-xl"
            />
            <h1 className="mt-4 text-4xl font-black">
              {user.name}, {user.age}
            </h1>
            <p className="text-muted-foreground">@lara · {user.city}</p>
            <p className="mt-4 text-sm text-muted-foreground">{user.bio}</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { l: "Ranking", v: `#${user.rank}` },
                { l: "Beijos", v: user.kisses },
                { l: "Matches", v: user.matches },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-red-50 p-3">
                  <div className="text-2xl font-black text-red-600">{s.v}</div>
                  <div className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <Button className="flex-1 rounded-full bg-gradient-lipstick font-black text-white">
                <Share2 className="mr-1 h-4 w-4" />
                BeijoCard
              </Button>
              <MatchButton />
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="rounded-[2.1rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(159,18,57,.08)]">
            <SectionHeader eyebrow="Evolução semanal" title="Performance no ranking" />
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyEvolution}>
                <defs>
                  <linearGradient id="perfil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip />
                <Area dataKey="beijos" stroke="#e11d48" strokeWidth={3} fill="url(#perfil)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Info title="Posição na cidade" value="#1 Santa Rosa" desc="+18% em relação a ontem" />
            <Info
              title="Posição regional"
              value="#1 Noroeste"
              desc="Liderança mantida por 4 dias"
            />
          </div>
        </div>
      </section>
      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div>
          <SectionHeader eyebrow="Badges" title="Conquistas" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              user.badge,
              user.status,
              "Campeã da semana",
              "Confirmação mútua",
              "Evento em alta",
              "Top social",
            ].map((b) => (
              <div
                key={b}
                className="rounded-3xl border border-white/70 bg-white/80 p-4 font-black text-red-600 shadow-sm"
              >
                🏅 {b}
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHeader eyebrow="Eventos" title="Frequentados" />
          <div className="grid gap-4 sm:grid-cols-2">
            {events.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
function Info({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <div className="rounded-[1.8rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_50px_rgba(159,18,57,.08)]">
      <p className="text-sm font-bold text-muted-foreground">{title}</p>
      <h3 className="mt-2 text-3xl font-black text-red-600">{value}</h3>
      <p className="mt-1 text-sm text-green-600">{desc}</p>
    </div>
  );
}
