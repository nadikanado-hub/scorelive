const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const FN = `${SUPABASE_URL}/functions/v1/sport-streaming`;

export interface SSEvent {
  id: string;
  title: string;
  sport: string;
  league?: string;
  teams?: {
    home?: { name?: string; badge?: string };
    away?: { name?: string; badge?: string };
  };
}

export interface SSServer {
  url: string;
  name: string;
  source: string;
  streamNo: number;
  language: string | null;
  hd: boolean;
  viewers?: number;
}

function norm(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function call(params: string): Promise<any> {
  const res = await fetch(`${FN}?${params}`, {
    headers: { Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`sport-streaming ${res.status}`);
  return res.json();
}

export async function findSportStreamingMatch(
  homeTeam: string,
  awayTeam: string,
): Promise<SSEvent | null> {
  try {
    const data = await call("action=events");
    const events: SSEvent[] = data?.events ?? [];
    const h = norm(homeTeam);
    const a = norm(awayTeam);
    const soccerOnly = events.filter(
      (e) => e.sport === "soccer" || e.sport === "football",
    );
    const pool = soccerOnly.length ? soccerOnly : events;
    return (
      pool.find((e) => {
        const eh = norm(e.teams?.home?.name ?? "");
        const ea = norm(e.teams?.away?.name ?? "");
        if (!eh || !ea) return false;
        const homeOk = eh.includes(h) || h.includes(eh);
        const awayOk = ea.includes(a) || a.includes(ea);
        return homeOk && awayOk;
      }) ?? null
    );
  } catch (err) {
    console.error("findSportStreamingMatch", err);
    return null;
  }
}

export async function fetchSportStreamingServers(id: string): Promise<SSServer[]> {
  try {
    const data = await call(`action=streams&id=${encodeURIComponent(id)}`);
    return Array.isArray(data?.servers) ? data.servers : [];
  } catch (err) {
    console.error("fetchSportStreamingServers", err);
    return [];
  }
}
