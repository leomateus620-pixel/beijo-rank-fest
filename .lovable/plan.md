## Objetivo
Permitir sair da conta de qualquer tela e voltar facilmente para a tela de login `/login`.

## Mudanças

1. **`src/components/beijocheck/brand.tsx` — header (AppShell)**
   - Trocar o "pill" estático do avatar (Lara · #1 Santa Rosa) por um menu (`DropdownMenu` do shadcn já presente) com:
     - Item "Meu perfil" → `/perfil`
     - Item "Sair da conta" → executa `supabase.auth.signOut()` + `toast` "Até já!" + `navigate({ to: "/login" })`
   - Visível em desktop (mantém o avatar). No mobile, o trigger aparece como ícone circular no header (substituindo nada — adicionar ao grupo de botões direito) para que o logout seja alcançável também no celular.

2. **`src/routes/perfil.tsx` — bloco "Conta"**
   - Adicionar no final do perfil um card sutil "Conta" com botão outline "Sair da conta" (mesmo handler). Garante descoberta clara para usuários mobile.

3. **`src/routes/login.tsx` (já existe)** — sem mudanças de UI.
   - Adicionar pequeno aviso no card: se chegar com `?signedout=1`, exibir toast "Você saiu da conta." (opcional, leve, sem ruído).

4. **Hydration mismatch incidental no `/` (EventLiveCard)**
   - Diagnóstico rápido: a classe da `<article>` muda entre SSR/cliente, provavelmente por `new Date()`/`Date.now()` ao computar "Acontecendo agora". Vou inspecionar `EventLiveCard` em `src/components/beijocheck/brand.tsx` e mover qualquer cálculo dependente de horário atual para um `useEffect` (estado inicializado vazio), eliminando o mismatch. Fora do escopo direto do pedido, mas resolvo no mesmo turno por estar no caminho.

## Não fazer
- Não criar nova rota.
- Não tocar em backend, RLS, ou auth middleware.
- Não esconder o avatar no desktop.
