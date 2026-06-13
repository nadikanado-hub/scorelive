import { Match } from "@/data/matches";

interface ApiFixture {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    name: string;
    country: string;
  };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

function getShortName(name: string): string {
  if (name.length <= 3) return name.toUpperCase();
  const abbrevs: Record<string, string> = {
    "Manchester United": "MUN", "Manchester City": "MCI", "Liverpool": "LIV",
    "Chelsea": "CHE", "Arsenal": "ARS", "Tottenham": "TOT", "Barcelona": "BAR",
    "Real Madrid": "RMA", "Bayern Munich": "BAY", "Paris Saint Germain": "PSG",
    "Juventus": "JUV", "AC Milan": "MIL", "Inter": "INT",
    "Borussia Dortmund": "BVB", "Atletico Madrid": "ATL", "Napoli": "NAP",
  };
  for (const [full, short] of Object.entries(abbrevs)) {
    if (name.includes(full)) return short;
  }
  return name.substring(0, 3).toUpperCase();
}

function mapStatus(short: string): "live" | "upcoming" | "finished" {
  const liveStatuses = ["1H", "2H", "ET", "P", "BT", "HT", "LIVE"];
  const finishedStatuses = ["FT", "AET", "PEN"];
  if (liveStatuses.includes(short)) return "live";
  if (finishedStatuses.includes(short)) return "finished";
  return "upcoming";
}

function mapFixtureToMatch(f: ApiFixture): Match {
  const status = mapStatus(f.fixture.status.short);
  const elapsed = f.fixture.status.elapsed;
  const matchTime =
    status === "live" && elapsed
      ? `${elapsed}'`
      : status === "finished"
      ? "FT"
      : new Date(f.fixture.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return {
    id: String(f.fixture.id),
    homeTeam: f.teams.home.name,
    awayTeam: f.teams.away.name,
    homeShort: getShortName(f.teams.home.name),
    awayShort: getShortName(f.teams.away.name),
    homeScore: f.goals.home ?? 0,
    awayScore: f.goals.away ?? 0,
    matchTime,
    league: f.league.name,
    status,
    date: new Date(f.fixture.date).toLocaleDateString(),
    homeColor: "from-blue-600 to-blue-800",
    awayColor: "from-red-600 to-red-800",
    homeLogo: f.teams.home.logo,
    awayLogo: f.teams.away.logo,
  };
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function callApi(params: string): Promise<ApiFixture[]> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/football-api?${params}`,
    {
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const result = await response.json();
  return result.response || [];
}

export async function fetchLiveMatches(): Promise<Match[]> {
  try {
    const fixtures = await callApi("endpoint=fixtures&live=all");
    return fixtures.map(mapFixtureToMatch);
  } catch (err) {
    console.error("fetchLiveMatches error:", err);
    return [];
  }
}

export async function fetchFixturesByDate(date: string): Promise<Match[]> {
  try {
    const fixtures = await callApi(`endpoint=fixtures&date=${date}`);
    return fixtures.map(mapFixtureToMatch);
  } catch (err) {
    console.error("fetchFixturesByDate error:", err);
    return [];
  }
}

export async function fetchStandings(league: number, season: number) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/football-api?endpoint=standings&league=${league}&season=${season}`,
      {
        headers: {
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch standings");
    const result = await response.json();
    return result.response?.[0]?.league?.standings?.[0] || [];
  } catch (err) {
    console.error("fetchStandings error:", err);
    return [];
  }
}
