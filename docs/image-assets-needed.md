# Image Assets Needed

The site currently runs on the existing photos already checked into
`public/images/`. Everything below still works as-is — this list is a
prioritized upgrade path for swapping in new professional photography.

**How to add a new photo**: drop a file at the exact path listed below
(same filename, `.webp` preferred) and it goes live immediately — no code
changes needed. Where a path doesn't exist yet (the 6 expert avatars), the
site shows clean initials in a circle until the file is added; nothing is
broken in the meantime.

Style guidance for all new photos: bright, naturally lit home interiors or
in-context technician shots; blue/white color grading consistent with the
site's brand color (`#1A73E8`); real or professional-stock photography (no
overly synthetic/AI look, no mismatched styles, no low-resolution or
upscaled images).

## 1. Homepage hero

- **Path**: `public/images/services/hero-appliance-technician.webp`
- **Used**: preloaded in `public/index.html` (fetchpriority="high") so it
  renders before/with first paint — this is intentional, don't lazy-load it.
- **Spec**: 16:9 or wider, min 1600px wide, technician actively working on
  an appliance in a bright kitchen.

## 2. Popular services / service cards

- `public/images/services/refrigerator-repair.webp`
- `public/images/services/appliances/washer-dryer.webp`
- `public/images/services/dishwasher-repair.webp`
- `public/images/services/oven-stove-repair.webp`
- `public/images/services/appliances/microwave-repair.webp`
- `public/images/services/hvac/ac-repair.webp`
- `public/images/services/plumbing/drain-cleaning.webp`
- `public/images/services/electrical/light-fixture-installation.webp`
- `public/images/services/smart-home/doorbell-install.webp`
- **Spec**: 4:3 or 1:1, min 800px wide, single appliance/system or
  close-up technician task shot, consistent lighting across the set.

## 3. Experts — circular profile avatars (added: unique AI-generated portraits)

| Expert | Target path |
|---|---|
| Smart Appliances Team | `public/images/experts/smart-appliances-team.png` |
| HVAC Comfort Expert | `public/images/experts/hvac-comfort-expert.png` |
| Appliance Care Expert | `public/images/experts/appliance-care-expert.png` |
| Plumbing Service Expert | `public/images/experts/plumbing-service-expert.png` |
| Electrical & Smart Home Expert | `public/images/experts/electrical-smart-home-expert.png` |
| Garage Door Expert | `public/images/experts/garage-door-expert.png` |

- **Why new paths**: two pairs of these previously shared the exact same
  stock photo (two "different" experts with one face) — not a good look for
  a provider marketplace. Each now points at its own dedicated path.
- **Spec**: square (1:1), min 400x400px, head-and-shoulders, centered face,
  neutral or softly blurred background. Listing cards render this at
  88–112px circular; the profile header renders it at 120–140px circular
  (`src/components/experts/ExpertCard.tsx`, `ExpertProfileHeader.tsx`).
- **Fallback behavior**: until a file exists at a given path, that expert
  shows their initials in a colored circle (no broken-image icon) — see
  `src/components/experts/ExpertAvatar.tsx`.

## 4. Expert profile pages

Same 6 files as above (used at larger size in the profile header) — no
additional files needed.

## 5. About Us page

- **Mission section photo path**: `public/images/services/hero-technician.jpg`
  (unchanged — real photo, already in use).
- **Hero banner**: now uses `HeroIllustration variant="about"` (vector,
  no file needed) since the page previously had no hero visual at all. To
  replace with a real photo, swap the `<HeroIllustration variant="about" .../>`
  block in `src/pages/AboutPage.tsx` for a `StableImage`/`<img>` pointed at a
  new path, e.g. `public/images/about/hero-team.webp` — team or small crew in
  front of a home, warm/approachable, distinct from the Our Mission photo
  above and from Home/Our Services imagery.

## 6. Contact Us page

- **Hero banner**: uses `HeroIllustration variant="contact"` (vector, no file
  needed). The page previously reused
  `public/images/services/smart-home/hero-installer.webp` (also used on Home
  service cards) — that duplicate was removed in favor of this dedicated
  illustration plus the service-area map for layout balance. To replace with
  a real photo, add e.g. `public/images/contact/hero-support.webp` (technician
  on the phone/tablet, reads as "support" not "repair in progress") and swap
  it in at the same spot in `src/pages/ContactPage.tsx`.

