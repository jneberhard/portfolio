# Jim Eberhard — Portfolio

Personal software-development portfolio built with Next.js, React, TypeScript,
and pnpm. The site highlights full-stack projects, leadership experience, and
the technologies Jim uses to build maintainable, user-focused software.

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
pnpm build
pnpm start
```

The project is ready for direct import into Vercel. Vercel will detect Next.js
and use the pnpm lockfile automatically.

## Contact form

The contact form sends through Resend from the server, so the destination
address is never included in browser code. Add these environment variables in
Vercel before deploying:

- `RESEND_API_KEY`: a Resend API key with sending access
- `CONTACT_TO_EMAIL`: the private inbox that should receive messages
- `CONTACT_FROM_EMAIL`: a sender using a domain verified in Resend

Use `.env.example` as the local configuration template. Never commit the real
values.

## Weather & Maps API Lab

The twelfth project card opens an internal Google Maps and Weather API
demonstration. It uses two credentials with different security boundaries:

- `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`: loads Maps JavaScript in the browser.
  This key is public by design and must have website and API restrictions.
- `GOOGLE_MAPS_SERVER_KEY`: used only by the Next.js server endpoint for the
  Weather API and Geocoding API. Never expose or commit this value.

Copy `.env.example` to `.env.local`, insert your development credentials, and
restart `pnpm dev` after changing environment variables. The page intentionally
shows a configuration state when the keys are absent, so builds remain safe.

For Vercel, open the project and go to **Settings → Environment Variables**.
Add both variables for Production and Preview, then redeploy. Add the browser
key to Development too if you use `vercel env pull`. The server key should
remain server-only in every environment.

Detailed key restrictions and setup steps are in
[`WEATHER_API_SETUP.md`](./WEATHER_API_SETUP.md).
