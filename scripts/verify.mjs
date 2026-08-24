/**
 * verify.mjs — headless-Chrome checks for the two-layer scrub hero.
 *   1. Idle loop plays at scroll-0 and wraps (2+ cycles) without stalling
 *   2. Idle layer fades out once scrolling starts (handoff)
 *   3. Scrub video currentTime tracks scroll position at several depths
 *   4. Screenshots along the scrub (flashlights → dark → warm → glow)
 *   5. 375px: no horizontal overflow, tap targets ≥44px, tel: links
 * Usage: node scripts/verify.mjs <playwrightDir> <shotDir>
 */

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const [, , playwrightDir, shotDir] = process.argv;
const { chromium } = await import(
  pathToFileURL(path.join(playwrightDir, 'node_modules', 'playwright', 'index.mjs')).href
);

// Range-capable static server — Chrome cannot SEEK an mp4 served without
// HTTP Range support, so a naive server makes the scrub look broken even
// though production (Cloudflare Pages) serves ranges natively.
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  if (!path.extname(p)) p += '.html';
  const file = path.join(OUT, p);
  try {
    const st = await stat(file);
    const type = MIME[path.extname(p)] ?? 'application/octet-stream';
    const data = await readFile(file);
    const range = req.headers.range && /bytes=(\d+)-(\d*)/.exec(req.headers.range);
    if (range) {
      const start = parseInt(range[1], 10);
      const end = range[2] ? parseInt(range[2], 10) : st.size - 1;
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Range': `bytes ${start}-${end}/${st.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
      });
      res.end(data.subarray(start, end + 1));
    } else {
      res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': st.size });
      res.end(data);
    }
  } catch { res.writeHead(404); res.end('nf'); }
});
await new Promise((r) => server.listen(8932, r));

const browser = await chromium.launch();
const results = {};

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:8932/', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(2000);

// ── 1. Idle loop: sample currentTime for 12s (loop is 9.67s → must wrap once)
results.idle = await page.evaluate(async () => {
  const vids = Array.from(document.querySelectorAll('video'));
  const idle = vids.find((v) => v.currentSrc.includes('hero-idle'));
  if (!idle) return { present: false };
  const samples = [];
  const t0 = performance.now();
  await new Promise((resolve) => {
    const iv = setInterval(() => {
      samples.push(+idle.currentTime.toFixed(2));
      if (performance.now() - t0 > 12000) { clearInterval(iv); resolve(); }
    }, 400);
  });
  let wraps = 0, stalls = 0;
  for (let i = 1; i < samples.length; i++) {
    const d = samples[i] - samples[i - 1];
    if (d < -5) wraps++;
    else if (d === 0) stalls++;
  }
  return {
    present: true, playing: !idle.paused, duration: +idle.duration.toFixed(2),
    opacity: getComputedStyle(idle).opacity, wraps, stalls,
    first: samples[0], last: samples[samples.length - 1],
  };
});
await page.screenshot({ path: path.join(shotDir, 'scrub-0-idle.png') });

// ── 2+3. Scroll to depths, confirm handoff + scrub tracking ────────────────
const depths = [0.15, 0.4, 0.62, 0.85, 1.0];
results.scrub = [];
for (const d of depths) {
  await page.evaluate((dd) => {
    const runway = document.querySelector('section[aria-label="Intro"]');
    const max = runway.offsetHeight - window.innerHeight;
    window.scrollTo(0, max * dd);
  }, d);
  await page.waitForTimeout(1400); // let Lenis settle + seek land
  const state = await page.evaluate(() => {
    const vids = Array.from(document.querySelectorAll('video'));
    const scrub = vids.find((v) => v.currentSrc.includes('hero-web') || v.currentSrc.includes('hero-mobile'));
    const idle = vids.find((v) => v.currentSrc.includes('hero-idle'));
    return {
      scrubTime: +scrub.currentTime.toFixed(2),
      scrubDur: +scrub.duration.toFixed(2),
      idleOpacity: getComputedStyle(idle).opacity,
    };
  });
  results.scrub.push({ depth: d, ...state, expected: +(state.scrubDur * d).toFixed(2) });
  await page.screenshot({ path: path.join(shotDir, `scrub-${Math.round(d * 100)}.png`) });
}

// Scroll through remaining sections so fades fire, then full-page shot
await page.evaluate(async () => {
  const step = window.innerHeight * 0.7;
  for (let y = window.scrollY; y <= document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 200));
  }
});
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(shotDir, 'sections-full.png'), fullPage: false });
await page.close();

// ── 5. Mobile 375 ───────────────────────────────────────────────────────────
const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
await mobile.goto('http://localhost:8932/', { waitUntil: 'load', timeout: 60000 });
await mobile.waitForTimeout(1500);
results.mobile = await mobile.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  overflows: document.documentElement.scrollWidth > 375,
  telLinks: document.querySelectorAll('a[href^="tel:"]').length,
  smallTaps: Array.from(document.querySelectorAll('a, button')).filter((el) => {
    const r = el.getBoundingClientRect();
    return (r.width > 0 || r.height > 0) && (r.height < 44 || r.width < 44);
  }).map((el) => `${el.tagName} "${(el.textContent || '').trim().slice(0, 25)}"`),
}));
await mobile.screenshot({ path: path.join(shotDir, 'mobile-hero.png') });
await mobile.close();

await browser.close();
server.close();
console.log(JSON.stringify(results, null, 2));
