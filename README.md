# Task Management Fullstack

> A real-time collaborative task management app with drag-and-drop boards, live sync, and team collaboration.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8+-yellow?logo=socket.io)](https://socket.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

## Features

- **Project management** — create and manage multiple projects
- **Containers & tasks** — organize work into columns (To Do, In Progress, Done, etc.)
- **Real-time sync** — instant updates across users via Socket.IO
- **Drag & drop** — move tasks between containers with dnd-kit
- **Team collaboration** — invite members, assign tasks, manage roles
- **OAuth auth** — sign in with Google or GitHub (NextAuth.js)
- **PostgreSQL + Prisma** — typed database access and migrations

## Services

| Service  | Port | Folder   | Description                |
|----------|------|----------|----------------------------|
| Web      | 3000 | `web/`   | Next.js frontend + API     |
| Socket   | 3001 | `socket/`| Socket.IO real-time server |
| Postgres | 5432 | —        | PostgreSQL database        |

## Tech stack

| Layer      | Technologies |
|------------|--------------|
| Frontend   | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, dnd-kit |
| Backend    | Next.js Server Actions, Prisma 7, PostgreSQL |
| Real-time  | Socket.IO (separate `socket/` service) |
| Auth       | NextAuth.js v5 (Google, GitHub) |
| DevOps     | Docker, Docker Compose |

## Project structure

```
taskManagmet-fullstack/
├── web/                              # Next.js application
│   ├── app/
│   │   ├── actions/                  # Server actions (tasks, containers, projects…)
│   │   ├── api/auth/                 # NextAuth route
│   │   ├── auth/                     # Login page
│   │   ├── dashboard/                # Main app pages
│   │   └── generated/prisma/         # Generated Prisma client
│   ├── components/                   # UI components (shadcn/ui, dialogs, sidebar)
│   ├── lib/                          # prisma.ts, socket.ts, utils
│   ├── providers/                    # SessionProvider, SocketProvider
│   ├── prisma/                       # schema + migrations
│   ├── auth.ts                       # NextAuth config
│   ├── middleware.ts                 # Auth route protection
│   ├── dockerfile
│   └── .env                          # Web environment variables
│
├── socket/                           # Socket.IO server
│   ├── src/
│   │   ├── index.ts                  # Main server
│   │   └── types/                    # Shared event types
│   ├── dockerfile
│   └── .env                          # Socket environment variables
│
├── docker-compose.yml                # Production Docker setup
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/) & Docker Compose (for Docker setup)
- [Git](https://git-scm.com/)

---

## Run with Docker (production)

Builds and runs all services in production mode.

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd taskManagmet-fullstack
```

### 2. Create environment files

Copy the example files and fill in your real secrets:

```bash
cp web/.env.example web/.env
cp socket/.env.example socket/.env
```

Then edit `web/.env` for Docker:

- `DATABASE_URL` → use `@postgres:5432` (not `localhost`)
- `SOCKET_URL` → `http://socket:3001`

> `.env.example` files are safe to push to GitHub. **Never** commit `.env` (real secrets).

> Generate `AUTH_SECRET`: `openssl rand -base64 32`

| Variable | Docker value | Why |
|----------|--------------|-----|
| `NEXT_PUBLIC_SOCKET_URL` | `http://localhost:3001` | Browser connects from your machine |
| `SOCKET_URL` | `http://socket:3001` | Web server talks to socket inside Docker network |
| `WEB_URL` | `http://localhost:3000` | CORS must match the browser origin |
| `DATABASE_URL` | `@postgres:5432` | Docker service name for Postgres |

### 3. Start

```bash
docker compose up --build
```

### 4. Open the app

- Web → http://localhost:3000
- Socket → http://localhost:3001
- Postgres → `localhost:5432` (user: `postgres`, password: `postgres`, db: `myFinalDb`)

### Docker commands

```bash
docker compose up --build -d    # run in background
docker compose logs -f          # view logs
docker compose down             # stop services
docker compose down -v          # stop + delete database volume
```

### Deploying to a real domain

| Variable | Update to |
|----------|-----------|
| `AUTH_URL` | `https://yourdomain.com` |
| `WEB_URL` (socket) | `https://yourdomain.com` |
| `NEXT_PUBLIC_SOCKET_URL` | your public socket URL |

---

## Run locally (development)

Hot reload without rebuilding Docker images.

### 1. Start the database

```bash
# Recommended: Postgres only in Docker
docker compose up postgres -d
```

Or use a local PostgreSQL instance with a database named `myFinalDb`.

### 2. Create environment files

```bash
cp web/.env.example web/.env
cp socket/.env.example socket/.env
```

The example files already use `localhost` for local dev — add your OAuth keys and `AUTH_SECRET`.

> See `web/.env.example` and `socket/.env.example` for comments on each variable.

### 3. Install dependencies

```bash
cd web
npm install
npx prisma generate
npx prisma migrate dev
cd ..

cd socket
npm install
cd ..
```

### 4. Start dev servers

Use **two terminals**:

```bash
# Terminal 1 — Socket (port 3001)
cd socket
npm run dev
```

```bash
# Terminal 2 — Web (port 3000)
cd web
npm run dev
```

### 5. Open the app

http://localhost:3000

---

## OAuth setup (Google / GitHub)

1. Create OAuth apps in [Google Cloud Console](https://console.cloud.google.com/) and/or [GitHub Developer Settings](https://github.com/settings/developers).
2. Add callback URLs:
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3000/api/auth/callback/github
   ```
3. Copy client ID and secret into `web/.env`.

---

## Real-time events

```
User action → Server Action → Database → Socket emit → All clients in project room
```

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-room` / `leave-room` | Client → Server | Join a project room |
| `container-order-changed` | Client → Server | Reorder containers |
| `container-action` | Client → Server | Add, edit, or delete a container |
| `task-created` | Client → Server | Create a task |
| `task-updated` | Client → Server | Update a task |
| `task-deleted` | Client → Server | Delete a task |
| `task-moved` | Client → Server | Move a task to another container |
| `containers-order-changed` | Server → Clients | Broadcast container order |
| `container-single-action` | Server → Clients | Broadcast container change |
| `task:created` / `task:updated` / `task:deleted` / `task:moved` | Server → Clients | Broadcast task changes |

---

## Environment variables

### Web (`web/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth session encryption secret |
| `AUTH_URL` | Public URL of the web app |
| `AUTH_GITHUB_ID` | GitHub OAuth client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth client secret |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_SOCKET_URL` | Socket URL for the **browser** |
| `SOCKET_URL` | Socket URL for the **server** (Docker: `http://socket:3001`) |

### Socket (`socket/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Socket server port (default: `3001`) |
| `WEB_URL` | Frontend origin for CORS |

---

## Development commands

```bash
# Web
cd web
npm run dev          # development server
npm run build        # production build
npm start            # production server
npx prisma studio    # database GUI
npx prisma migrate dev

# Socket
cd socket
npm run dev          # development (ts-node)
npm run build        # compile TypeScript
npm start            # production (node dist/index.js)
```

---

## Database models

- **User** — app users
- **Project** — team projects
- **ProjectMember** — members and roles
- **Container** — task columns
- **Task** — tasks inside containers
- **Invitations** — team invites

See [`web/prisma/schema.prisma`](web/prisma/schema.prisma) for the full schema.

---

## Troubleshooting

### Real-time updates not working

- Socket server must be running on port **3001**
- `WEB_URL` in `socket/.env` must match where you open the app (`http://localhost:3000`)
- `NEXT_PUBLIC_SOCKET_URL` in `web/.env` must be `http://localhost:3001`

### Database connection failed

| Mode | `DATABASE_URL` host |
|------|---------------------|
| Docker | `@postgres:5432` |
| Local dev | `@localhost:5432` |

Check Postgres is running: `docker compose ps`

### Port already in use

```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Docker build fails on web

Make sure `web/.env` exists before building. `NEXT_PUBLIC_SOCKET_URL` is baked in at build time.

---

## License

MIT
