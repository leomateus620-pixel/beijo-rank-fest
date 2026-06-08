import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Icons } from "@/components/beijocheck/brand";
import { SafetyTrustBar, SwipeProfileCard } from "@/components/beijocheck/social";
import { activeEvent, cities, events, type BeijoUser, users } from "@/data/beijocheck.mock";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ban, EyeOff, Flag, ShieldCheck } from "lucide-react";
import { ShareProfileRankingActions } from "@/components/beijocheck/share";

export const Route = createFileRoute("/explorar")({
  head: () => ({ meta: [{ title: "Radar da festa — BeijoCheck" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    focus: search.focus != null ? Number(search.focus) : undefined,
  }),
  component: ExplorarPage,
});

function ExplorarPage() {
  const { focus } = Route.useSearch();
  const [selected, setSelected] = useState<BeijoUser | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeUser = users[activeIndex % users.length];

  useEffect(() => {
    if (focus != null) {
      const target = users.find((u) => u.id === focus);
      if (target) setSelected(target);
    }
  }, [focus]);

  function nextProfile() {
    setActiveIndex((index) => (index + 1) % users.length);
  }

  return (
    <AppShell>
      <section className="grid min-w-0 gap-4 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <article className="card-3d hover-lift min-w-0 p-4 sm:p-6">
          <p className="break-words text-xs font-black uppercase tracking-[.18em] text-red-500">
            Radar da festa
          </p>
          <h1 className="mt-2 text-balance break-words text-fluid-hero font-black leading-[1] text-red-950">
            Descubra quem está em alta no evento
          </h1>
          <p className="mt-3 max-w-2xl break-words text-sm leading-relaxed text-muted-foreground sm:text-base">
            Veja destaques, curta perfis e envie BeijoCheck apenas com confirmação mútua.
          </p>
          <div className="relative mt-4 min-w-0">
            <Icons.Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
            <Input
              className="h-12 min-w-0 rounded-full border-red-100 bg-white pl-11 text-sm shadow-sm"
              placeholder="Buscar nome, cidade ou evento"
            />
          </div>
          <div className="scrollbar-hide mt-4 flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1">
            {[activeEvent.name, ...cities, "Perto de mim", "Top 10"].map((filter, i) => (
              <button
                key={filter}
                className={`tap-press shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${i === 0 ? "bg-gradient-lipstick text-white shadow-md shadow-red-500/20" : "bg-white/80 text-red-600 hover:bg-red-50"}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <SafetyTrustBar className="mt-4" />
        </article>

        <div className="min-w-0">
          <SwipeProfileCard user={activeUser} onProfile={setSelected} onNext={nextProfile} />
        </div>
      </section>

      <section className="mt-6 min-w-0 lg:mt-8">
        <article className="card-3d min-w-0 p-4 sm:p-5">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[.24em] text-red-500">
                Destaques do evento
              </p>
              <h2 className="mt-1 text-balance break-words text-[clamp(1.3rem,5.5vw,1.7rem)] font-black leading-tight">
                Em alta em {activeEvent.name}
              </h2>
            </div>
          </div>
          <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-3">
            {users.slice(0, 3).map((user) => (
              <button
                key={user.id}
                onClick={() => setSelected(user)}
                className="tap-press min-w-0 rounded-3xl border border-white/60 bg-white/75 p-3 text-left shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-full rounded-2xl object-cover sm:h-28"
                />
                <div className="mt-3 truncate font-black">{user.name}</div>
                <div className="truncate text-xs font-bold text-red-600">{user.localHighlight}</div>
              </button>
            ))}
          </div>
        </article>
      </section>
      <ProfileModal user={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </AppShell>
  );
}

function ProfileModal({
  user,
  onOpenChange,
}: {
  user: BeijoUser | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-lg overflow-y-auto rounded-[2rem] border-white/70 bg-white/95 p-0 shadow-[0_30px_100px_rgba(159,18,57,.35)]">
        {user && (
          <>
            <div className="relative h-60 overflow-hidden rounded-t-[2rem] sm:h-72">
              <img src={user.photos[0]} alt={user.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">
                  {user.badge}
                </span>
                <DialogHeader className="mt-3 text-left">
                  <DialogTitle className="break-words text-[clamp(1.6rem,7vw,2.25rem)] font-black leading-tight">
                    {user.name}
                  </DialogTitle>
                  <DialogDescription className="text-white/85">
                    {user.city} · {user.event}
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
            <div className="space-y-5 p-4 sm:p-5">
              <p className="text-muted-foreground">{user.bio}</p>
              <div className="grid min-w-0 grid-cols-3 gap-2 text-center sm:gap-3">
                {[
                  { l: "Ranking", v: `#${user.rank}` },
                  { l: "BeijoChecks", v: user.kisses },
                  { l: "Confirmações", v: user.matches },
                ].map((s) => (
                  <div key={s.l} className="min-w-0 rounded-2xl bg-red-50 p-3 sm:p-4">
                    <div className="text-2xl font-black text-red-600">{s.v}</div>
                    <div className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
              <div className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto pb-1">
                {user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="shrink-0 whitespace-nowrap rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-600"
                  >
                    {interest}
                  </span>
                ))}
              </div>
              <div className="rounded-3xl bg-red-50 p-4 text-sm font-bold text-red-700">
                <ShieldCheck className="mr-2 inline h-4 w-4" /> Só vale com confirmação mútua. Você
                pode ocultar seu perfil do ranking. Sem exposição indevida.
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <Button className="tap-press rounded-full bg-gradient-lipstick font-black text-white">
                  Interessar
                </Button>
                <Button
                  variant="outline"
                  className="tap-press rounded-full border-red-200 font-black text-red-600"
                >
                  BeijoCheck
                </Button>
                <Button
                  variant="outline"
                  className="tap-press rounded-full border-red-200 font-black text-red-600"
                >
                  Salvar
                </Button>
              </div>
              <ShareProfileRankingActions user={user} compact />
              <div className="flex flex-wrap gap-2 text-xs font-black text-muted-foreground">
                <span className="rounded-full bg-white px-3 py-2">
                  <Ban className="mr-1 inline h-4 w-4" /> Bloquear
                </span>
                <span className="rounded-full bg-white px-3 py-2">
                  <Flag className="mr-1 inline h-4 w-4" /> Denunciar
                </span>
                <span className="rounded-full bg-white px-3 py-2">
                  <EyeOff className="mr-1 inline h-4 w-4" /> Ocultar ranking
                </span>
              </div>
              <div>
                <h4 className="font-black">Eventos conectados</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {events.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600"
                    >
                      {e.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
