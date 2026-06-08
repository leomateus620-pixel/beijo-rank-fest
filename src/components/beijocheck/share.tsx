import { useEffect, useRef, useState } from "react";
import {
  Download,
  Instagram,
  Loader2,
  MessageCircle,
  Music2,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { toBlob } from "html-to-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BeijoUser } from "@/data/beijocheck.mock";
import { users } from "@/data/beijocheck.mock";
import { toast } from "sonner";

export type ShareSurface = "story" | "feed";

type ShareProfileRankingPayload = {
  user?: BeijoUser;
  position?: number;
  region?: string;
  event?: string;
  surface?: ShareSurface;
  compact?: boolean;
  className?: string;
  triggerLabel?: string;
};

const defaultUser = users[0];
const imagePlaceholder =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#e11d48"/><stop offset="1" stop-color="#fb923c"/></linearGradient></defs><rect width="1080" height="1080" fill="url(#g)"/><text x="540" y="560" text-anchor="middle" font-size="260" font-family="Arial, sans-serif">💋</text><text x="540" y="720" text-anchor="middle" fill="white" font-size="76" font-weight="900" font-family="Arial, sans-serif">BeijoCheck</text></svg>`,
  );

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function dataUrlToFile(blob: Blob, filename: string) {
  return new File([blob], filename, { type: "image/png" });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function ExportProfileRankingCard({
  user = defaultUser,
  position = user.rank,
  region = user.region || user.city,
  event = user.event,
  surface = "story",
}: ShareProfileRankingPayload) {
  const isFeed = surface === "feed";
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-gradient-to-br from-red-700 via-rose-600 to-orange-400 text-white shadow-2xl",
        isFeed ? "h-[1350px] w-[1080px]" : "h-[1920px] w-[1080px]",
      )}
    >
      <div className="absolute -left-48 -top-48 h-[560px] w-[560px] rounded-full bg-white/18 blur-[90px]" />
      <div className="absolute right-[-220px] top-[420px] h-[720px] w-[720px] rounded-full bg-orange-200/24 blur-[120px]" />
      <div className="absolute bottom-[-200px] left-[-80px] h-[560px] w-[560px] rounded-full bg-red-950/28 blur-[110px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,.24),transparent_28%),radial-gradient(circle_at_80%_65%,rgba(255,255,255,.16),transparent_32%)]" />

      <div className="relative z-10 flex h-full flex-col p-[72px]">
        <header className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="grid h-24 w-24 place-items-center rounded-[32px] bg-white text-5xl shadow-[0_32px_90px_rgba(127,29,29,.35)]">
              💋
            </div>
            <div>
              <div className="text-6xl font-black tracking-tight">BeijoCheck</div>
              <div className="mt-2 text-2xl font-extrabold text-white/76">
                Ranking por cidade, evento e região
              </div>
            </div>
          </div>
          <div className="rounded-full border border-white/35 bg-white/18 px-7 py-4 text-2xl font-black backdrop-blur-xl">
            Ranking atual
          </div>
        </header>

        <main className="mt-20 flex flex-1 flex-col">
          <section className="rounded-[72px] border border-white/35 bg-white/18 p-8 shadow-[0_44px_160px_rgba(127,29,29,.38)] backdrop-blur-2xl">
            <div
              className={cn(
                "overflow-hidden rounded-[56px] bg-red-950/20",
                isFeed ? "h-[540px]" : "h-[760px]",
              )}
            >
              <img
                src={user.photos?.[0] || user.avatar}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mt-8 flex items-end justify-between gap-8">
              <div className="min-w-0">
                <h2 className="break-words text-7xl font-black leading-none tracking-tight">
                  {user.name}, {user.age}
                </h2>
                <p className="mt-5 text-3xl font-bold text-white/82">
                  {user.city} · {region}
                </p>
                {event && (
                  <p className="mt-2 text-2xl font-bold text-white/72">Evento atual: {event}</p>
                )}
              </div>
              <div className="shrink-0 rounded-[36px] bg-white px-8 py-6 text-center text-red-600 shadow-2xl">
                <div className="text-7xl font-black leading-none">#{position}</div>
                <div className="mt-1 text-xl font-black uppercase tracking-wide">posição</div>
              </div>
            </div>
          </section>

          <section className="mt-10 grid grid-cols-2 gap-6">
            <div className="rounded-[44px] border border-white/28 bg-white/18 p-8 backdrop-blur-xl">
              <div className="text-8xl font-black leading-none">{user.kisses}</div>
              <div className="mt-3 text-2xl font-black text-white/78">BeijoChecks confirmados</div>
            </div>
            <div className="rounded-[44px] border border-white/28 bg-white/18 p-8 backdrop-blur-xl">
              <div className="text-4xl font-black leading-tight">
                {position <= 3 ? "Top da região" : user.badge}
              </div>
              <div className="mt-3 text-2xl font-black text-white/78">
                Em alta com confirmação mútua
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[44px] border border-white/25 bg-white/16 p-7 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-3xl font-black">Top 3 atual</h3>
              <span className="rounded-full bg-white/18 px-5 py-2 text-xl font-black">
                {region}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {users.slice(0, 3).map((rankedUser, index) => (
                <div key={rankedUser.id} className="rounded-[30px] bg-white/18 p-4 text-center">
                  <img
                    src={rankedUser.avatar}
                    alt={rankedUser.name}
                    className="mx-auto h-28 w-28 rounded-[28px] object-cover"
                  />
                  <div className="mt-3 text-3xl font-black">#{index + 1}</div>
                  <div className="truncate text-xl font-black text-white/85">{rankedUser.name}</div>
                </div>
              ))}
            </div>
          </section>

          {!isFeed && (
            <section className="mt-9 rounded-[44px] bg-white px-8 py-7 text-red-700 shadow-2xl">
              <div className="text-3xl font-black">Só conta com confirmação mútua</div>
              <div className="mt-2 text-2xl font-bold text-red-500">
                Perfil seguro, ranking validado e destaque por região.
              </div>
            </section>
          )}
        </main>

        <footer className="flex items-center justify-between gap-8 border-t border-white/25 pt-8">
          <div className="text-2xl font-bold text-white/76">
            Meu perfil está em destaque no BeijoCheck.
          </div>
          <div className="rounded-full bg-white/18 px-7 py-4 text-2xl font-black backdrop-blur-xl">
            beijocheck.app
          </div>
        </footer>
      </div>
    </div>
  );
}

