export type PrivacyMode = "visível" | "oculto" | "somente matches";
export type ConfirmationStatus = "confirmado" | "aguardando" | "novo";

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
  privacy: PrivacyMode;
  confirmationStatus: ConfirmationStatus;
  badges: string[];
  intention: string;
  lifestyle: string[];
  onlineStatus: string;
  verified: boolean;
  mutualConfirmation: boolean;
  likedYou?: boolean;
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
  image: string;
  description: string;
};

export type ExploreCategory = {
  id: string;
  title: string;
  text: string;
  count: string;
  cta: string;
  image: string;
  tone: string;
  badge: string;
};

export type LikePreview = {
  id: number;
  user: BeijoUser;
  reason: string;
  blurred: boolean;
  section: "curtidas" | "beijochecks" | "destaques";
};

export type Conversation = {
  id: number;
  user: BeijoUser;
  lastMessage: string;
  time: string;
  status: "curtiu você" | "BeijoCheck pendente" | "confirmado" | "novo";
  unread?: number;
};

const p = (id: string, w = 1100) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;

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
    badge: "Top 10 Santa Rosa",
    status: "Destaque da cidade",
    avatar: p("photo-1494790108377-be9c29b29330"),
    photos: [
      p("photo-1494790108377-be9c29b29330"),
      p("photo-1512316609839-ce289d3eba0a"),
      p("photo-1508214751196-bcfd4ca60f91"),
      p("photo-1517841905240-472988babdf9"),
      p("photo-1524250502761-1ac6f2e30d43"),
    ],
    bio: "Leve na pista, direta no papo e sempre com confirmação mútua ativada.",
    matches: 42,
    interests: ["Pop", "Glow party", "Fotos", "Ranking local"],
    distance: "1,2 km",
    localHighlight: "#1 em Santa Rosa",
    privacy: "visível",
    confirmationStatus: "confirmado",
    badges: ["Confirmação mútua", "Festa Neon", "18+", "Top 10 Santa Rosa"],
    intention: "Algo leve, seguro e social",
    lifestyle: ["Socialmente", "Dança nos fins de semana", "Sem conteúdo explícito"],
    onlineStatus: "online agora",
    verified: true,
    mutualConfirmation: true,
    likedYou: true,
  },
  {
    id: 2,
    name: "Rafa",
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
    avatar: p("photo-1500648767791-00dcc994a43e"),
    photos: [
      p("photo-1500648767791-00dcc994a43e"),
      p("photo-1519085360753-af0119f7cbe7"),
      p("photo-1527980965255-d3b416303d12"),
      p("photo-1492562080023-ab3db95bfbce"),
    ],
    bio: "Eventos universitários, música alta e ranking sem exposição indevida.",
    matches: 38,
    interests: ["Universitário", "Sertanejo", "After", "Desafios"],
    distance: "2,8 km",
    localHighlight: "Subiu 2 posições",
    privacy: "somente matches",
    confirmationStatus: "aguardando",
    badges: ["Ranking validado", "Perto de mim", "Novo destaque"],
    intention: "Conhecer gente do evento",
    lifestyle: ["Café tarde", "After com amigos", "Controle de visibilidade"],
    onlineStatus: "online recentemente",
    verified: true,
    mutualConfirmation: true,
    likedYou: false,
  },
  {
    id: 3,
    name: "Mika",
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
    avatar: p("photo-1517841905240-472988babdf9"),
    photos: [
      p("photo-1517841905240-472988babdf9"),
      p("photo-1524250502761-1ac6f2e30d43"),
      p("photo-1515886657613-9f3515b0c78f"),
      p("photo-1534528741775-53994a69daeb"),
    ],
    bio: "Entrou agora e já virou assunto nos rankings da região.",
    matches: 31,
    interests: ["Rodeio", "Dança", "Amigos", "Festival"],
    distance: "4,1 km",
    localHighlight: "Rising do evento",
    privacy: "visível",
    confirmationStatus: "novo",
    badges: ["Em evento", "Top da região", "18+"],
    intention: "Apenas algo sério",
    lifestyle: ["Dança", "Pet friendly", "Confirma depois"],
    onlineStatus: "online recentemente",
    verified: false,
    mutualConfirmation: true,
    likedYou: true,
  },
  {
    id: 4,
    name: "Bia",
    age: 23,
    city: "Ijuí",
    region: "Missões",
    event: "After Sunset",
    rank: 4,
    kisses: 58,
    points: 580,
    growth: -2,
    badge: "Top social",
    status: "Perfil protegido",
    avatar: p("photo-1524504388940-b1c1722653e1"),
    photos: [
      p("photo-1524504388940-b1c1722653e1"),
      p("photo-1502823403499-6ccfcf4fb453"),
      p("photo-1529626455594-4ff0802cfb7e"),
      p("photo-1487412720507-e7ab37603c6f"),
    ],
    bio: "Sunset, amigos e ranking que eu posso esconder quando quiser.",
    matches: 27,
    interests: ["Sunset", "Open air", "Eletrônico", "Viagem"],
    distance: "6,5 km",
    localHighlight: "Top social",
    privacy: "oculto",
    confirmationStatus: "confirmado",
    badges: ["Controle de visibilidade", "After Sunset", "Confirmação mútua"],
    intention: "Conversas boas primeiro",
    lifestyle: ["Open air", "Sem pressa", "Cidade visível"],
    onlineStatus: "há 12 min",
    verified: true,
    mutualConfirmation: true,
  },
  {
    id: 5,
    name: "Theo",
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
    avatar: p("photo-1506794778202-cad84cf45f1d"),
    photos: [
      p("photo-1506794778202-cad84cf45f1d"),
      p("photo-1492562080023-ab3db95bfbce"),
      p("photo-1519345182560-3f2917c472ef"),
    ],
    bio: "Gosto do pódio, mas gosto mais de criar histórias boas.",
    matches: 24,
    interests: ["Festival", "Rock", "Competição", "Stories"],
    distance: "8,3 km",
    localHighlight: "#2 no evento",
    privacy: "visível",
    confirmationStatus: "aguardando",
    badges: ["Subiu hoje", "Ranking validado", "18+"],
    intention: "Entrar no evento certo",
    lifestyle: ["Rock", "Fotos", "Ranking aberto"],
    onlineStatus: "hoje",
    verified: false,
    mutualConfirmation: true,
  },
  {
    id: 6,
    name: "Cami",
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
    avatar: p("photo-1534528741775-53994a69daeb"),
    photos: [
      p("photo-1534528741775-53994a69daeb"),
      p("photo-1487412720507-e7ab37603c6f"),
      p("photo-1520813792240-56fc4a3765a7"),
      p("photo-1512316609839-ce289d3eba0a"),
    ],
    bio: "Radar ligado nos eventos em alta e nas conversas com boa energia.",
    matches: 35,
    interests: ["Club", "Pop funk", "Amizades", "Noite"],
    distance: "3,4 km",
    localHighlight: "Viralizando",
    privacy: "somente matches",
    confirmationStatus: "confirmado",
    badges: ["Destaque", "Em alta hoje", "18+ verificado"],
    intention: "Social sem pressão",
    lifestyle: ["Noite", "Amigos", "Privacidade"],
    onlineStatus: "online agora",
    verified: true,
    mutualConfirmation: true,
    likedYou: true,
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
    gradient: "from-rose-600 via-red-500 to-orange-400",
    status: "ativo",
    participants: 184,
    venue: "Arena Glow",
    livePosition: "Ranking ao vivo",
    image: p("photo-1514525253161-7a46d19cd819", 1200),
    description: "Ranking ao vivo em Santa Rosa",
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
    image: p("photo-1492684223066-81342ee5ff30", 1200),
    description: "Entre antes do ranking abrir",
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
    gradient: "from-red-700 via-orange-500 to-amber-400",
    status: "em breve",
    participants: 96,
    venue: "Parque Municipal",
    livePosition: "Top 10 aquecido",
    image: p("photo-1506744038136-46273834b3fb", 1200),
    description: "Ranking por região no fim de semana",
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
    image: p("photo-1507525428034-b723cf961d3e", 1200),
    description: "Open air com controle de visibilidade",
  },
];

