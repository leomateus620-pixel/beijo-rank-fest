import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Ban,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Flag,
  Heart,
  HeartHandshake,
  MapPin,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BeijoEvent, BeijoUser } from "@/data/beijocheck.mock";
import { users } from "@/data/beijocheck.mock";
import { ShareProfileRankingActions } from "@/components/beijocheck/share";

export function MutualConfirmationBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/85 px-3 py-1.5 text-xs font-black text-red-600 shadow-sm backdrop-blur">
      <ShieldCheck className="h-4 w-4" />
      {compact ? "Confirmação mútua" : "Só vale com confirmação mútua"}
    </div>
  );
}

export function SafetyTrustBar({ className }: { className?: string }) {
  const items = [
    { icon: ShieldCheck, label: "Confirmação mútua" },
    { icon: EyeOff, label: "Ocultar do ranking" },
    { icon: Ban, label: "Bloquear" },
    { icon: Flag, label: "Denunciar" },
    { icon: CheckCircle2, label: "18+" },
  ];
  return (
    <div
      className={cn(
        "max-w-full rounded-[1.5rem] border border-white/70 bg-white/80 p-3 shadow-[0_14px_40px_rgba(159,18,57,.08)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1">
        {items.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-600"
          >
            <Icon className="h-4 w-4" /> {label}
          </span>
        ))}
      </div>
      <p className="mt-2 px-1 text-xs font-medium text-muted-foreground">
        Sem conteúdo explícito. Você controla sua visibilidade e pode denunciar perfis a qualquer
        momento.
      </p>
    </div>
  );
}

