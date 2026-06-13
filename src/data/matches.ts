export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeShort: string;
  awayShort: string;
  homeScore: number;
  awayScore: number;
  matchTime: string;
  league: string;
  status: "live" | "upcoming" | "finished";
  date: string;
  homeColor: string;
  awayColor: string;
  homeLogo?: string;
  awayLogo?: string;
  stats?: {
    possession: [number, number];
    shots: [number, number];
    shotsOnTarget: [number, number];
    corners: [number, number];
    fouls: [number, number];
    yellowCards: [number, number];
    redCards: [number, number];
  };
  goals?: { player: string; minute: string; team: "home" | "away" }[];
  ticker?: { minute: string; event: string; detail: string }[];
  lineup?: {
    home: { name: string; number: number; position: string }[];
    away: { name: string; number: number; position: string }[];
  };
}

// Team logo mapping using API-Football CDN
export const teamLogos: Record<string, string> = {
  "Chelsea": "https://media.api-sports.io/football/teams/49.png",
  "Inter Milan": "https://media.api-sports.io/football/teams/505.png",
  "AC Milan": "https://media.api-sports.io/football/teams/489.png",
  "Man United": "https://media.api-sports.io/football/teams/33.png",
  "Manchester United": "https://media.api-sports.io/football/teams/33.png",
  "Bayern Munich": "https://media.api-sports.io/football/teams/157.png",
  "Barcelona": "https://media.api-sports.io/football/teams/529.png",
  "Real Madrid": "https://media.api-sports.io/football/teams/541.png",
  "PSG": "https://media.api-sports.io/football/teams/85.png",
  "Liverpool": "https://media.api-sports.io/football/teams/40.png",
  "Dortmund": "https://media.api-sports.io/football/teams/165.png",
  "Juventus": "https://media.api-sports.io/football/teams/496.png",
  "Atletico": "https://media.api-sports.io/football/teams/530.png",
  "Atletico Madrid": "https://media.api-sports.io/football/teams/530.png",
  "Arsenal": "https://media.api-sports.io/football/teams/42.png",
  "Napoli": "https://media.api-sports.io/football/teams/492.png",
  "Man City": "https://media.api-sports.io/football/teams/50.png",
  "Manchester City": "https://media.api-sports.io/football/teams/50.png",
  "Porto": "https://media.api-sports.io/football/teams/212.png",
  "Al-Nassr": "https://media.api-sports.io/football/teams/2939.png",
  "Inter Miami": "https://media.api-sports.io/football/teams/18627.png",
  "Tottenham": "https://media.api-sports.io/football/teams/47.png",
};

export function getTeamLogo(teamName: string): string | undefined {
  return teamLogos[teamName];
}

