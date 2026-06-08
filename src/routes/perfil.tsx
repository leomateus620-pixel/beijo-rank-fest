import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { AppShell, EventCard, MatchButton, SectionHeader } from "@/components/beijocheck/brand";
import { events, users, weeklyEvolution } from "@/data/beijocheck.mock";
import { Button } from "@/components/ui/button";
import { ShareProfileRankingActions } from "@/components/beijocheck/share";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Check, LogOut, Medal, Pencil, Trophy } from "lucide-react";


export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — BeijoCheck" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const navigate = useNavigate();
  const user = users[0];
  const [avatar, setAvatar] = useState(user.avatar);
  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch {
      /* noop */
    }
    toast.success("Você saiu da conta.");
    navigate({ to: "/login", search: { signedout: 1 } as never });
  }

  const [bio, setBio] = useState(user.bio);
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(bio);
  const fileRef = useRef<HTMLInputElement>(null);

  function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatar(URL.createObjectURL(f));
  }

  return (
    <AppShell>
      <section className="grid min-w-0 gap-5 lg:grid-cols-[.75fr_1.25fr]">
        <article className="card-3d overflow-hidden p-0">
          <div className="relative h-32 bg-gradient-ember sm:h-36">
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(255,255,255,.4),transparent_55%)]" />
          </div>
          <div className="-mt-16 px-5 pb-5 text-center sm:px-6 sm:pb-6">
            <div className="relative mx-auto h-28 w-28 sm:h-32 sm:w-32">
              <img
                src={avatar}
                alt={user.name}
                className="h-full w-full rounded-[1.75rem] border-4 border-white object-cover shadow-xl"
              />
              <button
                onClick={() => fileRef.current?.click()}
                aria-label="Editar foto"
                className="tap-press absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-gradient-lipstick text-white shadow-lg ring-4 ring-white"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
              />
            </div>
            <h1 className="mt-4 break-words text-[clamp(1.6rem,7vw,2.25rem)] font-black leading-tight">
              {user.name}, {user.age}
            </h1>
            <p className="text-sm font-semibold text-muted-foreground">@lara · {user.city}</p>

            {editingBio ? (
              <div className="mt-4 text-left">
                <textarea
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  rows={3}
                  maxLength={160}
                  className="w-full rounded-2xl border border-red-100 bg-white p-3 text-sm shadow-sm focus:border-red-400 focus:outline-none"
                />
                <div className="mt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="tap-press rounded-full"
                    onClick={() => {
                      setBioDraft(bio);
                      setEditingBio(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="tap-press rounded-full bg-gradient-lipstick text-white"
                    onClick={() => {
                      setBio(bioDraft);
                      setEditingBio(false);
                    }}
                  >
                    <Check className="mr-1 h-4 w-4" /> Salvar
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setBioDraft(bio);
                  setEditingBio(true);
                }}
                className="tap-press group mx-auto mt-4 flex items-start gap-2 rounded-2xl bg-red-50/60 p-3 text-left text-sm text-muted-foreground hover:bg-red-50"
              >
                <span className="flex-1">{bio}</span>
                <Pencil className="mt-0.5 h-4 w-4 shrink-0 text-red-500 opacity-70 group-hover:opacity-100" />
              </button>
            )}

            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { l: "Ranking", v: `#${user.rank}` },
                { l: "BeijoChecks", v: user.kisses },
                { l: "Confirmações", v: user.matches },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-red-100 bg-white p-3 shadow-sm">
                  <div className="text-2xl font-black text-red-600">{s.v}</div>
                  <div className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-2">
              <ShareProfileRankingActions user={user} compact />
              <MatchButton />
            </div>
          </div>
        </article>
        <div className="space-y-5">
          <article className="card-3d p-4 sm:p-5">
            <SectionHeader eyebrow="Evolução semanal" title="Performance no ranking" />
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyEvolution} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="perfilArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(225,29,72,.1)" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="rgba(127,29,29,.5)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(127,29,29,.5)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: "#e11d48", strokeOpacity: 0.25 }}
                />
                <Area
                  type="monotone"
                  dataKey="beijos"
                  stroke="#e11d48"
                  strokeWidth={3}
                  fill="url(#perfilArea)"
                  dot={{ r: 4, fill: "#e11d48", stroke: "white", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#e11d48", stroke: "white", strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </article>
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
      <section className="mt-8 grid min-w-0 gap-5 lg:grid-cols-2">
        <div>
          <SectionHeader eyebrow="Badges" title="Conquistas" />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: user.badge, icon: Trophy },
              { label: user.status, icon: Medal },
              { label: "Campeã da semana", icon: Trophy },
              { label: "Confirmação mútua", icon: Check },
              { label: "Evento em alta", icon: Medal },
              { label: "Top social", icon: Trophy },
            ].map((b) => (
              <article key={b.label} className="card-3d hover-lift relative overflow-hidden p-4">
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-200/40 blur-2xl" />
                <div className="relative flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-lipstick text-white shadow-md">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black text-red-700">{b.label}</div>
                    <div className="text-[10px] font-black uppercase tracking-wide text-muted-foreground">
                      Conquistado
                    </div>
                  </div>
                </div>
              </article>
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

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { day: string; cidade: number } }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-2xl border border-red-100 bg-white/95 p-3 shadow-xl backdrop-blur">
      <div className="text-[10px] font-black uppercase tracking-wide text-red-500">{label}</div>
      <div className="mt-1 text-xl font-black text-red-600">{p.value} BeijoChecks</div>
      <div className="text-xs font-bold text-muted-foreground">Cidade: {p.payload.cidade}</div>
    </div>
  );
}

function Info({ title, value, desc }: { title: string; value: string; desc: string }) {
  return (
    <article className="card-3d hover-lift p-4 sm:p-5">
      <p className="text-sm font-bold text-muted-foreground">{title}</p>
      <h3 className="mt-2 text-2xl font-black text-red-600 sm:text-3xl">{value}</h3>
      <p className="mt-1 text-sm font-semibold text-green-600">{desc}</p>
    </article>
  );
}
