/**
 * Lists everything on the built site that still needs your real information.
 *
 *   npm run build
 *   npm run check:placeholders
 *
 * It looks for [SQUARE BRACKET] placeholders, the sample phone/email/links from the
 * starter config, and sample projects. Add --strict to exit with an error if anything is found.
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
  console.error('No build found. Run "npm run build" first.');
  process.exit(1);
}

const strict = process.argv.includes('--strict');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ');

// What counts as "still a placeholder"
// Text people can read on the page:
const textPatterns = [
  { label: 'Bracketed placeholder', re: /\[[^\[\]]{2,}\]/g },
  { label: 'Sample phone number', re: /\(212\) 555-01\d\d/g },
  { label: 'Sample project', re: /Sample project/g },
];
// Starter values that hide in links and page code (your website address, Google and Instagram links):
const codePatterns = [
  { label: 'Starter website address (set `url` in src/config/site.ts)', re: /[\w.-]+@your-domain\.com|www\.your-domain\.com|your-domain\.com/g },
  { label: 'Starter Google Business Profile link (set `social.googleBusinessProfile` and `social.googleReview`)', re: /g\.page\/r\/YOUR_GBP_ID(?:\/review)?/g },
  { label: 'Starter Instagram link (set `social.instagram`)', re: /instagram\.com\/your-handle/g },
];

const found = new Map(); // key -> { label, pages:Set }
const record = (label, match, page) => {
  const shown = match.length > 90 ? match.slice(0, 90) + '…' : match;
  const key = `${label}||${shown}`;
  if (!found.has(key)) found.set(key, { label, text: shown, pages: new Set() });
  found.get(key).pages.add(page);
};
for (const file of walk(dist)) {
  const page = '/' + path.relative(dist, file).replace(/\\/g, '/').replace(/index\.html$/, '');
  const html = fs.readFileSync(file, 'utf8');
  const text = visibleText(html);
  for (const { label, re } of textPatterns) for (const match of text.match(re) ?? []) record(label, match, page);
  for (const { label, re } of codePatterns) for (const match of html.match(re) ?? []) record(label, match, page);
}

if (found.size === 0) {
  console.log('No placeholders found in the built site. Nice.');
  process.exit(0);
}

console.log(`\nStill to replace before launch (${found.size} item${found.size === 1 ? '' : 's'}):\n`);
let currentLabel = '';
for (const item of [...found.values()].sort((a, b) => a.label.localeCompare(b.label))) {
  if (item.label !== currentLabel) {
    currentLabel = item.label;
    console.log(`\n${currentLabel}`);
  }
  const pages = [...item.pages];
  const where = pages.length > 3 ? `${pages.slice(0, 3).join(', ')} and ${pages.length - 3} more` : pages.join(', ');
  console.log(`  ${item.text}\n      on: ${where}`);
}
console.log('\nWhere to fix them: business details in src/config/site.ts, reviews in src/data/reviews.json,');
console.log('projects in src/content/projects, services and areas in src/content. See README.md.\n');
process.exit(strict ? 1 : 0);
