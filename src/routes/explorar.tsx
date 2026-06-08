import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AppShell,
  Icons,
  MatchButton,
  SectionHeader,
  UserCard,
} from "@/components/beijocheck/brand";
import { cities, events, type BeijoUser, users } from "@/data/beijocheck.mock";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/explorar")({
  head: () => ({ meta: [{ title: "Explorar — BeijoCheck" }] }),
  component: ExplorarPage,
});

function ExplorarPage() {
  const [selected, setSelected] = useState<BeijoUser | null>(null);
  return (
    <AppShell>
      <section className="rounded-[2.1rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_rgba(159,18,57,.08)] backdrop-blur-xl sm:p-7">
        <p className="text-xs font-black uppercase tracking-[.24em] text-red-500">Explorar</p>
        <div className="mt-2 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-4xl font-black sm:text-6xl">
              Descubra pessoas, veja rankings e dê match
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Feed social com perfis, badges, eventos atuais e confirmação mútua sem conteúdo
              explícito.
            </p>
          </div>
          <div className="relative min-w-80">
            <Icons.Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
            <Input
              className="h-13 rounded-full border-red-100 bg-white pl-11 shadow-sm"
              placeholder="Buscar nome, cidade ou evento"
            />
          </div>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {[...cities, "18-24", "Top 10", events[0].name].map((filter, i) => (
            <button
              key={filter}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-black ${i === 0 ? "bg-gradient-lipstick text-white" : "bg-red-50 text-red-600"}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionHeader eyebrow="Match social" title="Usuários populares agora" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} onProfile={setSelected} />
          ))}
        </div>
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
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] border-white/70 bg-white/95 p-0 shadow-[0_30px_100px_rgba(159,18,57,.35)]">
        <>
          {user && (
            <>
              <div className="relative h-64 overflow-hidden rounded-t-[2rem]">
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute bottom-5 left-5 text-white">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">
                    {user.badge}
                  </span>
                  <DialogHeader className="mt-3 text-left">
                    <DialogTitle className="text-4xl font-black">
                      {user.name}, {user.age}
                    </DialogTitle>
                    <DialogDescription className="text-white/85">
                      {user.city} · {user.event}
                    </DialogDescription>
                  </DialogHeader>
                </div>
              </div>
              <div className="space-y-5 p-5">
                <p className="text-muted-foreground">{user.bio}</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { l: "Ranking", v: `#${user.rank}` },
                    { l: "Beijos", v: user.kisses },
                    { l: "Matches", v: user.matches },
                  ].map((s) => (
                    <div key={s.l} className="rounded-2xl bg-red-50 p-4">
                      <div className="text-2xl font-black text-red-600">{s.v}</div>
                      <div className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                        {s.l}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-black">Eventos frequentados</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {events.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-600"
                      >
                        {e.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-black">Badges</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[user.badge, user.status, "Confirmação mútua"].map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-600"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <MatchButton />
              </div>
            </>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
}
