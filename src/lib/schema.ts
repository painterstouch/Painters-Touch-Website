/** JSON-LD (structured data) builders. Everything is generated from site.ts and the content collections. */
import { site } from '../config/site';
import { absoluteUrl, phoneE164, publicFileExists } from './utils';
import type { Area, Review, Service } from './data';
import { reviewStats } from './data';

const DAY_URL = (d: string) => `https://schema.org/${d}`;

export const BUSINESS_ID = `${site.url}/#business`;

export function localBusinessSchema(opts: { areas: Area[]; services: Service[]; reviews: Review[] }) {
  const stats = reviewStats(opts.reviews);
  const sameAs = [
    site.social.instagram,
    site.social.googleBusinessProfile,
    site.social.facebook,
    site.social.yelp,
  ].filter(Boolean);

  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  };
  if (site.address.show && site.address.street) address.streetAddress = site.address.street;
  if (site.address.postalCode) address.postalCode = site.address.postalCode;

  return {
    '@context': 'https://schema.org',
    '@type': 'HousePainter',
    '@id': BUSINESS_ID,
    name: site.name,
    url: site.url + '/',
    description: site.description,
    image: absoluteUrl(site.ogImage),
    ...(publicFileExists(site.logoImage) ? { logo: absoluteUrl(site.logoImage) } : {}),
    telephone: phoneE164(),
    email: site.email,
    ...(site.priceRange ? { priceRange: site.priceRange } : {}),
    address,
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: [
      ...site.regions.map((r) => ({ '@type': 'AdministrativeArea', name: r })),
      ...opts.areas.map((a) => ({ '@type': 'Place', name: `${a.data.name}, ${a.data.region}` })),
    ],
    openingHoursSpecification: site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map(DAY_URL),
      opens: h.opens,
      closes: h.closes,
    })),
    ...(sameAs.length ? { sameAs } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Painting services',
      itemListElement: opts.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.data.title, url: absoluteUrl(`/services/${s.id}/`) },
      })),
    },
    // Only added once at least one real (non-placeholder) review exists.
    ...(stats
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: stats.average,
            reviewCount: stats.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function serviceSchema(service: Service, areaNames: string[] = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.data.title,
    serviceType: service.data.serviceType,
    description: service.data.metaDescription,
    url: absoluteUrl(`/services/${service.id}/`),
    provider: { '@id': BUSINESS_ID },
    areaServed: [...site.regions, ...areaNames].map((name) => ({ '@type': 'Place', name })),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url + '/',
    publisher: { '@id': BUSINESS_ID },
  };
}

export function blogPostingSchema(post: {
  url: string;
  title: string;
  description: string;
  image: string;
  datePublished: Date;
  dateModified?: Date;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: absoluteUrl(post.image),
    url: absoluteUrl(post.url),
    mainEntityOfPage: absoluteUrl(post.url),
    datePublished: post.datePublished.toISOString(),
    dateModified: (post.dateModified ?? post.datePublished).toISOString(),
    author: { '@id': BUSINESS_ID },
    publisher: { '@id': BUSINESS_ID },
  };
}
