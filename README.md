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

- Home
- Our Services
- Pricing
- Experts
- Smart Care
- Service Areas
- About Us
- Contact Us
- Scheduler
- Track Request

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
- Netlify deployment uses `netlify.toml`.
- The Netlify AI Agent should not be used for this project.
- Recommended workflow: make changes locally → test → push to GitHub → deploy.

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
