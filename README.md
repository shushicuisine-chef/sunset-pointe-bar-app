# Sunset Pointe Bar

Mobile-first React, TypeScript, and Tailwind CSS PWA for Banana Bay Resort & Marina guests ordering from Sunset Pointe Bar at `sunsetpointebar.com`.

## What Is Included

- Guest flow: home, menu, cart, checkout, confirmation, and order status.
- QR-code friendly guest landing page at `/`.
- Admin dashboard at `/admin`.
- Privacy policy at `/privacy`.
- Terms page at `/terms`.
- Phase 1 pickup-only messaging: "Pickup available at Sunset Pointe Bar." and "Room delivery coming soon."
- Alcohol compliance checkbox and pickup-only enforcement for alcohol items.
- Admin flow: login, dashboard, order status updates, menu add/edit/delete, menu images, dish-cost pricing checks, operating hours, pause ordering, Phase 2 delivery settings, and CSV export.
- Local mock data and localStorage persistence.
- Installable app manifest and service worker.
- Payment-ready placeholder service for Stripe or Square.

## Run Locally

```bash
npm install
npm run dev
```

The admin demo password is:

```text
sunset90
```

## Backend-Ready Files

- `src/services/storage.ts` is the mock order, menu, settings, and CSV export boundary.
- `src/services/payment.ts` contains the placeholder payment intent shape for Stripe or Square.
- `src/types.ts` contains the app data model.

## Netlify Deployment

1. Push this project to GitHub.
2. In Netlify, import `shushicuisine-chef/sunset-pointe-bar-app`.
3. Use these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. No environment variables are required for the current MVP.
5. Add `sunsetpointebar.com` under Netlify Domain Management.
6. Follow Netlify's DNS instructions or point the domain's DNS to Netlify.
7. Create QR codes from `https://sunsetpointebar.com/`.

## Vercel Deployment

1. Push this project to GitHub.
2. In Vercel, import the GitHub repository.
3. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add `sunsetpointebar.com` in Vercel under Project Settings -> Domains.
5. Add `www.sunsetpointebar.com` too, then redirect it to the apex domain if desired.
6. Update DNS at the domain registrar using the records Vercel provides.
7. Wait for Vercel to show the domain as valid and HTTPS-ready.
8. Create QR codes from `https://sunsetpointebar.com/` and place them in rooms, lobby, pool, bar, and breakfast areas.

For a client demo before production DNS is ready, use the Vercel preview URL.

## Suggested QR Targets

- Guest ordering: `https://sunsetpointebar.com/`
- Order status: `https://sunsetpointebar.com/status`
- Staff dashboard: `https://sunsetpointebar.com/admin`
