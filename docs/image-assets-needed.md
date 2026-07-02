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

## 5. About Us page image

- **Path**: `public/images/services/hero-technician.jpg`
- **Spec**: portrait or landscape, technician or small team in a home
  setting, warm/approachable tone (this page is about company story/trust,
  not a specific repair).

## 6. Contact Us page image

- **Path**: `public/images/services/smart-home/hero-installer.webp`
- **Spec**: technician on the phone or at a laptop/tablet — should read as
  "support," not "repair in progress."

## 7. Service Areas section

No static image needed — `src/components/ServiceAreaMap.tsx` renders a live
embedded map (`SERVICE_AREA_MAP_EMBED_URL`), not a static graphic.
