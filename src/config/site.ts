/**
 * ─────────────────────────────────────────────────────────────────────────
 *  YOUR BUSINESS INFO LIVES HERE: edit this ONE file and the whole site
 *  updates (header, footer, contact page, titles, structured data, etc.).
 *
 *  - Anything in [SQUARE BRACKETS] is a placeholder. Replace it.
 *  - Run `npm run build` then `npm run check:placeholders` to list every
 *    placeholder still left on the site before you launch.
 *  - Keep Name, Address, Phone EXACTLY the same as your Google Business
 *    Profile (this is called NAP consistency and matters for local SEO).
 *  - Keep the quotes ' ' around text and the commas at the end of lines.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const site = {
  // ── Identity ───────────────────────────────────────────────────────────
  name: 'Painters Touch',
  tagline: 'Transforming Spaces, One Coat at a Time.',

  /** Your live website address, no slash at the end. Used for SEO (canonical URLs, sitemap). */
  url: 'https://painterstouch.site',

  /** Default description shown in Google results when a page doesn't have its own. */
  description:
    'Interior painters serving all five NYC boroughs and Long Island. Flat-rate quotes, on-time crews, and furniture and floors protected on every job.',

  // ── Contact ────────────────────────────────────────────────────────────
  /** Format it however you want people to see it. The tap-to-call link is built from the digits. */
  phone: '(646) 465-3441',
  email: 'painterstouch1nyc@gmail.com',

  /**
   * Address. If you work from home or travel to customers, leave `show` as false:
   * only the city/state will be shared (this is what most Google Business Profiles do).
   * Set `show` to true only if the address is public on your Google Business Profile.
   */
  address: {
    show: false,
    street: '',
    city: 'New York',
    region: 'NY',
    postalCode: '',
    country: 'US',
  },

  /** Rough center of your service area (used for search engines, not shown). */
  geo: { lat: 40.7128, lng: -74.006 },

  /** Business hours. Add, remove or change lines. Use 24-hour times like '17:30'. */
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { days: ['Saturday'], opens: '09:00', closes: '14:00' },
  ] as { days: string[]; opens: string; closes: string }[],

  // ── Links ──────────────────────────────────────────────────────────────
  social: {
    instagram: 'https://www.instagram.com/painterstouch.nyc/',
    /** Your Google Business Profile page (the listing people find on Google/Maps). Leave '' until you have one. */
    googleBusinessProfile: 'https://maps.app.goo.gl/E5YNQBiYKg7jRUkQ6',
    /** Direct "leave a review" link: Google Business Profile → "Ask for reviews" → copy link. The review buttons stay hidden while this is ''. */
    googleReview: 'https://g.page/r/CdEF15E-yNq1EBM/review',
    /** Leave blank ('') to hide. */
    facebook: '',
    yelp: '',
  },

  // ── Where you work ─────────────────────────────────────────────────────
  /**
   * The big regions you serve, in the order you want them listed.
   * Each service-area page (src/content/areas) names one of these regions.
   */
  regions: ['Queens', 'Brooklyn', 'Manhattan', 'Bronx', 'Staten Island', 'Nassau County', 'Suffolk County'],

  /** One short phrase describing where you work. Used in headlines, descriptions and the footer. */
  areaSummary: 'all five NYC boroughs and Long Island out to Huntington',

  /** The map on the Service Areas page: the place it centers on, and how far it zooms out (9 = whole region, 13 = one neighborhood). */
  mapQuery: 'New York, NY',
  mapZoom: 9,

  // ── Our Work page ──────────────────────────────────────────────────────
  gallery: {
    /**
     * How many projects the Our Work page shows at first. The rest appear when a visitor clicks
     * a category (Bedrooms, Commercial, ...). The first projects in the list are the ones shown:
     * before and after projects first, then newest by `date`.
     */
    initialCount: 12,
  },

  // ── Trust facts (only true things!) ────────────────────────────────────
  trust: {
    // Update these as they grow. Add a "+" (like '250+') if you'd rather not change them every month.
    yearsInBusiness: '5',
    jobsCompleted: '250+',
    /** Set to true ONLY if you carry liability insurance. Until then "Fully insured" stays hidden. */
    insured: false,
    /** Brands you actually use, for the FAQ. Example: 'Benjamin Moore and Sherwin-Williams'. Leave '' to leave brand names out. */
    paintBrands: 'Sherwin-Williams and Benjamin Moore',
  },

  /** How quickly you promise to answer quote requests (shown after the form is sent). */
  replyTime: 'one business day',

  // ── About page ─────────────────────────────────────────────────────────
  about: {
    story: [
      'We began as professional painters and friends who saw potential in creating a business with something that we love: painting. As a kid I always had a passion towards painting and making crafts. Later, in my teenage years, I used to do graffiti and murals.',
      'As the years passed, I got into indoor painting thanks to my close friend. A few years later I decided to make my own company and expand. I love helping people change their homes and love the reactions after the job is done.',
      'We always make sure to keep a sharp edge on the walls and the smoothest finish. We always use the best paints for the best result possible. As we continue to grow, we always keep intact our promise to deliver premium quality results for our clients.',
    ],
    team: [
      { name: '[NAME]', role: '[ROLE, e.g. Owner and lead painter]', bio: '[One or two sentences about this person.]' },
      { name: '[NAME]', role: '[ROLE]', bio: '[One or two sentences about this person.]' },
    ] as { name: string; role: string; bio: string }[],
  },

  // ── Blog author ──────────────────────────────────────────────────────
  /** Shown as the byline on every blog post, with a link to the author's page (/about/<slug>/). */
  author: {
    name: 'Ivan Vashchenko',
    slug: 'ivan-vashchenko',
    role: 'Owner and founder',
    /** Short bio under each post and on the author page. Only true facts. {years} and {jobs} are filled in from `trust` above. */
    bio: [
      'Ivan founded Painters Touch after years of painting, starting with graffiti and murals as a teenager before a close friend brought him into interior painting.',
      'He has led Painters Touch for {years} years and {jobs} jobs across NYC and Long Island, and he is famously picky about sharp cut lines and smooth finishes. His favorite color? White Dove (Benjamin Moore OC-17). Yes, a white.',
    ],
    knowsAbout: ['Interior painting', 'Accent walls', 'Lime wash', 'Skim coating', 'Drywall and plaster repair', 'Color selection'],
  },

  // ── Colors (hex codes) ─────────────────────────────────────────────────
  // Black and taupe come from the Painters Touch logo. The burgundy is the site's main color.
  brand: {
    ink: '#171719', // the logo's black: headings, dark sections
    accent: '#663347', // burgundy: buttons, links and the big call-to-action band (white text on it stays easy to read)
    taupe: '#9F9389', // the logo's taupe, used for color swatches and decoration
    plaster: '#F6F4F1', // page background (a warm off-white)
  },

  /**
   * Your logo files (in the /public folder). The header uses logoImage; the dark footer uses logoImageLight
   * (a version with light lettering). If a file is missing, a simple text logo is shown instead.
   * Both were made from brand/painters-touch-logo-original.webp with `npm run logo`.
   */
  logoImage: '/logo.png',
  logoImageLight: '/logo-light.png',

  // ── Contact form ───────────────────────────────────────────────────────
  form: {
    /** 'netlify' (default, free, works when hosted on Netlify) or 'formspree'. */
    provider: 'netlify' as 'netlify' | 'formspree',
    /** Only for Formspree: the ID from your form URL https://formspree.io/f/XXXXXXX */
    formspreeId: '',
    /**
     * Only needed when the website is shown from a host that is NOT Netlify (for example Hostinger).
     * Netlify Forms only work on Netlify, so the form then sends each quote to this Netlify address,
     * which records it and emails you. Leave it '' when your domain is served by Netlify itself.
     */
    netlifyUrl: 'https://nimble-sable-a57690.netlify.app',
  },

  // ── Tracking and verification (leave '' to turn off) ───────────────────
  analytics: {
    /** Google Analytics 4 Measurement ID, e.g. 'G-ABC123XYZ9' */
    ga4MeasurementId: '',
    /** Google Search Console "HTML tag" verification: paste only the content="..." value. */
    googleSiteVerification: '7qFPayo2tyqslJcMR56pIyQPk5QTJAFu4bz9hXngiZk',
  },

  /** Share image used when your site is shared on social media. Generated automatically; replace with your own file in /public if you like. */
  ogImage: '/og-default.jpg',

  /** Shown in the footer and Google results; '$$' is a safe default. Leave '' to hide. */
  priceRange: '$$',

  /** Last time the privacy policy text was updated. */
  privacyUpdated: 'October 6, 2026',
};

export type Site = typeof site;
