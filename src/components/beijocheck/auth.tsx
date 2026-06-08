import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BeijoLogo } from "@/components/beijocheck/brand";
import { lovable } from "@/integrations/lovable/index";
import modeloRomantica from "@/assets/modelo-romantica.png.asset.json";
import modeloConfiante from "@/assets/modelo-confiante.png.asset.json";
import modeloDivertida from "@/assets/modelo-divertida.png.asset.json";
import modeloPoderosa from "@/assets/modelo-poderosa.png.asset.json";

type Slide = {
  name: string;
  image: string;
  headline: string;
  subtitle: string;
};

export const loginModels: Slide[] = [
  {
    name: "Romântica",
    image: modeloRomantica.url,
    headline: "Veja quem está em alta perto de você.",
    subtitle: "Explore perfis, eventos e rankings da sua região.",
  },
  {
    name: "Confiante",
    image: modeloConfiante.url,
    headline: "Entre no evento e acompanhe o ranking ao vivo.",
    subtitle: "Cidade, evento e região conectados em uma experiência social.",
  },
  {
    name: "Divertida",
    image: modeloDivertida.url,
    headline: "Só vale com confirmação mútua.",
    subtitle: "Mais segurança, privacidade e controle para interagir.",
  },
  {
    name: "Poderosa",
    image: modeloPoderosa.url,
    headline: "Compartilhe sua posição no ranking.",
    subtitle: "Transforme sua presença em destaque na sua cidade.",
  },
];

/* ---------------------------------- Hero ---------------------------------- */

export function LoginHeroCarousel({ className }: { className?: string }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = loginModels.length;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      setI((v) => (v + 1) % n);
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused, n]);

  // preload next
  useEffect(() => {
    const next = loginModels[(i + 1) % n];
    const img = new Image();
    img.src = next.image;
  }, [i, n]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) setI((v) => (v + (dx < 0 ? 1 : -1) + n) % n);
    touchX.current = null;
  };

  return (
    <div
      className={cn(
        "relative isolate w-full overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-[0_30px_70px_-30px_rgba(225,29,72,.35)]",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {loginModels.map((s, idx) => (
        <div
          key={s.name}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            idx === i ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden={idx !== i}
        >
          <img
            src={s.image}
            alt={s.name}
            loading={idx === 0 ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 pb-7 text-white sm:p-7">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
              <Sparkles className="h-3 w-3" /> BeijoCheck
            </span>
            <h2 className="mt-2 max-w-[22ch] text-balance font-display text-[clamp(1.35rem,4.6vw,2rem)] font-black leading-[1.1] drop-shadow-md">
              {s.headline}
            </h2>
            <p className="mt-1.5 max-w-[34ch] text-balance text-sm/relaxed text-white/85 drop-shadow">
              {s.subtitle}
            </p>
          </div>
        </div>
      ))}
      {/* dots */}
      <div className="absolute inset-x-0 top-3 z-10 flex justify-center gap-1.5">
        {loginModels.map((s, idx) => (
          <button
            key={s.name}
            type="button"
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              idx === i ? "w-7 bg-white" : "w-2.5 bg-white/55",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- Form ---------------------------------- */

type Mode = "signin" | "signup";

export function LoginGlassCard() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    id: "",
    password: "",
    city: "",
  });

  const onChange = useCallback(
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value })),
    [],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id || !form.password) {
      toast.error("Preencha seus dados para continuar");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 650));
    toast.success(mode === "signin" ? "Bem-vindo de volta!" : "Conta criada!");
    setLoading(false);
    navigate({ to: "/" });
  }

  async function onGoogle() {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/",
      });
      if (result.error) {
        toast.error("Não rolou o login. Tenta de novo?");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/" });
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="glass-login w-full max-w-[26rem] rounded-3xl p-5 sm:p-6">
      <AuthModeToggle mode={mode} onChange={setMode} />

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        {mode === "signup" && (
          <Field
            label="Nome"
            value={form.name}
            onChange={onChange("name")}
            placeholder="Como você quer aparecer"
            autoComplete="name"
          />
        )}
        <Field
          label="E-mail ou telefone"
          value={form.id}
          onChange={onChange("id")}
          placeholder="voce@beijocheck.com"
          autoComplete="username"
          inputMode="email"
        />
        <Field
          label="Senha"
          value={form.password}
          onChange={onChange("password")}
          placeholder="Mínimo 6 caracteres"
          type={showPwd ? "text" : "password"}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="rounded-full p-1.5 text-rose-700/70 hover:bg-rose-50"
              aria-label={showPwd ? "Esconder senha" : "Mostrar senha"}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        {mode === "signup" && (
          <Field
            label="Cidade"
            value={form.city}
            onChange={onChange("city")}
            placeholder="Sua cidade"
            autoComplete="address-level2"
          />
        )}

        {mode === "signin" && (
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs font-semibold text-rose-700/80 hover:text-rose-700"
              onClick={() => toast("Recuperação em breve")}
            >
              Esqueci minha senha
            </button>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-2xl bg-gradient-to-r from-red-500 via-rose-600 to-orange-500 text-base font-black tracking-tight text-white shadow-[0_14px_30px_-10px_rgba(225,29,72,.55)] hover:brightness-105"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {mode === "signin" ? "Entrar" : "Criar conta"}
        </Button>

        <div className="relative my-1 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700/50">
          <span className="h-px flex-1 bg-rose-200/70" />
          ou
          <span className="h-px flex-1 bg-rose-200/70" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onGoogle}
          disabled={googleLoading}
          className="h-11 w-full rounded-2xl border-white/80 bg-white/70 font-bold text-rose-900 backdrop-blur hover:bg-white"
        >
          {googleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleMark className="mr-2 h-4 w-4" />
          )}
          Entrar com Google
        </Button>

        <p className="pt-1 text-center text-xs text-rose-900/65">
          {mode === "signin" ? "Novo no BeijoCheck?" : "Já tem uma conta?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-black text-rose-700 underline-offset-2 hover:underline"
          >
            {mode === "signin" ? "Criar conta" : "Entrar"}
          </button>
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  rightSlot,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 ml-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-rose-900/65">
        {label}
      </span>
      <div className="relative">
        <input
          {...props}
          className={cn(
            "h-11 w-full rounded-2xl border border-white/80 bg-white/75 px-4 pr-11 text-[15px] text-rose-950 placeholder:text-rose-900/35 shadow-inner outline-none transition focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-400/25",
            props.className,
          )}
        />
        {rightSlot ? (
          <div className="absolute inset-y-0 right-1.5 flex items-center">{rightSlot}</div>
        ) : null}
      </div>
    </label>
  );
}

