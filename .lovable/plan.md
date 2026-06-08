# BeijoCheck — Refino Premium (sem reconstruir)

Vou **preservar** todas as rotas, features, mocks e a identidade do app. O foco é organizar, despoluir, melhorar mobile e adicionar profundidade visual leve.

## 1. Base visual e utilitários (`src/styles.css`)

- Reduzir uso espalhado de rosa; promover **vermelho controlado + laranja como acento + branco/cremes neutros** como superfícies.
- Novos tokens/utilitários:
  - `--shadow-elevated`, `--shadow-3d` (camadas duplas suaves).
  - `--glass-soft` (glassmorphism moderado, sem `-webkit-backdrop-filter` à mão).
  - `--gradient-ember` (vermelho→laranja contido).
- Utilitários `@utility`:
  - `card-3d` — perspectiva sutil + sombra dupla + brilho radial topo.
  - `tap-press` — `active:scale-[.98]` + transição.
  - `hover-lift` — `hover:-translate-y-0.5` + sombra elevada.
  - `safe-bottom` — `padding-bottom: max(env(safe-area-inset-bottom), 1rem) + nav offset`.
- Tipografia: `clamp` menor para `h1` em mobile, `line-height` controlado.

## 2. Componentes reutilizáveis (`src/components/beijocheck/ui.tsx` — novo)

Criar/centralizar (sem remover existentes):
- `PremiumCard` — wrapper com `card-3d`, brilho radial, variantes (`solid|glass|gradient`).
- `SmartLinkCard` — `PremiumCard` envolvido em `<Link>` com `to`/`params`.
- `MetricTile` — valor grande + label + delta colorido.
- `RankingMiniCard`, `EventSummaryCard`, `ProfileHighlightCard`, `AchievementCard`, `PremiumChartCard`.
- `SectionHeader` refinado (eyebrow menor, título com clamp).
- `EditableProfileHeader` — capa + avatar + bio editável em estado local.

## 3. BottomNav com safe-area (`src/components/beijocheck/brand.tsx`)

- Reescrever só a `BottomNav`/`AppShell` para usar `safe-bottom` + altura fixa, e aplicar `pb-[calc(var(--bnav-h)+env(safe-area-inset-bottom))]` no conteúdo. Nada fica coberto.

## 4. Telas (refator cirúrgico, não reescrita)

### `routes/index.tsx` (Home)
- Trocar headline para **"O ranking está rolando agora"**; subheadline curta.
- Reorganizar com novos componentes: minha posição, evento ativo, BeijoChecks, destaques próximos — todos como `SmartLinkCard`:
  - Minha posição → `/ranking`
  - Evento ao vivo → `/eventos`
  - Destaques próximos / cards de usuários → `/explorar?focus=<id>`
- Atalhos para Explorar/Ranking/Eventos/Perfil.
- Menos texto, mais hierarquia.

### `routes/explorar.tsx`
- Copy: "Radar da festa" / "Descubra quem está em alta no evento" / nova instrução curta.
- **Remover** o bloco "Fluxo do BeijoCheck" desta tela (manter no `/registrar`).
- Reduzir altura do card foto no mobile, suavizar idade/distância, encolher `SafetyTrustBar`, chips com `whitespace-nowrap`.
- Manter 100% das ações (curtir, check, salvar, modal, bloquear, denunciar, ocultar).
- Rótulo "Matches" → **"Confirmações"**.
- Suportar `?focus=<id>` para abrir modal vindo da Home.

### `routes/ranking.tsx`
- Pódio com profundidade 3D e alinhamento consistente.
- Card "Minha posição" usando `PremiumCard`, destacando pontos/BeijoChecks/crescimento.
- Tabela compacta: highlight do usuário logado, truncate com tooltip, melhor espaçamento mobile.
- Abas com estado ativo mais claro, menos rosa.

### `routes/eventos.tsx`
- Hero mais limpo, título com clamp.
- Cards de evento como `EventSummaryCard` (3D leve).
- "Rising do evento" → **"Subindo no evento"**; "Quem está movimentando a pista" → **"Destaques da pista"**.

### `routes/perfil.tsx`
- `EditableProfileHeader`: botão de editar foto (input file local), bio editável (estado local — sem backend novo).
- `AchievementCard` com camada de brilho.
- `PremiumChartCard` (Recharts): linha + gradiente de área + pontos destacados + tooltip customizado.
- Rótulo "Matches" → **"Confirmações"** na UI (mock intacto).

## 5. Correções de copy globais

Varredura em `src/`:
- "perfs" → "perfis"; "rankig/rankin/ranling" → "ranking"; "Perfl" → "Perfil".
- "Rising" (UI/badge/localHighlight em `beijocheck.mock.ts`) → **"Subindo"**.
- "Beijo Checks" → **"BeijoChecks"**.
- "Matches" em UI → **"Confirmações"**.
- Revisar acentos e textos longos em headers.

Mocks: ajustar apenas strings exibidas (badge/localHighlight/labels). Estrutura e campos preservados.

## 6. Responsividade

Validar em 375/390/430px e desktop:
- `overflow-x-hidden` no shell, `min-w-0` em grids.
- Padding-bottom global suficiente para BottomNav + safe-area.
- Chips/tabs `whitespace-nowrap` + scroll horizontal interno.
- Imagens com `object-cover` e aspect ratios corretos.

## 7. Efeitos visuais

Aplicados via utilitários (não por componente):
- `hover-lift` + `tap-press` em todos os cards/botões principais.
- `card-3d` nos cards de destaque (Home/Ranking/Eventos/Perfil).
- Glassmorphism moderado apenas em headers/overlays.

## 8. Validação final

Rodar e corrigir até passar:
```text
npm run lint
npm run build
npm run validate:mobile
npm run validate:export
```
QA visual via browser em desktop e 390px nas rotas: `/`, `/explorar`, `/ranking`, `/eventos`, `/perfil`.

## Detalhes técnicos

- Sem novas dependências.
- Tailwind v4: tokens em `@theme`, utilitários via `@utility`, sem `-webkit-backdrop-filter` manual.
- Sem mudanças no Supabase, server functions, schema, auth ou rotas.
- Repositório de referência `taste-skill` usado só como inspiração de padrões de cards/spacing — nenhum código copiado.

## Entrega

Relatório final com: arquivos alterados, melhorias por tela, comandos de validação executados e pendências (se houver).
