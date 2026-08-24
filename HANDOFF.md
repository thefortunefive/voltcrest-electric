# Beacon Electric — Electrician Demo Site · Handoff

Single-page demo for a **fictional** electrical contractor ("Beacon Electric").
Portfolio piece demonstrating a scroll-scrubbed blackout-to-glow video hero.
Sister project to `fifth-ave-ai` (scrub architecture) and `hvac-site` (sections).

## Stack

- Next.js 14 (App Router), static export (`output: 'export'`) → `out/`
- Tailwind CSS (brand tokens in `tailwind.config.ts`)
- GSAP + ScrollTrigger + Lenis (Lenis disabled on phone-class devices)
- Deploy target: Cloudflare Pages (`wrangler pages deploy out`). Never Vercel.

## Hero architecture — two-layer scroll scrub

Source master (git-ignored): `sources/master.mp4` — 57.7s, 2552x1440, 24fps,
locked camera: black fade-in → flashlight beams wandering a dark house →
darkest stillness → warm windows lighting → full golden glow.

**Layer 1 — idle loop** (`public/hero-idle.mp4`, 0.54 MiB):
frames 76..308 (3.17–12.83s, 9.67s) of the flashlight phase. The window was
found by exhaustive scan: endpoint pair PSNR **52.5 dB — more similar than
ordinary consecutive frames** (47–60 dB in this phase), both endpoints dark
between-beam moments. DIRECT WRAP — pure continuous segment, no crossfade.
Autoplays at scroll-0; NOT scrubbed.

**Layer 2 — scrub** (`public/hero-web.mp4` 16.15 MiB, 1280w, **GOP 8**;
`public/hero-mobile.mp4` 11.99 MiB, 854w, **GOP 4**):
source frames 369→end (15.375–57.7s, 42.3s continuous). Short GOP is what
makes scroll-driven `currentTime` seeks land fast — do not re-encode with
default keyframe spacing. Scrub start frame chosen at luma 22.6 — identical
darkness to the idle endpoints, so the first-scroll cross-fade between layers
is dark-into-dark and invisible.

**Seek architecture** (ported from the fifth-ave-ai elevator hero):
ScrollTrigger writes `targetProgress` only → RAF loop seeks when the decoder
is idle, the diff exceeds threshold (0.008s desktop / 0.02s mobile), and the
target is seekable → `seeked` clears the lock and records rendered progress.
Mobile: decoder priming on first touch, native scroll (no Lenis), poster
fallback on error/reduced-motion. Debug overlay: `?debugHero=1`.

Runway: 460vh for the 42.3s scrub (same feel as the proven sister ratio).
Text beats (see `BEATS` in `components/Hero.tsx`): brand → "When the lights
go out…" → "…a flashlight only gets you so far." → "One call. Power
restored." (lands as the first warm windows ignite) → "Licensed. Bonded.
Bright." — final 12% kept text-free for the fully-lit payoff.

**Local testing note:** an MP4 served without HTTP Range support cannot be
seeked by Chrome — the scrub will look frozen. `scripts/verify.mjs` ships a
range-capable server for this reason. Cloudflare Pages serves ranges natively.

Re-render assets: `npm run encode-hero` (needs ffmpeg + `sources/master.mp4`).

## Brand

Sampled from the footage: amber glow `#C58935` (+ light `#E2A94F`), night
base `#050B16` / `#0A1626` / `#122238` (sky `#001026`, house shadow `#032443`).
Fonts: Barlow (display) + Inter (body).

## Rebranding for a real client — one-file edit

**All business identity lives in `lib/site-config.ts`** — name, phone,
tagline, license, towns, hours, review numbers, footer credit. Sections read
from it. Swap the footage in `/sources`, re-run `npm run encode-hero`, adjust
the amber/night hexes in `tailwind.config.ts`, replace the bolt mark in
`Header.tsx`/`Footer.tsx`.

## Sections

Hero (scrub) · Services (Panel Upgrades / EV Chargers / Rewiring / Lighting /
Generators / 24-7 Emergency) · Why Us (6 proof points) · Process (4 steps) ·
Service Area · Contact (phone + quote form, client-side demo success state) ·
Footer with Fifth Ave AI credit → fifthaveai.com.
Shared fade-up spec in `lib/animations.ts` (`[data-reveal]`).

## Verification results (2026-08-05, headless Chrome via scripts/verify.mjs)

- Idle loop: playing at scroll-0, wrapped mid-test, 0 stalls, opacity 1 ✅
- Handoff: idle opacity → 0 at every scrolled depth ✅
- Scrub tracking: currentTime == expected at 15/40/62/85/100% depth (exact) ✅
- 375px: no horizontal overflow, all tap targets ≥44px, 4 `tel:` links ✅
- `npm run build` static export clean ✅ · all video assets < 25 MiB ✅

## TODOs before a real launch

- [ ] Wire the quote form to a backend (fifth-ave-ai's Pages Function +
      Resend + Turnstile setup is the template)
- [ ] Real business info in `site-config.ts` (everything marked `// DEMO`)
- [ ] OG image + favicon set
- [ ] Lighthouse pass on the deployed URL (hero video weight is the main cost;
      poster + `preload` behavior already mitigate)
- [ ] Cloudflare Pages project + GitHub repo when ready to deploy
