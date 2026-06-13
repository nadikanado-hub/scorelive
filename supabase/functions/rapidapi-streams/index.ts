import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY") ?? "";
const HOST = "football-live-streaming-api.p.rapidapi.com";
const BASE = `https://${HOST}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!RAPIDAPI_KEY) {
    return new Response(JSON.stringify({ error: "RAPIDAPI_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const action = url.searchParams.get("action") ?? "matches";

  try {
    // --- Stream proxy: forwards to upstream with required Referer/UA headers ---
    if (action === "proxy") {
      const target = url.searchParams.get("url");
      const referer = url.searchParams.get("referer") ?? "";
      const ua = url.searchParams.get("ua") ??
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

      if (!target) {
        return new Response("missing url", { status: 400, headers: corsHeaders });
      }

      const headers: Record<string, string> = { "User-Agent": ua };
      if (referer) headers["Referer"] = referer;

      const upstream = await fetch(target, { headers });
      const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";

      // Rewrite .m3u8 playlists so nested segment URLs also go through the proxy
      if (contentType.includes("mpegurl") || target.includes(".m3u8")) {
        const text = await upstream.text();
        const baseUrl = new URL(target);
        const proxyBase = `${url.origin}${url.pathname}?action=proxy&referer=${encodeURIComponent(referer)}&url=`;

        const rewritten = text.split("\n").map((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) {
            // rewrite URI="..." inside #EXT-X-KEY / #EXT-X-MEDIA tags
            return line.replace(/URI="([^"]+)"/g, (_, u) => {
              const abs = new URL(u, baseUrl).toString();
              return `URI="${proxyBase}${encodeURIComponent(abs)}"`;
            });
          }
          const abs = new URL(trimmed, baseUrl).toString();
          return `${proxyBase}${encodeURIComponent(abs)}`;
        }).join("\n");

        return new Response(rewritten, {
          status: upstream.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/vnd.apple.mpegurl",
            "Cache-Control": "no-store",
          },
        });
      }

      // Stream binary (segments, mp4, etc.)
      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          ...corsHeaders,
          "Content-Type": contentType,
          "Cache-Control": upstream.headers.get("cache-control") ?? "public, max-age=10",
        },
      });
    }

    // --- Default: fetch matches list ---
    const status = url.searchParams.get("status") ?? "live";
    const page = url.searchParams.get("page") ?? "1";
    const upstream = `${BASE}/matches?page=${page}&status=${encodeURIComponent(status)}`;

    const res = await fetch(upstream, {
      headers: {
        "x-rapidapi-host": HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
        "Content-Type": "application/json",
      },
    });
    const text = await res.text();

    // Upstream quota exhausted or rate-limited: degrade gracefully so the
    // client doesn't blank-screen. Return an empty match list with 200.
    if (res.status === 429 || res.status === 403) {
      console.warn("rapidapi-streams upstream limited:", res.status, text.slice(0, 200));
      return new Response(JSON.stringify({ matches: [], quota_exceeded: true }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    return new Response(text, {
      status: res.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30",
      },
    });
  } catch (err) {
    console.error("rapidapi-streams error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
