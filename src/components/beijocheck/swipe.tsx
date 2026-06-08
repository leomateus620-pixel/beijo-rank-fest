import { useState } from "react";
import { ArrowUp, Heart, RotateCcw, Send, ShieldCheck, Sparkles, X } from "lucide-react";
import {
  TopSwipeTabs,
  MutualConfirmationBadge,
  SafetyMiniBar,
} from "@/components/beijocheck/brand";
import { cn } from "@/lib/utils";
import type { BeijoUser } from "@/data/beijocheck.mock";
import { users } from "@/data/beijocheck.mock";

export function PhotoProgress({ total, active }: { total: number; active: number }) {
  return (
    <div className="absolute left-4 right-4 top-3 z-20 flex gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={cn("h-1 flex-1 rounded-full bg-white/28", index === active && "bg-white")}
        />
      ))}
    </div>
  );
}

export function FullScreenProfileCard({ user }: { user: BeijoUser }) {
  const [photo, setPhoto] = useState(0);
  const photoCount = Math.min(user.photos.length, 9);
  const next = () => setPhoto((value) => (value + 1) % photoCount);
  const prev = () => setPhoto((value) => (value - 1 + photoCount) % photoCount);
  return (
    <article className="relative h-[calc(100dvh-7.4rem)] min-h-[620px] w-full overflow-hidden rounded-b-[2rem] bg-zinc-950 card-shadow-premium sm:h-[calc(100dvh-7.8rem)] sm:rounded-[2.2rem]">
      <img
        src={user.photos[photo]}
        alt={`${user.name} foto ${photo + 1}`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <button
        aria-label="Foto anterior"
        onClick={prev}
        className="absolute bottom-32 left-0 top-16 z-10 w-1/2"
      />
      <button
        aria-label="Próxima foto"
        onClick={next}
        className="absolute bottom-32 right-0 top-16 z-10 w-1/2"
      />
      <PhotoProgress total={photoCount} active={photo} />
      <div className="absolute inset-0 photo-card-gradient" />
      <div className="absolute bottom-28 left-0 right-0 z-20 px-5 text-white">
        <div className="mb-2 flex flex-wrap gap-2">
          <MutualConfirmationBadge compact />
          <span className="rounded-full bg-black/36 px-3 py-1.5 text-[11px] font-black backdrop-blur">
            {user.distance} · perto de mim
          </span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-[clamp(2.25rem,12vw,4rem)] font-black leading-none tracking-[-.055em]">
              {user.name} <span className="font-medium">{user.age}</span>
            </h1>
            <p className="mt-2 text-sm font-bold text-white/82">
              {user.city} · {user.region} · {user.event}
            </p>
          </div>
          <button className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-black/42 text-white backdrop-blur-xl">
            <ArrowUp className="h-6 w-6" />
          </button>
        </div>
        <button className="mt-3 flex items-center gap-2 text-left text-sm font-black text-white">
          <ShieldCheck className="h-4 w-4" /> Mais informações e estilo de vida
        </button>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {user.badges.slice(0, 4).map((badge) => (
            <span
              key={badge}
              className="shrink-0 rounded-full bg-black/50 px-3 py-2 text-xs font-black backdrop-blur"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      <SwipeActionBar />
    </article>
  );
}

export function SwipeActionBar() {
  const actions = [
    { label: "Voltar", icon: RotateCcw, className: "text-orange-300", size: "h-12 w-12" },
    { label: "Pular", icon: X, className: "text-rose-400", size: "h-16 w-16" },
    { label: "Destaque", icon: Sparkles, className: "text-sky-400", size: "h-12 w-12" },
    { label: "Interessar", icon: Heart, className: "text-emerald-300", size: "h-16 w-16" },
    { label: "Enviar", icon: Send, className: "text-blue-400", size: "h-12 w-12" },
  ];
  return (
    <div className="absolute bottom-3 left-0 right-0 z-30 flex items-center justify-center gap-3 px-4 pb-2">
      {actions.map(({ label, icon: Icon, className, size }) => (
        <button
          key={label}
          aria-label={label}
          className={cn(
            "grid shrink-0 place-items-center rounded-full border border-white/10 bg-zinc-950/58 shadow-xl backdrop-blur-xl transition active:scale-95",
            size,
            className,
          )}
        >
          <Icon className="h-7 w-7" fill={label === "Interessar" ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}

export function BeijoSwipeDeck() {
  const [index, setIndex] = useState(0);
  const active = users[index % users.length];
  return (
    <section className="relative h-dvh overflow-hidden bg-app-dark text-white">
      <TopSwipeTabs />
      <div className="px-0 pt-2 sm:px-4">
        <div className="mx-auto max-w-[28rem]">
          <FullScreenProfileCard user={active} />
        </div>
      </div>
      <div className="pointer-events-none absolute left-4 right-4 top-[5.35rem] z-30 mx-auto max-w-[28rem]">
        <SafetyMiniBar />
      </div>
      <button onClick={() => setIndex((value) => value + 1)} className="sr-only">
        Próximo perfil
      </button>
    </section>
  );
}
