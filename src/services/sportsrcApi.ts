const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function callSportSRC(params: Record<string, string>): Promise<any> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/sportsrc?${qs}`, {
    headers: { Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`sportsrc ${res.status}`);
  return res.json();
}

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export interface SportSRCMatch {
  id: string;
  home: string;
  away: string;
  raw: any;
}

interface FlatMatch {
  id: string;
  homeName: string;
  awayName: string;
  raw: any;
}

function flattenMatches(payload: any): FlatMatch[] {
  const data = payload?.data ?? payload;
  const groups: any[] = Array.isArray(data) ? data : [];
  const out: FlatMatch[] = [];
  for (const g of groups) {
    const matches: any[] = g?.matches ?? [];
    for (const m of matches) {
      out.push({
        id: String(m?.id ?? ""),
        homeName: m?.teams?.home?.name ?? "",
        awayName: m?.teams?.away?.name ?? "",
        raw: m,
      });
    }
  }
  return out;
}

export async function findSportSRCMatch(
  homeTeam: string,
  awayTeam: string,
  date?: string,
): Promise<SportSRCMatch | null> {
  const today = date ?? new Date().toISOString().slice(0, 10);
  const statuses = ["inprogress", "notstarted", "finished"];
  const h = norm(homeTeam);
  const a = norm(awayTeam);

  for (const status of statuses) {
    try {
      const data = await callSportSRC({
        type: "matches",
        sport: "football",
        status,
        date: today,
      });
      const items = flattenMatches(data);
      const match = items.find((m) => {
        const home = norm(m.homeName);
        const away = norm(m.awayName);
        if (!home || !away) return false;
        return (
          (home.includes(h) || h.includes(home)) &&
          (away.includes(a) || a.includes(away))
        );
      });
      if (match && match.id) {
        return {
          id: match.id,
          home: match.homeName || homeTeam,
          away: match.awayName || awayTeam,
          raw: match.raw,
        };
      }
    } catch (err) {
      console.error("findSportSRCMatch", status, err);
    }
  }
  return null;
}

export interface SportSRCStream {
  url: string;
  language: string;
  source: string;
  streamNo: number;
  hd: boolean;
}

export async function fetchStreamUrls(matchId: string): Promise<SportSRCStream[]> {
  const data = await callSportSRC({ type: "detail", id: matchId });
  const detail = data?.data ?? data;
  const sources: any[] = detail?.sources ?? [];
  const seen = new Set<string>();
  const out: SportSRCStream[] = [];
  for (const s of sources) {
    const u = s?.embedUrl ?? s?.url ?? s?.embed ?? s?.src;
    if (typeof u !== "string" || !u.startsWith("http")) continue;
    if (seen.has(u)) continue;
    seen.add(u);
    out.push({
      url: u,
      language: String(s?.language ?? "").trim(),
      source: String(s?.source ?? "").trim(),
      streamNo: Number(s?.streamNo ?? out.length + 1),
      hd: Boolean(s?.hd),
    });
  }
  return out;
}

import type { Match } from "@/data/matches";

function statusMap(s: string): Match["status"] {
  if (s === "inprogress") return "live";
  if (s === "finished") return "finished";
  return "upcoming";
}

function short(name: string): string {
  const w = name.trim().split(/\s+/);
  if (w.length === 1) return w[0].slice(0, 3).toUpperCase();
  return (w[0][0] + w[1][0] + (w[2]?.[0] ?? "")).toUpperCase();
}

function timeLabel(m: any): string {
  const s = m?.status;
  if (s === "inprogress") return m?.status_detail ?? "LIVE";
  if (s === "finished") return "FT";
  const ts = m?.timestamp;
  if (typeof ts === "number") {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return "";
}

export async function fetchSportSRCMatchesByDate(
  date: string,
  status?: "inprogress" | "notstarted" | "finished",
): Promise<Match[]> {
  const statuses = status ? [status] : (["inprogress", "notstarted", "finished"] as const);
  const out: Match[] = [];
  for (const st of statuses) {
    try {
      const data = await callSportSRC({ type: "matches", sport: "football", status: st, date });
      const groups: any[] = data?.data ?? [];
      for (const g of groups) {
        const leagueName = g?.league?.name ?? "";
        for (const m of g?.matches ?? []) {
          const home = m?.teams?.home?.name ?? "";
          const away = m?.teams?.away?.name ?? "";
          if (!home || !away) continue;
          out.push({
            id: String(m?.id ?? `${home}-${away}-${m?.timestamp ?? ""}`),
            homeTeam: home,
            awayTeam: away,
            homeShort: m?.teams?.home?.code ?? short(home),
            awayShort: m?.teams?.away?.code ?? short(away),
            homeScore: m?.score?.current?.home ?? 0,
            awayScore: m?.score?.current?.away ?? 0,
            matchTime: timeLabel(m),
            league: leagueName,
            status: statusMap(m?.status ?? ""),
            date,
            homeColor: "from-blue-600 to-blue-800",
            awayColor: "from-red-600 to-red-800",
            homeLogo: m?.teams?.home?.badge,
            awayLogo: m?.teams?.away?.badge,
          });
        }
      }
    } catch (err) {
      console.error("fetchSportSRCMatchesByDate", st, err);
    }
  }
  return out;
}

export async function fetchSportSRCLive(): Promise<Match[]> {
  const today = new Date().toISOString().slice(0, 10);
  return fetchSportSRCMatchesByDate(today, "inprogress");
}
