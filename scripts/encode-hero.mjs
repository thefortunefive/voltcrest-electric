/**
 * encode-hero.mjs — builds the two-layer scroll-scrub hero assets.
 *
 * INPUT (git-ignored): sources/master.mp4 — 57.7s, 2552x1440, 24fps:
 *   0–2s     fade in from black
 *   2–30s    night house, blue flashlight beams wandering room to room
 *   30–35s   beams fade — darkest, still
 *   36–43s   first warm lights (lower-left rooms)
 *   43–57.7s warm light spreads window by window to a full golden glow
 *
 * MEASURED (96x54 grayscale scan of the flashlight phase):
 *   • Idle window frames 76..308 (3.17–12.83s, 9.67s): endpoint pair PSNR
 *     52.5 dB — HIGHER than the phase's own consecutive-frame steps (47–60dB),
 *     both endpoints dark between-beam moments (luma 22.7/22.6). The loop is
 *     therefore a DIRECT WRAP — pure continuous segment, no crossfade baked.
 *   • Scrub start frame 369 (15.375s, luma 22.6): as dark as the idle
 *     endpoints, so the idle→scrub handoff cross-fade is dark-into-dark.
 *
 * OUTPUTS:
 *   public/hero-idle.mp4   — 9.67s autoplay loop, 1920w, normal GOP
 *   public/hero-web.mp4    — 42.3s scrub master, 1280w, SHORT GOP (g=8) so
 *                            currentTime seeks land fast while scrolling
 *   public/hero-mobile.mp4 — same range, 854w, g=4, for phone-class devices
 *   public/hero-poster.jpg — idle first frame (dark house)
 *
 * Run:  npm run encode-hero
 */

import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'sources', 'master.mp4');
const PUB = (f) => path.join(ROOT, 'public', f);

// ── Tunables (frame-exact at 24fps, from the measured scan) ─────────────────
const IDLE_IN_F = 76;     // 3.167s — dark, beams mid-drift
const IDLE_OUT_F = 309;   // exclusive; last frame 308 (12.833s) matches frame 76 at 52.5dB
const SCRUB_IN_F = 369;   // 15.375s — dark between-beam moment; scrub runs to EOF

const ff = (args, label) => {
  execFileSync('ffmpeg', ['-v', 'error', ...args], { stdio: 'inherit' });
  const f = args[args.length - 1];
  const mb = statSync(f).size / (1024 * 1024);
  console.log(`${label}: ${mb.toFixed(2)} MiB ${mb < 25 ? '(OK)' : '— OVER 25 MiB Cloudflare limit!'}`);
  if (mb >= 25) process.exit(1);
};

console.log('1/4 hero-idle.mp4 (direct-wrap loop, frames 76..308) …');
ff([
  '-i', SRC,
  '-vf', `trim=start_frame=${IDLE_IN_F}:end_frame=${IDLE_OUT_F},setpts=PTS-STARTPTS,scale=1920:-2,format=yuv420p`,
  '-an', '-c:v', 'libx264', '-crf', '26', '-preset', 'slow', '-movflags', '+faststart',
  '-y', PUB('hero-idle.mp4'),
], 'hero-idle.mp4');

console.log('2/4 hero-web.mp4 (scrub master, short GOP) …');
ff([
  '-i', SRC,
  '-vf', `trim=start_frame=${SCRUB_IN_F},setpts=PTS-STARTPTS,scale=1280:-2,format=yuv420p`,
  '-an', '-c:v', 'libx264', '-crf', '24', '-preset', 'slow',
  '-g', '8', '-keyint_min', '8', '-sc_threshold', '0',   // keyframe every 8 frames → fast seeks
  '-movflags', '+faststart',
  '-y', PUB('hero-web.mp4'),
], 'hero-web.mp4');

console.log('3/4 hero-mobile.mp4 (phone scrub, g=4) …');
ff([
  '-i', SRC,
  '-vf', `trim=start_frame=${SCRUB_IN_F},setpts=PTS-STARTPTS,scale=854:-2,format=yuv420p`,
  '-an', '-c:v', 'libx264', '-crf', '26', '-preset', 'slow',
  '-g', '4', '-keyint_min', '4', '-sc_threshold', '0',
  '-movflags', '+faststart',
  '-y', PUB('hero-mobile.mp4'),
], 'hero-mobile.mp4');

console.log('4/4 hero-poster.jpg (idle first frame) …');
execFileSync('ffmpeg', ['-v', 'error', '-i', PUB('hero-idle.mp4'), '-frames:v', '1', '-q:v', '3', '-y', PUB('hero-poster.jpg')], { stdio: 'inherit' });
console.log('done');