export function ProfilePhotoCarousel({ user }: { user: BeijoUser }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  function goTo(index: number) {
    const next = Math.max(0, Math.min(user.photos.length - 1, index));
    setPhotoIndex(next);
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  }

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== photoIndex) setPhotoIndex(next);
  }

  return (
    <div className="relative h-full min-h-[390px] overflow-hidden rounded-[1.6rem] bg-red-100 sm:min-h-[560px]">
      <div className="absolute left-4 right-4 top-4 z-20 flex gap-1.5">
        {user.photos.map((photo, i) => (
          <button
            key={photo}
            aria-label={`Ver foto ${i + 1}`}
            onClick={() => goTo(i)}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/35"
          >
            <span
              className={cn(
                "block h-full rounded-full bg-white transition-all duration-300",
                i === photoIndex ? "w-full" : "w-0",
              )}
            />
          </button>
        ))}
      </div>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {user.photos.map((photo, i) => (
          <img
            key={photo}
            src={photo}
            alt={`${user.name} foto ${i + 1}`}
            className="h-full min-w-full max-w-full snap-center object-cover"
          />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/20 to-black/15" />
      <button
        onClick={() => goTo(photoIndex - 1)}
        className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur sm:grid"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => goTo(photoIndex + 1)}
        className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur sm:grid"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 text-white sm:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <MutualConfirmationBadge compact />
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-black backdrop-blur">
            <MapPin className="h-4 w-4" /> Perto de mim · {user.distance}
          </span>
        </div>
        <h2 className="break-words text-[clamp(2rem,10vw,3rem)] font-black leading-none sm:text-5xl">
          {user.name}, {user.age}
        </h2>
        <p className="mt-1 break-words text-sm font-semibold text-white/85 sm:text-base">
          {user.city} · {user.event} · {user.localHighlight}
        </p>
      </div>
    </div>
  );
}

export function SwipeProfileCard({
  user,
  onProfile,
  onNext,
}: {
  user: BeijoUser;
  onProfile: (user: BeijoUser) => void;
  onNext: (action: "skip" | "like" | "check" | "save") => void;
}) {
  const [feedback, setFeedback] = useState<string | null>(null);
  function act(action: "skip" | "like" | "check" | "save", label: string) {
    setFeedback(label);
    window.setTimeout(() => {
      setFeedback(null);
      onNext(action);
    }, 300);
  }

  return (
    <article className="relative mx-auto w-full max-w-[min(100%,28rem)] rounded-[1.85rem] border border-white/70 bg-white/85 p-2 shadow-[0_30px_90px_rgba(159,18,57,.22)] backdrop-blur-xl transition duration-300 sm:max-w-lg">
      {feedback && (
        <div className="absolute left-1/2 top-8 z-30 -translate-x-1/2 rounded-full bg-white px-5 py-2 text-sm font-black text-red-600 shadow-xl animate-in fade-in zoom-in">
          {feedback}
        </div>
      )}
      <ProfilePhotoCarousel user={user} />
      <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
        <div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto pb-1">
          {user.interests.map((interest) => (
            <span
              key={interest}
              className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600"
            >
              {interest}
            </span>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{user.bio}</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <MiniStat label="Ranking" value={`#${user.rank}`} />
          <MiniStat label="BeijoChecks" value={user.kisses} />
          <MiniStat label="Badge" value={user.badge} />
        </div>
        <Button
          onClick={() => onProfile(user)}
          variant="outline"
          className="h-11 w-full rounded-full border-red-200 bg-white font-black text-red-600 hover:bg-red-50"
        >
          Ver mais detalhes
        </Button>
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          <ActionButton label="Pular" icon={X} onClick={() => act("skip", "Perfil pulado")} />
          <ActionButton
            label="Curtir"
            icon={Heart}
            onClick={() => act("like", "Interesse enviado")}
            primary
          />
          <ActionButton
            label="Check"
            icon={HeartHandshake}
            onClick={() => act("check", "BeijoCheck enviado")}
          />
          <ActionButton
            label="Salvar"
            icon={Bookmark}
            onClick={() => act("save", "Perfil salvo")}
          />
        </div>
      </div>
    </article>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
  primary = false,
}: {
  label: string;
  icon: typeof Heart;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex min-w-0 flex-col items-center gap-1 rounded-2xl border px-1.5 py-2.5 text-[10px] sm:p-3 sm:text-[11px] font-black transition active:scale-95",
        primary
          ? "border-red-500 bg-gradient-lipstick text-white shadow-lg shadow-red-500/20"
          : "border-red-100 bg-white text-red-600 hover:bg-red-50",
      )}
    >
      <Icon className="h-5 w-5" /> {label}
    </button>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="min-w-0 rounded-2xl bg-red-50/75 p-2 sm:p-3">
      <div className="truncate text-lg font-black text-red-600">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function EventLiveCard({ event }: { event: BeijoEvent }) {
  return (
    <article className="relative min-w-0 overflow-hidden rounded-[1.65rem] border border-white/70 bg-white/82 p-4 text-red-950 shadow-[0_18px_50px_rgba(159,18,57,.08)] backdrop-blur-xl sm:p-5">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-orange-200/35 blur-2xl" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[.22em] text-red-500">
            Evento ao vivo
          </p>
          <h2 className="mt-1 break-words text-[clamp(1.55rem,7vw,2rem)] font-black leading-tight">
            {event.name}
          </h2>
          <p className="mt-1 text-sm font-bold text-muted-foreground">
            {event.venue} · {event.city}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
          {event.status === "ativo" ? "Ativo" : event.status}
        </span>
      </div>
      <div className="relative z-10 mt-4 grid grid-cols-2 gap-2 text-center">
        <LiveStat label="Participantes" value={event.participants} />
        <LiveStat label="BeijoChecks" value={event.kisses} />
      </div>
      <div className="relative z-10 mt-4 grid gap-2 sm:grid-cols-2">
        <Button asChild className="rounded-full bg-gradient-lipstick font-black text-white">
          <Link to="/eventos">Entrar no evento</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-red-200 bg-white font-black text-red-600 hover:bg-red-50"
        >
          <Link to="/ranking">Ver ranking</Link>
        </Button>
      </div>
    </article>
  );
}

function LiveStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-red-50/75 p-3">
      <div className="text-xl font-black text-red-600">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function RankingPodium({ users }: { users: BeijoUser[] }) {
  return (
    <div className="grid grid-cols-3 items-end gap-2 sm:gap-4">
      {users.slice(0, 3).map((user, index) => (
        <article
          key={user.id}
          className={cn(
            "relative min-w-0 overflow-hidden rounded-[1.35rem] border border-white/70 p-2.5 text-center shadow-[0_16px_44px_rgba(159,18,57,.1)] sm:rounded-[1.75rem] sm:p-4",
            index === 0
              ? "order-2 bg-gradient-to-br from-red-600 to-orange-400 text-white sm:-translate-y-3"
              : index === 1
                ? "order-1 bg-white/84"
                : "order-3 bg-white/84",
          )}
        >
          <div className="absolute right-2 top-2 text-3xl opacity-20 sm:text-5xl">
            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
          </div>
          <img
            src={user.avatar}
            alt={user.name}
            className={cn(
              "mx-auto rounded-[1.1rem] border-2 border-white/80 object-cover shadow-lg",
              index === 0 ? "h-16 w-16 sm:h-20 sm:w-20" : "h-12 w-12 sm:h-16 sm:w-16",
            )}
          />
          <div className="mt-2 text-lg font-black leading-none sm:text-2xl">#{index + 1}</div>
          <h3 className="mt-1 truncate text-sm font-black sm:text-lg">{user.name}</h3>
          <p
            className={cn(
              "truncate text-[10px] font-bold sm:text-xs",
              index === 0 ? "text-white/78" : "text-muted-foreground",
            )}
          >
            {user.city}
          </p>
          <div className="mt-2 rounded-full bg-white/18 px-2 py-1 text-[10px] font-black sm:text-xs">
            {user.kisses} BeijoChecks
          </div>
        </article>
      ))}
    </div>
  );
}

export function MyRankingPositionCard({ compact = false }: { compact?: boolean }) {
  return (
    <article className="relative overflow-hidden rounded-[1.65rem] border border-red-100 bg-white/86 p-4 shadow-[0_18px_50px_rgba(159,18,57,.1)] backdrop-blur-xl sm:p-5">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-red-100/70 blur-2xl" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[.22em] text-red-500">
            Minha posição
          </p>
          <div className="mt-2 flex items-end gap-3">
            <h3 className="text-5xl font-black leading-none text-red-600">#18</h3>
            <span className="mb-1 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-600">
              +2 hoje
            </span>
          </div>
          <p className="mt-2 font-bold text-muted-foreground">Santa Rosa · Festa Neon</p>
          <p className="mt-1 text-sm font-black text-red-600">128 BeijoChecks confirmados</p>
        </div>
        <Trophy className="h-10 w-10 shrink-0 text-orange-500" />
      </div>
      <div className={cn("relative z-10 mt-4", compact && "max-w-xs")}>
        <ShareProfileRankingActions
          user={users[0]}
          position={18}
          compact
          triggerLabel={compact ? "Compartilhar" : "Compartilhar ranking"}
        />
      </div>
    </article>
  );
}

export function ShareRankingCard() {
  return (
    <article className="rounded-[1.65rem] border border-white/70 bg-white/84 p-4 shadow-[0_18px_50px_rgba(159,18,57,.08)] backdrop-blur-xl sm:p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-lipstick text-white shadow-lg">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-black leading-tight">Competição pronta para compartilhar</h3>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            Gere um PNG oficial do ranking validado.
          </p>
        </div>
      </div>
      <ShareProfileRankingActions
        user={users[0]}
        className="mt-4"
        triggerLabel="Compartilhar ranking geral"
      />
    </article>
  );
}

export function BeijoCheckFlow({ compact = false }: { compact?: boolean }) {
  const steps = [
    "Pessoa ou evento",
    "Contexto",
    "Enviar confirmação",
    "Aguardando o outro",
    "Entra no ranking",
  ];
  return (
    <div className="rounded-[1.8rem] border border-white/70 bg-white/80 p-4 shadow-[0_18px_50px_rgba(159,18,57,.08)]">
      <div className="mb-4 flex items-center gap-2">
        <Send className="h-5 w-5 text-red-500" />
        <h3 className="font-display text-2xl font-black">Fluxo do BeijoCheck</h3>
      </div>
      <ol className={cn("grid gap-3", compact ? "" : "sm:grid-cols-5")}>
        {steps.map((step, index) => (
          <li key={step} className="rounded-2xl bg-red-50 p-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-lipstick text-sm font-black text-white">
              {index + 1}
            </div>
            <p className="mt-2 text-sm font-black text-red-700">{step}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm font-semibold text-muted-foreground">
        Status mockado: aguardando confirmação da outra pessoa. Só depois disso pontua.
      </p>
    </div>
  );
}
