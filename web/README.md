# Web App (`todo-full`)

This folder contains the **Next.js** frontend and backend (Server Actions, Prisma, NextAuth).

For full setup instructions — Docker, local development, environment variables, and troubleshooting — see the [**main README**](../README.md) in the project root.

## Quick reference

```bash
# From this folder (web/)
npm install
npx prisma generate
npx prisma migrate dev
npm run dev        # http://localhost:3000
```

Requires the **socket server** running separately on port `3001`. See the [main README](../README.md#run-locally-development).

## Key files

| File | Purpose |
|------|---------|
| `auth.ts` | NextAuth configuration |
| `middleware.ts` | Route protection |
| `lib/prisma.ts` | Database client |
| `lib/socket.ts` | Socket.IO client (browser + server) |
| `prisma/schema.prisma` | Database schema |
| `app/actions/` | Server actions for CRUD operations |
| `dockerfile` | Production Docker image |

## Environment

Copy values into `web/.env` — see [Environment variables](../README.md#environment-variables) in the main README.
