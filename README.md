# Your painting website: owner's guide

A fast, search-friendly website for your interior painting business. You edit plain text files, and the site rebuilds itself. You don't need to be a developer. If you can edit a document and copy a folder, you can run this.

**Contents**

1. [Run the site on your computer](#1-run-the-site-on-your-computer)
2. [Put your business info in](#2-put-your-business-info-in)
3. [Everyday edits](#3-everyday-edits): add a project, a review, a service area, a service
4. [Before you launch](#4-before-you-launch)
5. [Deploy to Netlify and connect your domain](#5-deploy-to-netlify-and-connect-your-domain)
6. [After launch](#6-after-launch-google-setup)
7. [Using Vercel instead](#7-using-vercel-instead-of-netlify)
8. [Troubleshooting](#8-troubleshooting)
9. [Where everything lives](#9-where-everything-lives)

---

## 1. Run the site on your computer

You only do the setup once.

**Setup (first time only)**

1. Install **Node.js** (the "LTS" version, 22 or newer) from <https://nodejs.org>. Accept all the defaults.
2. Open this folder in a terminal. On Windows: open the folder, click the address bar at the top, type `powershell`, and press Enter. On Mac: right-click the folder and choose *New Terminal at Folder*.
3. Install the site's tools (takes a minute or two):

```bash
npm install
```

**Start the site**

```bash
npm run dev
```

Open <http://localhost:4321> in your browser. Every time you save a file, the page updates by itself. Press `Ctrl + C` in the terminal to stop it.

> **About the quote form on your computer:** while previewing, the form pretends to send and shows the success message, but no email is sent. Real delivery starts once the site is live on Netlify ([step 5](#5-deploy-to-netlify-and-connect-your-domain)).

**Make the final version** (this is what gets published):

```bash
npm run build
```

---

## 2. Put your business info in

**Open `src/config/site.ts`.** It is the single place for your business details. Change a value here and it updates everywhere: header, footer, contact page, page titles, and the data Google reads.

| What | Where in `site.ts` |
| --- | --- |
| Business name, tagline, website address | `name`, `tagline`, `url` |
| Phone, email, hours, address | `phone`, `email`, `hours`, `address` |
| Instagram, Google Business Profile, Google review link | `social` |
| Regions you serve (the five boroughs, Nassau, Suffolk) | `regions`, and the one-line summary `areaSummary` used in headlines |
| The map on the Service Areas page | `mapQuery`, `mapZoom` |
| Years in business, jobs done, insured, paint brands | `trust` |
| Your story and team | `about` |
| Brand colors | `brand` |
| Google Analytics and Search Console | `analytics` |
| Where quote requests go | `form` |

Things to know:

- Anything in **[SQUARE BRACKETS]** is a placeholder. Replace it, brackets included.
- **Keep your name, address and phone exactly the same as your Google Business Profile.** Google compares them, and mismatches hurt local rankings.
- **`trust.insured`** is `false` until you change it. "Fully insured" only appears on the site, and the FAQ insurance answer only gets filled in, once you set it to `true`. Only do that if it's true.
- **Address:** if you travel to customers and don't show a street address on Google, leave `address.show` as `false`.
- **Keep the quotes `' '` and the commas** at the end of each line. If the site stops working after an edit, the cause is almost always a missing quote or comma.

### Logo

The site uses the Painters Touch roller "P" logo. Your original file is kept in `brand/painters-touch-logo-original.webp` (the previous plaster-sign logo is archived next to it). The site uses versions made from it, in `public/`, with the white background removed:

| File | Where it shows |
| --- | --- |
| `logo.png` | Header (the roller "P" and the wordmark, in black and burgundy) |
| `logo-light.png` | The dark footer and the social share image (white lettering, lighter burgundy) |
| `favicon.png`, `apple-touch-icon.png` | Browser tab and phone home-screen icon (the roller "P") |

The original artwork is black and taupe. The website versions are recolored to match the site: the taupe parts (the roller head and "TOUCH") become the burgundy `accent` color and the black becomes the site's `ink` color, both taken from `site.ts`. If you ever change those colors, run `npm run logo` and the logo follows. To rebuild the files from the original, run the same command.

The "PAINTING SERVICES" line under the wordmark is left out of the website versions because it is too small to read at header size.

**If you get a cleaner logo later** (a PNG or SVG with a transparent background, ideally with a version in light colors for dark backgrounds), just save it over `public/logo.png` and `public/logo-light.png`. No other changes are needed. If `logo-light.png` is missing, the footer shows `logo.png` on a white tile. If `logo.png` is missing, a simple text logo appears.

### Brand colors

The site uses the logo's black and taupe, with burgundy as the main color (the logo itself is recolored to burgundy and black, see above). In `site.ts`, change the hex codes under `brand`, then run `npm run logo` so the logo files pick up the new colors:

| Setting | What it colors | Current |
| --- | --- | --- |
| `ink` | Headings, text, dark areas like the footer (the logo's black) | `#171719` |
| `accent` | Buttons, links, star ratings and the big call-to-action band (burgundy) | `#663347` |
| `taupe` | Color swatches and decoration (the logo's own taupe) | `#9F9389` |
| `plaster` | The page background (a warm off-white) | `#F6F4F1` |

Keep `accent` dark enough that white text on it stays easy to read. Burgundy is dark enough with plenty to spare. The logo's own taupe is too light for buttons, which is why it is only used for decoration.

### Hero photo

The home page opens with an animated fan of paint chips. If you'd rather show a photo, save one as **`src/assets/hero.jpg`** (portrait or square works best). It replaces the chips automatically.

---

## 3. Everyday edits

### Add a project to the gallery

Each project is one folder.

1. Open `src/content/projects/`.
2. **Copy** a whole project folder (for example `apartment-bedroom-blue-gray-repaint`) and **rename the copy**. The folder name becomes the web address, so use lowercase words with dashes: `bayside-kitchen-refresh`.
3. Delete the photos from the new folder and add your own. Name them descriptively (`bayside-kitchen-before.jpg`, `bayside-kitchen-after.jpg`). That helps Google Images. JPG, PNG or WebP, around 2000 pixels wide is plenty. The site makes small, fast versions automatically.
4. Open the folder's `index.md` and edit the top section (between the `---` lines):

```md
---
title: Kitchen walls and trim            # shown as the project name
location: Bayside, Queens                # neighborhood, borough
roomType: Kitchens                       # creates the filter buttons. Spell it the same way every time
service: interior-painting               # optional: links to a service page
area: astoria                            # optional: links to an area page (file name in src/content/areas)
date: 2026-03-15                         # optional: month finished
before: ./bayside-kitchen-before.jpg     # optional. Without it there's no slider
after: ./bayside-kitchen-after.jpg       # required
afterAlt: Painted kitchen walls in soft green with white trim    # optional: describe the photo
gallery:                                 # optional: extra photos
  - src: ./bayside-kitchen-trim.jpg
    alt: Close-up of crisp white trim against green walls
featured: true                           # optional: show on the home page (first 3 are used)
---

Write two or three sentences here about the job: what you did, the finish and color, how long it took.
```

To remove a project, delete its folder.

A before/after slider, a lightbox, and a filter button are all created for you.

Tips for photos:

- **Phone photos are fine, portrait or landscape.** The slider takes the shape of your "after" photo. Take the before and after from the same spot and angle so the slider lines up.
- **Ordering:** projects with both a before and an after photo always come first, so visitors see your transformations straight away. Single-photo projects follow. Within each group, add a `date` (like `2026-03-15`) and the newest leads. Without dates, projects with more photos come first, then A to Z by title. This applies on the Our Work page and everywhere else projects are listed, and it decides which projects are in the featured 12.
- **How many projects show on the Our Work page:** at first it shows the first **12** projects (the button says "Featured (12)"). The rest appear when a visitor clicks a category such as Bedrooms or Commercial, which shows everything in that category. To change the number, edit `gallery.initialCount` in `src/config/site.ts`. To control *which* projects are in the first 12, remember the order: before and after projects first, then newest `date`. Give a project a recent `date` to move it up.
- Every project still has its own page and is in the site's sitemap, so Google finds all of them, even the ones hidden from the first view.
- On the home page, the first three projects that have both a before and an after photo are shown as sliders. Mark your favorites with `featured: true` to put them first.
- If you ever add a placeholder project while you wait for photos, add `sample: true` to it. It shows a "Sample project" badge, always sorts after your real work, and the placeholder checker will flag it before launch.

### Add a review

Reviews live in **`src/data/reviews.json`**. Copy one block (from `{` to `}`) and fill it in:

```json
{
  "id": "review-maria-g",
  "name": "Maria G.",
  "neighborhood": "Astoria",
  "rating": 5,
  "date": "2026-03-15",
  "text": "The crew showed up exactly on time and the apartment looked incredible."
}
```

- Use real reviews from real customers, exactly as they wrote them. Never invent reviews.
- `name`, `rating` and `text` are required. `neighborhood` and `date` are optional, and are simply left off the card if you skip them. `date` is `YYYY-MM-DD`.
- `rating` is the number of stars (1 to 5). Match what the customer actually gave.
- `id` must be different in every block.
- Put a **comma between blocks** and **no comma after the last one**.
- **Order:** reviews marked `"featured": true` come first, then the newest by `date`. Reviews without dates are in A to Z order by `id`.
- **Star ratings in Google:** the site adds an overall star rating (the average of your reviews) to the data Google reads **only when real reviews exist**. It appears on the Reviews page too. Note that Google often doesn't show stars in search results for a business's own website. Your Google Business Profile reviews are what show up.
- Customers leave reviews through the **"Review us on Google"** button. Set its address in `site.ts` under `social.googleReview`. In your Google Business Profile, choose *Ask for reviews* and copy the link.

### Add a service area

Each area is one small text file with its own page, such as `/areas/astoria/`.

1. Open `src/content/areas/`.
2. **Copy** `astoria.md`, rename the copy (`bayside.md`), and edit it. The file name is the web address.
3. Fill in the top section: `name`, `region`, `metaDescription` (the text Google shows), `lead`, `nearby`, `highlights`, `services`, and optionally a few `faqs`.
4. Write the text below the second `---` line **in your own words**, about what is really different about painting in that neighborhood: the types of buildings, building rules, typical rooms, and so on.
5. `region` must match one of the names in `regions` in `site.ts` (currently Queens, Brooklyn, Manhattan, Bronx, Staten Island, Nassau County and Suffolk County). If you serve somewhere new, add it to `regions` first, and update `areaSummary` if you like.
6. **Watch for colons in your text.** In the top section of these files, a text value that contains a colon followed by a space (like `Our price: flat rate`) breaks the file. Rewrite the sentence without the colon, or put the whole value in double quotes.

> **Important for Google:** every area page needs genuinely different text. If you copy the same paragraph into ten areas, Google treats them as thin duplicate pages and may ignore them. Only add areas you really serve, and delete the starter areas you don't. To delete one, delete its file in `src/content/areas/`.

### Edit or add a service

Services are Markdown files in `src/content/services/`. Edit the text under the top section for the page body. The `includes`, `bestFor` and `faqs` lists in the top section show up in the page's sidebar and FAQ. To add one, copy a file, rename it, and update it. Use the file name (without `.md`) when you list it in an area's `services`.

### Edit the FAQ, the About page, or the privacy policy

- **FAQ:** `src/data/faqs.ts`. Edit the text between the quotes. It also feeds the FAQ data Google reads.
- **About page:** the story and team are in `site.ts` under `about`.
- **Privacy policy:** `src/pages/privacy.astro`. It is a simple starting point written for a small service business. It is not legal advice, so have it reviewed if you want certainty.

---

## 4. Before you launch

1. Build the site:

```bash
npm run build
```

2. List every placeholder still on the site:

```bash
npm run check:placeholders
```

It shows each leftover `[PLACEHOLDER]`, starter values like `your-domain.com` or `YOUR_GBP_ID`, and any "Sample project", along with the pages they appear on. Fix them using the sections above, rebuild, and check again until it's clean.

3. Checklist:
   - [ ] Business info in `site.ts` matches your Google Business Profile exactly
   - [ ] `url` in `site.ts` is your real address (for example `https://www.yourbusiness.com`)
   - [ ] Every project in the gallery is real (no `sample: true` projects left)
   - [ ] Real reviews added (or the placeholders removed)
   - [ ] Starter service areas you don't serve deleted, and the rest edited
   - [ ] Hours checked: they are shown on the site and sent to Google
   - [ ] `trust.insured` set correctly, and paint brands filled in
   - [ ] Logo added (optional)
   - [ ] Opened the site on your own phone and tapped through it (see below)

### How the site behaves on phones

Most customers will find you on a phone, so the site is built for thumbs, not just shrunk down:

- **Call and Free Quote bar** stuck to the bottom of the screen on every page (on the quote page it becomes a single Call button, since they're already on the form).
- **Short pages:** the services list shows a short summary with a "Learn more" link, reviews on the home page swipe sideways, neighborhoods are tap-sized buttons, and the footer is two columns.
- **Our Work:** two projects per row, with the room filters in one row you can swipe sideways.
- **Photos:** the before/after slider drags with a finger (scrolling up and down still works over it), and the photo viewer swipes left and right and shows "3 / 8".
- **Forms:** phone and email fields open the right keyboard, and fields are big enough that iPhones don't zoom in.
- **Sideways phones:** the header scrolls away and the bottom bar slims down, so the page isn't mostly bars.

When you add projects or pages, keep it this way: buttons and links at least about 44 pixels tall, and text at least 14 pixels (small badges 13).

---

## 5. Deploy to Netlify and connect your domain

Netlify hosts the site for free, and its **Forms** feature emails you every quote request. There's nothing to code.

### Option A: from GitHub (recommended, so edits publish automatically)

1. Create a free account at <https://github.com> and a **new private repository**. Upload this project folder to it. The easiest way is **GitHub Desktop** (<https://desktop.github.com>): *File → Add local repository*, then *Publish*. It automatically skips the `node_modules` and `dist` folders. If you upload files through the GitHub website instead, upload everything **except** `node_modules` and `dist`.
2. Create a free account at <https://netlify.com>.
3. Click **Add new site → Import an existing project → GitHub** and pick your repository.
4. Netlify reads the settings from `netlify.toml`. They should already say build command `npm run build` and publish directory `dist`. Click **Deploy**.
5. After a minute or two you get a temporary address like `random-name.netlify.app`. Open it and check the site.

From now on, every time you upload an edited file to GitHub, Netlify rebuilds and publishes the site in about a minute.

### Option B: drag and drop (no GitHub)

1. On your computer, run `npm run build`. It creates a folder called `dist`.
2. Go to <https://app.netlify.com/drop> and drag the **`dist` folder** onto the page.
3. For every later edit, run `npm run build` again and drag the new `dist` folder onto your site's **Deploys** page.

### Get quote requests emailed to you

1. In Netlify, open your site → **Forms**. After the first deploy you should see a form named **quote**. If you don't, open **Site configuration → Forms** and make sure form detection is enabled, then redeploy.
2. Go to **Forms → Form notifications → Add notification → Email notification**. Choose the **quote** form and enter the email address that should receive requests.
3. **Test it:** fill out the quote form on your live site and make sure the email arrives.

The spam trap (a hidden field that only bots fill in) is already built in, and Netlify filters spam on top of that. Photo uploads are limited to 8 MB. The form says so.

*Is your domain shown from another host (like Hostinger) and not from Netlify?* Netlify Forms only work on Netlify, so quotes would be lost. The form therefore sends quotes to the Netlify address you put in `form.netlifyUrl` in `site.ts`, and Netlify records and emails them as usual. Keep that Netlify project alive, and clear `netlifyUrl` (set it to `''`) once your domain is served by Netlify itself.

*Formspree instead of Netlify Forms?* Sign up at <https://formspree.io>, create a form, and copy the ID from its address (`formspree.io/f/XXXXXXX`). In `site.ts`, set `form.provider` to `'formspree'` and put the ID in `form.formspreeId`. Photo uploads need a paid Formspree plan.

### Connect your own domain

1. In Netlify: **Domain management → Add a domain**, then enter the domain you own (for example `yourbusiness.com`).
2. Netlify shows you exactly what to change at the company where you bought the domain. Either set the nameservers to Netlify's, or add the DNS records it lists.
3. DNS changes can take anywhere from a few minutes to a day. Netlify then issues a free HTTPS certificate on its own.
4. **Important:** set `url` in `site.ts` to your real domain (no slash at the end), then redeploy. This updates the canonical addresses, sitemap, and social share links.

---

## 6. After launch: Google setup

1. **Google Search Console** (<https://search.google.com/search-console>): add your site as a *URL prefix* property. Choose the **HTML tag** method, copy only the code inside `content="..."`, and paste it into `site.ts` under `analytics.googleSiteVerification`. Redeploy, click **Verify**, then open **Sitemaps** and submit **`sitemap-index.xml`**.
2. **Google Analytics 4** (<https://analytics.google.com>): create a property and a *Web* data stream, then copy the Measurement ID (it looks like `G-ABC123XYZ9`) into `analytics.ga4MeasurementId`. Redeploy. Leave it blank to turn tracking off. The privacy page updates itself to mention analytics when you add an ID.
3. **Google Business Profile:** add your website address to your profile, and check that your name, address, phone and hours match the site exactly.
4. Ask happy customers to leave a Google review using the link from `social.googleReview`.

---

## 7. Using Vercel instead of Netlify

The site deploys to Vercel too (**Add New → Project → import your GitHub repo**, and Vercel detects Astro on its own). But **Netlify Forms only work on Netlify**. On Vercel, switch the form to Formspree as described in step 5.

---

## 8. Troubleshooting

| Problem | What to do |
| --- | --- |
| The dev site shows an error after an edit | Read the message. It usually names the file and line. Common causes: a missing quote or comma in `site.ts` or `reviews.json`, or wrong indentation at the top of a `.md` file. |
| "Invalid frontmatter" or a schema error | The message lists which field is wrong, such as a missing `title` or a `before` photo path that doesn't match the file name. |
| "Nested mappings are not allowed" | A text value in the top section of a `.md` file contains a colon followed by a space. Remove the colon or put the value in double quotes. |
| A new area or project doesn't appear | Check the dev terminal for a red error naming the file. The file is skipped until the error is fixed. |
| A photo doesn't appear | The file name in `index.md` must match the file in the folder exactly, including `.jpg`. iPhone photos in HEIC format need converting to JPG first. |
| The area page won't build | Check `region` matches `regions` in `site.ts`, and that every slug under `services` is the file name of a service. |
| Changes don't show on the live site | Wait for the Netlify deploy to finish (**Deploys** tab). If you use drag and drop, build and upload again. |
| The quote form says "Your request is in" but no email or submission arrives | **The site must be served by Netlify.** If your domain's DNS points to another host (for example Hostinger), that host answers every form with a thank-you page and the quote is thrown away. Check the address bar: the live site must be served by Netlify, and the domain must be added under **Domain management** in Netlify, with the DNS records Netlify shows. Test it: a form post with a made-up form name must come back as an error (404), not as a thank-you page. Also check **Forms → quote** in Netlify, including the Spam tab, and that a notification email exists under **Forms → Submission notifications**. |
| `npm` is "not recognized" | Close and reopen the terminal after installing Node.js, or reinstall Node. |

---

## 9. Where everything lives

```
src/
  config/site.ts            Your business info (edit this first)
  content/
    projects/<name>/        One folder per gallery project: index.md + photos
    areas/<name>.md         One file per service area page
    services/<name>.md      One file per service page
  data/
    reviews.json            Customer reviews
    faqs.ts                 FAQ questions and answers
  assets/hero.jpg           Optional hero photo (not included)
  pages/                    The pages (home, services, work, contact ...) and sitemap/robots
  components/, layouts/     The building blocks and page frame
  styles/global.css         Fonts, colors, buttons
public/                     Files served as-is: logo, favicon, home-screen icon
brand/                      Your original logo artwork
scripts/                    Helper scripts (placeholder checker, logo builder)
netlify.toml                Hosting settings
```

**What's built in for SEO:** a unique title and description on every page, one main heading per page, structured data (HousePainter business, Service, FAQ, breadcrumbs, and star ratings once real reviews exist), an automatic `sitemap-index.xml` and `robots.txt`, canonical addresses, social share cards with an automatically generated image, optimized images (modern formats, lazy loading, correct sizes), and links between services, areas and projects.
