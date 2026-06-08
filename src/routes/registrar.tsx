import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
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
import { Camera, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { recordKiss } from "@/lib/kisses.functions";
import { myParties } from "@/lib/parties.functions";

export const Route = createFileRoute("/registrar")({
  head: () => ({ meta: [{ title: "Registrar beijo — BeijoCheck" }] }),
  component: Registrar,
});

function Registrar() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [partner, setPartner] = useState("");
  const [partyId, setPartyId] = useState<string>("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      toast.error("Manda uma selfie 📸");
      return;
    }
    if (!city.trim()) {
      toast.error("Qual a cidade?");
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
      toast.success("Beijo registrado! 💋");
      navigate({ to: "/perfil" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  if (!authChecked) return null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold">Novo beijo 💋</h1>
        <p className="text-muted-foreground mt-2">Manda a selfie. Sem ela não conta.</p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <div>
            <Label className="font-semibold mb-2 block">Selfie do beijo *</Label>
            <label className="relative block aspect-square rounded-3xl border-2 border-dashed border-primary/40 bg-card hover:border-primary cursor-pointer overflow-hidden transition-colors">
              {preview ? (
                <img src={preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Camera className="w-12 h-12 text-primary" />
                  <span className="font-semibold">Toque para tirar/escolher</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={onFile}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          </div>

          <div>
            <Label htmlFor="city" className="font-semibold mb-2 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> Cidade *
            </Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Rio de Janeiro"
              className="rounded-2xl bg-card h-12"
              required
              maxLength={80}
            />
          </div>

          <div>
            <Label htmlFor="party" className="font-semibold mb-2 block">
              Festa (opcional)
            </Label>
            <Select
              value={partyId || "none"}
              onValueChange={(v) => setPartyId(v === "none" ? "" : v)}
            >
              <SelectTrigger className="rounded-2xl bg-card h-12">
                <SelectValue placeholder="Sem festa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem festa</SelectItem>
                {(parties?.parties ?? []).map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Não tem?{" "}
              <Link to="/festas" className="text-primary">
                Criar ou entrar →
              </Link>
            </p>
          </div>

          <div>
            <Label htmlFor="partner" className="font-semibold mb-2 block">
              Apelido do par (opcional)
            </Label>
            <Input
              id="partner"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              placeholder="Ex: gato da pista"
              className="rounded-2xl bg-card h-12"
              maxLength={40}
            />
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-card border border-border/60 p-4">
            <div>
              <div className="font-semibold">Foto pública</div>
              <div className="text-xs text-muted-foreground">Por padrão, só você vê a selfie.</div>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="w-full rounded-full bg-gradient-lipstick text-primary-foreground h-14 text-base font-bold"
          >
            {submitting ? "Registrando..." : "Registrar beijo 💋"}
          </Button>
        </form>
      </main>
    </div>
  );
}
