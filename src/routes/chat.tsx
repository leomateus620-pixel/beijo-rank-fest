import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, UserRoundCheck } from "lucide-react";
import { AppShell } from "@/components/beijocheck/brand";
import { conversations, users } from "@/data/beijocheck.mock";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chat — BeijoCheck" }] }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <AppShell>
      <section className="text-white">
        <div className="flex items-center justify-between pt-2">
          <h1 className="text-fluid-title">Chat</h1>
          <div className="flex rounded-full border border-white/10 bg-white/6 p-1">
            <button className="grid h-11 w-14 place-items-center rounded-full">
              <Shield />
            </button>
            <button className="grid h-11 w-14 place-items-center rounded-full bg-white/10">
              <UserRoundCheck />
            </button>
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-black tracking-[-.04em]">Novos matches</h2>
        <div className="no-scrollbar -mx-4 mt-4 flex gap-4 overflow-x-auto px-4 pb-2">
          <Link to="/curtidas" className="w-28 shrink-0 text-center">
            <div className="grid aspect-square place-items-center rounded-[1.6rem] border-4 border-yellow-300 bg-white/10 backdrop-blur">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-yellow-300 text-xl font-black text-zinc-950">
                27
              </span>
            </div>
            <b className="mt-2 block text-xl">Curtidas</b>
          </Link>
          {users.slice(0, 5).map((user) => (
            <div key={user.id} className="w-28 shrink-0 text-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="aspect-square rounded-[1.6rem] object-cover"
              />
              <b className="mt-2 block truncate text-xl">{user.name}</b>
            </div>
          ))}
        </div>
        <h2 className="mt-8 text-3xl font-black tracking-[-.04em]">Mensagens</h2>
        <div className="mt-4 divide-y divide-white/10">
          {conversations.map((item) => (
            <article key={item.id} className="flex items-center gap-4 py-4">
              <div className="relative shrink-0">
                <img
                  src={item.user.avatar}
                  alt={item.user.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <span className="absolute bottom-1 right-0 h-5 w-5 rounded-full border-4 border-zinc-950 bg-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-2xl font-black">{item.user.name}</h3>
                  <span className="shrink-0 rounded-md bg-yellow-300 px-2 py-1 text-[11px] font-black uppercase text-zinc-950">
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-lg font-semibold text-white/58">
                  {item.lastMessage}
                </p>
              </div>
              <button className="rounded-full bg-white px-3 py-2 text-xs font-black text-red-600">
                Abrir
              </button>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
