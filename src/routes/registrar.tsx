import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/beijocheck/brand";
import { BeijoCheckFlow, SafetyTrustBar } from "@/components/beijocheck/social";
import { beijoCheckSteps, events, users } from "@/data/beijocheck.mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Camera,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  MapPin,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { recordKiss } from "@/lib/kisses.functions";
import { myParties } from "@/lib/parties.functions";

export const Route = createFileRoute("/registrar")({
  head: () => ({ meta: [{ title: "Registrar BeijoCheck — BeijoCheck" }] }),
  component: Registrar,
});

function Registrar() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [city, setCity] = useState("Santa Rosa");
  const [partner, setPartner] = useState(users[1].name);
  const [partyId, setPartyId] = useState<string>("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mockStatus, setMockStatus] = useState<"rascunho" | "aguardando">("rascunho");

  const recordFn = useServerFn(recordKiss);
  const partiesFn = useServerFn(myParties);
  const { data: parties } = useQuery({
    queryKey: ["my-parties"],
    queryFn: () => partiesFn(),
    enabled: !!userId,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth", replace: true });
      else {
        setUserId(data.session.user.id);
        setAuthChecked(true);
      }
    });
  }, [navigate]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const r = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10`,
              { headers: { "Accept-Language": "pt-BR" } },
            );
            const j = await r.json();
            const c =
              j.address?.city || j.address?.town || j.address?.village || j.address?.municipality;
            if (c && !city) setCity(c);
          } catch {
            /* ignore */
          }
        },
        () => {},
        { timeout: 5000 },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) {
      toast.error("Foto até 8MB");
      return;
    }
    if (!f.type.startsWith("image/")) {
      toast.error("Só imagens");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !userId) {
      toast.error("Envie uma foto de contexto para validação 📸");
      return;
    }
    if (!city.trim()) {
      toast.error("Confirme a cidade");
      return;
    }
    setSubmitting(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().slice(0, 5);
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("kiss-photos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      await recordFn({
        data: {
          photo_path: path,
          city: city.trim(),
          party_id: partyId || null,
          partner_nickname: partner.trim() || null,
          is_public: isPublic,
        },
      });
      setMockStatus("aguardando");
      toast.success("Solicitação enviada. Aguardando confirmação mútua ✅");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  if (!authChecked) return null;

  return (
    <AppShell>
      <section className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-[2.1rem] bg-gradient-to-br from-red-600 via-rose-600 to-orange-400 p-6 text-white shadow-[0_28px_90px_rgba(225,29,72,.3)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[.24em] text-white/70">
            Registrar BeijoCheck
          </p>
          <h1 className="mt-2 text-5xl font-black leading-[.9] sm:text-6xl">
            Um fluxo guiado, seguro e mútuo
          </h1>
          <p className="mt-4 text-white/85">
            Registre o contexto, envie a solicitação e acompanhe o status. Só entra no ranking
            quando a outra pessoa confirma.
          </p>
          <div className="mt-6 rounded-[1.5rem] bg-white/15 p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              {mockStatus === "aguardando" ? (
                <Clock3 className="h-8 w-8" />
              ) : (
                <ShieldCheck className="h-8 w-8" />
              )}
              <div>
                <div className="font-black">
                  {mockStatus === "aguardando" ? "Aguardando confirmação" : "Pronto para enviar"}
                </div>
                <div className="text-sm text-white/75">
                  {mockStatus === "aguardando"
                    ? "Quando confirmado, pontua no ranking."
                    : "Sem exposição indevida e sem conteúdo explícito."}
                </div>
              </div>
            </div>
          </div>
        </div>
        <BeijoCheckFlow compact />
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={submit}
          className="space-y-5 rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(159,18,57,.08)] sm:p-6"
        >
          <StepTitle number="1" title="Selecionar pessoa ou evento" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="partner" className="mb-2 flex items-center gap-1 font-semibold">
                <UserRound className="h-4 w-4" /> Pessoa
              </Label>
              <Input
                id="partner"
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                placeholder="Nome ou apelido"
                className="h-12 rounded-2xl bg-white"
                maxLength={40}
              />
            </div>
            <div>
              <Label className="mb-2 block font-semibold">Evento</Label>
              <Select value={partyId} onValueChange={setPartyId}>
                <SelectTrigger className="h-12 rounded-2xl bg-white">
                  <SelectValue placeholder={events[0].name} />
                </SelectTrigger>
                <SelectContent>
                  {parties?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                  {events.map((event) => (
                    <SelectItem key={`mock-${event.id}`} value={`mock-${event.id}`}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <StepTitle number="2" title="Confirmar contexto" />
          <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
            <div>
              <Label htmlFor="city" className="mb-2 flex items-center gap-1 font-semibold">
                <MapPin className="h-4 w-4" /> Cidade
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Cidade"
                className="h-12 rounded-2xl bg-white"
              />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 p-4">
              <div>
                <div className="font-semibold">Ocultar do ranking</div>
                <div className="text-xs text-muted-foreground">Você controla a visibilidade.</div>
              </div>
              <Switch checked={!isPublic} onCheckedChange={(checked) => setIsPublic(!checked)} />
            </div>
          </div>

          <StepTitle number="3" title="Adicionar foto de contexto" />
          <label className="relative block aspect-[4/3] cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-red-200 bg-red-50 transition-colors hover:border-red-400">
            {preview ? (
              <img src={preview} alt="Prévia do contexto" className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Camera className="h-12 w-12 text-red-500" />
                <span className="font-semibold">Toque para tirar ou escolher uma foto</span>
                <span className="text-xs">
                  Sem conteúdo explícito. Use apenas contexto permitido.
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={onFile}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>

          <StepTitle number="4" title="Enviar solicitação de confirmação" />
          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="h-14 w-full rounded-full bg-gradient-lipstick text-base font-black text-white"
          >
            {submitting ? (
              "Enviando..."
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" /> Enviar BeijoCheck para confirmação
              </>
            )}
          </Button>
        </form>

        <aside className="space-y-5">
          <SafetyTrustBar />
          <div className="rounded-[1.8rem] border border-white/70 bg-white/82 p-5 shadow-[0_18px_50px_rgba(159,18,57,.08)]">
            <p className="text-xs font-black uppercase tracking-[.24em] text-red-500">
              Status visual
            </p>
            <div className="mt-4 space-y-3">
              {beijoCheckSteps.map((step, index) => (
                <div key={step.title} className="flex gap-3 rounded-2xl bg-red-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <div>
                    <div className="font-black">
                      Etapa {index + 1}: {step.title}
                    </div>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm font-bold text-orange-700">
              Status atual: aguardando confirmação da outra pessoa.
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}

function StepTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2 first:pt-0">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-lipstick text-sm font-black text-white">
        {number}
      </div>
      <h2 className="text-2xl font-black">{title}</h2>
    </div>
  );
}