export function AuthModeToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/70 bg-white/55 p-1 text-sm font-bold">
      {(["signin", "signup"] as Mode[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={cn(
            "h-9 rounded-xl transition",
            mode === m
              ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow"
              : "text-rose-900/70 hover:text-rose-900",
          )}
        >
          {m === "signin" ? "Entrar" : "Criar conta"}
        </button>
      ))}
    </div>
  );
}

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.6 29.4 5 24 5 16.2 5 9.5 9 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 35 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.4 39.9 16.1 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.3 5.2C41 35.9 44 30.4 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

/* -------------------------------- Trust bar -------------------------------- */

export function LoginTrustBadges({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-semibold text-rose-900/70",
        className,
      )}
    >
      <Pill>18+</Pill>
      <Pill icon={<ShieldCheck className="h-3 w-3" />}>Só conta com confirmação mútua</Pill>
      <Pill>Sem conteúdo explícito</Pill>
    </div>
  );
}

function Pill({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/65 px-2.5 py-1 backdrop-blur">
      {icon}
      {children}
    </span>
  );
}

/* --------------------------------- Screen --------------------------------- */

export function LoginScreen() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <div className="bg-login relative min-h-[100dvh] overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-6rem] -z-0 h-80 w-80 rounded-full bg-rose-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-6rem] left-[-4rem] -z-0 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl"
      />

      <div
        className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col px-4 pb-6 sm:px-6"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 1rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)",
        }}
      >
        <header className="flex items-center justify-between gap-3">
          <BeijoLogo />
          <span className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-700 backdrop-blur">
            <ShieldCheck className="h-3 w-3" /> 18+ · Confirmação mútua
          </span>
        </header>

        <main className="mt-4 grid flex-1 items-center gap-6 lg:mt-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
          {/* Hero */}
          <div className="order-1 lg:order-1">
            <LoginHeroCarousel className="aspect-[3/4] max-h-[62dvh] w-full lg:aspect-auto lg:h-[78dvh] lg:max-h-none" />
          </div>

          {/* Form column */}
          <div className="order-2 flex flex-col items-center gap-4 lg:order-2 lg:items-start">
            <div className="hidden lg:block">
              <h1 className="text-balance font-display text-[clamp(1.75rem,2.4vw,2.4rem)] font-black leading-[1.05] text-rose-950">
                Descubra quem está em alta perto de você.
              </h1>
              <p className="mt-2 max-w-md text-rose-900/70">
                Explore perfis, entre em eventos e acompanhe sua posição no ranking.
              </p>
            </div>

            <LoginGlassCard />
            <LoginTrustBadges className="mt-1" />
            <p className="text-center text-[11px] text-rose-900/55 lg:text-left">
              Ao continuar, você aceita os Termos e a Política de Privacidade do BeijoCheck.
            </p>

            <p className="hidden text-[11px] text-rose-900/45 lg:block">
              © {year} BeijoCheck · Ranking por cidade, evento e região.
            </p>
          </div>
        </main>

        <footer className="mt-5 flex items-center justify-between gap-2 text-[11px] text-rose-900/55 lg:hidden">
          <span>© {year} BeijoCheck</span>
          <Link to="/" className="font-bold text-rose-700">
            Ver demo
          </Link>
        </footer>
      </div>
    </div>
  );
}
