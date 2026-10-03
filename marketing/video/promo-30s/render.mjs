// Frame-accurate render: seeks the composition to each frame time and pipes PNG screenshots into ffmpeg.
// Usage:
//   node render.mjs                         -> renders/koreafarsi-promo-30s.mp4 (1080x1920, 60fps)
//   node render.mjs --fps 30 --out x.mp4
//   node render.mjs --stills 0,2.1,7.5      -> renders/stills/t-<sec>.png
//   node render.mjs --determinism 12.34     -> renders the same frame from two seek orders and compares
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../.."); // repo root (serves design/brand/logo)
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);

let chromium;
try { ({ chromium } = await import("playwright")); }
catch { ({ chromium } = await import(pathToFileURL(path.join(execSync("npm root -g").toString().trim(), "playwright/index.mjs")).href)); }

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff" };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": types[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const url = `http://127.0.0.1:${server.address().port}/marketing/video/promo-30s/src/index.html`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on("console", (m) => m.type() === "error" && console.error("[page]", m.text()));
await page.goto(url);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
const shot = async (t) => { await page.evaluate((t) => window.seek(t), t); return page.screenshot({ type: "png" }); };

const outDir = path.join(here, "renders");
fs.mkdirSync(outDir, { recursive: true });

if (args.includes("--stills")) {
  fs.mkdirSync(path.join(outDir, "stills"), { recursive: true });
  for (const t of opt("--stills", "0").split(",").map(Number)) {
    fs.writeFileSync(path.join(outDir, "stills", `t-${t.toFixed(2)}.png`), await shot(t));
  }
  console.log("stills written");
} else if (args.includes("--determinism")) {
  const t = Number(opt("--determinism", "12.34"));
  await shot(0); const a = await shot(t);
  await shot(29.9); await shot(5); const b = await shot(t);
  console.log(`determinism @${t}s: ${Buffer.compare(a, b) === 0 ? "IDENTICAL" : "DIFFERENT"}`);
} else {
  const fps = Number(opt("--fps", "60"));
  const dur = await page.evaluate(() => window.DURATION);
  const out = path.join(outDir, opt("--out", "koreafarsi-promo-30s.mp4"));
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-r", String(fps), "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });
  const n = Math.round(dur * fps);
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const buf = await shot(i / fps);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % (fps * 2) === 0) process.stdout.write(`\rframe ${i}/${n}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  console.log(`\nwrote ${out}`);
}
await browser.close();
server.close();
