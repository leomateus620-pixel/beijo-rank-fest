import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Filter,
  Flame,
  HeartHandshake,
  LogOut,
  MapPin,
  Search,
  SlidersHorizontal,
  Trophy,
  UserRound,
  Users,
  CalendarDays,
  Home,
  Compass,
  Medal,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { BeijoUser } from "@/data/beijocheck.mock";
import { events, users } from "@/data/beijocheck.mock";


export function BeijoLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2 font-display font-black tracking-tight">
      <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-orange-400 text-xl text-white shadow-[0_14px_30px_rgba(225,29,72,.32)] transition-transform group-hover:-rotate-6 group-hover:scale-105">
        💋
        <span className="absolute -right-1 -bottom-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] text-red-600 shadow-lg">
          ✓
        </span>
      </span>
      {!compact && (
        <span className="text-2xl text-gradient-lipstick drop-shadow-sm">BeijoCheck</span>
      )}
    </Link>
  );
}

const navItems = [
  { label: "Home", to: "/", icon: Home },
  { label: "Explorar", to: "/explorar", icon: Compass },
  { label: "Ranking", to: "/ranking", icon: Medal },
  { label: "Eventos", to: "/eventos", icon: CalendarDays },
  { label: "Perfil", to: "/perfil", icon: User },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen max-w-full overflow-x-hidden pb-safe-nav lg:pb-0">
      <div className="fixed inset-0 -z-10 max-w-full overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-400/25 blur-3xl" />
        <div className="absolute right-[-5rem] top-48 h-80 w-80 rounded-full bg-orange-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-rose-300/25 blur-3xl" />
      </div>
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-2 px-3 py-3 sm:px-4">
          <BeijoLogo />
          <nav className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/65 p-1 shadow-sm lg:flex">
            {navItems.map(({ label, to, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition hover:bg-red-50 hover:text-red-600"
                activeProps={{
                  className: "bg-gradient-lipstick text-white shadow-lg shadow-red-500/20",
                }}
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/70 text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <Bell className="h-4 w-4" />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/70 text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <Filter className="h-4 w-4" />
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-white/80 bg-white/70 py-1 pl-1 pr-3 shadow-sm sm:flex">
              <img src={users[0].avatar} alt="Lara" className="h-9 w-9 rounded-full object-cover" />
              <div className="text-xs">
                <div className="font-black">Lara</div>
                <div className="text-muted-foreground">#1 Santa Rosa</div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="relative z-10 mx-auto w-full max-w-7xl min-w-0 overflow-x-hidden px-3 py-4 sm:px-4 sm:py-7">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}

export function BottomNavigation() {
  return (
    <nav
      aria-label="Navegação principal"
      className="bottom-safe-nav fixed inset-x-2 z-50 mx-auto max-w-[min(33rem,calc(100vw-1rem))] overflow-hidden rounded-[1.65rem] border border-white/60 bg-white/58 p-1.5 shadow-[0_18px_60px_rgba(159,18,57,.2),inset_0_1px_0_rgba(255,255,255,.82)] backdrop-blur-[30px] supports-[backdrop-filter]:bg-white/46 lg:hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.68),rgba(255,255,255,.14)_45%,rgba(251,146,60,.12))]" />
      <div className="scrollbar-hide relative flex min-w-0 snap-x snap-mandatory gap-1 overflow-x-auto overscroll-x-contain scroll-smooth px-0.5">
        {navItems.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex min-w-[4rem] shrink-0 snap-center flex-col items-center justify-center gap-1 rounded-[1.2rem] px-2 py-2 text-[10px] font-black text-red-950/58 transition-all duration-300 hover:bg-white/50 hover:text-red-600 active:scale-95"
            activeProps={{
              className:
                "bg-gradient-to-br from-red-600 via-rose-600 to-orange-400 text-white shadow-[0_10px_28px_rgba(225,29,72,.28),inset_0_1px_0_rgba(255,255,255,.34)]",
            }}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="max-w-full truncate leading-none">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function PeriodFilter() {
  return (
    <div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto pb-1">
      {["Hoje", "Semana", "Mês"].map((p, i) => (
        <button
          key={p}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-black transition",
            i === 1
              ? "bg-gradient-lipstick text-white shadow-lg shadow-red-500/20"
              : "bg-white/75 text-muted-foreground hover:bg-red-50",
          )}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

export function CitySelector() {
  return (
    <div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto pb-1">
      {["Geral", "Cidade", "Evento", "Região"].map((p, i) => (
        <button
          key={p}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-black transition",
            i === 0
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-white/70 bg-white/65 text-muted-foreground hover:text-red-600",
          )}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

export function MetricCard({
  metric,
}: {
  metric: { label: string; value: string; delta: string; icon: string; tone: string };
}) {
  return (
    <div className="group relative overflow-hidden rounded-[1.7rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_rgba(159,18,57,.08)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(225,29,72,.18)]">
      <div
        className={cn(
          "absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-20 blur-xl",
          metric.tone,
        )}
      />
      <div
        className={cn(
          "mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-xl text-white shadow-lg",
          metric.tone,
        )}
      >
        {metric.icon}
      </div>
      <p className="text-sm font-bold text-muted-foreground">{metric.label}</p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <strong className="text-3xl font-black tracking-tight">{metric.value}</strong>
        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-black text-green-600">
          {metric.delta}
        </span>
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-black uppercase tracking-[.24em] text-red-500">{eyebrow}</p>
        )}
        <h2 className="text-2xl font-black sm:text-3xl">{title}</h2>
      </div>
      {action && (
        <button className="hidden rounded-full bg-white/70 px-4 py-2 text-sm font-black text-red-600 shadow-sm sm:block">
          {action}
        </button>
      )}
    </div>
  );
}

export function RankingList({
  title,
  items = users.slice(0, 5),
}: {
  title: string;
  items?: BeijoUser[];
}) {
  return (
    <div className="rounded-[1.8rem] border border-white/70 bg-white/75 p-4 shadow-[0_18px_50px_rgba(159,18,57,.08)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xl font-black">{title}</h3>
        <Trophy className="h-5 w-5 text-orange-500" />
      </div>
      <ol className="space-y-2">
        {items.map((u, i) => (
          <li
            key={u.id}
            className="flex min-w-0 items-center gap-3 rounded-2xl bg-white/70 p-3 transition hover:bg-red-50/80"
          >
            <span
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-2xl font-black",
                i < 3
                  ? "bg-gradient-lipstick text-white shadow-lg"
                  : "bg-secondary text-muted-foreground",
              )}
            >
              {i + 1}
            </span>
            <img src={u.avatar} alt={u.name} className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-black">{u.name}</div>
              <div className="truncate text-xs text-muted-foreground">
                {u.city} · {u.event}
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-red-600">{u.kisses}</div>
              <div
                className={cn(
                  "text-xs font-bold",
                  u.growth > 0 ? "text-green-600" : "text-red-500",
                )}
              >
                {u.growth > 0 ? "↑" : "↓"} {Math.abs(u.growth)}%
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function UserCard({
  user,
  onProfile,
}: {
  user: BeijoUser;
  onProfile?: (user: BeijoUser) => void;
}) {
  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(159,18,57,.09)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(225,29,72,.2)]">
      <div className="relative h-40 overflow-hidden">
        <img
          src={user.avatar}
          alt={user.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-red-600">
          {user.badge}
        </span>
        <span className="absolute bottom-3 left-3 text-white">
          <strong className="block text-2xl">
            #{user.rank} {user.name}
          </strong>
          <span className="text-sm opacity-90">
            {user.age} anos · {user.city}
          </span>
        </span>
      </div>
      <div className="space-y-4 p-4">
        <div className="grid min-w-0 grid-cols-3 gap-2 text-center">
          <Stat label="BeijoChecks" value={user.kisses} />
          <Stat label="Pontos" value={user.points} />
          <Stat label="Match" value={user.matches} />
        </div>
        <p className="text-sm text-muted-foreground">
          <MapPin className="mr-1 inline h-4 w-4 text-red-500" />
          {user.event}
        </p>
        <div className="flex gap-2">
          <MatchButton />
          <Button
            onClick={() => onProfile?.(user)}
            variant="outline"
            className="flex-1 rounded-full border-red-200 bg-white font-black text-red-600 hover:bg-red-50"
          >
            Ver perfil
          </Button>
        </div>
      </div>
    </article>
  );
}

export function EventCard({ event }: { event: (typeof events)[number] }) {
  return (
    <article className="overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/80 shadow-[0_18px_50px_rgba(159,18,57,.09)] transition hover:-translate-y-1">
      <div className={cn("relative min-h-36 bg-gradient-to-br p-5 text-white", event.gradient)}>
        <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">
          {event.ranking}
        </div>
        <p className="text-sm font-bold opacity-90">{event.vibe}</p>
        <h3 className="mt-8 text-3xl font-black">{event.name}</h3>
      </div>
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Cidade" value={event.city} />
          <Stat label="Data" value={event.date} />
          <Stat label="BeijoChecks" value={event.kisses} />
          <Stat label="Ativos" value={event.activeUsers} />
        </div>
        <Button className="w-full rounded-full bg-gradient-lipstick font-black text-white">
          Entrar no evento
        </Button>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-red-50/70 p-3">
      <div className="text-lg font-black text-red-600">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
export function MatchButton() {
  return (
    <Button className="flex-1 rounded-full bg-gradient-lipstick font-black text-white shadow-lg shadow-red-500/20 transition active:scale-95">
      <HeartHandshake className="mr-1 h-4 w-4" />
      Interessar
    </Button>
  );
}
export const Icons = {
  Search,
  SlidersHorizontal,
  Flame,
  Users,
  UserRound,
  Trophy,
  MapPin,
  CalendarDays,
};
