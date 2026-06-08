export type BeijoUser = {
  id: number;
  name: string;
  age: number;
  city: string;
  region: string;
  event: string;
  rank: number;
  kisses: number;
  points: number;
  growth: number;
  badge: string;
  status: string;
  avatar: string;
  bio: string;
  matches: number;
};

export const cities = [
  "Santa Rosa",
  "Horizontina",
  "Três de Maio",
  "Santo Ângelo",
  "Ijuí",
  "Porto Alegre",
];
export const regions = ["Noroeste RS", "Missões", "Fronteira", "Metropolitana"];

export const users: BeijoUser[] = [
  {
    id: 1,
    name: "Lara",
    age: 22,
    city: "Santa Rosa",
    region: "Noroeste RS",
    event: "Festa Neon",
    rank: 1,
    kisses: 86,
    points: 860,
    growth: 18,
    badge: "Top 10",
    status: "Destaque da cidade",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bio: "Competitiva no ranking, leve na pista e sempre confirmando tudo no app.",
    matches: 42,
  },
  {
    id: 2,
    name: "Rafael",
    age: 24,
    city: "Horizontina",
    region: "Noroeste RS",
    event: "Baile Universitário",
    rank: 2,
    kisses: 72,
    points: 720,
    growth: 12,
    badge: "Campeão da semana",
    status: "Popular",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Rei dos eventos universitários e presença confirmada nos rankings locais.",
    matches: 38,
  },
  {
    id: 3,
    name: "Amanda",
    age: 21,
    city: "Três de Maio",
    region: "Noroeste RS",
    event: "Rodeio Regional",
    rank: 3,
    kisses: 64,
    points: 640,
    growth: 9,
    badge: "Rising",
    status: "Subindo rápido",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    bio: "Entrou faz pouco e já virou assunto nos eventos da região.",
    matches: 31,
  },
  {
    id: 4,
    name: "Bruna",
    age: 23,
    city: "Ijuí",
    region: "Missões",
    event: "After Sunset",
    rank: 4,
    kisses: 58,
    points: 580,
    growth: -2,
    badge: "Popular",
    status: "Top social",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    bio: "Curte eventos ao ar livre, badges e disputas saudáveis com os amigos.",
    matches: 27,
  },
  {
    id: 5,
    name: "Mateus",
    age: 25,
    city: "Santo Ângelo",
    region: "Missões",
    event: "Festa da Cidade",
    rank: 5,
    kisses: 51,
    points: 510,
    growth: 7,
    badge: "Evento em alta",
    status: "Confirmado",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    bio: "Gosta do pódio, mas gosta mais de criar histórias boas pra contar.",
    matches: 24,
  },
  {
    id: 6,
    name: "Camila",
    age: 22,
    city: "Porto Alegre",
    region: "Metropolitana",
    event: "Open Bar Night",
    rank: 6,
    kisses: 47,
    points: 470,
    growth: 15,
    badge: "Destaque da cidade",
    status: "Viralizando",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Radar ligado nos eventos em alta e nos matches com boa energia.",
    matches: 35,
  },
];

export const events = [
  {
    id: 1,
    name: "Festa Neon",
    city: "Santa Rosa",
    date: "Hoje, 22:00",
    kisses: 248,
    activeUsers: 184,
    ranking: "#1 na região",
    vibe: "Glow party",
    gradient: "from-rose-500 via-red-500 to-orange-400",
  },
  {
    id: 2,
    name: "Baile Universitário",
    city: "Horizontina",
    date: "Sex, 23:30",
    kisses: 192,
    activeUsers: 128,
    ranking: "#2 geral",
    vibe: "Campus night",
    gradient: "from-orange-500 via-rose-500 to-pink-500",
  },
  {
    id: 3,
    name: "Rodeio Regional",
    city: "Três de Maio",
    date: "Sáb, 20:00",
    kisses: 164,
    activeUsers: 96,
    ranking: "#1 Missões",
    vibe: "Regional",
    gradient: "from-red-600 via-orange-500 to-amber-400",
  },
  {
    id: 4,
    name: "After Sunset",
    city: "Ijuí",
    date: "Dom, 18:00",
    kisses: 121,
    activeUsers: 88,
    ranking: "Top sunset",
    vibe: "Open air",
    gradient: "from-pink-500 via-red-500 to-yellow-400",
  },
  {
    id: 5,
    name: "Festa da Cidade",
    city: "Santo Ângelo",
    date: "15 Jun",
    kisses: 117,
    activeUsers: 79,
    ranking: "Em alta",
    vibe: "Festival",
    gradient: "from-rose-600 via-orange-500 to-red-500",
  },
  {
    id: 6,
    name: "Open Bar Night",
    city: "Porto Alegre",
    date: "21 Jun",
    kisses: 103,
    activeUsers: 71,
    ranking: "Novo hit",
    vibe: "Club",
    gradient: "from-orange-400 via-red-500 to-rose-700",
  },
];

export const metrics = [
  {
    label: "Beijos hoje",
    value: "1.248",
    delta: "+18%",
    icon: "💋",
    tone: "from-red-500 to-rose-600",
  },
  {
    label: "Na semana",
    value: "8.704",
    delta: "+31%",
    icon: "🔥",
    tone: "from-orange-400 to-red-500",
  },
  {
    label: "Usuários ativos",
    value: "3.9k",
    delta: "+12%",
    icon: "✨",
    tone: "from-rose-500 to-pink-500",
  },
  {
    label: "Eventos ativos",
    value: "42",
    delta: "+7",
    icon: "🎟️",
    tone: "from-amber-400 to-orange-500",
  },
  {
    label: "Cidade líder",
    value: "Santa Rosa",
    delta: "248 pts",
    icon: "🏙️",
    tone: "from-red-600 to-orange-500",
  },
  {
    label: "Região destaque",
    value: "Noroeste",
    delta: "+22%",
    icon: "🏆",
    tone: "from-orange-500 to-rose-600",
  },
];

export const weeklyEvolution = [
  { day: "Seg", beijos: 680, cidade: 240 },
  { day: "Ter", beijos: 740, cidade: 280 },
  { day: "Qua", beijos: 860, cidade: 310 },
  { day: "Qui", beijos: 790, cidade: 300 },
  { day: "Sex", beijos: 1280, cidade: 520 },
  { day: "Sáb", beijos: 1640, cidade: 690 },
  { day: "Dom", beijos: 1210, cidade: 470 },
];

export const cityComparison = [
  { name: "Santa Rosa", pontos: 248 },
  { name: "Horizontina", pontos: 192 },
  { name: "Três de Maio", pontos: 164 },
  { name: "Ijuí", pontos: 121 },
  { name: "Santo Ângelo", pontos: 117 },
  { name: "POA", pontos: 103 },
];
