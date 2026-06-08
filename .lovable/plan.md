# BeijoCheck — Plano

App divertido onde usuários registram beijos com selfie, sobem em rankings por cidade, festa e entre amigos, e compartilham seus stats nas redes sociais.

## Visual
- Vibe **Romântico pop**: rosa (#fff0f5, #ffb3c6), batom (#ff4d6d), magenta profundo (#c9184a).
- Tipografia divertida com display marcante + corpo limpo.
- Botões arredondados, ícones de beijo/lábios, micro-animações de coração.

## Telas
1. **Landing pública (/)** — pitch, ranking público em destaque (top 10 global), CTA "Entrar com Google", botão compartilhar.
2. **/auth** — login com Google (Lovable Cloud).
3. **/feed** (autenticado) — registrar novo beijo (botão grande), feed dos próprios registros.
4. **/registrar** — formulário: selfie obrigatória (upload), cidade (auto via geolocalização + edit), festa opcional (selecionar/criar), apelido do par opcional, toggle "público/privado".
5. **/ranking** — abas: Cidade · Festa · Amigos · Global. Cards com avatar, apelido, total de beijos, badge da posição.
6. **/festa/$id** — página da festa: nome, local, ranking exclusivo, botão "entrar na festa", botão compartilhar.
7. **/perfil/$id** — stats do usuário, badges, botão "compartilhar meu BeijoCard" (gera imagem para stories).
8. **/amigos** — adicionar amigos por username, ver ranking só do grupo.

## Funcionalidades-chave
- **Selfie como prova**: upload obrigatório no registro; armazenada em Storage privado por padrão, pública se usuário marcar.
- **Geolocalização**: detecta cidade via browser (com fallback manual).
- **Festas**: qualquer um cria; entrada por código curto ou QR.
- **Compartilhar**: gera card visual (canvas) com ranking/stats + botões nativos para Instagram Stories, WhatsApp, X.
- **Anti-spam**: rate limit (máx X registros/hora), validação de imagem (tamanho, é foto).

## Stack técnica (resumo)
- **Lovable Cloud** habilitado para auth, banco e storage.
- **Login Google** via broker Lovable + `supabase--configure_social_auth`.
- **Tabelas**:
  - `profiles` (id→auth.users, username, display_name, avatar_url, city, created_at)
  - `parties` (id, name, code, city, created_by, starts_at, ends_at)
  - `party_members` (party_id, user_id)
  - `friendships` (user_id, friend_id, status)
  - `kisses` (id, user_id, partner_nickname, city, party_id?, photo_path, is_public, created_at)
- **Storage**: bucket `kiss-photos` (privado por padrão; URLs assinadas; públicas só quando `is_public=true`).
- **Rankings**: views/funções SQL agregando `count(*)` por cidade/festa/grupo com período (dia/semana/total).
- **RLS**: usuário só edita seus próprios beijos; leitura de rankings via server functions com `supabaseAdmin` (projeção segura: só apelido, contagem, avatar — nunca foto privada).
- **Server functions** (`createServerFn`):
  - `recordKiss` (auth) — valida zod, insere, faz upload.
  - `getCityRanking`, `getPartyRanking`, `getFriendsRanking`, `getGlobalRanking` — públicas onde aplicável.
  - `createParty`, `joinParty`.
  - `generateShareCard` — devolve PNG do BeijoCard.
- **Rotas**: `/` pública; tudo que exige login sob `_authenticated/`.

## Confirmações pendentes
- Precisamos de um campo **username** no profile (sim por padrão, para mencionar amigos).
- Os beijos **mostram a foto publicamente no ranking**? Plano: **não** — ranking mostra só apelido + contagem; foto fica privada salvo opt-in explícito no registro.
- Período do ranking padrão: **semana atual** + filtro "tudo / hoje / semana / mês".

Posso seguir com esse plano?
