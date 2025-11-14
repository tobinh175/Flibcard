# Hydrogen landingpage (sample)

This folder contains a simple landing page route for the Hydrogen app.

How to preview locally:

```
cd "d:/Cursor/Shopify Custom Theme/Hydrogen-test"
npm run dev
# open http://localhost:3000/landing
```

Deploy to a subdomain:

1. Build and deploy the Hydrogen app to your hosting provider (Vercel, Netlify or Shopify Oxygen).
2. Point the subdomain (e.g. `landing.yourdomain.com`) to the provider according to their DNS instructions.
3. If using Oxygen, follow Shopify Oxygen guides. For Vercel / Netlify, configure project root to this Hydrogen folder and set env vars from your store (PUBLIC_STORE_DOMAIN, PUBLIC_STOREFRONT_API_TOKEN, SHOP_ID, SESSION_SECRET, etc.).

Notes:
- The landing page is a standalone route at `/landing`.
- Links to `/collections/all` and `/pages/contact` are examples—these will go to your main store pages served by Shopify if you keep them under the same domain.
