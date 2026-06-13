# Architecture — ScoreLive

## High-level flow

```text
        ┌──────────────────────────┐
        │   Browser (React SPA)    │
        │   Vite + TS + Tailwind   │
        └────────────┬─────────────┘
                     │ fetch (Bearer = SUPABASE_PUBLISHABLE_KEY)
                     ▼
        ┌──────────────────────────┐
        │  Supabase Edge Functions │
        │  (Deno, stateless)       │
        │                          │
        │  • football-api          │── API-Football
        │  • sport-streaming  ⭐   │── RapidAPI (primary streams)
        │  • rapidapi-streams      │── RapidAPI (HLS/MP4)
        │  • sportsrc              │── SportSRC (iframes)
        └────────────┬─────────────┘
                     │
                     ▼
              Third-party APIs
```

No client-side database tables yet. All data is read-through via edge functions. Auth client is wired but unused for gating.

## Frontend layers

```text
pages/*           thin route wrappers, set SEO, render screen
└── components/AppLayout      shell + bottom nav (5 items)
    └── components/<Screen>   feature screen (Home / Live / …)
        └── components/<Sub>  cards, players, lockers
            └── services/*    edge function clients
```

## Data refresh

- `react-query` polls live data every **60s**.
- Edge functions set short `Cache-Control` (15–30s) to leverage CDN.
- Stream source list is fetched once per match detail mount; user can switch servers without refetching.

## Video pipeline

```text
LiveStreamPlayer
  ├── collect sources (parallel try/catch over 3 providers)
  ├── sort by score(label)
  ├── render active source:
  │     • iframe  → onLoad clears 10s timeout
  │     • hls.js  → MANIFEST_PARSED clears timeout
  │     • mp4     → loadedmetadata clears timeout
  └── on error / timeout → tryNextSource()
```

If all sources fail, show "All sources unavailable" toast + inline message.

## Monetization layer

```text
MatchDetail → ContentLocker (AdBlueMedia CPA wall)
                   │ poll every 15s for completion
                   ▼
              LiveStreamPlayer (only mounts after unlock)
```

ContentLocker is **unskippable by design**. No close button. Subscription tier can bypass (Pro / Ultimate) — wiring lives in `SubscriptionScreen.tsx` + locker logic.

## SEO

`react-helmet-async` via `SEOHead.tsx`. Per-page title (<60ch), meta description (<160ch), canonical, OG + Twitter, JSON-LD where applicable. `public/sitemap.xml`, `public/robots.txt`, `public/llms.txt` are checked in.
