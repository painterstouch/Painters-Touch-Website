import fs from 'node:fs';
import path from 'node:path';
import { site } from '../config/site';

/** True if a file such as "/logo.png" exists in the /public folder (build-time check). */
export function publicFileExists(file: string) {
  return fs.existsSync(path.join(process.cwd(), 'public', file));
}

/** "(212) 555-0100" → "tel:+12125550100" */
export function phoneDigits(phone: string = site.phone) {
  return phone.replace(/\D/g, '');
}
export function phoneHref(phone: string = site.phone) {
  const d = phoneDigits(phone);
  return `tel:+${d.length === 10 ? '1' : ''}${d}`;
}
export function phoneE164(phone: string = site.phone) {
  const d = phoneDigits(phone);
  return `+${d.length === 10 ? '1' : ''}${d}`;
}

/** ["A", "B", "C"] → "A, B and C" */
export function joinList(items: string[]) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** "Nassau County" → "nassau-county" (used for jump links on the service areas page). */
export function regionSlug(region: string) {
  return region.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path, site.url + '/').toString();
}

/** True for text that still has a [PLACEHOLDER] in it. */
export function hasPlaceholder(text: string) {
  return /\[[^\]]{2,}\]/.test(text);
}

const SHORT_DAY: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`;
}

/** Turns the hours in site.ts into short display lines like "Mon–Fri: 8 am – 6 pm". */
export function formatHours() {
  return site.hours.map((h) => {
    const days = h.days.map((d) => SHORT_DAY[d] ?? d);
    const label = days.length > 1 ? `${days[0]}–${days[days.length - 1]}` : days[0];
    return { label, time: `${formatTime(h.opens)} – ${formatTime(h.closes)}` };
  });
}

/** "2026-03-15" → "March 2026". Anything else (like "[DATE]") is shown as is. */
export function formatReviewDate(value?: string) {
  if (!value) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Date(value + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/** Safe JSON for a <script type="application/ld+json"> tag. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function pageTitle(part: string) {
  return `${part} | ${site.name}`;
}

/** The blog author's bio paragraphs, with {years} and {jobs} filled in from site.trust. */
export function authorBio() {
  return site.author.bio.map((p) =>
    p.replace('{years}', site.trust.yearsInBusiness).replace('{jobs}', site.trust.jobsCompleted),
  );
}
