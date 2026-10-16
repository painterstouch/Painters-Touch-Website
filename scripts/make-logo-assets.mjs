/**
 * Builds the website's logo files from your original logo artwork.
 *
 *   npm run logo
 *
 * Input:  brand/painters-touch-logo-original.webp  (the roller "P" logo on a plain white background)
 * Output (in /public):
 *   logo.png              header logo for light backgrounds (transparent background)
 *   logo-light.png        same logo with white lettering, for the dark footer and the share image
 *   favicon.png           browser tab icon (the roller "P")
 *   apple-touch-icon.png  phone home-screen icon (the roller "P")
 *
 * The "PAINTING SERVICES" line under the wordmark is left out of these files because it is far too
 * small to read at header size.
 *
 * The colors are taken from `brand.ink` and `brand.accent` in src/config/site.ts, so if you change the site's
 * main color there, run `npm run logo` again and the logo follows.
 *
 * If you later get a logo with a transparent background from a designer (ideally an SVG or a large
 * PNG), you don't need this script: just save it as public/logo.png (and public/logo-light.png for
 * dark backgrounds).
 */
import sharp from 'sharp';
import fs from 'node:fs';

const SRC = 'brand/painters-touch-logo-original.webp';
if (!fs.existsSync(SRC)) {
  console.error(`Missing ${SRC}`);
  process.exit(1);
}

const LOGO_HEIGHT = 144; // final logo height in px (it is shown ~48px tall, so this is crisp on retina screens)
const TILE_BG = '#f6f4f1'; // background of the favicon / home-screen tile (same as the site background)

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb) => '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');

// ── read the artwork ─────────────────────────────────────────────────────
const { data, info } = await sharp(SRC).flatten({ background: '#ffffff' }).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const px = (x, y) => [data[(y * W + x) * C], data[(y * W + x) * C + 1], data[(y * W + x) * C + 2]];

// background colour = the median of a few spots in the margins
const samples = [px(5, 5), px(W - 6, 5), px(5, H - 6), px(W - 6, H - 6), px(Math.floor(W / 2), 150), px(Math.floor(W / 2), H - 120)];
const BG = [0, 1, 2].map((i) => samples.map((s) => s[i]).sort((a, b) => a - b)[Math.floor(samples.length / 2)]);
const distTo = (p, c) => Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]);

// The logo has exactly two solid colours: black and taupe. Measure them from the artwork.
function averageNear(center, tolerance) {
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = px(x, y);
    if (distTo(p, center) < tolerance) { r += p[0]; g += p[1]; b += p[2]; n++; }
  }
  return [r / n, g / n, b / n];
}
const BLACK = averageNear([24, 24, 24], 40);
const TAUPE = averageNear([160, 152, 138], 28);
console.log('logo colors: black', toHex(BLACK), ' taupe', toHex(TAUPE));

// ── lift the logo off the background ─────────────────────────────────────
// Every pixel is either background, a solid colour, or an anti-aliased mix of the two. For each pixel we
// work out which solid colour it belongs to and how much of it there is (its opacity).
const SOLIDS = [BLACK, TAUPE];
const alpha = new Float32Array(W * H);
const which = new Uint8Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const p = px(x, y);
  const d = [p[0] - BG[0], p[1] - BG[1], p[2] - BG[2]];
  let best = { a: 0, k: 0, res: Infinity };
  SOLIDS.forEach((c, k) => {
    const v = [c[0] - BG[0], c[1] - BG[1], c[2] - BG[2]];
    const a = Math.max(0, Math.min(1, (d[0] * v[0] + d[1] * v[1] + d[2] * v[2]) / (v[0] * v[0] + v[1] * v[1] + v[2] * v[2])));
    const res = Math.hypot(d[0] - a * v[0], d[1] - a * v[1], d[2] - a * v[2]);
    if (res < best.res) best = { a, k, res };
  });
  const i = y * W + x;
  alpha[i] = best.a < 0.04 ? 0 : best.a > 0.97 ? 1 : best.a; // drop faint noise, keep soft edges
  which[i] = best.k;
}

