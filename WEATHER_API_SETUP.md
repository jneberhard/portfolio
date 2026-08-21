# Google Weather and Maps API setup

The portfolio uses two API keys so public browser access and private server
access can be restricted independently. Do not paste either real key into a
tracked file or GitHub issue.

## 1. Prepare the Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Select the project that owns your existing Maps key, or create a project
   specifically for the portfolio.
3. Attach a billing account. Google requires billing for production use even
   when usage remains within the monthly free caps.
4. Open **APIs & Services → Library**.
5. Enable these APIs:
   - Maps JavaScript API
   - Weather API
   - Geocoding API

Places API is not required for this implementation because location searches
are geocoded by the server.

## 2. Create the browser Maps key

1. Open **APIs & Services → Credentials**.
2. Select **Create credentials → API key**.
3. Rename it `Portfolio browser maps`.
4. Under **Application restrictions**, select **Websites**.
5. Add these website restrictions:
   - `http://localhost:3000/*`
   - `http://localhost:3001/*`
   - `http://localhost:3002/*`
   - `https://portfolio-jeberhard.vercel.app/*`
   - Any custom portfolio domain followed by `/*`
6. Under **API restrictions**, select **Restrict key** and allow only
   **Maps JavaScript API**.
7. Save the key.

This key is placed in `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`. Browser keys are
visible to visitors, so the website and API restrictions are essential.

## 3. Create the server key

1. Create another API key from the Credentials page.
2. Rename it `Portfolio weather server`.
3. Under **API restrictions**, allow only:
   - Weather API
   - Geocoding API
4. Keep this key private. Vercel serverless functions do not normally provide a
   fixed outbound IP, so API restrictions, low quotas, monitoring, and keeping
   the key server-side are the practical protections for this deployment.
5. Save the key.

This key is placed in `GOOGLE_MAPS_SERVER_KEY`. Do not add `NEXT_PUBLIC_` to
its name.

## 4. Configure local development

Create `.env.local` in the project root. It is already ignored by Git.

```dotenv
NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY=replace_with_browser_key
GOOGLE_MAPS_SERVER_KEY=replace_with_server_key
```

Keep the existing Resend variables in the same file if the contact form is
also being tested. Restart the development server after any environment change:

```powershell
pnpm dev
```

Then open `http://localhost:3000/weather`.

## 5. Configure Vercel

1. Open the portfolio project in Vercel.
2. Go to **Settings → Environment Variables**.
3. Add `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` with the browser key.
4. Add `GOOGLE_MAPS_SERVER_KEY` with the server key.
5. Select **Production**, **Preview**, and **Development** as appropriate.
6. Save the variables.
7. Redeploy the latest deployment. `NEXT_PUBLIC_` variables are embedded at
   build time, so an existing deployment will not receive the browser key until
   it is rebuilt.

For preview deployments, add `https://*.vercel.app/*` to the browser key only
if you want Maps enabled on every preview. A tighter option is to allow only
the production Vercel domain and test the map locally.

## 6. Protect the billing account

In Google Cloud Console:

1. Open **Google Maps Platform → Quotas**.
2. Set conservative daily request limits for Maps JavaScript, Weather, and
   Geocoding.
3. Open **Billing → Budgets & alerts** and create a low-dollar alert.
4. Review API usage after deployment to confirm only the intended APIs and
   domains are using the credentials.

The application also caches Google responses for ten minutes and rate-limits
the public server endpoint to reduce accidental or abusive usage.
