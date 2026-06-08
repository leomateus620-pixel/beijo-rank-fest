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
  photos: string[];
  interests: string[];
  distance: string;
  localHighlight: string;
  privacy: "visível" | "oculto" | "somente matches";
  confirmationStatus: "confirmado" | "aguardando" | "novo";
  badges: string[];
};

export type BeijoEvent = {
  id: number;
  name: string;
  city: string;
  date: string;
  kisses: number;
  activeUsers: number;
  ranking: string;
  vibe: string;
  gradient: string;
  status: "ativo" | "em breve" | "encerrado";
  participants: number;
  venue: string;
  livePosition: string;
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
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80",
    ],
    bio: "Competitiva no ranking, leve na pista e sempre confirmando tudo no app.",
    matches: 42,
    interests: ["Pop", "Glow party", "Fotos", "Ranking local"],
    distance: "1,2 km",
    localHighlight: "#1 em Santa Rosa",
    privacy: "visível",
    confirmationStatus: "confirmado",
    badges: ["Campeã da semana", "Confirmação mútua", "Em alta hoje"],
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
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=80",
    ],
    bio: "Rei dos eventos universitários e presença confirmada nos rankings locais.",
    matches: 38,
    interests: ["Universitário", "Sertanejo", "After", "Desafios"],
    distance: "2,8 km",
    localHighlight: "Subiu 2 posições",
    privacy: "somente matches",
    confirmationStatus: "aguardando",
    badges: ["Popular", "Ranking validado", "Novo destaque"],
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
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    ],
    bio: "Entrou faz pouco e já virou assunto nos eventos da região.",
    matches: 31,
    interests: ["Rodeio", "Dança", "Amigos", "Festival"],
    distance: "4,1 km",
    localHighlight: "Rising do evento",
    privacy: "visível",
    confirmationStatus: "novo",
    badges: ["Rising", "Em alta hoje", "Evento em alta"],
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
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
    ],
    bio: "Curte eventos ao ar livre, badges e disputas saudáveis com os amigos.",
    matches: 27,
    interests: ["Sunset", "Open air", "Eletrônico", "Viagem"],
    distance: "6,5 km",
    localHighlight: "Top social",
    privacy: "oculto",
    confirmationStatus: "confirmado",
    badges: ["Top social", "Perfil protegido", "Confirmação mútua"],
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
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80",
    ],
    bio: "Gosta do pódio, mas gosta mais de criar histórias boas pra contar.",
    matches: 24,
    interests: ["Festival", "Rock", "Competição", "Stories"],
    distance: "8,3 km",
    localHighlight: "#2 no evento",
    privacy: "visível",
    confirmationStatus: "aguardando",
    badges: ["Evento em alta", "Ranking validado", "Subiu hoje"],
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
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=900&q=80",
    ],
    bio: "Radar ligado nos eventos em alta e nos matches com boa energia.",
    matches: 35,
    interests: ["Club", "Pop funk", "Amizades", "Noite"],
    distance: "3,4 km",
    localHighlight: "Viralizando",
    privacy: "somente matches",
    confirmationStatus: "confirmado",
    badges: ["Destaque da cidade", "Em alta hoje", "18+ verificado"],
  },
];

export const events: BeijoEvent[] = [
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
    status: "ativo",
    participants: 184,
    venue: "Arena Glow",
    livePosition: "Ranking ao vivo",
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
    status: "em breve",
    participants: 128,
    venue: "Centro Acadêmico",
    livePosition: "Pré-ranking aberto",
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
    status: "em breve",
    participants: 96,
    venue: "Parque Municipal",
    livePosition: "Top 10 aquecido",
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
    status: "ativo",
    participants: 88,
    venue: "Deck Sunset",
    livePosition: "Ao vivo agora",
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
    status: "em breve",
    participants: 79,
    venue: "Praça Central",
    livePosition: "Entradas abertas",
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
    status: "encerrado",
    participants: 71,
    venue: "Club 22",
    livePosition: "Ranking final",
  },
];

export const activeEvent = events[0];

export const myRankingPosition = {
  name: "Você",
  city: "Santa Rosa",
  event: activeEvent.name,
  position: 18,
  points: 220,
  change: 2,
  nextTarget: "faltam 34 pts para o Top 15",
  badge: "Novo destaque",
};

export const metrics = [
  {
    label: "BeijoChecks hoje",
    value: "1.248",
    delta: "+18%",
    icon: "💋",
    tone: "from-red-500 to-rose-600",
  },
  {
    label: "Confirmados",
    value: "86%",
    delta: "mútuos",
    icon: "✅",
    tone: "from-orange-400 to-red-500",
  },
  {
    label: "Eventos ativos",
    value: "42",
    delta: "+7",
    icon: "🎟️",
    tone: "from-amber-400 to-orange-500",
  },
];

export const weeklyEvolution = [
  { day: "Seg", beijos: 680, cidade: 240 },
  { day: "Ter", beijos: 740, cidade: 280 },
  { day: "Qua", beijos: 860, cidade: 310 },
  { day: "Qui", beijos: 790, cidade: 300 },
  { day: "Sex", beijos: 1280, cidade: 520 },
  { day: "Sáb", beijos: 1640, cidade: 690 },
  { day: "Dom", beijos: 1248, cidade: 480 },
];

export const cityComparison = [
  { name: "Santa Rosa", pontos: 248 },
  { name: "Horizontina", pontos: 192 },
  { name: "Três de Maio", pontos: 164 },
  { name: "Ijuí", pontos: 121 },
  { name: "Santo Ângelo", pontos: 117 },
  { name: "Porto Alegre", pontos: 103 },
];

export const beijoCheckSteps = [
  {
    title: "Escolher pessoa ou evento",
    desc: "Encontre quem participou do momento ou vincule ao evento ativo.",
  },
  {
    title: "Confirmar contexto",
    desc: "Cidade, evento e privacidade ficam claros antes do envio.",
  },
  {
    title: "Enviar solicitação",
    desc: "A outra pessoa recebe uma confirmação simples e segura.",
  },
  {
    title: "Aguardar confirmação",
    desc: "Só entra no ranking quando os dois confirmam.",
  },
  {
    title: "Pontuar no ranking",
    desc: "BeijoCheck confirmado gera pontos na cidade, evento e região.",
  },
];
