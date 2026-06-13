# API Reference — ScoreLive

Detailed reference for every backend integration. All upstream APIs are proxied through Supabase Edge Functions so secrets stay server-side.

Base URL for edge functions:
```
${VITE_SUPABASE_URL}/functions/v1/<function-name>
```
Client calls include `Authorization: Bearer ${VITE_SUPABASE_PUBLISHABLE_KEY}`.

---

## 1. `football-api` — match & league data

**File**: `supabase/functions/football-api/index.ts`
**Upstream**: API-Football (`v3.football.api-sports.io`)
**Secret**: `API_FOOTBALL_KEY`
**Client**: `src/services/footballApi.ts`

Used for: fixtures (live / by date / by league), standings, team logos.

Auto-refresh every **60s** for live data via `react-query`.

CDN team logos come from API-Football's media CDN.

---

## 2. `sport-streaming` — PRIMARY stream provider ⭐

**File**: `supabase/functions/sport-streaming/index.ts`
**Upstream**: `sport-streaming-api.p.rapidapi.com` (RapidAPI)
**Secret**: `RAPIDAPI_KEY`
**Client**: `src/services/sportStreamingApi.ts`
**Plan**: Free — 500 requests/day

### Actions

| Action               | Upstream path           | Cache       |
| -------------------- | ----------------------- | ----------- |
| `action=events`      | `/events`               | 30s         |
| `action=streams&id=` | `/streams/{id}`         | 15s         |
| `action=sports`      | `/sports`               | (default)   |

### Response shape (`SSServer`)

```ts
{
  url: string;        // embed.st iframe URL
  name: string;
  source: string;
  streamNo: number;
  language: string | null;
  hd: boolean;
  viewers?: number;
}
```

### Why it's first
- Highest-quality embeds (embed.st)
- Largest server selection per match
- `LiveStreamPlayer.score()` adds **+1000** to any label starting with `ss ·` to guarantee top placement.

### Match lookup
`findSportStreamingMatch(home, away)` fuzzy-matches team names (lowercased + alphanumeric-only) against `/events` filtered to `sport === "soccer" | "football"`.

---

## 3. `rapidapi-streams` — secondary (native HLS/MP4)

**File**: `supabase/functions/rapidapi-streams/index.ts`
**Upstream**: `football-live-streaming-api.p.rapidapi.com` (RapidAPI)
**Secret**: `RAPIDAPI_KEY` (shared)
**Client**: `src/services/rapidApi.ts`
**Plan**: BASIC — **daily quota** (429 when exhausted, resets midnight UTC)

### Actions

| Action                         | Purpose                                        |
| ------------------------------ | ---------------------------------------------- |
| `action=matches&status=live`   | List live matches                              |
| `action=matches&status=upcoming` | List upcoming                                |
| `action=matches&status=finished` | List finished                                |
| `action=proxy&url=&referer=&ua=` | Header-injecting proxy for referer-locked streams |

### Server filtering (`serversToStreams`)
- **Skip** DRM, FLV, anything not `.m3u8` or `.mp4`.
- For `type: "referer"`, rewrite `src` through the edge `action=proxy` so the upstream `Referer` and `User-Agent` headers get injected.

### Quota handling
429 from upstream is **expected**. `LiveStreamPlayer` silently swallows the error and uses the other providers. Do not surface this as a user-facing error.

---

## 4. `sportsrc` — tertiary fallback (iframes)

**File**: `supabase/functions/sportsrc/index.ts`
**Upstream**: SportSRC API
**Secret**: `SPORTSRC_API_KEY`
**Client**: `src/services/sportsrcApi.ts`

Returns iframe-only embeds. Used last. Match lookup again uses fuzzy team-name normalization.

---

## 5. Stream source priority (LiveStreamPlayer)

In `src/components/LiveStreamPlayer.tsx`, sources are collected in this order:

1. **SportStreaming** (iframes) — labelled `SS · {lang} [HD] #{n}`
2. **RapidAPI football-live-streaming** — native HLS / MP4
3. **SportSRC** (iframes)

Then sorted by `score(label)`:

| Match                                   | Score |
| --------------------------------------- | ----- |
| Starts with `ss ·` (SportStreaming)     | +1000 |
| Known WC broadcaster (FOX, BBC, beIN…)  | +100  |
| Contains `english` / `en` / `multi`     | +10   |
| Contains `hd`                           | +5    |

Auto-failover: a 10s `LOAD_TIMEOUT_MS` rotates to the next source on iframe/HLS error.

---

## 6. Adding a new provider

1. Create `supabase/functions/<name>/index.ts` — proxy upstream, set CORS, cache headers.
2. Add the upstream API key as a Lovable Cloud secret (`secrets--add_secret`).
3. Create `src/services/<name>Api.ts` exporting `find<Name>Match(home, away)` and `fetch<Name>Servers(id)`.
4. In `LiveStreamPlayer.tsx` add a `try { ... } catch { }` block to `collected`, adjust `score()` weighting.
5. Test against a live World Cup or top-league fixture.

---

## 7. Quotas — current

| Provider                          | Plan  | Limit       | Behavior on cap          |
| --------------------------------- | ----- | ----------- | ------------------------ |
| API-Football                      | (varies) | per-day  | Surfaces error           |
| sport-streaming-api               | Free  | 500/day     | 429 (rare)               |
| football-live-streaming-api       | BASIC | daily cap   | 429 — silently fallback  |
| SportSRC                          | (varies) | —        | —                        |

Resets are midnight UTC unless noted.
