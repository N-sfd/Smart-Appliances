# Connecting a Custom Domain

This site is deployed to both Vercel and Netlify (see `vercel.json` /
`netlify.toml`), each with its own generated preview URL:

- Vercel: `https://project-i8icw-ebon.vercel.app/`
- Netlify: `https://frabjous-queijadas-2649b4.netlify.app/`

Neither URL appears in customer-facing copy — the footer, contact info, and
structured data all reference the brand (`Smart Appliances`,
`service@smartappliances.co`) rather than a hosting URL, so switching or
adding a custom domain requires no content changes, only the configuration
below.

## Recommended domains

In order of preference:

1. `smartappliances.co` (matches the existing contact email domain)
2. `smartappliancesmd.com`
3. `booksmartappliances.com`

Pick whichever is available at your registrar; the steps below are the same
regardless of which one you choose.

## Option A — Vercel

1. Vercel dashboard → your project → **Settings → Domains → Add**.
2. Enter your domain. Vercel will show either:
   - **Vercel DNS** (recommended) — point your registrar's nameservers at
     Vercel's, and Vercel manages the records automatically.
   - **External DNS** — add the `A` record (apex) or `CNAME` (subdomain)
     Vercel provides at your current DNS host.
3. Add both the apex domain and `www`, then set your preferred one as
   **primary** — Vercel redirects the other to it automatically.
4. SSL is issued automatically (Let's Encrypt) once DNS resolves — no
   manual step required.

## Option B — Netlify

1. Netlify dashboard → your site → **Domain settings → Add a domain**.
2. Enter your domain. Netlify will offer either:
   - **Netlify DNS** (recommended) — Netlify becomes your DNS host; update
     your registrar's nameservers to Netlify's.
   - **External DNS** — keep your current DNS provider and add the `A` /
     `CNAME` records Netlify gives you.
3. Add both the apex domain and `www`, then set your preferred one as the
   **primary domain**.
4. Once DNS propagates (minutes to 24 hours), Netlify auto-provisions a
   free SSL certificate under **Domain settings → HTTPS** — confirm it
   shows "Netlify managed certificate," not an error state.

If both Vercel and Netlify stay live side by side, point the custom domain
at whichever one you consider the primary deployment, and keep the other as
a staging/backup URL.

## Update the placeholder domain in code

The codebase uses a placeholder production URL,
`https://www.smartappliances.com`, in a few SEO-related files until a real
domain is connected. Once your domain is live, replace it (exact string
match) in:

- `src/hooks/useSeo.ts` — the `SITE_URL` constant (drives canonical links,
  Open Graph tags, and structured data on every service landing page)
- `public/index.html` — the canonical link, `og:*` / `twitter:*` meta tags,
  and the `LocalBusiness` JSON-LD block's `url` field
- `public/sitemap.xml` — every `<loc>` entry
- `public/robots.txt` — the `Sitemap:` line

A quick way to update all of them at once from the project root:

```bash
grep -rl "www.smartappliances.com" src/hooks/useSeo.ts public/index.html public/sitemap.xml public/robots.txt \
  | xargs sed -i 's#https://www.smartappliances.com#https://YOUR-REAL-DOMAIN#g'
```

## Re-submit to Google Search Console

After the domain is live with HTTPS working:

1. Add the new domain as a property in [Google Search Console](https://search.google.com/search-console).
2. Verify ownership (the `google-site-verification` meta tag placeholder is
   already commented out in `public/index.html` — uncomment it and fill in
   your verification code).
3. Submit `https://YOUR-REAL-DOMAIN/sitemap.xml` under **Sitemaps**.
4. If you were previously indexed under a `.vercel.app` or `.netlify.app`
   URL, add that as a property too and use Search Console's change-of-address
   tool (or a 301 at the DNS/host level) so link equity carries over.

## Environment variables

Custom domain changes don't require updating Supabase, Vercel, or Netlify
Function environment variables — those are keyed to the deployment, not the
domain. The only exception is the `FROM_EMAIL` sender domain used by the
booking confirmation emails (see the Resend setup) — that's a separate DNS
configuration (SPF/DKIM records for the sending domain) and is independent
of which domain serves the website itself.
