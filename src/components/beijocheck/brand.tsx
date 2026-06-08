import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  Check,
  ChevronRight,
  Compass,
  Heart,
  MessageCircle,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BeijoUser } from "@/data/beijocheck.mock";
import { myProfile, users } from "@/data/beijocheck.mock";

export function BeijoLogo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      to="/"
      className={cn("group flex items-center gap-2 font-black tracking-tight", className)}
    >
      <span className="relative grid h-10 w-10 place-items-center rounded-[1.15rem] bg-gradient-to-br from-red-500 via-rose-600 to-orange-400 text-lg text-white shadow-[0_14px_30px_rgba(225,29,72,.34)] transition group-hover:-rotate-6 group-hover:scale-105">
        💋
        <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] text-red-600 shadow-lg">
          <Check className="h-3 w-3 stroke-[4]" />
        </span>
      </span>
      {!compact && <span className="text-xl text-white sm:text-2xl">BeijoCheck</span>}
    </Link>
  );
}

const navItems = [
  { label: "Deslizar", to: "/", icon: Zap },
  { label: "Explorar", to: "/explorar", icon: Compass },
  { label: "Curtidas", to: "/curtidas", icon: Heart, badge: "27" },
  { label: "Chat", to: "/chat", icon: MessageCircle },
  { label: "Perfil", to: "/perfil", icon: UserRound },
] as const;

export function AppShell({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-h-dvh max-w-full overflow-x-hidden pb-safe-nav",
        dark ? "bg-app-dark text-white" : "bg-app-soft text-red-950",
      )}
    >
      <div className="fixed inset-0 -z-10 max-w-full overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-48 h-80 w-80 rounded-full bg-orange-400/16 blur-3xl" />
      </div>
      {!dark && (
        <header className="safe-top sticky top-0 z-40 border-b border-white/10 bg-zinc-950/82 text-white backdrop-blur-2xl">
          <div className="mx-auto flex max-w-5xl min-w-0 items-center justify-between gap-2 px-4 py-3">
            <BeijoLogo />
            <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/8 p-1 lg:flex">
              {navItems.map(({ label, to, icon: Icon, badge }) => (
                <Link
                  key={to}
                  to={to}
                  className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white/62 transition hover:bg-white/10 hover:text-white"
                  activeProps={{ className: "bg-white text-red-600 shadow-lg" }}
                >
                  <Icon className="h-4 w-4" /> {label}
                  {badge && (
                    <span className="rounded-full bg-yellow-300 px-1.5 text-[10px] text-zinc-950">
                      {badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur">
                <Bell className="h-4 w-4" />
              </button>
              <Link
                to="/perfil"
                className="hidden items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-xs font-bold sm:flex"
              >
                <img
                  src={myProfile.avatar}
                  alt={myProfile.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                #{myRankingPosition.position}
              </Link>
            </div>
          </div>
        </header>
      )}
      <main
        className={cn(
          "relative z-10 mx-auto w-full max-w-5xl min-w-0 overflow-x-hidden",
          dark ? "" : "px-4 py-5",
        )}
      >
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}

export function BottomNavigation() {
  const location = useLocation();
  return (
    <nav
      aria-label="Navegação principal"
      className="bottom-safe-nav bottom-nav-glass fixed inset-x-3 z-50 mx-auto max-w-[min(42rem,calc(100vw-1.5rem))] rounded-[1.7rem] border border-white/12 p-1.5 shadow-[0_24px_70px_rgba(0,0,0,.38),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-[28px] lg:hidden"
    >
      <div className="grid grid-cols-5 gap-1">
        {navItems.map(({ label, to, icon: Icon, badge }) => {
          const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-[1.25rem] px-1 py-2 text-[10px] font-black text-white/72 transition active:scale-95",
                active && "bg-white/16 text-white shadow-inner",
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-9 place-items-center rounded-full",
                  active && "beijo-gradient text-white",
                )}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  fill={label === "Curtidas" && active ? "currentColor" : "none"}
                />
              </span>
              <span className="max-w-full truncate leading-none">{label}</span>
              {badge && (
                <span className="absolute right-1.5 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-yellow-300 px-1 text-[10px] font-black text-zinc-950 ring-2 ring-zinc-950/50">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopSwipeTabs() {
  return (
    <div className="safe-top pointer-events-auto flex items-center gap-3 px-4 pt-3 text-white">
      <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black/28 backdrop-blur-xl">
        <SlidersHorizontal className="h-5 w-5" />
      </button>
      <div className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto rounded-full bg-black/18 p-1 backdrop-blur-xl">
        {["Pra você", "Eventos", "Região"].map((item, index) => (
          <button
            key={item}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-black text-white/74",
              index === 0 && "bg-white/16 text-white",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-black/28 text-orange-300 backdrop-blur-xl">
        <Sparkles className="h-5 w-5" />
      </button>
    </div>
  );
}

export function MutualConfirmationBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 font-black text-white backdrop-blur",
        compact ? "text-[11px]" : "text-xs",
      )}
    >
      <Check className="h-3.5 w-3.5" /> Confirmação mútua
    </span>
  );
}

export function SafetyMiniBar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2 text-[11px] font-black", className)}>
      {[
        "Só conta com confirmação mútua",
        "Você controla sua visibilidade",
        "18+",
        "Sem conteúdo explícito",
      ].map((item) => (
        <span
          key={item}
          className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-white/72 backdrop-blur"
        >
          {item}
        </span>
      ))}
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
    <section className="glass-light rounded-[1.6rem] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xl font-black">{title}</h3>
        <Trophy className="h-5 w-5 text-orange-500" />
      </div>
      <ol className="space-y-2">
        {items.map((u, index) => (
          <li key={u.id} className="flex min-w-0 items-center gap-3 rounded-3xl bg-white/70 p-2.5">
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-2xl text-sm font-black",
                index < 3 ? "beijo-gradient text-white" : "bg-red-50 text-red-600",
              )}
            >
              #{index + 1}
            </span>
            <img src={u.avatar} alt={u.name} className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-black">{u.name}</div>
              <div className="truncate text-xs font-bold text-red-950/50">
                {u.city} · {u.event}
              </div>
            </div>
            <div className="text-right text-sm font-black text-red-600">{u.kisses}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export const Icons = {
  ChevronRight,
  Settings,
  Trophy,
  Sparkles,
  Heart,
  Compass,
  MessageCircle,
  UserRound,
};
const myRankingPosition = { position: 18 };
