/**
 * Builds the default social share image (1200x630) from your logo, headline and service area.
 * Replace it by putting your own image in /public (e.g. /public/share.jpg) and
 * pointing `ogImage` in src/config/site.ts at '/share.jpg'.
 */
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { site } from '../config/site';
import { publicFileExists } from '../lib/utils';

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Splits text into lines of at most `max` characters. */
function wrap(text: string, max: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > max) {
      lines.push(line);
      line = word;
    } else {
      line = (line + ' ' + word).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

export const GET: APIRoute = async () => {
  const { ink, accent } = site.brand;
  const headline = wrap('Interior painters for NYC apartments, homes and offices', 24);
  const chips = ['#A3AD99', '#B8AFA3', '#98A19B', accent, '#9F9389'];

  // Use the light logo when there is one; otherwise draw a simple text mark.
  const logoFile = site.logoImageLight && publicFileExists(site.logoImageLight) ? site.logoImageLight : null;
  const textMark = `
    <rect x="72" y="72" width="64" height="64" rx="12" fill="#ffffff"/>
    <rect x="86" y="88" width="36" height="14" rx="3" fill="${accent}"/>
    <rect x="86" y="108" width="22" height="14" rx="3" fill="${ink}"/>
    <text x="156" y="118" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="800" fill="#ffffff">${escape(site.name)}</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${ink}"/>
    ${logoFile ? '' : textMark}
    ${headline
      .map(
        (l, i) =>
          `<text x="72" y="${270 + i * 84}" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="800" letter-spacing="-2" fill="#ffffff">${escape(l)}</text>`,
      )
      .join('')}
    <text x="72" y="${270 + headline.length * 84 - 10}" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="#ffffff" fill-opacity="0.92">Flat-rate quotes and on-time crews.</text>
    <text x="72" y="${270 + headline.length * 84 + 30}" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#ffffff" fill-opacity="0.8">Serving ${escape(site.areaSummary)}</text>
    ${chips.map((c, i) => `<rect x="${72 + i * 92}" y="578" width="76" height="14" rx="3" fill="${c}"/>`).join('')}
  </svg>`;

  let image = sharp(Buffer.from(svg));
  if (logoFile) {
    const logo = await sharp(fs.readFileSync(path.join(process.cwd(), 'public', logoFile))).resize({ height: 88 }).toBuffer();
    image = image.composite([{ input: logo, left: 72, top: 64 }]);
  }

  const jpeg = await image.jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { 'Content-Type': 'image/jpeg' } });
};
