import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../config/site';
import { hasPlaceholder } from './utils';

export type Service = CollectionEntry<'services'>;
export type Area = CollectionEntry<'areas'>;
export type Project = CollectionEntry<'projects'>;
export type Review = CollectionEntry<'reviews'>;

/** The paint chips used across the site (names are just for fun, not real paint colors). */
export const chips = [
  { name: 'Stoop Gray', hex: '#9F9389' },
  { name: 'Brownstone', hex: '#8A5A49' },
  { name: 'Hudson Fog', hex: '#98A19B' },
  { name: 'Fire Escape', hex: '#2B2A2B' },
  { name: 'Central Park', hex: '#A3AD99' },
] as const;

export const chipAt = (i: number) => chips[i % chips.length];

export async function getServices(): Promise<Service[]> {
  const all = await getCollection('services');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getAreas(): Promise<Area[]> {
  const all = await getCollection('areas');
  const regionRank = (r: string) => {
    const i = site.regions.indexOf(r);
    return i === -1 ? 999 : i;
  };
  return all.sort(
    (a, b) =>
      regionRank(a.data.region) - regionRank(b.data.region) ||
      a.data.order - b.data.order ||
      a.data.name.localeCompare(b.data.name),
  );
}

/** Areas grouped by region, in the order of `regions` in site.ts. */
export async function getAreasByRegion() {
  const areas = await getAreas();
  const groups = new Map<string, Area[]>();
  for (const region of site.regions) groups.set(region, []);
  for (const a of areas) {
    if (!groups.has(a.data.region)) groups.set(a.data.region, []);
    groups.get(a.data.region)!.push(a);
  }
  return [...groups.entries()].filter(([, list]) => list.length > 0);
}

/**
 * Display order for every project list on the site:
 *  1. Projects with a before AND after photo come first, so visitors see the transformations straight away.
 *  2. Then single-photo projects.
 *  3. Any `sample: true` placeholders always come last.
 * Within each group: newest first (if there is a `date`), then projects with more photos, then A to Z by title.
 * (So when only some projects fit in the featured 12, the ones with the most to look at stay in.)
 */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort(
    (a, b) =>
      Number(a.data.sample) - Number(b.data.sample) ||
      Number(Boolean(b.data.before)) - Number(Boolean(a.data.before)) ||
      (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0) ||
      b.data.gallery.length - a.data.gallery.length ||
      a.data.title.localeCompare(b.data.title),
  );
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getProjects();
  const withSlider = all.filter((p) => p.data.before);
  const featured = withSlider.filter((p) => p.data.featured);
  return [...featured, ...withSlider.filter((p) => !p.data.featured)].slice(0, limit);
}

export async function getReviews(): Promise<Review[]> {
  const all = await getCollection('reviews');
  // Featured first, then newest first. Reviews without a date keep the order they have in reviews.json.
  return all.sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || (b.data.date ?? '').localeCompare(a.data.date ?? ''),
  );
}

/** Reviews that no longer contain a [PLACEHOLDER]. Only these count toward star ratings. */
export function realReviews(reviews: Review[]) {
  return reviews.filter((r) => !hasPlaceholder(r.data.text) && !hasPlaceholder(r.data.name));
}

export function reviewStats(reviews: Review[]) {
  const real = realReviews(reviews);
  if (real.length === 0) return null;
  const avg = real.reduce((sum, r) => sum + r.data.rating, 0) / real.length;
  return { count: real.length, average: Math.round(avg * 10) / 10 };
}
