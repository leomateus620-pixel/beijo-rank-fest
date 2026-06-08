import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, EyeOff, Plus, Settings, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/beijocheck/brand";
import { ShareProfileRankingActions } from "@/components/beijocheck/share";
import { myProfile, users } from "@/data/beijocheck.mock";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Perfil — BeijoCheck" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const [editing, setEditing] = useState(false);
  return (
    <AppShell>
      <section className="text-white">
        <header className="flex items-center gap-4 pt-3">
          <img
            src={myProfile.avatar}
            alt={myProfile.name}
            className="h-24 w-24 rounded-full object-cover beijo-ring"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-4xl font-black tracking-[-.05em]">{myProfile.name}</h1>
              <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-500 text-sm">
                ✓
              </span>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="mt-3 rounded-full bg-white px-6 py-3 font-black text-zinc-950"
            >
              Editar perfil
            </button>
          </div>
          <button className="grid h-14 w-14 place-items-center rounded-full bg-white/10">
            <Settings />
          </button>
        </header>
        <div className="mt-6">
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-full w-[86%] rounded-full beijo-gradient" />
          </div>
          <p className="mt-4 text-xl font-semibold text-white/62">
            Complete seu perfil para aparecer melhor nos rankings.
          </p>
        </div>
        <div className="mt-6 grid gap-4">
          <ActionCard
            icon="“"
            title="Adicione uma pergunta"
            text="Mostre sua personalidade para iniciar conversas melhores."
          />
          <ActionCard
            icon="★"
            title="Super Check"
            text="Destaque um interesse com confirmação mútua."
          />
          <ActionCard
            icon="⚡"
            title="Meus Boosts"
            text="Apareça melhor em eventos e rankings locais."
          />
          <ActionCard
            icon="🔒"
            title="Privacidade do ranking"
            text="Controle cidade, evento visível e bloqueios."
          />
        </div>
        <section className="mt-5 rounded-[1.8rem] border border-white/10 bg-white/8 p-4 backdrop-blur">
          <p className="text-sm font-black uppercase tracking-[.2em] text-red-300">
            Ranking pessoal
          </p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">{myProfile.ranking}</h2>
              <p className="mt-1 font-semibold text-white/58">
                {myProfile.beijoChecks} BeijoChecks · Só conta com confirmação mútua.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ShareProfileRankingActions
              user={users[0]}
              position={18}
              triggerLabel="Compartilhar"
              compact
            />
            <Link
              to="/ranking"
              className="grid h-10 place-items-center rounded-full border border-white/14 text-sm font-black"
            >
              Ver ranking
            </Link>
          </div>
        </section>
        <section className="mt-5 rounded-[1.8rem] border border-white/10 bg-white/6 p-4">
          <h2 className="text-2xl font-black">Segurança</h2>
          <div className="mt-3 grid gap-2 text-sm font-bold text-white/68">
            <p>
              <ShieldCheck className="mr-2 inline h-4 w-4" />
              Confirmação mútua ativa.
            </p>
            <p>
              <EyeOff className="mr-2 inline h-4 w-4" />
              Você controla sua visibilidade.
            </p>
            <p>18+ · Sem conteúdo explícito.</p>
          </div>
        </section>
      </section>
      {editing && <EditProfileSheet onClose={() => setEditing(false)} />}
    </AppShell>
  );
}
function ActionCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <article className="flex items-center gap-4 rounded-[1.65rem] bg-white/8 p-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center text-4xl font-black text-red-300">
        {icon}
      </span>
      <div className="min-w-0">
        <h3 className="text-xl font-black">{title}</h3>
        <p className="mt-1 text-sm font-semibold text-white/58">{text}</p>
      </div>
      <Plus className="ml-auto h-6 w-6 text-white/44" />
    </article>
  );
}
function EditProfileSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 px-3 pb-[calc(.75rem+env(safe-area-inset-bottom))] backdrop-blur">
      <section
        role="dialog"
        aria-label="Editar info"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[2rem] bg-zinc-950 p-4 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black">Editar info</h2>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10"
          >
            <X />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 rounded-full bg-white/8 p-1 text-center text-sm font-black">
          <button className="rounded-full bg-white py-2 text-red-600">Editar</button>
          <button>Visualizar</button>
        </div>
        <h3 className="mt-5 text-xl font-black">Mídia</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white/8"
            >
              {myProfile.photos[index] ? (
                <img
                  src={myProfile.photos[index]}
                  alt="Mídia"
                  className="h-full w-full object-cover"
                />
              ) : (
                <button className="grid h-full w-full place-items-center">
                  <Plus />
                </button>
              )}{" "}
              {myProfile.photos[index] && (
                <button className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
        <h3 className="mt-5 text-xl font-black">Bio</h3>
        <div className="mt-3 grid gap-3">
          {[
            "Nome",
            "Idade",
            "Cidade",
            "Região",
            "Evento preferido",
            "Interesses",
            "Estilo de vida",
          ].map((label) => (
            <label key={label} className="grid gap-1 text-sm font-black text-white/60">
              {label}
              <input
                className="h-12 rounded-2xl border border-white/10 bg-white/8 px-4 text-white"
                defaultValue={label === "Nome" ? myProfile.name : ""}
              />
            </label>
          ))}
        </div>
        <h3 className="mt-5 text-xl font-black">Ranking e segurança</h3>
        <div className="mt-3 rounded-2xl bg-white/8 p-4 text-sm font-bold text-white/68">
          <Camera className="mr-2 inline h-4 w-4" />
          Mostrar ranking · cidade visível · confirmação mútua · 18+.
        </div>
      </section>
    </div>
  );
}
