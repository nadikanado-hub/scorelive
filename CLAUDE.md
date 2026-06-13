# CLAUDE.md — ScoreLive Project Guide

This document gives Claude (or any AI coding assistant) the full context needed to work productively on this project. Read it before making changes.

---

## 1. What this app is

**ScoreLive** is a live football (soccer) PWA-style web app. It shows:

- Live, upcoming, and finished matches (with auto-refresh every 60s)
- League standings
- A match detail page with a **live video player** (multi-source), 2D pitch, live ticker, betting odds
- A subscription screen (Stripe-backed: Free / Pro / Ultimate)
- Profile screen

Live video access is **gated by an AdBlueMedia CPA offer wall** (`ContentLocker.tsx`) — never add a close/skip button to that locker. The locker polls completion every 15s.

---

## 2. Tech stack

- **Frontend**: React 18 + Vite 5 + TypeScript 5 + Tailwind v3 + shadcn/ui
- **State / data**: `@tanstack/react-query`
- **Routing**: `react-router-dom` v6
- **SEO**: `react-helmet-async` (+ JSON-LD, sitemap in `public/`)
- **Video**: `hls.js` for native HLS; iframes for embed providers
- **Backend**: Lovable Cloud (Supabase under the hood). Edge Functions in `supabase/functions/*`. No client tables yet — all data is proxied through edge functions.
- **Auth**: Supabase auth client is wired (`src/integrations/supabase/client.ts`) but the app currently has no enforced auth — Profile is the only auth-aware screen.

**Never** edit auto-generated files:
- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `.env` (VITE_SUPABASE_*)
- `supabase/config.toml` project-level fields

---

## 3. Routes & screens

Defined in `src/App.tsx`:

| Path             | Component             | Notes                                  |
| ---------------- | --------------------- | -------------------------------------- |
| `/`              | `HomePage`            | Featured matches, auto-swiping carousel |
| `/live`          | `LivePage`            | Live + date-nav fixtures, betting odds |
| `/standings`     | `StandingsPage`       | League tables                          |
| `/subscription`  | `SubscriptionPage`    | Stripe checkout                        |
| `/profile`       | `ProfilePage`         | User account                           |
| `*`              | `NotFound`            | 404                                    |

All screens are wrapped in `AppLayout` with a `BottomNavigation` of 5 items: **Home, LIVE, Standings, Profile, Subscription**. Do NOT add Watch/Favorites tabs (removed intentionally).

The match detail view (`src/components/MatchDetail.tsx`) is rendered inside the live/home flow, not as a dedicated route.

---

## 4. Design system (LOCKED — do not drift)

Theme: **"Liquid glass iOS 26"**. Defined in `src/index.css` and `tailwind.config.ts`.

- Accent: neon-lime **`#D8FF3E`** (HSL token `--primary`)
- Backgrounds: deep dark, heavy blur (`backdrop-filter: blur(40px)`)
- Headlines: **Bebas Neue**; body uses the configured sans stack
- Always use **semantic Tailwind tokens** (`bg-background`, `text-foreground`, `border-border`, `bg-primary`, etc.). NEVER hard-code colors like `text-white`, `bg-black`, or `bg-[#...]` — that breaks theming.
- Glass cards: translucent surface + `backdrop-filter: blur(...)` + subtle border.

---

## 5. APIs (this is the important part)

All third-party APIs are proxied through Supabase Edge Functions so RapidAPI keys never reach the browser.

### 5.1 `football-api` — fixtures, standings, live scores
- File: `supabase/functions/football-api/index.ts`
- Upstream: **API-Football** (`v3.football.api-sports.io`)
- Secret: `API_FOOTBALL_KEY`
- Client wrapper: `src/services/footballApi.ts`
- Auto-refresh: every **60s** for live data
- Use this as the canonical source for match metadata (teams, league, time, score, status).

### 5.2 `sport-streaming` — primary streaming provider ⭐
- File: `supabase/functions/sport-streaming/index.ts`
- Upstream: **sport-streaming-api.p.rapidapi.com** (RapidAPI host)
- Secret: `RAPIDAPI_KEY`
- Client wrapper: `src/services/sportStreamingApi.ts`
- Actions: `events`, `streams?id=...`, `sports`
- Returns **embed.st iframes** (`SSServer.url`). Each server has `language`, `hd`, `streamNo`.
- **This is the highest-priority stream source** — sorted first in `LiveStreamPlayer.tsx` (`score()` adds +1000 to any label starting with `ss ·`).
- Free plan: 500 req/day. One match detail page = ~1 call.

### 5.3 `rapidapi-streams` — secondary streaming provider (native HLS/MP4)
- File: `supabase/functions/rapidapi-streams/index.ts`
- Upstream: **football-live-streaming-api.p.rapidapi.com**
- Secret: `RAPIDAPI_KEY` (same key, different host)
- Client wrapper: `src/services/rapidApi.ts`
- Returns raw servers; `serversToStreams()` filters out DRM/FLV and keeps `.m3u8` (HLS) + `.mp4`.
- "Referer" servers are wrapped via the edge function's `action=proxy` endpoint to inject the upstream `Referer` / `User-Agent` headers.
- BASIC plan has a **daily quota** — 429s here are expected when the cap is hit and they reset at midnight UTC. Frontend silently falls back to the other providers.

