import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export function SiteHeader() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <span className="animate-kiss inline-block">💋</span>
          <span className="text-gradient-lipstick">BeijoCheck</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
          <Link to="/ranking" className="px-3 py-2 rounded-full hover:bg-secondary transition-colors" activeProps={{ className: "bg-secondary" }}>Ranking</Link>
          {authed && (
            <>
              <Link to="/registrar" className="px-3 py-2 rounded-full hover:bg-secondary transition-colors" activeProps={{ className: "bg-secondary" }}>Registrar</Link>
              <Link to="/festas" className="hidden sm:inline-block px-3 py-2 rounded-full hover:bg-secondary transition-colors" activeProps={{ className: "bg-secondary" }}>Festas</Link>
              <Link to="/amigos" className="hidden sm:inline-block px-3 py-2 rounded-full hover:bg-secondary transition-colors" activeProps={{ className: "bg-secondary" }}>Amigos</Link>
            </>
          )}
          {authed === false && (
            <Button asChild size="sm" className="rounded-full bg-gradient-lipstick text-primary-foreground hover:opacity-90">
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
          {authed && (
            <Button onClick={signOut} variant="ghost" size="sm" className="rounded-full">Sair</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
