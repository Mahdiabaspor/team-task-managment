<div align="center">

# Task Management Fullstack

**Real-time team task boards with drag-and-drop, live sync, and OAuth login.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8+-yellow?logo=socket.io)](https://socket.io)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com)

[Features](#features) · [Quick start](#quick-start) · [Environment](#environment-variables) · [Docker](#run-with-docker-production) · [Local dev](#run-locally-development)

</div>

---

## Features

| | |
|---|---|
| **Projects & boards** | Multiple projects with customizable task columns |
| **Drag & drop** | Move tasks between containers with dnd-kit |
| **Real-time sync** | Live updates for every team member via Socket.IO |
| **Team work** | Invites, roles, task assignment |
| **Auth** | Sign in with Google or GitHub (NextAuth.js) |
| **Database** | PostgreSQL + Prisma migrations |

---

## Architecture

```
 Browser (you)
      │
      ├──▶ Web app      :3000   (Next.js — UI + API)
      │         │
      │         ├──▶ Postgres :5432   (data)
      │         └──▶ Socket   :3001   (real-time, server-side)
      │
      └──▶ Socket       :3001   (real-time, browser-side)
```

| Service | Port | Folder | Role |
|---------|------|--------|------|
| Web | `3000` | `web/` | Frontend, Server Actions, auth |
| Socket | `3001` | `socket/` | Broadcasts task & container changes |
| Postgres | `5432` | — | Stores users, projects, tasks |

**Database name:** `teamTaskManagementProdDb`

---

## Quick start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clone

```bash
git clone <your-repo-url>
cd taskManagmet-fullstack
```

### 2. Set up environment files

```bash
cp web/.env.example web/.env
cp socket/.env.example socket/.env
```

| File | What to do |
|------|------------|
| `socket/.env` | **Nothing extra** — defaults are enough to test |
| `web/.env` | Add your `AUTH_SECRET` and OAuth keys (Google / GitHub) |

> Only `web/.env` needs real secrets. Socket has no passwords or API keys.

### 3. Run with Docker

```bash
docker compose up --build
```

Open **http://localhost:3000**

---

## Run with Docker (production)

All three services start in production mode — built images, no hot reload.

```bash
docker compose up --build        # foreground
docker compose up --build -d     # background
docker compose logs -f           # view logs
docker compose down              # stop
docker compose down -v           # stop + wipe database
```

### What Docker uses automatically

`docker-compose.yml` already sets:

- Postgres database → `teamTaskManagementProdDb`
- `DATABASE_URL_PROD` for the web build
- `SOCKET_URL` → `http://socket:3001` (internal Docker network)
- `NODE_ENV` → `production`

### What you must set in `web/.env`

```env
DATABASE_URL_PROD=postgresql://postgres:postgres@postgres:5432/teamTaskManagementProdDb
AUTH_SECRET=<your-secret>
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

`SOCKET_URL` is overridden by Docker — you don't need to change it for Docker.

### URLs after start

| What | URL |
|------|-----|
| App | http://localhost:3000 |
| Socket | http://localhost:3001 |
| Postgres | `localhost:5432` — user `postgres` / password `postgres` |

---

## Run locally (development)

For coding with hot reload. You only need Docker for the database.

### 1. Database

```bash
docker compose up postgres -d
```

### 2. Environment

```bash
cp web/.env.example web/.env
cp socket/.env.example socket/.env
```

Use **`DATABASE_URL`** (with `@localhost`) — not `DATABASE_URL_PROD`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/teamTaskManagementProdDb
SOCKET_URL=http://localhost:3001
```

### 3. Install & migrate

```bash
cd web && npm install && npx prisma generate && npx prisma migrate dev && cd ..
cd socket && npm install && cd ..
```

### 4. Start (two terminals)

```bash
# Terminal 1
cd socket && npm run dev

# Terminal 2
cd web && npm run dev
```

Open **http://localhost:3000**

---

## Environment variables

### How it works

| File | Commit to GitHub? | What you do |
|------|-------------------|-------------|
| `.env.example` | Yes — safe template | Push this |
| `.env` | **Never** — has secrets | Keep local only |

```bash
cp web/.env.example web/.env
cp socket/.env.example socket/.env
```

| App | Setup effort |
|-----|--------------|
| **Socket** | Copy example → `.env` → **done**. Defaults are enough to test. |
| **Web** | Copy example → `.env` → add `AUTH_SECRET` + OAuth keys |

### Database URLs

| Variable | When | Host in URL |
|----------|------|-------------|
| `DATABASE_URL` | Local dev (`npm run dev`) | `localhost` |
| `DATABASE_URL_PROD` | Docker / production | `postgres` (Docker service name) |

Both use database: `teamTaskManagementProdDb`

---

### `socket/.env` — copy & run (no secrets)

Create `socket/.env` from the template below. **Nothing else to change** for local or Docker testing.

```env
# Socket server — no API keys or passwords needed

PORT=3001
WEB_URL=http://localhost:3000
```

> `WEB_URL` must be the URL you open in the browser (`http://localhost:3000`), not a Docker internal name like `http://web:3000`.

---

### `web/.env` — copy & add your secrets

Create `web/.env` and fill in OAuth keys + `AUTH_SECRET`.  
Generate secret: `openssl rand -base64 32`

```env
# --- Database ---
# DATABASE_URL      → local dev  (npm run dev)
# DATABASE_URL_PROD → Docker     (docker compose up)

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/teamTaskManagementProdDb
DATABASE_URL_PROD=postgresql://postgres:postgres@postgres:5432/teamTaskManagementProdDb

# --- Auth (NextAuth) ---
AUTH_SECRET=replace-with-a-long-random-string
AUTH_URL=http://localhost:3000

# GitHub — callback: http://localhost:3000/api/auth/callback/github
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret

# Google — callback: http://localhost:3000/api/auth/callback/google
AUTH_GOOGLE_ID=your-google-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-google-client-secret

# --- Socket ---
# NEXT_PUBLIC_SOCKET_URL → browser connects here (always localhost on your machine)
# SOCKET_URL             → local dev: localhost | Docker: set automatically to http://socket:3001

NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
SOCKET_URL=http://localhost:3001
```

For **Docker**, keep both database URLs in `.env`. Docker overrides `SOCKET_URL` to `http://socket:3001` automatically.

---

### Variable reference

**Web**

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Local dev | DB with `@localhost` |
| `DATABASE_URL_PROD` | Docker | DB with `@postgres` |
| `AUTH_SECRET` | Yes | Session encryption |
| `AUTH_URL` | Yes | `http://localhost:3000` |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | For GitHub login | OAuth credentials |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | For Google login | OAuth credentials |
| `NEXT_PUBLIC_SOCKET_URL` | Yes | Browser socket URL |
| `SOCKET_URL` | Yes | Server socket URL |

**Socket**

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Default `3001` |
| `WEB_URL` | Yes | CORS origin — `http://localhost:3000` |

---

### Push to GitHub

```bash
# Safe — templates only, no real secrets
git add web/.env.example socket/.env.example README.md

# Never commit these
# web/.env
# socket/.env
```

---

## OAuth setup

1. Create apps at [Google Cloud Console](https://console.cloud.google.com/) and/or [GitHub Developers](https://github.com/settings/developers).
2. Set callback URLs:
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3000/api/auth/callback/github
   ```
3. Paste client ID and secret into `web/.env`.

---

## Real-time events

```
User action → Server Action → Database → Socket emit → All clients in room
```

| Client → Server | Server → Clients |
|-----------------|------------------|
| `join-room` / `leave-room` | `containers-order-changed` |
| `container-order-changed` | `container-single-action` |
| `container-action` | `task:created` / `task:updated` |
| `task-created` / `task-updated` | `task:deleted` / `task:moved` |
| `task-deleted` / `task-moved` | |

---

## Project structure

```
taskManagmet-fullstack/
├── web/                    # Next.js app
│   ├── app/actions/        # Server actions (CRUD)
│   ├── app/dashboard/      # Main UI
│   ├── lib/prisma.ts       # DB client (picks URL by NODE_ENV)
│   ├── lib/socket.ts       # Socket client
│   ├── prisma/             # Schema + migrations
│   ├── .env.example        # Template — commit this
│   └── .env                # Your secrets — never commit
├── socket/                 # Socket.IO server
│   ├── src/index.ts
│   ├── .env.example        # Defaults work as-is
│   └── .env
├── docker-compose.yml
└── README.md
```

---

## Commands

```bash
# Web
cd web
npm run dev              # development
npm run build && npm start   # production
npx prisma studio        # database GUI
npx prisma migrate dev   # run migrations (dev)

# Socket
cd socket
npm run dev              # development
npm run build && npm start   # production
```

---

## Troubleshooting

<details>
<summary><strong>Real-time updates not working</strong></summary>

- Socket must run on port **3001**
- `WEB_URL` in `socket/.env` = `http://localhost:3000`
- `NEXT_PUBLIC_SOCKET_URL` in `web/.env` = `http://localhost:3001`

</details>

<details>
<summary><strong>Database connection failed</strong></summary>

| Mode | Use this variable | Host |
|------|-------------------|------|
| `npm run dev` | `DATABASE_URL` | `@localhost:5432` |
| `docker compose up` | `DATABASE_URL_PROD` | `@postgres:5432` |

Check Postgres: `docker compose ps`

</details>

<details>
<summary><strong>Port already in use</strong></summary>

```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

</details>

<details>
<summary><strong>Login / OAuth errors</strong></summary>

- `AUTH_SECRET` must be set in `web/.env`
- Callback URLs in Google/GitHub must match `http://localhost:3000/api/auth/callback/...`
- `AUTH_URL=http://localhost:3000`

</details>

---

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Prisma 7 · PostgreSQL 16 · Socket.IO · NextAuth.js · Docker

---

<div align="center">

MIT License · See [`web/prisma/schema.prisma`](web/prisma/schema.prisma) for the database schema

</div>
