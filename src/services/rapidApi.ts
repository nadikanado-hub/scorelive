const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const FN_URL = `${SUPABASE_URL}/functions/v1/rapidapi-streams`;

export interface RapidServer {
  name: string;
  url: string;
  type: "direct" | "referer" | "drm" | string;
  header?: Record<string, string>;
}

export interface RapidMatch {
  match_time: number;
  match_status: string;
  home_team_name: string;
  away_team_name: string;
  servers: RapidServer[];
}

function norm(s: string): string {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function fetchRapidMatches(status: "live" | "upcoming" | "finished"): Promise<RapidMatch[]> {
  try {
    const res = await fetch(`${FN_URL}?action=matches&status=${status}`, {
      headers: { Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.matches) ? data.matches : [];
  } catch (err) {
    console.error("fetchRapidMatches", err);
    return [];
  }
}

/** Find a RapidAPI match by fuzzy team-name matching */
export async function findRapidMatch(
  homeTeam: string,
  awayTeam: string,
): Promise<RapidMatch | null> {
  const h = norm(homeTeam);
  const a = norm(awayTeam);

  for (const status of ["live", "upcoming", "finished"] as const) {
    const matches = await fetchRapidMatches(status);
    const found = matches.find((m) => {
      const mh = norm(m.home_team_name);
      const ma = norm(m.away_team_name);
      const homeOk = mh.includes(h) || h.includes(mh);
      const awayOk = ma.includes(a) || a.includes(ma);
      return homeOk && awayOk;
    });
    if (found) return found;
  }
  return null;
}

/** Returns playable stream descriptors. Skips DRM/FLV for now (option a). */
export interface PlayableStream {
  label: string;
  src: string;
  kind: "hls" | "mp4";
}

export function serversToStreams(servers: RapidServer[]): PlayableStream[] {
  const out: PlayableStream[] = [];
  for (const s of servers) {
    if (!s?.url) continue;
    const lower = s.url.toLowerCase();

    // Skip DRM and FLV for option (a)
    if (s.type === "drm" || lower.includes("drmscheme=") || lower.endsWith(".flv")) continue;

    const isHls = lower.includes(".m3u8");
    const isMp4 = lower.endsWith(".mp4");
    if (!isHls && !isMp4) continue;

    let src = s.url;
    if (s.type === "referer") {
      const referer = s.header?.["referer"] ?? s.header?.["Referer"] ?? "";
      const ua = s.header?.["user-agent"] ?? s.header?.["User-Agent"] ?? "";
      src = `${FN_URL}?action=proxy&referer=${encodeURIComponent(referer)}&ua=${encodeURIComponent(ua)}&url=${encodeURIComponent(s.url)}`;
    }

    out.push({
      label: s.name || (isHls ? "HLS" : "MP4"),
      src,
      kind: isHls ? "hls" : "mp4",
    });
  }
  return out;
}
