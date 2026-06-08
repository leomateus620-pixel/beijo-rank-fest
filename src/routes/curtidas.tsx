import { createFileRoute, Link } from "@tanstack/react-router";
import { LockKeyhole, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/beijocheck/brand";
import { likePreviews } from "@/data/beijocheck.mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/curtidas")({
  head: () => ({ meta: [{ title: "Curtidas — BeijoCheck" }] }),
  component: CurtidasPage,
});

function CurtidasPage() {
  return (
    <AppShell>
      <section className="text-white">
        <h1 className="text-fluid-title pt-2">Curtidas</h1>
        <div className="mt-7 grid grid-cols-3 items-center rounded-full border border-white/10 bg-white/5 p-1 text-center text-sm font-black text-white/46">
          <button className="rounded-full bg-white px-3 py-3 text-red-600">27 curtidas</button>
          <button>BeijoChecks</button>
          <button>Destaques</button>
        </div>
        <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto border-y border-white/10 px-4 py-4">
          <button className="grid h-11 w-14 shrink-0 place-items-center rounded-full border border-white/18">
            <SlidersHorizontal className="h-5 w-5" />
          </button>
          {["Perto de mim", "Com bio", "Em evento", "Top da região"].map((filter) => (
            <button
              key={filter}
              className="shrink-0 rounded-full border border-white/18 px-5 py-2.5 text-sm font-black text-white/58"
            >
              {filter}
            </button>
          ))}
        </div>
        <Section title="Pessoas que demonstraram interesse" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          {likePreviews.slice(0, 4).map((like) => (
            <LikePreviewCard key={like.id} like={like} />
          ))}
        </div>
        <Link
          to="/chat"
          className="sticky bottom-[6.8rem] z-20 mx-auto mt-5 block max-w-xs rounded-full bg-white px-5 py-4 text-center text-lg font-black text-zinc-950 shadow-2xl"
        >
          Ver curtidas agora
        </Link>
        <Section title="BeijoChecks aguardando confirmação" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          {likePreviews.slice(2, 6).map((like) => (
            <LikePreviewCard key={like.id} like={like} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
function Section({ title }: { title: string }) {
  return (
    <div className="mt-8 flex items-end justify-between">
      <h2 className="max-w-[15rem] text-3xl font-black leading-tight tracking-[-.04em]">{title}</h2>
      <Link to="/explorar" className="text-sm font-black text-white/68">
        Ver tudo ›
      </Link>
    </div>
  );
}
function LikePreviewCard({ like }: { like: (typeof likePreviews)[number] }) {
  return (
    <article className="relative aspect-[.78] overflow-hidden rounded-[1.6rem] bg-zinc-900">
      <img
        src={like.user.avatar}
        alt={like.user.name}
        className={cn("h-full w-full object-cover", like.blurred && "blur-md scale-110 opacity-80")}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/10 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-400" />
          <span className="text-xl font-black">{like.user.age}</span>
          {like.blurred && <LockKeyhole className="h-4 w-4 text-sky-300" />}
        </div>
        <p className="mt-1 text-sm font-black">{like.user.onlineStatus}</p>
        <button className="mt-3 w-full rounded-full bg-white/90 py-2 text-xs font-black text-red-600">
          {like.section === "beijochecks" ? "Confirmar" : "Ver curtida"}
        </button>
      </div>
    </article>
  );
}
