import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY") ?? "";
const HOST = "sport-streaming-api.p.rapidapi.com";
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
  const action = url.searchParams.get("action") ?? "events";

  try {
    let upstream = "";
    if (action === "events") {
      upstream = `${BASE}/events`;
    } else if (action === "streams") {
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response(JSON.stringify({ error: "missing id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      upstream = `${BASE}/streams/${encodeURIComponent(id)}`;
    } else if (action === "sports") {
      upstream = `${BASE}/sports`;
    } else {
      return new Response(JSON.stringify({ error: "invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch(upstream, {
      headers: {
        "x-rapidapi-host": HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": action === "events" ? "public, max-age=30" : "public, max-age=15",
      },
    });
  } catch (err) {
    console.error("sport-streaming error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
