import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const API_BASE = "https://api.sportsrc.org/v2/";
const API_KEY = Deno.env.get("SPORTSRC_API_KEY") ?? "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: "SPORTSRC_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const params = new URLSearchParams();
    // Allowlist forwarded params
    const allowed = ["type", "sport", "status", "date", "id", "league_id"];
    for (const key of allowed) {
      const v = url.searchParams.get(key);
      if (v) params.set(key, v);
    }
    if (!params.get("type")) {
      return new Response(JSON.stringify({ error: "Missing 'type' param" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const upstream = `${API_BASE}?${params.toString()}`;
    const res = await fetch(upstream, {
      headers: { "X-API-KEY": API_KEY },
    });
    const text = await res.text();

    return new Response(text, {
      status: res.status,
      headers: {
        ...corsHeaders,
        "Content-Type": res.headers.get("content-type") ?? "application/json",
        "Cache-Control": "public, max-age=20",
      },
    });
  } catch (err) {
    console.error("sportsrc error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