### 5.4 `sportsrc` — tertiary streaming fallback (iframes)
- File: `supabase/functions/sportsrc/index.ts`
- Upstream: SportSRC API
- Secret: `SPORTSRC_API_KEY`
- Client wrapper: `src/services/sportsrcApi.ts`
- Iframe-only embeds. Used last in the source list.

### 5.5 Source priority in `LiveStreamPlayer.tsx`
1. SportStreaming (`SS · ...` labels) — **always first** (+1000 score)
2. RapidAPI football-live-streaming (native HLS/MP4)
3. SportSRC (iframes)

Servers are then scored by broadcaster (FOX, BBC, beIN, DAZN, Sky, etc.), HD flag, and English/multi-language. Failed sources auto-rotate after a 10s timeout.

---

## 6. Monetization

- **Live video gate**: `src/components/ContentLocker.tsx` (AdBlueMedia CPA wall). Unskippable. Polls completion every 15s. Do not weaken.
- **Subscriptions**: Stripe-backed, three tiers (Free / Pro / Ultimate) in `SubscriptionScreen.tsx`. Tier names and copy live there.

---

## 7. Secrets (already configured in Lovable Cloud)

| Secret                       | Used by                                |
| ---------------------------- | -------------------------------------- |
| `API_FOOTBALL_KEY`           | `football-api`                         |
| `RAPIDAPI_KEY`               | `sport-streaming`, `rapidapi-streams`  |
| `SPORTSRC_API_KEY`           | `sportsrc`                             |
| `LOVABLE_API_KEY`            | Lovable AI Gateway (if used)           |
| `SUPABASE_*`                 | Auto-managed by Lovable Cloud          |

Never log, echo, or return secret values. `SUPABASE_SERVICE_ROLE_KEY` is not accessible on Lovable Cloud.

---

## 8. Conventions / rules

- **World Cup matches must always sort first** on Home and Live screens (helper regex: `/world cup|fifa|coupe du monde|mondial/i`). Already implemented in `HomeScreen.tsx` and `LiveMatchesScreen.tsx`.
- **No close button on `ContentLocker`** — ever.
- Match-detail video player must **not** expose a fullscreen toggle in the chrome.
- All color/gradient/shadow values come from semantic tokens in `src/index.css`. No raw hex in components.
- Keep edge functions stateless and short. Cache headers already set (`Cache-Control: max-age=30` for events, `15` for streams).
- When adding a new streaming provider, mirror the pattern: edge function in `supabase/functions/<name>/`, client wrapper in `src/services/<name>Api.ts`, register in `LiveStreamPlayer.tsx` and adjust `score()` weighting.

---

## 9. File map (quick reference)

```
src/
  App.tsx                       routes
  pages/                        thin route wrappers
  components/
    AppLayout.tsx               shell + bottom nav
    BottomNavigation.tsx
    HomeScreen.tsx              featured + lists, sorts WC first
    LiveMatchesScreen.tsx       date-nav, betting odds, sorts WC first
    MatchDetail.tsx             video + 2D pitch + ticker
    LiveStreamPlayer.tsx        multi-source player (HLS/MP4/iframe)
    ContentLocker.tsx           AdBlueMedia CPA gate (unskippable)
    SubscriptionScreen.tsx      Stripe tiers
    ProfileScreen.tsx
    SEOHead.tsx                 react-helmet-async wrapper
  services/
    footballApi.ts              -> football-api edge fn
    sportStreamingApi.ts        -> sport-streaming edge fn (primary)
    rapidApi.ts                 -> rapidapi-streams edge fn
    sportsrcApi.ts              -> sportsrc edge fn
  integrations/supabase/        AUTO-GENERATED — do not edit
  data/matches.ts               types + mock fallbacks
  index.css                     design tokens (HSL)

supabase/functions/
  football-api/                 fixtures, standings, live
  sport-streaming/              primary stream provider
  rapidapi-streams/             native HLS/MP4 + referer proxy
  sportsrc/                     iframe fallback

public/
  llms.txt                      LLM-friendly site description
  sitemap.xml, robots.txt
```

---

## 10. When debugging streams

1. Open match detail, watch console for `SportStreaming fetch failed` / `RapidAPI fetch failed` / `SportSRC fetch failed`.
2. A 429 from `rapidapi-streams` = BASIC daily quota hit. Expected. Falls back automatically.
3. If **zero** sources resolve, the team-name fuzzy match in each `find*Match` likely failed — check normalization (`norm()` strips non-alphanumerics, lowercases).
4. Iframe sources can silently 404; the 10s `LOAD_TIMEOUT_MS` rotates to next source.

---

## 11. When in doubt

- Prefer Lovable Cloud + existing edge functions over adding new infra.
- Prefer extending an existing component over creating parallel ones.
- Match the liquid-glass aesthetic — no generic Tailwind starter look.
- Ask the user before making sweeping UI restructures.
