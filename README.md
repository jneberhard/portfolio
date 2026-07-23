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
