# Corner Shop

**Live site:** https://corner-shop-ugbomah.vercel.app

A small shop for the HNG15 Lesson 2 individual task. It's built with Next.js 15 (App Router) and uses:

- **Supabase (Postgres)** to store products, orders and order items, with row-level security
- **Google sign-in** through an OAuth client from Google Cloud Console, wired up with Supabase Auth
- **Mailgun** (HTTP API) to send order confirmation emails
- A **checkout page** where orders are paid on delivery. Prices are checked again on the server.

## Setup

1. **Install**
   ```bash
   npm install
   cp .env.example .env.local
   ```

2. **Supabase**
   - Create a project at [supabase.com](https://supabase.com).
   - In the SQL Editor, paste and run `supabase/schema.sql`. This creates the tables and policies and adds 8 sample products.
   - Go to Project Settings → API and copy the URL and the `anon` key into `.env.local`.

3. **Google OAuth (Google Cloud Console)**
   - Go to [console.cloud.google.com](https://console.cloud.google.com), then APIs & Services → OAuth consent screen. Set it up as External and add your email as a test user.
   - Go to Credentials → Create credentials → OAuth client ID, and choose **Web application**.
     - Authorized JavaScript origins: `http://localhost:3000`
     - Authorized redirect URIs: `https://<your-project>.supabase.co/auth/v1/callback`
   - Copy the Client ID and Secret into Supabase → Authentication → Providers → **Google**, and enable it.
   - In Supabase → Authentication → URL Configuration, set the Site URL to `http://localhost:3000`. Add `http://localhost:3000/auth/callback` (and your deployed URL's `/auth/callback`) to Redirect URLs.

4. **Mailgun**
   - Copy your API key and domain into `.env.local`.
   - The sandbox domain only sends to *authorized recipients*. Add the Google email you'll sign in with under Sending → Domains → sandbox → Authorized Recipients, then accept the invite email Mailgun sends you.
   - If your account is in the EU region, set `MAILGUN_API_BASE=https://api.eu.mailgun.net`.

5. **Run**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Flow

Browse products, add them to the cart (it's saved in localStorage) and open the cart. At checkout you sign in with Google if you haven't already. Placing the order:

1. Saves the `orders` and `order_items` rows in Supabase
2. Sends the confirmation through Mailgun
3. Takes you to `/orders/[id]`

Past orders are listed at `/orders`.

## Deploying (Vercel)

The site is deployed at https://corner-shop-ugbomah.vercel.app. Every push to `master` redeploys it.

1. Import the GitHub repo on [vercel.com/new](https://vercel.com/new). Paste the contents of `.env.local` into **Environment Variables**, then deploy.
2. In Supabase → Authentication → URL Configuration:
   - Set **Site URL** to the production URL. If it stays on localhost, sign-in sends users back to localhost.
   - Add `https://*-<your-vercel-team>.vercel.app/**` and `http://localhost:3000/**` to **Redirect URLs**. The wildcard covers production and every preview deployment.
3. In Google Cloud Console → your OAuth client, add the production URL to **Authorized JavaScript origins**.
4. In Vercel → Settings → Deployment Protection, turn off **Vercel Authentication** so visitors don't hit a Vercel login page.

Use the stable production URL. The `corner-shop-<hash>-….vercel.app` URLs each belong to one deployment and never update.

**Email note:** emails sent from Mailgun's sandbox domain only reach Authorized Recipients, and Gmail usually files them in **Spam** because they fail its DMARC check. To get them into the inbox, verify your own domain in Mailgun and update `MAILGUN_DOMAIN` and `MAILGUN_FROM`.
