import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BeijoLogo } from "@/components/beijocheck/brand";
import { users } from "@/data/beijocheck.mock";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BadgeCheck, Bell, LockKeyhole, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — BeijoCheck" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/", replace: true });
    });
  }, [navigate]);
  async function signIn() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/",
    });
    if (result.error) {
      toast.error("Não rolou o login. Tenta de novo?");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/", replace: true });
  }
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-5">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(244,63,94,.25),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(251,146,60,.24),transparent_30%),linear-gradient(135deg,#fff7f7,#fff,#fff1e8)]" />
      <div className="absolute left-1/2 top-16 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-red-300/25 blur-3xl" />
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <BeijoLogo />
        <Link
          to="/"
          className="rounded-full bg-white/70 px-4 py-2 text-sm font-black text-red-600 shadow-sm backdrop-blur"
        >
          Ver demo
        </Link>
      </header>
      <main className="mx-auto grid min-h-[calc(100vh-90px)] max-w-6xl items-center gap-8 py-8 lg:grid-cols-[1.05fr_.95fr]">
        <section className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-black text-red-600 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" /> Login premium com Google Auth
          </div>
          <h1 className="mt-6 text-5xl font-black leading-[.95] sm:text-7xl">
            Entre no app social que transforma confirmação em ranking.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Acesse seu perfil, acompanhe badges, participe de eventos e dispute rankings com uma
            interface segura, rápida e cheia de energia.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { i: Trophy, t: "Ranking viral", d: "Cidade, evento e região" },
              { i: BadgeCheck, t: "Confirmação mútua", d: "Pontuação com clareza" },
              { i: LockKeyhole, t: "Conta segura", d: "OAuth Google" },
            ].map(({ i: Icon, t, d }) => (
              <div
                key={t}
                className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur"
              >
                <Icon className="h-6 w-6 text-red-600" />
                <div className="mt-3 font-black">{t}</div>
                <div className="text-xs text-muted-foreground">{d}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-md rounded-[2.25rem] border border-white/80 bg-white/80 p-5 shadow-[0_30px_100px_rgba(159,18,57,.22)] backdrop-blur-2xl sm:p-7">
            <div className="absolute -right-4 -top-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-lipstick text-3xl text-white shadow-xl animate-kiss">
              💋
            </div>
            <div className="rounded-[1.75rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-400 p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black backdrop-blur">
                  BeijoPass
                </span>
                <Bell className="h-5 w-5" />
              </div>
              <h2 className="mt-10 text-4xl font-black">Bem-vindo ao BeijoCheck</h2>
              <p className="mt-2 text-white/85">
                Seu ranking, seus matches e seus eventos em uma só conta.
              </p>
              <div className="mt-5 flex -space-x-3">
                {users.slice(0, 4).map((u) => (
                  <img
                    key={u.id}
                    src={u.avatar}
                    alt={u.name}
                    className="h-11 w-11 rounded-full border-2 border-white object-cover"
                  />
                ))}
                <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-white bg-white/25 text-xs font-black">
                  +3k
                </div>
              </div>
            </div>
            <Button
              onClick={signIn}
              disabled={loading}
              size="lg"
              className="mt-5 h-14 w-full rounded-full bg-foreground text-base font-black text-background shadow-xl transition hover:-translate-y-0.5 hover:opacity-95"
            >
              <GoogleIcon />
              {loading ? "Conectando com Google..." : "Continuar com Google"}
            </Button>
            <div className="mt-5 rounded-3xl bg-red-50/80 p-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Experiência segura:</strong> não exibimos conteúdo
              explícito ou fotos de beijos; o foco é ranking social, avatares, badges e confirmação
              responsável.
            </div>
            <p className="mt-5 text-center text-xs text-muted-foreground">
              Ao entrar, você concorda em usar o BeijoCheck com respeito e responsabilidade.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
function GoogleIcon() {
  return (
    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