export const activeEvent = events[0];

export const exploreCategories: ExploreCategory[] = [
  {
    id: "neon",
    title: "Festa Neon",
    text: "Ranking ao vivo em Santa Rosa",
    count: "248 ativos",
    cta: "Entrar",
    image: events[0].image,
    tone: "from-red-950/10 via-red-600/55 to-orange-500/75",
    badge: "Confirmação mútua",
  },
  {
    id: "serio",
    title: "Apenas algo sério",
    text: "Pessoas com a mesma intenção",
    count: "43 perfis",
    cta: "Ver vibe",
    image: p("photo-1529156069898-49953e39b3ac", 1200),
    tone: "from-purple-950/20 via-rose-700/50 to-red-500/75",
    badge: "18+",
  },
  {
    id: "top",
    title: "Top da cidade",
    text: "Quem está em alta perto de você",
    count: "Top 10",
    cta: "Abrir",
    image: p("photo-1517457373958-b7bdd4587205", 1200),
    tone: "from-black/25 via-red-700/50 to-orange-500/70",
    badge: "Perto de mim",
  },
  {
    id: "pendentes",
    title: "BeijoChecks pendentes",
    text: "Confirmações aguardando resposta",
    count: "8 pendentes",
    cta: "Confirmar",
    image: p("photo-1511795409834-ef04bbd61622", 1200),
    tone: "from-zinc-950/30 via-rose-700/55 to-pink-500/70",
    badge: "Privacidade",
  },
  {
    id: "regiao",
    title: "Ranking por região",
    text: "Veja os destaques do Noroeste",
    count: "6 cidades",
    cta: "Ver ranking",
    image: p("photo-1500530855697-b586d89ba3ee", 1200),
    tone: "from-red-950/20 via-red-700/45 to-amber-500/70",
    badge: "Controle",
  },
  {
    id: "eventos",
    title: "Eventos próximos",
    text: "Entre antes do ranking abrir",
    count: "12 eventos",
    cta: "Explorar",
    image: events[1].image,
    tone: "from-black/25 via-orange-700/45 to-red-500/75",
    badge: "Sem explícito",
  },
];

