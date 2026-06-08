# Web App

Next.js frontend + Server Actions + Prisma + NextAuth.

**Full documentation:** [main README](../README.md)

## Quick start (local dev)

```bash
cp .env.example .env        # then add AUTH_SECRET + OAuth keys
npm install
npx prisma generate
npx prisma migrate dev
npm run dev                 # http://localhost:3000
```

Also run the socket server — see [socket setup](../README.md#run-locally-development).

## Database URLs

| Variable | Use when |
|----------|----------|
| `DATABASE_URL` | `npm run dev` — host is `localhost` |
| `DATABASE_URL_PROD` | `docker compose up` — host is `postgres` |

See [`.env.example`](.env.example) for all variables.
