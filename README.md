# Smart Appliances

Smart Appliances is a modern home-service booking platform for appliance care, HVAC, plumbing, electrical, smart home, garage door, and emergency service requests.

## Live Demo

- Vercel: [https://project-i8icw-ebon.vercel.app/](https://project-i8icw-ebon.vercel.app/)
- Netlify: [https://frabjous-queijadas-2649b4.netlify.app/](https://frabjous-queijadas-2649b4.netlify.app/)

## Core Features

- Online service booking scheduler
- Service category and problem selection
- Pricing estimator
- ZIP/service-area validation
- Service request tracking
- Booking confirmation page
- Admin dashboard
- Admin bookings management
- Expert profiles
- Smart Care membership page
- Service areas page
- Email notification workflow
- Supabase database integration
- Render/Vercel/Netlify deployment support

## Public Pages

- Home (`/`)
- Our Services (`/services`, `/services/:serviceId`)
- Pricing (`/pricing`)
- Experts (`/experts`, `/experts/:expertId`)
- Smart Care membership (`/membership`)
- Service Areas (`/` — Service Areas section)
- About Us (`/about`)
- Contact Us (`/contact`)
- Resources / Help Center (`/resources`, `/resources/articles`, `/resources/articles/:slug`, `/resources/videos`)
- Scheduler (`/scheduler`)
- Track Request (`/track-request`)
- Emergency Service (`/emergency-service`)
- Match an Expert (`/match-expert`)

## Resources / Help Center

- `/resources` — hub with featured articles, category cards, and a videos preview.
- `/resources/articles` — full, filterable article list (`?category=` filters by `ResourceCategoryId`, e.g. `?category=handyman`, `?category=tv-mounting`, `?category=phone-repair`).
- `/resources/:slug` — article detail, with a related-video sidebar card and related articles.
- `/resources/videos` — full video library, filterable by category.

Categories: Appliance Care, HVAC & Energy Savings, Plumbing Tips, Electrical
Safety, Smart Home Guides, Garage Door Care, Maintenance Checklists, Repair or
Replace, Handyman, TV Mounting, and Phone Repair (`src/data/resourceCategories.ts`).

- **Handyman** — furniture assembly, wall hanging, drywall repair, and small
  home projects (`handyman-small-home-projects`, `furniture-assembly-tips`,
  `wall-hanging-guide`, `drywall-repair-basics`).
- **TV Mounting** — mounting cost factors, a pre-appointment checklist, and
  wire concealment (`tv-mounting-cost-guide`, `tv-wall-mounting-checklist`,
  `wire-concealment-guide`).
- **Phone Repair** — screen, battery, and charging-port issues, plus repair-vs-replace
  guidance (`phone-screen-repair-guide`, `phone-battery-replacement-signs`,
  `charging-port-repair-guide`, `phone-repair-or-replace`). These articles never
  ask for a passcode, full serial number, IMEI, or account credentials.

Resources content is original and inspired by common customer questions across
home-service categories.

Article and category art falls back to hand-drawn on-brand vector scenes
(`TopicIllustration` for category art, `ArticleTopicIllustration` for articles
whose shared category art would otherwise repeat) until a real photo is added
at the documented path — see `docs/image-assets-needed.md`. Nothing renders as
a broken image.

## Optional Video System

Resource videos are data-driven and optional, defined in
`src/data/resourceVideos.ts`. Only videos with `enabled: true` **and** a
`youtubeId` render — embedded via `youtube-nocookie.com`, lazy-loaded, never
autoplaying, inside a responsive 16:9 (or 9:16 for `portrait`) frame. If no
approved video exists for a given context (category, article, or overall),
the site shows a professional "Helpful Videos Coming Soon" panel (or a
compact "Related Video Guide — Coming Soon" card in article sidebars)
instead of a broken embed or a fake play button.

The site currently embeds a small set of reviewed, approved videos from
reputable external creators (This Old House, Lowe's Home Improvement,
RepairClinic.com, Ace Hardware, Electrical Safety Foundation International).
These are not Smart Appliances-owned content — every embed carries a "Helpful
video from an external source" note plus a "Video source: <channel>" link
back to the original YouTube video, per `sourceName`/`sourceUrl` on that
video's entry. A new video should only be flipped to `enabled: true` after
it's confirmed relevant, publicly embeddable, and from a reputable,
attributable source — never just because a link was suggested somewhere.

## Hero Layout System

Membership, Pricing, About Us, and Contact Us share one hero container
pattern: a `1180px` max-width container, a two-column grid (copy left,
visual right) on desktop that stacks on mobile, and `56–64px` vertical
padding on desktop (less on Contact, which is intentionally the shortest of
the four). Each page's visual is a distinct vector scene from
`src/components/illustrations/HeroIllustration.tsx` — no hero image is
reused between pages.

## Services Submenu Imagery

The header **Our Services** menu is a two-column grid on desktop (single
column, tap-accordion on mobile) with a small badge icon, category name,
and one-line description per item, plus a "View All Services" link. Badge
icons come from `src/components/illustrations/ServiceMenuIllustration.tsx`
— a distinct visual style from the page-hero and Help Center illustrations
so no artwork repeats across sections. See
`docs/image-assets-needed.md` for how to swap in real category photography
later.

## Image Assets

```text
public/images/services/menu/     — header Services menu category art
public/images/services/          — service detail/category photography
public/images/resources/         — Help Center article photography
public/images/membership/        — Membership page photography (optional)
public/images/pricing/           — Pricing page photography (optional)
public/images/about/             — About Us page photography (optional)
public/images/contact/           — Contact Us page photography (optional)
public/images/experts/           — expert profile portraits
```

**Local image policy**: all images are checked into `public/images/` and
served locally — the site never fetches images from external/unlicensed
sources at runtime or build time. Until a real photo is added at a
documented path, pages render an on-brand vector illustration instead of a
broken image or placeholder icon. See `docs/image-assets-needed.md` for the
full per-section asset list, specs, and policy against reusing one image
across multiple sections (Services, Resources, Membership, Pricing, About,
Contact, Experts each keep their own imagery).

## Scalable Service Catalog Architecture

Smart Appliances uses **one central booking table** (`service_requests`) for all service categories. Service-specific details are stored in `booking_answers` JSONB — not as dozens of per-service columns or separate request tables.

### Database tables

```text
auth.users
  └── profiles

profiles
  └── customers

customers
  └── service_requests

service_categories
  └── services
        └── service_questions

service_categories
  └── service_questions

services
  └── service_requests
```

| Table | Purpose |
|-------|---------|
| `service_categories` | Category catalog (Appliance Care, HVAC, TV Mounting, Phone Repair, Handyman, …) |
| `services` | Individual bookable services with pricing metadata |
| `service_questions` | Dynamic booking question definitions per category/service |
| `service_requests` | **Single** booking table for all categories |

### New service categories (2026 expansion)

- TV Mounting (`/services/tv-mounting`)
- Phone Repair (`/services/phone-repair`)
- Handyman (`/services/handyman`)
- Expanded Smart Home catalog services

### Booking answers

Dynamic scheduler questions save to `service_requests.booking_answers` as JSON, for example:

```json
{
  "tvSize": "55–65 inches",
  "wallType": "Drywall",
  "wireConcealment": true
}
```

### Address field standardization

Going forward, writes should use:

- `street_address`
- `suite_apt`
- `city`
- `state`
- `zip_code`

The legacy `address` column is **deprecated** but retained for historical rows. A migration backfills `street_address` from `address` where needed.

### Migrations

Apply catalog expansion:

```text
supabase/migrations/20260708143000_expand_service_catalog.sql
```

Run in the Supabase SQL Editor (or your migration workflow). Safe to re-run.

### RLS model

- Public (anon/authenticated): read active `service_categories`, `services`, `service_questions`
- Admin (`profiles.role = 'admin'`): manage catalog tables
- `service_requests`: existing insert/select policies unchanged; users read own requests; admins manage all

### Frontend catalog API

- Types: `src/types/services.ts`
- Supabase helpers: `src/services/serviceCatalog.ts` (with local fallback in `src/data/serviceCatalogFallback.ts`)
- Dynamic scheduler fields: `src/components/booking/DynamicServiceQuestion.tsx`
- Admin answer display: `src/components/admin/BookingAnswersPanel.tsx`

### Backward compatibility

Legacy text fields (`service_category`, `product_name`) remain populated during transition. Catalog IDs (`category_id`, `service_id`) are set when lookup succeeds; null IDs do not block booking submission.

### Future: phone repair operations module

No specialized phone repair table in this release. If parts inventory, device intake, or warranty workflows are needed later, a dedicated operational module may be added — `booking_answers` covers MVP intake.

## Admin Features

- Admin dashboard
- View bookings
- Update request status
- Cancel/delete booking option
- Customer details
- Expert assignment (if available)
- Membership leads (if available)
- Reports/settings (future-ready)

## Tech Stack

- React
- TypeScript
- Material UI
- React Router
- Supabase
- Resend
- Render backend/API (if used)
- Vercel
- Netlify
- Create React App

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your own values. These are examples only — never commit real keys.

```env
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
RESEND_API_KEY=
FROM_EMAIL=
ADMIN_EMAIL=
```

**Do not commit `.env` files or secret keys.**

## Local Setup

```bash
npm install
npm start
npm run build
```

## Deployment Notes

- Vercel deployment uses `vercel.json`.
- Netlify deployment uses `netlify.toml` (build command `npm run build`, publish `build`, functions in `netlify/functions`).
- The Netlify AI Agent should not be used for this project.
- Recommended workflow: make changes locally → `npm run build` → test → push to GitHub → deploy.
- Verify `npm run build` passes before deploying — CRA's production build also type-checks the project.

## Database

Supabase stores service requests, profiles, bookings, and admin/customer data, along with optional expert and membership fields.

## Email Workflow

Bookings trigger an admin notification email and a customer confirmation email, sent and reported independently. If using a Resend test domain, customer emails may require a verified domain before they can be sent to all recipients.

## Service Areas

Serving MD, VA, WV, PA, DE, and Washington DC.

ZIP-code service-area checks are shared across the site through
`src/utils/serviceAreas.ts` (`getServiceAreaByZip` / `isZipInServiceArea`,
coarse ZIP-range lookup) and the higher-level helpers in
`src/data/serviceAreas.ts` (validation messages, ZIP normalization, state
inference). The Emergency Service form (`/emergency-service`) uses this same
logic but never blocks submission for a ZIP outside the service area — it
only shows a warning ("This ZIP may be outside our current emergency service
area. Please call us to confirm availability.") and still lets the request go
through as long as the contact fields are valid. When a ZIP is outside the
area, the request is flagged with `outsideServiceArea` / `detectedServiceArea`
on the saved record (localStorage/Firestore); the Supabase `service_requests`
table has no matching columns yet, so that detail is also folded into the
request's free-text notes as a fallback rather than sent as extra columns.

## Contact

- Email: [service@smartappliances.co](mailto:service@smartappliances.co)
- Phone: +1 (240) 576-0397

## Roadmap

- Stripe payments
- Verified customer reviews
- Technician assignment workflow
- Customer portal improvements
- SEO service pages
- Google Analytics/Search Console
- Custom domain
- Production Resend domain verification

## License

This project is licensed under the MIT License.