export const liveMatches: Match[] = [
  {
    id: "3",
    homeTeam: "Atletico Madrid",
    awayTeam: "Barcelona",
    homeShort: "ATL",
    awayShort: "BAR",
    homeScore: 2,
    awayScore: 1,
    matchTime: "65:00",
    league: "La Liga",
    status: "live",
    date: "Today",
    homeColor: "from-red-600 to-blue-900",
    awayColor: "from-blue-700 to-red-700",
    homeLogo: teamLogos["Atletico Madrid"],
    awayLogo: teamLogos["Barcelona"],
    stats: { possession: [44, 56], shots: [10, 12], shotsOnTarget: [5, 6], corners: [4, 7], fouls: [12, 8], yellowCards: [3, 1], redCards: [0, 0] },
    goals: [
      { player: "Griezmann", minute: "23'", team: "home" },
      { player: "Yamal", minute: "38'", team: "away" },
      { player: "Álvarez", minute: "58'", team: "home" },
    ],
    ticker: [
      { minute: "65'", event: "🏃 Play", detail: "Barcelona pushing for the equalizer" },
      { minute: "58'", event: "⚽ GOAL!", detail: "Julián Álvarez puts Atletico back in front!" },
      { minute: "38'", event: "⚽ GOAL!", detail: "Lamine Yamal equalizes for Barcelona!" },
      { minute: "23'", event: "⚽ GOAL!", detail: "Griezmann opens the scoring for Atletico!" },
    ],
  },
  {
    id: "1",
    homeTeam: "Chelsea",
    awayTeam: "Inter Milan",
    homeShort: "CHE",
    awayShort: "INT",
    homeScore: 3,
    awayScore: 1,
    matchTime: "50:10",
    league: "Champions League",
    status: "live",
    date: "Today",
    homeColor: "from-blue-600 to-blue-800",
    awayColor: "from-blue-900 to-black",
    homeLogo: teamLogos["Chelsea"],
    awayLogo: teamLogos["Inter Milan"],
    stats: { possession: [58, 42], shots: [14, 8], shotsOnTarget: [7, 3], corners: [6, 3], fouls: [9, 12], yellowCards: [1, 3], redCards: [0, 0] },
    goals: [
      { player: "Palmer", minute: "12'", team: "home" },
      { player: "Jackson", minute: "34'", team: "home" },
      { player: "Lautaro", minute: "41'", team: "away" },
      { player: "Mudryk", minute: "48'", team: "home" },
    ],
    ticker: [
      { minute: "50'", event: "⚽ GOAL!", detail: "Mudryk scores! Chelsea extend their lead!" },
      { minute: "48'", event: "🔄 Substitution", detail: "Enzo Fernandez comes on for Gallagher" },
      { minute: "45'", event: "⏱️ Half Time", detail: "Chelsea 2 - 1 Inter Milan" },
      { minute: "41'", event: "⚽ GOAL!", detail: "Lautaro Martinez pulls one back for Inter!" },
      { minute: "34'", event: "⚽ GOAL!", detail: "Jackson doubles Chelsea's lead!" },
      { minute: "25'", event: "🟨 Yellow Card", detail: "Barella receives a yellow for a foul" },
      { minute: "12'", event: "⚽ GOAL!", detail: "Palmer opens the scoring with a brilliant strike!" },
    ],
    lineup: {
      home: [
        { name: "Sanchez", number: 1, position: "GK" },
        { name: "James", number: 24, position: "RB" },
        { name: "Thiago Silva", number: 6, position: "CB" },
        { name: "Colwill", number: 26, position: "CB" },
        { name: "Cucurella", number: 3, position: "LB" },
        { name: "Caicedo", number: 25, position: "CM" },
        { name: "Gallagher", number: 23, position: "CM" },
        { name: "Palmer", number: 20, position: "RW" },
        { name: "Mudryk", number: 10, position: "LW" },
        { name: "Sterling", number: 17, position: "AM" },
        { name: "Jackson", number: 15, position: "ST" },
      ],
      away: [
        { name: "Sommer", number: 1, position: "GK" },
        { name: "Pavard", number: 28, position: "RB" },
        { name: "Acerbi", number: 15, position: "CB" },
        { name: "Bastoni", number: 95, position: "CB" },
        { name: "Dimarco", number: 32, position: "LB" },
        { name: "Barella", number: 23, position: "CM" },
        { name: "Calhanoglu", number: 20, position: "CM" },
        { name: "Mkhitaryan", number: 22, position: "CM" },
        { name: "Dumfries", number: 2, position: "RW" },
        { name: "Lautaro", number: 10, position: "ST" },
        { name: "Thuram", number: 9, position: "ST" },
      ],
    },
  },
  {
    id: "10",
    homeTeam: "Arsenal",
    awayTeam: "Napoli",
    homeShort: "ARS",
    awayShort: "NAP",
    homeScore: 1,
    awayScore: 1,
    matchTime: "72:00",
    league: "Champions League",
    status: "live",
    date: "Today",
    homeColor: "from-red-600 to-red-900",
    awayColor: "from-blue-500 to-blue-800",
    homeLogo: teamLogos["Arsenal"],
    awayLogo: teamLogos["Napoli"],
    stats: { possession: [55, 45], shots: [13, 9], shotsOnTarget: [6, 4], corners: [7, 3], fouls: [8, 11], yellowCards: [1, 2], redCards: [0, 0] },
    goals: [
      { player: "Saka", minute: "15'", team: "home" },
      { player: "Kvara", minute: "52'", team: "away" },
    ],
    ticker: [
      { minute: "72'", event: "🏃 Play", detail: "Arsenal controlling possession looking for the winner" },
      { minute: "52'", event: "⚽ GOAL!", detail: "Kvaratskhelia equalizes with a stunning strike!" },
      { minute: "15'", event: "⚽ GOAL!", detail: "Saka opens the scoring for Arsenal!" },
    ],
  },
];

export const upcomingMatches: Match[] = [
  {
    id: "4",
    homeTeam: "Real Madrid",
    awayTeam: "PSG",
    homeShort: "RMA",
    awayShort: "PSG",
    homeScore: 0,
    awayScore: 0,
    matchTime: "20:00",
    league: "Champions League",
    status: "upcoming",
    date: "Tomorrow",
    homeColor: "from-white to-gray-200",
    awayColor: "from-blue-900 to-red-600",
    homeLogo: teamLogos["Real Madrid"],
    awayLogo: teamLogos["PSG"],
  },
  {
    id: "5",
    homeTeam: "Liverpool",
    awayTeam: "Dortmund",
    homeShort: "LIV",
    awayShort: "BVB",
    homeScore: 0,
    awayScore: 0,
    matchTime: "21:00",
    league: "Champions League",
    status: "upcoming",
    date: "Tomorrow",
    homeColor: "from-red-600 to-red-800",
    awayColor: "from-yellow-500 to-black",
    homeLogo: teamLogos["Liverpool"],
    awayLogo: teamLogos["Dortmund"],
  },
  {
    id: "6",
    homeTeam: "Juventus",
    awayTeam: "Atletico",
    homeShort: "JUV",
    awayShort: "ATL",
    homeScore: 0,
    awayScore: 0,
    matchTime: "18:45",
    league: "Champions League",
    status: "upcoming",
    date: "Tomorrow",
    homeColor: "from-white to-black",
    awayColor: "from-red-600 to-blue-900",
    homeLogo: teamLogos["Juventus"],
    awayLogo: teamLogos["Atletico"],
  },
];

