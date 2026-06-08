## Objetivo
Criar a rota `/login` do BeijoCheck com experiência premium mobile-first: hero de modelos em carrossel (fade), card de formulário liquid-glass, identidade BeijoCheck sutil e CTAs claros. A rota `/auth` atual (Google OAuth) é preservada e linkada como opção rápida; nada é removido.

## Escopo
- Frontend apenas. Sem mudanças de backend, schema ou Supabase.
- Não conectar login real ainda — `Entrar` e `Criar conta` fazem submit fake (loading 600ms) e redirecionam para `/`. Login Google permanece via `lovable.auth.signInWithOAuth` (igual `/auth`).
- Preservar `/auth` por compat; adicionar nova rota `/login`.

## Assets
- Subir as 4 imagens via `lovable-assets create` para `src/assets/login-modelo-{romantica,confiante,divertida,poderosa}.png.asset.json` (mantém binário fora do repo).
- Também criar a pasta `public/models/beijocheck/login/` com um README explicando como substituir por arquivos próprios; o código aceita ambos os caminhos via um array central `loginModels` em `src/components/beijocheck/auth.tsx`.

## Arquivos
- **Novo** `src/routes/login.tsx` — rota fina que monta `<LoginScreen />`.
- **Novo** `src/components/beijocheck/auth.tsx` — exporta:
  - `LoginScreen` (layout mobile coluna única / desktop split 2 colunas)
  - `LoginHeroCarousel` (fade auto 5s, pausa em hover/focus, indicadores 4 pontos, swipe touch)
  - `LoginModelSlide` (img `object-cover`, gradiente legibilidade, headline + subtitle)
  - `LoginGlassCard` (formulário, alterna `AuthModeToggle` Entrar/Criar conta)
  - `LoginTrustBadges` (18+ · Confirmação mútua · Sem conteúdo explícito)
- **Editar** `src/styles.css` — adicionar utilitário `.glass-login` (backdrop-blur 24px, bg branco/55%, borda branca/60%, sombra suave) e `.bg-login` (gradiente blush+laranja muito leve). Sem novos tokens semânticos globais.
- **Editar** `src/routes/auth.tsx` — adicionar link discreto "Ver nova tela" → `/login` (não obrigatório, só para descoberta).
- Sem novas dependências; usar `embla-carousel-react` se já existir, senão fade puro com `useState + setInterval` (preferido — menos peso).

## Componente: estrutura
```
LoginScreen
├─ header: BeijoLogo + selo "18+ · Confirmação mútua"
├─ mobile: <LoginHeroCarousel/> (h ~58dvh) → <LoginGlassCard/> → <LoginTrustBadges/>
└─ desktop (lg+): grid [1.1fr_.9fr]
     ├─ <LoginHeroCarousel/> full-bleed
     └─ stack: logo + headline + <LoginGlassCard/> + badges
```

## Conteúdo dos slides
Conforme spec: 4 slides (Romântica/Confiante/Divertida/Poderosa) com headline+subtitle exatos do brief.

## Formulário (mock)
- Modo Entrar: email/telefone + senha → "Entrar" (primário gradient red→orange) + "Esqueci minha senha" + link "Criar conta" alterna modo.
- Modo Criar conta: nome + email/telefone + senha + cidade → "Criar conta".
- Separador "ou" + botão "Entrar com Google" reutilizando `lovable.auth.signInWithOAuth("google", ...)` do padrão existente.
- Estados: focus ring red-500/40, loading no botão, erro inline simples.

## Carrossel (sem libs novas)
- `useEffect` com `setInterval(5000)` avança índice, pausa em `:hover` e quando aba fora de foco (`document.hidden`).
- Slides com `position:absolute inset-0` + `opacity` + `transition-opacity duration-700`.
- Touch swipe via handlers `onTouchStart/End` (>40px = trocar).
- Preload: `<link rel="preload" as="image">` injetado para próximo slide.

## Identidade (sutil)
- Fundo `.bg-login` (radial blush 8%, radial orange 6%, base branca).
- BeijoLogo no topo + heart watermark a 6% opacidade no canto.
- Sem corações decorativos espalhados, sem cards extras, sem dashboard.

## Responsividade
- Container `min-h-[100dvh]`, `overflow-x-hidden`, `pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`.
- Hero `aspect-[3/4]` em mobile com `max-h-[62dvh]`; desktop hero ocupa coluna esquerda 100% altura.
- Texto `clamp(1.5rem,5vw,2.25rem)` na headline; `text-balance` + `break-words`.
- Card glass `max-w-[26rem]` centralizado.

## Validação
- `npm run lint` + build automático.
- QA visual via `browser--view_preview` em 390x844 e 1440x900 (sem instalar Playwright extra).
- Checks: sem overflow X, CTA Entrar visível sem scroll, carrossel troca, glass legível, desktop split equilibrado.

## Não fazer
- Não remover `/auth`, `/registrar` nem qualquer rota.
- Não adicionar embla/framer se não estiverem instalados.
- Não tocar em `client.ts`, `types.ts`, `routeTree.gen.ts`, schema, edge functions.
- Não popular a tela com ranking/cards extras.