function SharePreviewCard({
  user,
  position,
  region,
  event,
}: Required<Pick<ShareProfileRankingPayload, "user" | "position" | "region" | "event">>) {
  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[10rem] overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-red-700 via-rose-600 to-orange-400 p-3 text-white shadow-[0_24px_70px_rgba(190,18,60,.28)]">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between text-[10px] font-black">
          <span>💋 BeijoCheck</span>
          <span className="rounded-full bg-white/20 px-2 py-1">#{position}</span>
        </div>
        <img
          src={user.avatar}
          alt={user.name}
          className="mt-3 h-24 w-full rounded-[1rem] object-cover ring-2 ring-white/40"
        />
        <div className="mt-3 text-lg font-black leading-none">
          {user.name}, {user.age}
        </div>
        <div className="mt-1 text-[11px] font-bold text-white/80">
          {user.city} · {region}
        </div>
        <div className="mt-auto grid gap-2">
          <div className="rounded-2xl bg-white/16 p-2">
            <div className="text-2xl font-black">{user.kisses}</div>
            <div className="text-[9px] font-black uppercase text-white/70">BeijoChecks</div>
          </div>
          <div className="rounded-full bg-white px-2 py-1 text-center text-[10px] font-black text-red-600">
            {event} · Confirmação mútua
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShareProfileRankingActions({
  user = defaultUser,
  position = user.rank,
  region = user.region || user.city,
  event = user.event,
  surface = "story",
  compact = false,
  className,
  triggerLabel,
}: ShareProfileRankingPayload) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState("Pronto para gerar PNG premium 9:16.");
  const filename = `beijocheck-ranking-${slugify(user.name || String(user.id))}.png`;
  const shareText = `Estou em #${position} no ranking BeijoCheck de ${region} com ${user.kisses} BeijoChecks. Ranking por cidade, evento e região.`;
  const label = triggerLabel || (compact ? "Compartilhar" : "Compartilhar ranking");

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  async function generateBlob() {
    if (!exportRef.current) throw new Error("Card de exportação indisponível.");
    setIsGenerating(true);
    try {
      const blob = await toBlob(exportRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 1,
        backgroundColor: "#be123c",
        imagePlaceholder,
        skipFonts: true,
        fetchRequestInit: { cache: "force-cache" },
        width: surface === "feed" ? 1080 : 1080,
        height: surface === "feed" ? 1350 : 1920,
        style: { transform: "none" },
      });
      if (!blob) throw new Error("Não foi possível gerar o PNG.");
      setLastMessage("PNG gerado. Agora escolha o app ou baixe a imagem.");
      toast.success("PNG gerado com sucesso");
      return blob;
    } finally {
      setIsGenerating(false);
    }
  }

  async function shareNative(channel?: "instagram" | "tiktok" | "whatsapp" | "system") {
    try {
      const blob = await generateBlob();
      const file = dataUrlToFile(blob, filename);
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({
          files: [file],
          title: "Meu ranking BeijoCheck",
          text:
            channel === "whatsapp"
              ? `Veja meu ranking no BeijoCheck: Top ${position} em ${region} com ${user.kisses} BeijoChecks.`
              : shareText,
        });
        setLastMessage("Folha nativa aberta. Selecione Instagram, TikTok ou WhatsApp.");
        return;
      }
      downloadBlob(blob, filename);
      if (channel === "whatsapp") {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText)}`,
          "_blank",
          "noopener,noreferrer",
        );
        setLastMessage("PNG baixado e WhatsApp aberto. Anexe a imagem manualmente.");
      } else {
        setLastMessage("PNG baixado. Publique manualmente no Instagram, TikTok ou WhatsApp.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao gerar compartilhamento.";
      setLastMessage(message);
      toast.error(message);
    }
  }

  async function download() {
    try {
      const blob = await generateBlob();
      downloadBlob(blob, filename);
      setLastMessage(`Download iniciado: ${filename}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao baixar PNG.";
      setLastMessage(message);
      toast.error(message);
    }
  }

  return (
    <div className={cn("min-w-0", className)}>
      <div
        className="pointer-events-none fixed left-[-10000px] top-0 z-[-10] h-[1920px] w-[1080px] overflow-hidden opacity-100 [contain:layout_paint_size]"
        aria-hidden="true"
        data-export-card="beijocheck-ranking"
      >
        <div ref={exportRef}>
          <ExportProfileRankingCard
            user={user}
            position={position}
            region={region}
            event={event}
            surface={surface}
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full rounded-full bg-gradient-lipstick font-black text-white shadow-[0_14px_34px_rgba(225,29,72,.2)] transition active:scale-[.98]",
          compact ? "h-10 px-4 text-sm" : "h-12 px-5",
        )}
      >
        <Share2 className="mr-2 h-4 w-4" /> {label}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center px-3 pb-[calc(.75rem+env(safe-area-inset-bottom))] pt-8 sm:items-center">
          <button
            type="button"
            aria-label="Fechar compartilhamento"
            className="absolute inset-0 bg-red-950/28 backdrop-blur-[6px]"
            onClick={() => setIsOpen(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Compartilhar ranking BeijoCheck"
            className="relative max-h-[min(88vh,42rem)] w-full max-w-md overflow-y-auto rounded-[2rem] border border-white/65 bg-white/82 p-4 shadow-[0_30px_120px_rgba(127,29,29,.36),inset_0_1px_0_rgba(255,255,255,.8)] backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-red-200 sm:hidden" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-[11px] font-black uppercase tracking-[.16em] text-red-600">
                  <Sparkles className="h-3.5 w-3.5" /> BeijoCard oficial
                </p>
                <h2 className="mt-3 text-2xl font-black leading-tight text-red-950">
                  Compartilhar posição
                </h2>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  Preview seguro. O PNG real é gerado fora da tela.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/75 text-red-600 shadow-sm transition hover:bg-red-50"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-[7.75rem_1fr] gap-3 max-[370px]:grid-cols-1">
              <SharePreviewCard user={user} position={position} region={region} event={event} />
              <div className="grid content-center gap-2">
                <ShareButton
                  label="WhatsApp"
                  icon={MessageCircle}
                  onClick={() => shareNative("whatsapp")}
                  disabled={isGenerating}
                  className="bg-green-600 text-white hover:bg-green-700"
                />
                <ShareButton
                  label="Instagram"
                  icon={Instagram}
                  onClick={() => shareNative("instagram")}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white"
                />
                <ShareButton
                  label="TikTok"
                  icon={Music2}
                  onClick={() => shareNative("tiktok")}
                  disabled={isGenerating}
                  className="bg-zinc-950 text-white hover:bg-zinc-800"
                />
                <ShareButton
                  label="Sistema"
                  icon={Share2}
                  onClick={() => shareNative("system")}
                  disabled={isGenerating}
                  className="bg-gradient-lipstick text-white"
                />
                <ShareButton
                  label="Baixar PNG"
                  icon={Download}
                  onClick={download}
                  disabled={isGenerating}
                  className="border border-red-200 bg-white text-red-600 hover:bg-red-50"
                />
              </div>
            </div>

            <p className="mt-4 rounded-2xl bg-red-50/80 p-3 text-xs font-semibold leading-relaxed text-red-900/75">
              {isGenerating && <Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />}
              {lastMessage} Instagram e TikTok usam a folha nativa do celular. Se não aparecer,
              baixe o PNG e publique manualmente.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

function ShareButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  className,
}: {
  label: string;
  icon: typeof Share2;
  onClick: () => void;
  disabled: boolean;
  className?: string;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn("h-11 justify-start rounded-2xl px-4 font-black", className)}
    >
      {disabled ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icon className="mr-2 h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
