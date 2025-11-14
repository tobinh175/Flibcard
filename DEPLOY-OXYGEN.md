# Deploy Hydrogen Landing Page to Shopify Oxygen

This guide walks you through deploying the Hydrogen landing page to **Shopify Oxygen** on a subdomain.

## Architecture

```
Main Store: www.yourdomain.com (Shopify Theme + Liquid)
Landing: landing.yourdomain.com (Hydrogen on Oxygen)
```

---

## Prerequisites

1. ✅ Shopify store with Storefront API credentials (you have this)
2. ✅ Custom domain (e.g., `yourdomain.com`)
3. ✅ Shopify CLI installed
4. ✅ Node.js & npm installed
5. ✅ GitHub account (to store your Hydrogen code)

---

## Step 1: Prepare Hydrogen App for Oxygen

### 1.1 Update Production Environment

Edit `.env.production` with your Shopify credentials:

```bash
PUBLIC_STOREFRONT_API_TOKEN=your_token_here
PUBLIC_STORE_DOMAIN=zetee1012.myshopify.com
SHOP_ID=89962774870
SESSION_SECRET=generate-a-secure-random-string
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=your_client_id
PUBLIC_CHECKOUT_DOMAIN=checkout.hydrogen.shop
```

**How to generate a secure SESSION_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy output and paste into `.env.production`.

### 1.2 Verify Local Build Works

```bash
cd "d:\Cursor\Shopify Custom Theme\Hydrogen-test"
npm run build
```

Expected output: No errors, build artifacts in `dist/` folder.

---

## Step 2: Push Code to GitHub

### 2.1 Initialize Git (if not already done)

```bash
cd "d:\Cursor\Shopify Custom Theme\Hydrogen-test"
git init
git config user.email "your@email.com"
git config user.name "Your Name"
```

### 2.2 Create `.gitignore` (exclude sensitive files)

Make sure `.env.production` is NOT committed:

```bash
echo ".env.production" >> .gitignore
echo "node_modules/" >> .gitignore
echo "dist/" >> .gitignore
git add .gitignore
```

### 2.3 Commit & Push

```bash
git add .
git commit -m "Initial Hydrogen landing page for Oxygen"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hydrogen-landing.git
git push -u origin main
```

---

## Step 3: Deploy to Shopify Oxygen

### 3.1 Link Hydrogen Project to Shopify Store

```bash
cd "d:\Cursor\Shopify Custom Theme\Hydrogen-test"
npx shopify hydrogen link
```

**Choose your store** from the list:
- Select: `zetee1012.myshopify.com`

This creates a `hydrogen.config.json` file (commit this to git).

### 3.2 Deploy to Oxygen

```bash
npx shopify hydrogen deploy
```

Follow the prompts:
- Select **Oxygen** as the deployment target
- Choose a deployment name (e.g., `landing-page`)
- Confirm environment variables

**Wait for deployment to complete.** You'll see:
```
✅ Deployment successful!
🌐 Preview URL: https://hydrogen-xxxxx.oxygen.shop
```

### 3.3 Set Environment Variables on Oxygen

1. Go to **Shopify Admin → Settings → Apps and integrations → Oxygen**
2. Select your deployment
3. **Environment Variables** tab → Add all variables from `.env.production`
4. Redeploy if needed

---

## Step 4: Configure Custom Domain (Subdomain)

### 4.1 In Shopify Admin

1. **Settings → Domains**
2. **Add domain** → Enter `landing.yourdomain.com`
3. Shopify provides a CNAME record
4. Copy the CNAME value

### 4.2 In Your Domain Registrar (GoDaddy, Namecheap, Route 53, etc.)

Create a CNAME record:

```
Type: CNAME
Name: landing
Value: [CNAME from Shopify]
TTL: 3600
```

Example for GoDaddy:
- Name: `landing`
- Value: `cname-oxygen.shopifycloud.com` (from Shopify)

### 4.3 Verify DNS Propagation

```bash
nslookup landing.yourdomain.com
# or
ping landing.yourdomain.com
```

Should resolve within 15-30 minutes.

---

## Step 5: Link Main Store to Custom Domain

### 5.1 Add Main Domain to Shopify

1. **Shopify Admin → Settings → Domains**
2. **Add domain** → Enter `www.yourdomain.com`
3. Copy CNAME and add to your domain registrar

DNS Record:
```
Type: CNAME
Name: www
Value: shops.myshopify.com
TTL: 3600
```

### 5.2 Verify Both Domains Work

```
http://www.yourdomain.com        → Shopify Theme (products, checkout)
http://landing.yourdomain.com    → Hydrogen Landing Page
```

---

## Step 6: Continuous Deployment (Optional)

### 6.1 Enable GitHub Auto-Deploy

1. Shopify Admin → **Apps → Hydrogen**
2. **Deployments** → Select your project
3. **Settings → GitHub**
4. Connect your GitHub repo
5. **Auto-deploy on push to main** enabled

Now every `git push` to main will auto-deploy to Oxygen!

---

## Troubleshooting

### ❌ "Cannot find module" errors during build

```bash
rm -rf node_modules dist
npm install
npm run build
```

### ❌ Environment variables not working

Check Oxygen dashboard:
- **Settings → Environment Variables** should have all vars from `.env.production`
- After adding vars, **redeploy** the project

### ❌ Domain not resolving

- Wait 24 hours for DNS to propagate
- Check DNS records with `nslookup landing.yourdomain.com`
- Verify CNAME matches what Shopify/Oxygen provided

### ❌ Landing page shows 404

- Check deployment logs: **Oxygen Dashboard → Deployments → Logs**
- Ensure route `/landing.jsx` exists in `app/routes/`

---

## Production Checklist

- [ ] `.env.production` has valid Shopify credentials
- [ ] SESSION_SECRET is cryptographically random
- [ ] `.env.production` is in `.gitignore`
- [ ] `hydrogen.config.json` is committed to git
- [ ] GitHub repo is connected to Oxygen
- [ ] Subdomain DNS records are configured
- [ ] Main domain DNS records are configured
- [ ] Both domains resolve correctly
- [ ] Landing page loads at `landing.yourdomain.com`
- [ ] Main store loads at `www.yourdomain.com`

---

## Next Steps

1. **Customize Landing Page**: Edit `app/components/LandingHero.jsx` and `app/styles/landing.css`
2. **Add More Routes**: Create new `.jsx` files in `app/routes/` as needed
3. **Connect Analytics**: Add Google Analytics / Facebook Pixel to both stores
4. **Set Up SSL**: Oxygen + Shopify handle SSL automatically ✅

---

## Support

- [Hydrogen Docs](https://hydrogen.shopify.dev)
- [Oxygen Docs](https://shopify.dev/docs/oxygen)
- [Shopify CLI Reference](https://shopify.dev/docs/cli)
