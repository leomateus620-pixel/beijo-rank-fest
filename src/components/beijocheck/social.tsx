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
        "rounded-[1.5rem] border border-white/70 bg-white/80 p-3 shadow-[0_14px_40px_rgba(159,18,57,.08)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex gap-2 overflow-x-auto pb-1">
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
    <div className="relative h-full min-h-[460px] overflow-hidden rounded-[2rem] bg-red-100 sm:min-h-[560px]">
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
            className="h-full min-w-full snap-center object-cover"
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
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 text-white sm:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <MutualConfirmationBadge compact />
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-black backdrop-blur">
            <MapPin className="h-4 w-4" /> Perto de mim · {user.distance}
          </span>
        </div>
        <h2 className="text-4xl font-black sm:text-5xl">
          {user.name}, {user.age}
        </h2>
        <p className="mt-1 font-semibold text-white/85">
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
    <article className="relative mx-auto max-w-md rounded-[2.2rem] border border-white/70 bg-white/85 p-2 shadow-[0_30px_90px_rgba(159,18,57,.22)] backdrop-blur-xl transition duration-300 sm:max-w-lg">
      {feedback && (
        <div className="absolute left-1/2 top-8 z-30 -translate-x-1/2 rounded-full bg-white px-5 py-2 text-sm font-black text-red-600 shadow-xl animate-in fade-in zoom-in">
          {feedback}
        </div>
      )}
      <ProfilePhotoCarousel user={user} />
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          {user.interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600"
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
        <div className="grid grid-cols-4 gap-2">
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
        "flex flex-col items-center gap-1 rounded-2xl border p-3 text-[11px] font-black transition active:scale-95",
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
    <div className="rounded-2xl bg-red-50/75 p-3">
      <div className="truncate text-lg font-black text-red-600">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function EventLiveCard({ event }: { event: BeijoEvent }) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-400 p-5 text-white shadow-[0_28px_90px_rgba(225,29,72,.3)] sm:p-6">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.24em] text-white/70">
            Evento em alta agora
          </p>
          <h2 className="mt-2 text-4xl font-black">{event.name}</h2>
          <p className="mt-2 font-semibold text-white/85">
            {event.venue} · {event.city} · {event.date}
          </p>
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">
          {event.status === "ativo" ? "Ativo" : event.status}
        </span>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        <LiveStat label="Participantes" value={event.participants} />
        <LiveStat label="BeijoChecks" value={event.kisses} />
        <LiveStat label="Status" value={event.livePosition} />
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Button asChild className="rounded-full bg-white font-black text-red-600 hover:bg-white/90">
          <Link to="/eventos">Entrar no evento</Link>
        </Button>
        <Button
          asChild
          className="rounded-full border border-white/40 bg-white/15 font-black text-white hover:bg-white/25"
        >
          <Link to="/ranking">Ver ranking ao vivo</Link>
        </Button>
      </div>
    </article>
  );
}

function LiveStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/16 p-3 backdrop-blur">
      <div className="text-xl font-black">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-wide text-white/70">{label}</div>
    </div>
  );
}

export function RankingPodium({ users }: { users: BeijoUser[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3 md:items-end">
      {users.slice(0, 3).map((user, index) => (
        <article
          key={user.id}
          className={cn(
            "relative overflow-hidden rounded-[2rem] border border-white/70 p-5 shadow-[0_18px_50px_rgba(159,18,57,.12)]",
            index === 0
              ? "bg-gradient-to-br from-red-600 to-orange-400 text-white md:-translate-y-5 md:scale-105"
              : "bg-white/82",
          )}
        >
          <div className="absolute right-4 top-3 text-6xl opacity-20">
            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
          </div>
          <img
            src={user.avatar}
            alt={user.name}
            className="h-20 w-20 rounded-[1.6rem] border-4 border-white/70 object-cover shadow-xl"
          />
          <h3 className="mt-4 text-3xl font-black">
            #{index + 1} {user.name}
          </h3>
          <p className={cn("text-sm", index === 0 ? "text-white/80" : "text-muted-foreground")}>
            {user.city} · {user.event}
          </p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <strong className="text-4xl font-black">{user.points}</strong>
              <p
                className={cn(
                  "text-xs font-bold",
                  index === 0 ? "text-white/70" : "text-muted-foreground",
                )}
              >
                pontos validados
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-black",
                index === 0 ? "bg-white/20" : "bg-green-50 text-green-600",
              )}
            >
              subiu {Math.abs(user.growth)}%
            </span>
          </div>
          <div className="mt-4 rounded-2xl bg-white/15 p-3 text-sm font-black">
            {user.badges[0]}
          </div>
        </article>
      ))}
    </div>
  );
}

export function MyRankingPositionCard() {
  return (
    <article className="rounded-[1.8rem] border border-red-100 bg-white/85 p-5 shadow-[0_18px_50px_rgba(159,18,57,.1)]">
      <p className="text-xs font-black uppercase tracking-[.24em] text-red-500">Minha posição</p>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-4xl font-black text-red-600">#18</h3>
          <p className="font-bold text-muted-foreground">Santa Rosa · Festa Neon</p>
          <p className="mt-1 text-sm font-semibold text-green-600">Subiu 2 posições hoje</p>
        </div>
        <Trophy className="h-12 w-12 text-orange-500" />
      </div>
      <Button className="mt-4 w-full rounded-full bg-gradient-lipstick font-black text-white">
        <Share2 className="mr-2 h-4 w-4" /> Compartilhar posição
      </Button>
    </article>
  );
}

export function ShareRankingCard() {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_rgba(159,18,57,.1)]">
      <div className="rounded-[1.5rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-400 p-5 text-white">
        <Sparkles className="h-8 w-8" />
        <h3 className="mt-4 text-3xl font-black">Seu print de hoje está pronto</h3>
        <p className="mt-2 text-sm text-white/80">
          Ranking validado, badges e variação de posição em um card compartilhável.
        </p>
      </div>
      <Button className="mt-4 w-full rounded-full bg-gradient-lipstick font-black text-white">
        <Share2 className="mr-2 h-4 w-4" /> Compartilhar ranking
      </Button>
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
