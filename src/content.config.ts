import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const faq = z.object({ q: z.string(), a: z.string() });

/**
 * Gallery projects: one folder per project in src/content/projects/<project-name>/
 * containing index.md plus the photos.
 */
const projects = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Neighborhood and borough, e.g. "Astoria, Queens" */
      location: z.string(),
      /** Used for the filter buttons. Use the same spelling every time, e.g. "Bedrooms". */
      roomType: z.string(),
      /** Optional: slug of a service page (e.g. "interior-painting") to link to. */
      service: z.string().optional(),
      /** Optional: slug of an area page (e.g. "astoria") to link to. */
      area: z.string().optional(),
      /** Completion date, e.g. 2026-03-15 */
      date: z.coerce.date().optional(),
      before: image().optional(),
      after: image(),
      /** Optional alt text overrides (describe what is in the photo). */
      beforeAlt: z.string().optional(),
      afterAlt: z.string().optional(),
      /** Extra photos shown on the project page. */
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      /** Show on the home page (the first 3 featured projects are used). */
      featured: z.boolean().default(false),
      /** true = sample/placeholder project that must be replaced before launch. */
      sample: z.boolean().default(false),
    }),
});

/** Service pages: one Markdown file per service in src/content/services/. */
const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    order: z.number().default(100),
    /** One sentence for cards and lists. */
    summary: z.string(),
    /** Google title and description for this page. */
    metaTitle: z.string(),
    metaDescription: z.string(),
    /** Sub-heading under the page title. */
    lead: z.string(),
    includes: z.array(z.string()),
    bestFor: z.array(z.string()).default([]),
    faqs: z.array(faq).default([]),
    /** Slugs of related service pages. */
    related: z.array(z.string()).default([]),
    /** Shown in structured data, e.g. "Interior painting". */
    serviceType: z.string(),
    /** Show the sheen guide (flat → gloss) on this page. */
    sheenGuide: z.boolean().default(false),
  }),
});

/** Service area pages: one Markdown file per neighborhood in src/content/areas/. */
const areas = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/areas' }),
  schema: z.object({
    name: z.string(),
    /** Must match one of the names in `regions` in src/config/site.ts */
    region: z.string(),
    order: z.number().default(100),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    /** One sentence under the page title. */
    lead: z.string(),
    /** Neighboring areas / sub-neighborhoods covered. */
    nearby: z.array(z.string()).default([]),
    /** Three or so things that are genuinely specific to painting in this area. */
    highlights: z.array(z.object({ title: z.string(), text: z.string() })).min(2),
    /** Slugs of the services to feature on this page. */
    services: z.array(z.string()).min(1),
    /** What to search for in the embedded map. Defaults to "<name>, <region>, NY". */
    mapQuery: z.string().optional(),
    faqs: z.array(faq).default([]),
  }),
});

/**
 * Borough / region pages (e.g. /areas/queens/): one Markdown file per page in src/content/regions/.
 * Each one gathers the neighborhood pages from the regions it covers.
 */
const regions = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/regions' }),
  schema: z.object({
    /** Shown in headings, e.g. "Queens" or "Long Island" */
    name: z.string(),
    /** Which `regions` from src/config/site.ts this page covers, e.g. ["Nassau County", "Suffolk County"] */
    covers: z.array(z.string()).min(1),
    order: z.number().default(100),
    metaTitle: z.string(),
    metaDescription: z.string(),
    /** One sentence under the page title. */
    lead: z.string(),
    highlights: z.array(z.object({ title: z.string(), text: z.string() })).min(2),
    mapQuery: z.string(),
    /** Google Maps zoom: 10 or 11 fits a borough. */
    mapZoom: z.number().default(11),
    faqs: z.array(faq).default([]),
  }),
});

/** Reviews: edit src/data/reviews.json */
const reviews = defineCollection({
  loader: file('./src/data/reviews.json'),
  schema: z.object({
    /** First name and last initial, e.g. "Maria G." */
    name: z.string(),
    /** Optional, e.g. "Astoria". Left out of the card if blank. */
    neighborhood: z.string().optional(),
    rating: z.number().min(1).max(5),
    /** Optional, YYYY-MM-DD. Newest reviews are listed first. */
    date: z.string().optional(),
    text: z.string(),
    /** Optional: show this one first on the home page. */
    featured: z.boolean().default(false),
  }),
});

export const collections = { projects, services, areas, regions, reviews };
