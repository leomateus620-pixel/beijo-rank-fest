import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — BeijoCheck" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/registrar", replace: true });
    });
  }, [navigate]);

  async function signIn() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/registrar" });
    if (result.error) {
      toast.error("Não rolou o login. Tenta de novo?");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/registrar", replace: true });
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6 animate-kiss inline-block">💋</div>
        <h1 className="text-4xl font-bold">Entrar no <span className="text-gradient-lipstick">BeijoCheck</span></h1>
        <p className="mt-3 text-muted-foreground">Use sua conta Google. Rapidinho.</p>
        <Button onClick={signIn} disabled={loading} size="lg" className="mt-8 w-full rounded-full bg-foreground text-background hover:opacity-90 h-12">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {loading ? "Conectando..." : "Continuar com Google"}
        </Button>
        <p className="mt-8 text-xs text-muted-foreground">
          Ao entrar você concorda em beijar com responsabilidade 😘
        </p>
        <p className="mt-4 text-sm">
          <Link to="/" className="text-primary hover:underline">← Voltar</Link>
        </p>
      </main>
    </div>
  );
}
