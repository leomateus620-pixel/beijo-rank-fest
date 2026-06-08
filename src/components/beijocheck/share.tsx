import { useRef, useState } from "react";
import {
  Download,
  Instagram,
  Loader2,
  MessageCircle,
  Music2,
  Share2,
  Sparkles,
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

export function ShareProfileRankingActions({
  user = defaultUser,
  position = user.rank,
  region = user.region || user.city,
  event = user.event,
  surface = "story",
  compact = false,
  className,
}: ShareProfileRankingPayload) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastMessage, setLastMessage] = useState("Pronto para gerar PNG premium 9:16.");
  const filename = `beijocheck-ranking-${slugify(user.name || String(user.id))}.png`;
  const shareText = `Estou em #${position} no ranking BeijoCheck de ${region} com ${user.kisses} BeijoChecks. Ranking por cidade, evento e região.`;

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
      setLastMessage(
        "PNG gerado com sucesso. Escolha Instagram, TikTok ou WhatsApp na tela de compartilhamento.",
      );
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
        setLastMessage("Compartilhamento nativo aberto. Selecione Instagram, TikTok ou WhatsApp.");
        return;
      }
      downloadBlob(blob, filename);
      if (channel === "whatsapp") {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText)}`,
          "_blank",
          "noopener,noreferrer",
        );
        setLastMessage(
          "Web Share API indisponível: PNG baixado e WhatsApp aberto com texto. Anexe a imagem manualmente.",
        );
      } else {
        setLastMessage(
          "Se o app não aparecer, baixe a imagem e publique manualmente no Instagram, TikTok ou WhatsApp.",
        );
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
    <div
      className={cn(
        "max-w-full rounded-[1.6rem] border border-white/70 bg-white/75 p-3 shadow-[0_18px_50px_rgba(159,18,57,.08)] backdrop-blur-xl",
        className,
      )}
    >
      <div
        className="pointer-events-none fixed -left-[120vw] top-0 z-[-1] opacity-100"
        aria-hidden="true"
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
      {!compact && (
        <div className="mb-3 flex items-center gap-2 px-1 text-sm font-black text-red-600">
          <Sparkles className="h-4 w-4" /> Exportar perfil + ranking em PNG
        </div>
      )}
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <Button
          onClick={() => shareNative("whatsapp")}
          disabled={isGenerating}
          className="min-w-0 rounded-full bg-green-600 px-3 font-black text-white hover:bg-green-700"
        >
          {isGenerating ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <MessageCircle className="mr-1 h-4 w-4" />
          )}{" "}
          WhatsApp
        </Button>
        <Button
          onClick={() => shareNative("instagram")}
          disabled={isGenerating}
          className="min-w-0 rounded-full bg-gradient-to-r from-fuchsia-600 to-orange-500 px-3 font-black text-white"
        >
          <Instagram className="mr-1 h-4 w-4" /> Instagram
        </Button>
        <Button
          onClick={() => shareNative("tiktok")}
          disabled={isGenerating}
          className="min-w-0 rounded-full bg-zinc-950 px-3 font-black text-white hover:bg-zinc-800"
        >
          <Music2 className="mr-1 h-4 w-4" /> TikTok
        </Button>
        <Button
          onClick={() => shareNative("system")}
          disabled={isGenerating}
          className="min-w-0 rounded-full bg-gradient-lipstick px-3 font-black text-white"
        >
          <Share2 className="mr-1 h-4 w-4" /> Sistema
        </Button>
        <Button
          onClick={download}
          disabled={isGenerating}
          variant="outline"
          className="col-span-2 min-w-0 rounded-full border-red-200 bg-white px-3 font-black text-red-600 sm:col-span-1"
        >
          <Download className="mr-1 h-4 w-4" /> Baixar PNG
        </Button>
      </div>
      <p className="mt-3 px-1 text-xs font-semibold leading-relaxed text-muted-foreground">
        {lastMessage} Instagram e TikTok na web não aceitam upload direto automático; use a folha
        nativa ou baixe o PNG.
      </p>
    </div>
  );
}