export const likePreviews: LikePreview[] = users.map((user, index) => ({
  id: user.id,
  user,
  reason: index % 2 === 0 ? "curtiu sua vibe" : "enviou interesse",
  blurred: index < 4,
  section: index < 2 ? "curtidas" : index < 4 ? "beijochecks" : "destaques",
}));

export const conversations: Conversation[] = [
  {
    id: 1,
    user: users[2],
    lastMessage: "Online recentemente, confirme se ainda faz sentido.",
    time: "2 min",
    status: "curtiu você",
    unread: 1,
  },
  {
    id: 2,
    user: users[0],
    lastMessage: "BeijoCheck pendente da Festa Neon.",
    time: "12 min",
    status: "BeijoCheck pendente",
    unread: 2,
  },
  {
    id: 3,
    user: users[3],
    lastMessage: "Fechado, só vale com confirmação mútua.",
    time: "1 h",
    status: "confirmado",
  },
  {
    id: 4,
    user: users[1],
    lastMessage: "Vou entrar no ranking do baile hoje.",
    time: "ontem",
    status: "novo",
  },
];

export const myProfile = {
  name: "Leo",
  age: 24,
  city: "Santa Rosa",
  region: "Noroeste RS",
  avatar: p("photo-1507003211169-0a1dd7228f2d"),
  verified: true,
  completion: 86,
  ranking: "#18 Santa Rosa · Festa Neon",
  beijoChecks: 128,
  photos: [
    p("photo-1507003211169-0a1dd7228f2d"),
    p("photo-1492562080023-ab3db95bfbce"),
    p("photo-1519345182560-3f2917c472ef"),
    p("photo-1519085360753-af0119f7cbe7"),
  ],
  bio: "Ranking com privacidade, evento certo e confirmação mútua.",
};

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
export const cityComparison = cities.map((name, index) => ({
  name,
  pontos: [248, 192, 164, 121, 117, 103][index],
}));
export const beijoCheckSteps = [
  { title: "Escolher pessoa ou evento", desc: "Contexto claro antes do interesse." },
  { title: "Enviar solicitação", desc: "A outra pessoa confirma no próprio app." },
  { title: "Pontuar no ranking", desc: "Só conta com confirmação mútua." },
];
