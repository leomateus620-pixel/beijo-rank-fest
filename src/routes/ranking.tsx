import { createFileRoute } from "@tanstack/react-router";
import { AppShell, RankingList } from "@/components/beijocheck/brand";
import { ShareProfileRankingActions } from "@/components/beijocheck/share";
import { myRankingPosition, users } from "@/data/beijocheck.mock";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking — BeijoCheck" }] }),
  component: RankingPage,
});
function RankingPage() {
  return (
    <AppShell>
      <section className="text-white">
        <header className="pt-2">
          <p className="text-xs font-black uppercase tracking-[.22em] text-red-300">
            competitivo e compartilhável
          </p>
          <h1 className="text-fluid-title mt-1">Ranking</h1>
        </header>
        <section className="mt-5 rounded-[2rem] bg-white p-5 text-red-950 shadow-2xl">
          <p className="text-sm font-black uppercase tracking-[.2em] text-red-500">Minha posição</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-5xl font-black tracking-[-.06em]">
                #{myRankingPosition.position}
              </h2>
              <p className="font-bold text-red-950/60">Santa Rosa · Festa Neon</p>
              <p className="mt-2 text-sm font-black text-emerald-600">
                ↑ {myRankingPosition.change} posições · {myRankingPosition.nextTarget}
              </p>
            </div>
            <ShareProfileRankingActions
              user={users[0]}
              position={myRankingPosition.position}
              compact
            />
          </div>
        </section>
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">
          {["Cidade", "Evento", "Região"].map((tab, index) => (
            <button
              key={tab}
              className={`shrink-0 rounded-full px-5 py-3 text-sm font-black ${index === 0 ? "bg-white text-red-600" : "bg-white/8 text-white/58"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <section className="mt-5 rounded-[1.8rem] border border-white/10 bg-white/8 p-4">
          <h2 className="text-2xl font-black">Top 3 compacto</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {users.slice(0, 3).map((user, index) => (
              <div key={user.id} className="text-center">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={`mx-auto rounded-[1.2rem] object-cover ${index === 0 ? "h-28 w-full" : "mt-5 h-20 w-full"}`}
                />
                <b className="mt-2 block">
                  #{index + 1} {user.name}
                </b>
                <span className="text-xs font-bold text-white/50">{user.kisses} BC</span>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-5 text-red-950">
          <RankingList title="Lista compacta" />
        </div>
      </section>
    </AppShell>
  );
}
