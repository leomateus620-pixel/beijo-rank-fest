import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createParty, joinPartyByCode, myParties } from "@/lib/parties.functions";

export const Route = createFileRoute("/festas")({
  head: () => ({ meta: [{ title: "Festas — BeijoCheck" }] }),
  component: FestasPage,
});

function FestasPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [checked, setChecked] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [code, setCode] = useState("");

  const createFn = useServerFn(createParty);
  const joinFn = useServerFn(joinPartyByCode);
  const partiesFn = useServerFn(myParties);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth", replace: true });
      else setChecked(true);
    });
  }, [navigate]);

  const { data } = useQuery({ queryKey: ["my-parties"], queryFn: () => partiesFn(), enabled: checked });

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const p = await createFn({ data: { name: name.trim(), city: city.trim() || undefined } });
      toast.success(`Festa criada! Código: ${p.code}`);
      setName(""); setCity("");
      qc.invalidateQueries({ queryKey: ["my-parties"] });
    } catch (err) { toast.error(err instanceof Error ? err.message : "Erro"); }
  }

  async function onJoin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const p = await joinFn({ data: { code: code.trim().toUpperCase() } });
      toast.success(`Entrou em ${p.name}!`);
      setCode("");
      qc.invalidateQueries({ queryKey: ["my-parties"] });
    } catch (err) { toast.error(err instanceof Error ? err.message : "Erro"); }
  }

  if (!checked) return null;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Festas</h1>
        <p className="text-muted-foreground mb-8">Crie uma festa ou entre em uma existente com o código.</p>

        <div className="grid md:grid-cols-2 gap-4">
          <form onSubmit={onCreate} className="rounded-3xl bg-card border border-border/60 p-6 space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2"><Sparkles className="text-primary w-5 h-5" /> Criar festa</h2>
            <div><Label>Nome *</Label><Input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} className="rounded-2xl mt-1" /></div>
            <div><Label>Cidade</Label><Input value={city} onChange={(e) => setCity(e.target.value)} maxLength={80} className="rounded-2xl mt-1" /></div>
            <Button type="submit" className="w-full rounded-full bg-gradient-lipstick text-primary-foreground">Criar</Button>
          </form>

          <form onSubmit={onJoin} className="rounded-3xl bg-card border border-border/60 p-6 space-y-4">
            <h2 className="font-bold text-lg">Entrar com código</h2>
            <div><Label>Código</Label><Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="EX: ABC123" maxLength={10} className="rounded-2xl mt-1 uppercase tracking-widest text-center font-bold" /></div>
            <Button type="submit" variant="outline" className="w-full rounded-full border-primary/40">Entrar</Button>
          </form>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4">Suas festas</h2>
        {(data?.parties ?? []).length === 0 ? (
          <p className="text-muted-foreground">Nenhuma festa ainda.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {data!.parties.map((p) => (
              <Link key={p.id} to="/festa/$code" params={{ code: p.code }} className="rounded-3xl bg-card border border-border/60 p-5 hover:border-primary/60 transition-colors">
                <div className="font-bold text-lg">{p.name}</div>
                {p.city && <div className="text-sm text-muted-foreground">{p.city}</div>}
                <div className="mt-2 text-xs font-mono bg-secondary inline-block px-2 py-1 rounded-full">{p.code}</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
