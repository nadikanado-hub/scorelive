import { useEffect, useRef, useState } from "react";
import { Radio, Loader2, AlertCircle } from "lucide-react";
import Hls from "hls.js";
import { findSportSRCMatch, fetchStreamUrls } from "@/services/sportsrcApi";
import { findRapidMatch, serversToStreams, PlayableStream } from "@/services/rapidApi";
import {
  findSportStreamingMatch,
  fetchSportStreamingServers,
} from "@/services/sportStreamingApi";
import { Match } from "@/data/matches";
import { toast } from "sonner";

const LOAD_TIMEOUT_MS = 10000;

type Source =
  | { kind: "iframe"; label: string; src: string }
  | { kind: "hls"; label: string; src: string }
  | { kind: "mp4"; label: string; src: string };

interface LiveStreamPlayerProps {
  match: Match;
}

const LiveStreamPlayer = ({ match }: LiveStreamPlayerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const failedRef = useRef<Set<number>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tryNextSource = (failedIdx: number, reason: string) => {
    failedRef.current.add(failedIdx);
    const total = sources.length;
    if (failedRef.current.size >= total) {
      toast.error("All stream sources failed to load");
      setError("All sources unavailable");
      return;
    }
    let next = failedIdx;
    for (let i = 1; i <= total; i++) {
      const candidate = (failedIdx + i) % total;
      if (!failedRef.current.has(candidate)) {
        next = candidate;
        break;
      }
    }
    toast.error(`Source ${failedIdx + 1} failed (${reason}). Trying Source ${next + 1}…`);
    setActiveIdx(next);
  };

  // Load sources: RapidAPI first, SportSRC as fallback / additional
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSources([]);
    setActiveIdx(0);
    failedRef.current = new Set();

    (async () => {
      const collected: Source[] = [];

      // 1) Sport Streaming API (best provider — embed.st iframes) — FIRST
      try {
        const event = await findSportStreamingMatch(match.homeTeam, match.awayTeam);
        if (event?.id) {
          const servers = await fetchSportStreamingServers(event.id);
          servers.forEach((s, i) => {
            if (!s.url) return;
            const lang = s.language ? s.language : s.source;
            const label = `SS · ${lang}${s.hd ? " HD" : ""} #${s.streamNo ?? i + 1}`;
            collected.push({ kind: "iframe", label, src: s.url });
          });
        }
      } catch (err) {
        console.error("SportStreaming fetch failed", err);
      }

      // 2) RapidAPI football-live-streaming (native HLS / MP4)
      try {
        const rapid = await findRapidMatch(match.homeTeam, match.awayTeam);
        if (rapid?.servers?.length) {
          const playable: PlayableStream[] = serversToStreams(rapid.servers);
          playable.forEach((p, i) =>
            collected.push({
              kind: p.kind,
              label: p.label || `RapidAPI ${i + 1}`,
              src: p.src,
            }),
          );
        }
      } catch (err) {
        console.error("RapidAPI fetch failed", err);
      }

      // 3) SportSRC fallback (iframe embeds)
      try {
        let matchId: string | null = null;
        if (match.id && /^\d+$/.test(match.id)) {
          matchId = match.id;
        } else {
          const found = await findSportSRCMatch(match.homeTeam, match.awayTeam);
          matchId = found?.id ?? null;
        }
        if (matchId) {
          const streams = await fetchStreamUrls(matchId);
          streams.forEach((s, i) => {
            const lang = s.language || "";
            const parts = lang.split(/[-–—|]/).map((p) => p.trim()).filter(Boolean);
            const channel = parts.length > 1 ? parts.slice(1).join(" ") : "";
            let label: string;
            if (channel) {
              label = channel;
            } else if (lang && lang.toLowerCase() !== "unknown") {
              label = `SportSRC · ${lang}`;
            } else {
              label = `SportSRC ${s.streamNo ?? i + 1}`;
            }
            if (s.hd) label += " HD";
            collected.push({ kind: "iframe", label, src: s.url });
          });
        }
      } catch (err) {
        console.error("SportSRC fetch failed", err);
      }


      if (cancelled) return;
      if (collected.length === 0) {
        setError("No stream available for this match");
      } else {
        // Prioritize servers that typically carry FIFA World Cup matches
        const WC_BROADCASTERS = [
          "fox", "fs1", "fs2", "telemundo", "universo", // USA
          "bbc", "itv", // UK
          "bein", "bein sports", // MENA/global
          "tsn", "ctv", "rds", // Canada
          "sky", "dazn", // EU
          "rté", "rte",
          "srf", "ard", "zdf",
          "tf1", "m6",
          "rai",
          "globo", "sportv",
        ];
        const score = (label: string): number => {
          const l = label.toLowerCase();
          let s = 0;
          // Sport Streaming API is the best provider — always rank first
          if (l.startsWith("ss ·") || l.startsWith("ss·")) s += 1000;
          for (const b of WC_BROADCASTERS) {
            if (l.includes(b)) { s += 100; break; }
          }
          if (/\bhd\b/.test(l)) s += 5;
          if (l.includes("english") || l.startsWith("en") || l.includes("multi")) s += 10;
          return s;
        };
        const sorted = [...collected].sort((a, b) => score(b.label) - score(a.label));
        setSources(sorted);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [match.id, match.homeTeam, match.awayTeam]);

  // Handle hls.js lifecycle for the active video source
  useEffect(() => {
    if (sources.length === 0) return;
    const src = sources[activeIdx];

    // cleanup previous hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      tryNextSource(activeIdx, "timeout");
    }, LOAD_TIMEOUT_MS);

    if (src.kind === "hls" && videoRef.current) {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hlsRef.current = hls;
        hls.loadSource(src.src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          video.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (data.fatal) tryNextSource(activeIdx, data.type);
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        video.src = src.src;
        video.addEventListener("loadedmetadata", () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          video.play().catch(() => {});
        }, { once: true });
      } else {
        tryNextSource(activeIdx, "hls-unsupported");
      }
    } else if (src.kind === "mp4" && videoRef.current) {
      const video = videoRef.current;
      video.src = src.src;
      video.addEventListener("loadedmetadata", () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        video.play().catch(() => {});
      }, { once: true });
    }
    // iframe handles its own load via onLoad below

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx, sources]);

  const active = sources[activeIdx];

  return (
    <div className="rounded-2xl overflow-hidden border border-border/20 w-full max-w-full" style={{ touchAction: "manipulation" }}>
      <div className="relative bg-background w-full max-w-full overflow-hidden" style={{ height: 0, paddingBottom: "56.25%" }}>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/40">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <span className="text-[11px] text-muted-foreground font-medium">
              Loading stream...
            </span>
          </div>
        )}

        {!loading && error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/40 px-6 text-center">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground font-medium">{error}</span>
          </div>
        )}

        {!loading && !error && active && active.kind === "iframe" && (
          <iframe
            key={active.src}
            src={active.src}
            className="absolute inset-0 w-full h-full block"
            style={{ border: 0, maxWidth: "100%", maxHeight: "100%" }}
            scrolling="no"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onError={() => tryNextSource(activeIdx, "error")}
          />
        )}


        {!loading && !error && active && (active.kind === "hls" || active.kind === "mp4") && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full bg-black"
            controls
            playsInline
            autoPlay
            muted
            onError={() => tryNextSource(activeIdx, "video-error")}
          />
        )}

        {/* Top overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 p-3 flex items-center justify-between bg-gradient-to-b from-background/80 to-transparent pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive text-white text-[10px] font-bold shadow-lg shadow-destructive/30">
              <Radio className="h-3 w-3" />
              LIVE
            </span>
            <span
              className="text-[10px] font-medium text-foreground/80 px-2.5 py-1 rounded-full border border-border/30"
              style={{ background: 'hsl(var(--background) / 0.5)', backdropFilter: 'blur(12px)' }}
            >
              {match.matchTime}
            </span>
          </div>
          <span
            className="text-[10px] font-bold text-primary px-2.5 py-1 rounded-full border border-primary/20"
            style={{ background: 'hsl(var(--primary) / 0.15)', backdropFilter: 'blur(12px)' }}
          >
            HD
          </span>
        </div>
      </div>

      {sources.length >= 1 && (
        <div className="relative bg-card/40 border-t border-border/20">
          <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Servers · pick your language
          </div>
          <div className="px-3 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {sources.map((s, i) => (
              <button
                key={i}
                onClick={() => { setActiveIdx(i); failedRef.current.delete(i); }}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap ${
                  i === activeIdx
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {s.label}
                {i === activeIdx && (
                  <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveStreamPlayer;
