import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { myStats } from "@/lib/kisses.functions";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "Meu perfil — BeijoCheck" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ display_name: string; username: string; avatar_url: string | null; city: string | null } | null>(null);
  const statsFn = useServerFn(myStats);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { navigate({ to: "/auth", replace: true }); return; }
      const { data: p } = await supabase.from("profiles").select("display_name, username, avatar_url, city").eq("id", data.session.user.id).maybeSingle();
      if (p) setProfile(p);
    });
  }, [navigate]);

  const { data: stats } = useQuery({ queryKey: ["my-stats"], queryFn: () => statsFn(), enabled: !!profile });

  function shareCard() {
    if (!profile || !stats) return;
    const text = `💋 BeijoCheck\n@${profile.username} já beijou ${stats.total} ${stats.total === 1 ? "pessoa" : "pessoas"} em ${stats.cities} ${stats.cities === 1 ? "cidade" : "cidades"}!\n\nEntra você também:`;
    const url = window.location.origin;
    if (navigator.share) navigator.share({ title: "Meu BeijoCard", text, url }).catch(() => {});
    else { navigator.clipboard.writeText(`${text} ${url}`); toast.success("Copiado!"); }
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="rounded-3xl bg-gradient-lipstick text-primary-foreground p-8 text-center">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white/40" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/30 mx-auto flex items-center justify-center text-4xl">💋</div>
          )}
          <h1 className="text-3xl font-bold mt-4">{profile.display_name}</h1>
          <p className="opacity-90">@{profile.username}</p>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: "Beijos", v: stats?.total ?? 0 },
              { label: "Cidades", v: stats?.cities ?? 0 },
              { label: "Festas", v: stats?.parties ?? 0 },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-black">{s.v}</div>
                <div className="text-xs opacity-80 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
          <Button onClick={shareCard} variant="secondary" className="rounded-full mt-8">
            <Share2 className="w-4 h-4 mr-1" /> Compartilhar BeijoCard
          </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Histórico</h2>
          {(stats?.recent ?? []).length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Sem beijos ainda. <Link to="/registrar" className="text-primary font-semibold">Bora começar 💋</Link></p>
          ) : (
            <ul className="space-y-2">
              {stats!.recent.map((k) => (
                <li key={k.id} className="rounded-2xl bg-card border border-border/60 p-4">
                  <div className="flex justify-between">
                    <div className="font-semibold">{k.partner_nickname || "Anônimo(a)"}</div>
                    <div className="text-xs text-muted-foreground">{new Date(k.created_at).toLocaleDateString("pt-BR")}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{k.city}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
