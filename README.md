# 📋 Team Task Management

> A modern, real-time collaborative task management application with drag-and-drop interface, real-time synchronization, and team collaboration features.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql)](https://www.postgresql.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8+-yellow?logo=socket.io)](https://socket.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## ✨ Features

- 🎯 **Project Management** - Create and manage multiple projects
- 📦 **Containers & Tasks** - Organize tasks into containers (To Do, In Progress, Done, etc.)
- ⚡ **Real-time Sync** - Instant updates across all connected users using Socket.IO
- 🎨 **Drag & Drop** - Intuitive drag-and-drop interface for task management
- 👥 **Team Collaboration** - Invite team members and assign tasks
- 🔐 **Secure Authentication** - OAuth support (Google, GitHub)
- 💾 **Data Persistence** - PostgreSQL database with Prisma ORM
- 📱 **Responsive Design** - Beautiful UI with Tailwind CSS and shadcn/ui
- 🔄 **Real-time Notifications** - Get notified of team activities instantly

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Socket.IO Client** - Real-time bidirectional communication
- **dnd-kit** - Drag and drop toolkit
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Server actions for database operations
- **Prisma ORM** - Database management
- **PostgreSQL** - Relational database
- **Socket.IO Server** - Real-time event broadcasting
- **NextAuth.js** - Authentication system

### DevOps & Tools
- **Node.js** - JavaScript runtime
- **npm** - Package manager
- **Git** - Version control

---

## 📁 Project Structure

```
team-task-management/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server actions
│   │   ├── container-actions.ts  # Container CRUD operations
│   │   ├── project-actions.ts    # Project CRUD operations
│   │   ├── task-actions.ts       # Task CRUD operations
│   │   └── user-actions.ts       # User management
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Main application pages
│   ├── generated/                # Generated Prisma client
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── sidebar/                  # Sidebar components
│   └── dialogs/                  # Dialog components
│
├── hooks/                        # Custom React hooks
│   └── use-mobile.ts             # Mobile detection hook
│
├── lib/                          # Utility functions
│   ├── prisma.ts                 # Prisma client instance
│   ├── socket.ts                 # Socket.IO client setup
│   └── utils.ts                  # Helper functions
│
├── providers/                    # Context providers
│   ├── SessionProvider.tsx       # NextAuth session provider
│   └── SocketProvider.tsx        # Socket.IO provider
│
├── prisma/                       # Prisma configuration
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
│
├── real-time-socket/             # Socket.IO server
│   ├── src/
│   │   ├── index.ts              # Main server file
│   │   └── types/                # TypeScript types
│   └── package.json              # Socket server dependencies
│
├── public/                       # Static assets
├── auth.ts                       # NextAuth configuration
├── middleware.ts                 # Next.js middleware
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies
└── .env.example                  # Environment variables template
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/team-task-management.git
cd team-task-management
```

### Step 2: Install Dependencies

```bash
# Install main application dependencies
npm install

# Install Socket.IO server dependencies
cd real-time-socket
npm install
cd ..
```

### Step 3: Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Copy the socket server env file
cp .env.example real-time-socket/.env
```

Then update `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/team_task_db"

# Socket.IO Server
PORT=3001
CLIENT_URL="http://localhost:3000"

# Optional: OAuth Credentials
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### Step 4: Setup Database

```bash
# Create PostgreSQL database
createdb team_task_db

# Run Prisma migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### Step 5: Start the Development Servers

**Terminal 1 - Next.js Frontend** (Port 3000):
```bash
npm run dev
```

**Terminal 2 - Socket.IO Server** (Port 3001):
```bash
cd real-time-socket
npm run dev
# or
node src/index.ts
```

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📖 Usage Guide

### Creating a Project

1. Click **"New Project"** button in the dashboard
2. Enter project name and description
3. Click **"Create"** to create the project

### Managing Tasks

1. Navigate to your project
2. Click **"New Container"** to create a container (e.g., "To Do", "In Progress", "Done")
3. Click **"Add Task"** in any container
4. Enter task details (title, description, assign members)
5. **Drag & Drop** tasks between containers to move them

### Team Collaboration

1. Go to **Project Settings**
2. Click **"Invite Members"**
3. Enter team member email address
4. Select their role (Viewer, Editor, Admin)
5. Click **"Send Invite"**

---

## 🔧 API Documentation

### Task Actions

#### Create Task
```typescript
createTask(projectId, title, containerId, description?, assignedId?, progress?)
```

#### Update Task
```typescript
editTaskFromForm(formData, projectId)
```

#### Delete Task
```typescript
deleteTask(taskId, projectId)
```

#### Move Task
```typescript
moveTask(taskId, containerId, projectId)
```

### Container Actions

#### Create Container
```typescript
createContainer(name, projectId)
```

#### Update Container
```typescript
editContainerName(title, containerId)
```

#### Delete Container
```typescript
deleteContainer(containerId)
```

---

## 🔄 Real-time Synchronization

The application uses **Socket.IO** for real-time data synchronization:

### Event Flow
```
User Action → Server Action → Database Update → Socket Emit → All Connected Clients
```

### Supported Real-time Events

**Container Events:**
- `container-action` - Create, edit, or delete container
- `container-order-changed` - Container order updated

**Task Events:**
- `task-created` - New task created
- `task-updated` - Task updated
- `task-deleted` - Task deleted
- `task-moved` - Task moved to different container

---

## 🐳 Docker Setup (Optional)

### Start PostgreSQL with Docker

```bash
docker run --name task-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=team_task_db \
  -p 5432:5432 \
  -d postgres:14
```

### Verify Database Connection

```bash
docker exec -it task-db psql -U postgres -d team_task_db -c "\dt"
```

---

## 🧪 Development Commands

```bash
# Development
npm run dev                    # Start Next.js dev server
cd real-time-socket && npm run dev  # Start Socket.IO server

# Building
npm run build                  # Build for production
npm start                      # Start production server

# Database
npx prisma migrate dev        # Create and run migration
npx prisma studio            # Open Prisma Studio (GUI)
npx prisma db seed           # Seed database

# Linting
npm run lint                  # Run ESLint
```

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `PORT` | Socket.IO server port | `3001` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | (optional) |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | (optional) |
| `NEXTAUTH_SECRET` | NextAuth encryption secret | (optional) |
| `NODE_ENV` | Environment mode | `development` / `production` |

---

## 📦 Database Schema

### Core Models

- **User** - Application users
- **Project** - Team projects
- **ProjectMember** - Project team members with roles
- **Container** - Task containers (To Do, In Progress, etc.)
- **Task** - Individual tasks within containers
- **Invitations** - Team member invitations

See [prisma/schema.prisma](prisma/schema.prisma) for full schema details.

---

## 🚨 Troubleshooting

### Socket.IO Connection Issues

If real-time updates aren't working:

1. **Check Socket.IO Server**
   ```bash
   # Verify server is running on port 3001
   lsof -i :3001
   ```

2. **Check CORS Configuration**
   - Ensure `CLIENT_URL` in `.env` matches your frontend URL
   - Socket server CORS should allow your frontend

3. **Browser Console**
   - Open DevTools (F12)
   - Check for Socket.IO connection errors in Console

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql postgresql://user:password@localhost:5432/team_task_db

# Check Prisma connection
npx prisma db execute --stdin < query.sql
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

---

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to repository
git push origin feature/feature-name

# Create Pull Request on GitHub
```

---

## 🎨 Styling & Customization

### Tailwind CSS Configuration

Edit [tailwind.config.ts](tailwind.config.ts) to customize:
- Colors
- Typography
- Spacing
- Responsive breakpoints

### Component Library

The project uses **shadcn/ui** components. Add new components:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

---

## 📊 Performance Tips

1. **Use Prisma Studio** to optimize queries
2. **Enable Socket.IO compression** for large payloads
3. **Index frequently queried fields** in database
4. **Use React.memo** for expensive components
5. **Enable Next.js Image Optimization**

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

For support, email support@example.com or open an issue on GitHub.

---

## 🚀 Deployment

### Vercel (Recommended for Frontend)

```bash
vercel deploy
```

### Railway or Render (For Backend & Socket.IO)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy Socket.IO server

### AWS or DigitalOcean (For Full Stack)

See deployment guides in documentation.

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.IO Documentation](https://socket.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## 🎯 Future Enhancements

- [ ] Task comments & activity log
- [ ] File attachments
- [ ] Advanced filtering & search
- [ ] Task templates
- [ ] Analytics & reporting
- [ ] Mobile app (React Native)
- [ ] Webhook integrations
- [ ] Dark mode toggle

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and Socket.IO**

⭐ Star this repo if you find it helpful!

</div>