/** An RGBA image of a region, with each solid colour replaced by the colours you pass in. */
async function render(region, colors, { keep } = {}) {
  const w = region.right - region.left + 1;
  const h = region.bottom - region.top + 1;
  const rgba = Buffer.alloc(w * h * 4);
  const rgb = colors.map((hex) => toRgb(hex));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const sx = region.left + x, sy = region.top + y, i = sy * W + sx, o = (y * w + x) * 4;
    const visible = keep ? keep(sx, sy) : true;
    const c = rgb[which[i]];
    rgba[o] = c[0]; rgba[o + 1] = c[1]; rgba[o + 2] = c[2];
    rgba[o + 3] = visible ? Math.round(alpha[i] * 255) : 0;
  }
  return sharp(rgba, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

// Where things are in the artwork (pixels): the wordmark row, and the "PAINTING SERVICES" row below it.
const WORDMARK = { left: 140, right: 1425, top: 337, bottom: 633 };
// The roller "P" on its own (the "A" starts just below and to the right of it, so cut that part away).
const P_MARK = { left: 140, right: 395, top: 337, bottom: 633 };
const notTheA = (x, y) => !(x >= 205 && y >= 493);

const blackHex = toHex(BLACK);
const taupeHex = toHex(TAUPE);

// The logo is recoloured to the website's own colours (brand.ink and brand.accent in src/config/site.ts):
// the black stays the site's black and the taupe parts (roller head and "TOUCH") become the site's burgundy.
const siteConfig = fs.readFileSync('src/config/site.ts', 'utf8');
const brandColor = (key) => siteConfig.match(new RegExp(`\\b${key}:\\s*'(#[0-9a-fA-F]{6})'`))?.[1];
const inkHex = brandColor('ink') ?? blackHex;
const accentHex = brandColor('accent') ?? taupeHex;
console.log('recoloured to the website: ink', inkHex, ' accent', accentHex);

/** The same colour at a given lightness (0 to 1), keeping its hue, so it stays recognisably the same colour. */
function withLightness(hex, lightness) {
  const [r, g, b] = toRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(max + min - 1));
  let h = 0;
  if (d !== 0) h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  const c = (1 - Math.abs(2 * lightness - 1)) * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = lightness - c / 2;
  const [r1, g1, b1] = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(h) % 6];
  return toHex([r1 + m, g1 + m, b1 + m].map((v) => v * 255));
}

const dark = [inkHex, accentHex];
const light = ['#ffffff', withLightness(accentHex, 0.68)]; // white lettering, a lighter burgundy that stays readable on the dark footer

async function logoFile(colors, file) {
  const full = await render(WORDMARK, colors);
  await sharp(full)
    .resize({ height: LOGO_HEIGHT, kernel: 'lanczos3' })
    .png({ compressionLevel: 9, palette: true, quality: 95, colors: 128, dither: 0 })
    .toFile(file);
  const m = await sharp(file).metadata();
  console.log('wrote', file, `${m.width}x${m.height}`);
}
await logoFile(dark, 'public/logo.png');
await logoFile(light, 'public/logo-light.png');

// Small WebP copies at the size the header/footer shows them (48px tall), plus a sharper 2x version.
// Logo.astro uses these automatically when they exist (faster than the full PNG).
for (const name of ['logo', 'logo-light']) {
  for (const width of [208, 416]) {
    await sharp(`public/${name}.png`).resize({ width }).webp({ quality: width > 208 ? 75 : 90, effort: 6 }).toFile(`public/${name}-${width}.webp`);
    console.log('wrote', `public/${name}-${width}.webp`);
  }
}

// Tab icon and phone home-screen icon: the roller "P" on a soft tile.
const pMark = await render(P_MARK, dark, { keep: notTheA });
async function tile(size, file, { rounded }) {
  const inner = Math.round(size * (rounded ? 0.74 : 0.68));
  const p = await sharp(pMark).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 }).resize({ height: inner, kernel: 'lanczos3' }).toBuffer();
  const meta = await sharp(p).metadata();
  const r = rounded ? Math.round(size * 0.2) : 0;
  const base = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="${TILE_BG}"/></svg>`);
  await sharp(base)
    .composite([{ input: p, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png()
    .toFile(file);
  console.log('wrote', file, `${size}x${size}`);
}
await tile(64, 'public/favicon.png', { rounded: true });
await tile(180, 'public/apple-touch-icon.png', { rounded: false });

console.log('brand colors measured from the logo: black', blackHex, ' taupe', taupeHex);
