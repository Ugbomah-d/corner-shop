# Corner Shop

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

Add the same environment variables in Vercel. Then add the deployed URL in three places:

- Google Cloud Console → Authorized JavaScript origins
- Supabase → URL Configuration → Site URL
- Supabase → URL Configuration → Redirect URLs (`https://your-app.vercel.app/auth/callback`)
