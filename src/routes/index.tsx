import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  AppShell,
  CitySelector,
  EventCard,
  Icons,
  MetricCard,
  PeriodFilter,
  RankingList,
  SectionHeader,
  UserCard,
} from "@/components/beijocheck/brand";
import { cityComparison, events, metrics, users, weeklyEvolution } from "@/data/beijocheck.mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — BeijoCheck" },
      {
        name: "description",
        content: "Central social gamificada de rankings, eventos e beijos confirmados.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-400 p-6 text-white shadow-[0_28px_90px_rgba(225,29,72,.35)] sm:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-4 right-6 hidden text-8xl opacity-20 sm:block">💋✓</div>
          <div className="relative max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/18 px-4 py-2 text-sm font-black backdrop-blur">
              <Icons.Flame className="h-4 w-4" /> Ao vivo em 42 eventos
            </div>
            <h1 className="text-4xl font-black leading-[.95] sm:text-6xl">
              O ranking dos beijos da sua cidade
            </h1>
            <p className="mt-5 max-w-xl text-base font-medium text-white/85 sm:text-lg">
              Registre, confirme e suba no ranking do BeijoCheck com uma experiência social leve,
              competitiva e pronta para viralizar.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full bg-white px-6 font-black text-red-600 hover:bg-white/90"
              >
                <Link to="/ranking">Ver ranking</Link>
              </Button>
              <Button
                asChild
                className="h-12 rounded-full border border-white/40 bg-white/15 px-6 font-black text-white backdrop-blur hover:bg-white/25"
              >
                <Link to="/explorar">Explorar usuários</Link>
              </Button>
              <Button
                asChild
                className="h-12 rounded-full border border-white/40 bg-white/15 px-6 font-black text-white backdrop-blur hover:bg-white/25"
              >
                <Link to="/registrar">Registrar beijo</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_rgba(159,18,57,.08)] backdrop-blur-xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[.24em] text-red-500">
            Filtros rápidos
          </p>
          <div className="space-y-4">
            <PeriodFilter />
            <CitySelector />
          </div>
          <div className="mt-5 rounded-3xl bg-gradient-to-br from-red-50 to-orange-50 p-4">
            <div className="flex items-center gap-3">
              <img
                src={users[0].avatar}
                alt="Lara"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <div className="font-black">Lara lidera hoje</div>
                <div className="text-sm text-muted-foreground">86 pontos · Santa Rosa</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <ChartCard
          title="Evolução de beijos por dia"
          subtitle="Confirmações aquecem no fim de semana"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyEvolution}>
              <defs>
                <linearGradient id="beijos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#fecdd3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="beijos"
                stroke="#e11d48"
                strokeWidth={3}
                fill="url(#beijos)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Comparação entre cidades" subtitle="Disputa regional em tempo real">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cityComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="pontos" radius={[14, 14, 0, 0]} fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-4">
        <RankingList title="Ranking geral" />
        <RankingList
          title="Por cidade"
          items={[...users].sort((a, b) => a.city.localeCompare(b.city)).slice(0, 5)}
        />
        <RankingList
          title="Por evento"
          items={[...users].sort((a, b) => b.kisses - a.kisses).slice(0, 5)}
        />
        <RankingList
          title="Por região"
          items={[...users].sort((a, b) => a.region.localeCompare(b.region)).slice(0, 5)}
        />
      </section>

      <section className="mt-10">
        <SectionHeader
          eyebrow="Eventos em alta"
          title="Onde o ranking está pegando fogo"
          action="Ver todos"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {events.slice(0, 4).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader eyebrow="Top usuários" title="Perfis em destaque" action="Explorar" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.slice(0, 3).map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.8rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_rgba(159,18,57,.08)] backdrop-blur-xl">
      <div className="mb-4">
        <h3 className="font-display text-2xl font-black">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
