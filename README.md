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
- `/resources/articles` — full, filterable article list.
- `/resources/articles/:slug` — article detail, with a related-video sidebar card and related articles.
- `/resources/videos` — full video library, filterable by category.

Article and category art falls back to hand-drawn on-brand vector scenes
(`TopicIllustration`) until a real photo is added at the documented path —
see `docs/image-assets-needed.md`. Nothing renders as a broken image.

## Optional Video System

Resource videos are data-driven and optional, defined in
`src/data/resourceVideos.ts`. Only videos with `enabled: true` **and** a
`youtubeId` render — embedded via `youtube-nocookie.com`, lazy-loaded, never
autoplaying, inside a responsive 16:9 (or 9:16 for `portrait`) frame. If no
approved videos exist for a given context, the site shows a professional
"Helpful Videos Coming Soon" panel (or a compact "Related Video Guide —
Coming Soon" card in article sidebars) instead of a broken embed or a fake
play button. A video should only be flipped to `enabled: true` after it's
confirmed relevant, publicly embeddable, and from a reputable, attributable
source — never just because a link was suggested somewhere.

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
