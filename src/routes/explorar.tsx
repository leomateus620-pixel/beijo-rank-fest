import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Icons, SafetyMiniBar } from "@/components/beijocheck/brand";
import { exploreCategories } from "@/data/beijocheck.mock";

export const Route = createFileRoute("/explorar")({
  head: () => ({ meta: [{ title: "Explorar — BeijoCheck" }] }),
  component: ExplorarPage,
});

function ExplorarPage() {
  return (
    <AppShell>
      <section className="space-y-5 text-white">
        <header className="pt-2">
          <p className="text-xs font-black uppercase tracking-[.22em] text-red-300">contextos</p>
          <h1 className="text-fluid-title mt-1">Explorar</h1>
          <p className="mt-2 max-w-sm text-sm font-semibold text-white/62">
            Escolha uma vibe, evento ou ranking para entrar.
          </p>
        </header>
        <div className="grid gap-4">
          {exploreCategories.map((card, index) => (
            <Link
              key={card.id}
              to={card.id === "regiao" ? "/ranking" : card.id === "eventos" ? "/eventos" : "/"}
              className="group relative min-h-[15.5rem] overflow-hidden rounded-[2rem] bg-zinc-900 card-shadow-premium"
            >
              <img
                src={card.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${card.tone}`} />
              <div className="absolute right-4 top-4 rounded-2xl border border-white/35 bg-black/30 px-3 py-1.5 text-sm font-black backdrop-blur">
                {card.count}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="rounded-full bg-white/14 px-3 py-1.5 text-[11px] font-black text-white backdrop-blur">
                  {card.badge}
                </span>
                <h2 className="mt-3 max-w-[15rem] text-4xl font-black leading-[.9] tracking-[-.05em]">
                  {card.title}
                </h2>
                <p className="mt-3 max-w-xs text-sm font-semibold text-white/78">{card.text}</p>
                {index === 0 && <SafetyMiniBar className="mt-3" />}
                <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-black text-red-600">
                  {card.cta}
                  <Icons.ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