export const finishedMatches: Match[] = [
  {
    id: "7",
    homeTeam: "Arsenal",
    awayTeam: "Napoli",
    homeShort: "ARS",
    awayShort: "NAP",
    homeScore: 2,
    awayScore: 0,
    matchTime: "FT",
    league: "Champions League",
    status: "finished",
    date: "Yesterday",
    homeColor: "from-red-600 to-red-800",
    awayColor: "from-blue-500 to-blue-700",
    homeLogo: teamLogos["Arsenal"],
    awayLogo: teamLogos["Napoli"],
  },
  {
    id: "8",
    homeTeam: "Man City",
    awayTeam: "Porto",
    homeShort: "MCI",
    awayShort: "POR",
    homeScore: 4,
    awayScore: 1,
    matchTime: "FT",
    league: "Champions League",
    status: "finished",
    date: "Yesterday",
    homeColor: "from-blue-400 to-blue-700",
    awayColor: "from-blue-800 to-white",
    homeLogo: teamLogos["Man City"],
    awayLogo: teamLogos["Porto"],
  },
];

export const standingsData = [
  { pos: 1, team: "Chelsea", logo: teamLogos["Chelsea"], p: 8, gd: 12, pts: 22 },
  { pos: 2, team: "Arsenal", logo: teamLogos["Arsenal"], p: 8, gd: 9, pts: 20 },
  { pos: 3, team: "Man City", logo: teamLogos["Man City"], p: 8, gd: 8, pts: 19 },
  { pos: 4, team: "Barcelona", logo: teamLogos["Barcelona"], p: 8, gd: 7, pts: 18 },
  { pos: 5, team: "Bayern Munich", logo: teamLogos["Bayern Munich"], p: 8, gd: 6, pts: 16 },
  { pos: 6, team: "Inter Milan", logo: teamLogos["Inter Milan"], p: 8, gd: 4, pts: 15 },
  { pos: 7, team: "PSG", logo: teamLogos["PSG"], p: 8, gd: 3, pts: 14 },
  { pos: 8, team: "Real Madrid", logo: teamLogos["Real Madrid"], p: 8, gd: 2, pts: 13 },
];

export const teams = [
  { id: "psg", name: "PSG", short: "PSG", color: "from-blue-900 to-red-600", logo: teamLogos["PSG"] },
  { id: "alnassr", name: "Al-Nassr", short: "NAS", color: "from-yellow-500 to-blue-800", logo: teamLogos["Al-Nassr"] },
  { id: "arsenal", name: "Arsenal", short: "ARS", color: "from-red-600 to-red-800", logo: teamLogos["Arsenal"] },
  { id: "barcelona", name: "Barcelona", short: "BAR", color: "from-blue-700 to-red-700", logo: teamLogos["Barcelona"] },
  { id: "realmadrid", name: "Real Madrid", short: "RMA", color: "from-white to-blue-100", logo: teamLogos["Real Madrid"] },
  { id: "intermiami", name: "Inter Miami", short: "MIA", color: "from-pink-400 to-black", logo: teamLogos["Inter Miami"] },
  { id: "chelsea", name: "Chelsea", short: "CHE", color: "from-blue-600 to-blue-800", logo: teamLogos["Chelsea"] },
  { id: "liverpool", name: "Liverpool", short: "LIV", color: "from-red-600 to-red-800", logo: teamLogos["Liverpool"] },
  { id: "bayern", name: "Bayern Munich", short: "BAY", color: "from-red-600 to-red-900", logo: teamLogos["Bayern Munich"] },
  { id: "mancity", name: "Man City", short: "MCI", color: "from-blue-400 to-blue-700", logo: teamLogos["Man City"] },
  { id: "juventus", name: "Juventus", short: "JUV", color: "from-white to-black", logo: teamLogos["Juventus"] },
  { id: "milan", name: "AC Milan", short: "MIL", color: "from-red-700 to-black", logo: teamLogos["AC Milan"] },
];
