import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserPlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { addFriend, listFriends, removeFriend } from "@/lib/kisses.functions";

export const Route = createFileRoute("/amigos")({
  head: () => ({ meta: [{ title: "Amigos — BeijoCheck" }] }),
  component: AmigosPage,
});

function AmigosPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState("");
  const addFn = useServerFn(addFriend);
  const listFn = useServerFn(listFriends);
  const removeFn = useServerFn(removeFriend);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth", replace: true });
      else setChecked(true);
    });
  }, [navigate]);

  const { data } = useQuery({ queryKey: ["friends"], queryFn: () => listFn(), enabled: checked });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    try {
      const f = await addFn({ data: { username: username.trim().replace(/^@/, "") } });
      toast.success(`Adicionou ${f.display_name} 💋`);
      setUsername("");
      qc.invalidateQueries({ queryKey: ["friends"] });
      qc.invalidateQueries({ queryKey: ["ranking", "friends"] });
    } catch (err) { toast.error(err instanceof Error ? err.message : "Erro"); }
  }

  async function rm(id: string) {
    await removeFn({ data: { friendId: id } });
    qc.invalidateQueries({ queryKey: ["friends"] });
    qc.invalidateQueries({ queryKey: ["ranking", "friends"] });
  }

  if (!checked) return null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Amigos</h1>
        <p className="text-muted-foreground mb-6">Adicione por @username pra disputar o ranking da turma.</p>

        <form onSubmit={add} className="flex gap-2 mb-8">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@username" className="rounded-full bg-card" />
          <Button type="submit" className="rounded-full bg-gradient-lipstick text-primary-foreground"><UserPlus className="w-4 h-4 mr-1" /> Adicionar</Button>
        </form>

        {(data?.friends ?? []).length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhum amigo ainda 😢</p>
        ) : (
          <ul className="space-y-2">
            {data!.friends.map((f) => (
              <li key={f.id} className="flex items-center gap-3 rounded-2xl bg-card border border-border/60 p-3">
                {f.avatar_url ? <img src={f.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center">💋</div>}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{f.display_name}</div>
                  <div className="text-xs text-muted-foreground">@{f.username}{f.city ? ` · ${f.city}` : ""}</div>
                </div>
                <Button onClick={() => rm(f.id)} variant="ghost" size="icon" className="rounded-full"><X className="w-4 h-4" /></Button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