## 7. Service Areas section

No static image needed — `src/components/ServiceAreaMap.tsx` renders a live
embedded map (`SERVICE_AREA_MAP_EMBED_URL`), not a static graphic.

## 8. Resources — Help Center article images (NEW paths, files not yet added)

| Article | Target path |
|---|---|
| Why Is My Refrigerator Not Cooling? | `public/images/resources/refrigerator-not-cooling.webp` |
| Why Is My Washing Machine Making Noise? | `public/images/resources/washer-noise.webp` |
| Why Is My Dryer Taking Too Long to Dry Clothes? | `public/images/resources/dryer-vent.webp` |
| Why Is My Dishwasher Not Draining? | `public/images/resources/dishwasher-drain.webp` |
| What Causes Freezer Frost Buildup? | `public/images/resources/freezer-frost.webp` |
| Should You Repair or Replace Your Appliance? | `public/images/resources/repair-or-replace.webp` |
| Electrical Safety: When to Call a Professional Instead of DIY | `public/images/resources/electrical-safety.webp` |
| Simple Ways to Lower Your Heating Bill | `public/images/resources/lower-heating-cost.webp` |
| How Often Should You Replace Your HVAC Filter? | `public/images/resources/hvac-filter.webp` |
| Simple Ways to Prevent Common Plumbing Leaks | `public/images/resources/plumbing-leaks.webp` |
| Is a Smart Thermostat Worth It? | `public/images/resources/smart-thermostat.webp` |
| Essential Garage Door Maintenance Tips | `public/images/resources/garage-door-maintenance.webp` |

- **Why a separate folder**: Resources images are topic-specific editorial
  photos (e.g. a thermometer inside a fridge, a dryer vent being cleaned) —
  deliberately distinct from the technician/lifestyle photos used in Our
  Services, the homepage service cards, Experts, and About Us, so none of
  those existing images are reused here.
- **Spec**: 16:10 landscape, min 1000px wide, single clear subject matching
  the topic (see filename), bright and neutral, consistent with the site's
  blue/white grading. No competitor branding, watermarks, or text overlays.
- **Fallback behavior**: until a file exists at a given path, the article
  (and its card/thumbnail elsewhere) renders a hand-drawn, on-brand vector
  scene for its category instead of a broken image or a bare icon — see
  `src/components/illustrations/TopicIllustration.tsx` and how
  `src/components/resources/ResourceImage.tsx` renders it via the
  `illustrationVariant` prop. Once a real photo is added at the path above,
  it automatically takes over (the `<img>` is tried first; the illustration
  only shows on missing/broken `src`) — no other code changes needed.
- **Video policy**: `src/data/resourceVideos.ts` ships with sample topic
  placeholders only, all `enabled: false`. A video should only be flipped to
  `enabled: true` after confirming it is relevant, publicly embeddable, from
  a reputable/attributable source, and not simply because a link was
  suggested somewhere — see the comments in that file. Until then,
  `VIDEO_TOPIC_PLACEHOLDERS` (same file) drives a "Coming Soon" card per
  category on `/resources`, `/resources/videos`, and the homepage Resources
  section, so the video area never looks empty.

## 9. Resources — category cards, hero sections, and hero pages (NEW, vector illustrations)

Several placements previously had no image at all and now use hand-drawn
vector scenes (not photos) as a deliberate, easy-to-replace placeholder
layer — see `src/components/illustrations/TopicIllustration.tsx` (per Help
Center category, used on category cards and article images/thumbnails) and
`src/components/illustrations/HeroIllustration.tsx` (larger page-hero
scenes: `resources`, `membership`, `pricing`, `about`, `contact`, and
`electrical-detail`). `src/components/illustrations/ArticleSupportIllustration.tsx`
provides two small inline scenes (`inspection`, `decision`) used inside
article bodies via `src/components/resources/ArticleInlineImage.tsx`.

None of these require a file — they render instantly as inline SVG, so
there's nothing to add for them to "work." To upgrade any one of them to a
real photo later, replace its usage (e.g. `<HeroIllustration variant="pricing" .../>`)
with a `StableImage`/`<img>` pointed at a new file under a page-specific
folder (`public/images/membership/`, `public/images/pricing/`,
`public/images/about/`, `public/images/contact/`) — same aspect ratio,
lazy loading, and alt text conventions as everywhere else on the site.
