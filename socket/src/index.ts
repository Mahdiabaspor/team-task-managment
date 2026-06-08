import { Server, Socket } from "socket.io";
import http from "http";
import cors from "cors";
import express from "express";
import {
  ITask,
  IContainer,
  ContainerOrderUpdate,
  ContainerAction,
  TaskUpdate,
} from "./types/t.task";

const app = express();
const server = http.createServer(app);


export const env = {
  PORT: process.env.PORT || 3001,
  CLIENT_URL:
    process.env.WEB_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Enable CORS
app.use(
  cors({
    origin: env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store active rooms and users
const activeRooms = new Map<string, Set<string>>();

// ==========================================
// SOCKET CONNECTION
// ==========================================
io.on("connection", (socket: Socket) => {
  console.log(`\n👤 User connected: ${socket.id}`);
  console.log(`📊 Total connected users: ${io.engine.clientsCount}`);

  // ==========================================
  // ROOM MANAGEMENT
  // ==========================================
  socket.on("join-room", (projectId: string) => {
    socket.join(projectId);

    if (!activeRooms.has(projectId)) {
      activeRooms.set(projectId, new Set());
    }
    activeRooms.get(projectId)?.add(socket.id);

    console.log(`User ${socket.id} joined room ${projectId}`);

    // Notify others in room
    socket.to(projectId).emit("user-joined", {
      userId: socket.id,
      timestamp: new Date(),
    });
  });

  socket.on("leave-room", (projectId: string) => {
    socket.leave(projectId);
    activeRooms.get(projectId)?.delete(socket.id);

    if (activeRooms.get(projectId)?.size === 0) {
      activeRooms.delete(projectId);
    }

    console.log(`User ${socket.id} left room ${projectId}`);

    socket.to(projectId).emit("user-left", {
      userId: socket.id,
      timestamp: new Date(),
    });
  });

  // ==========================================
  // CONTAINER EVENTS
  // ==========================================

  // Container order changed
  socket.on(
    "container-order-changed",
    (projectId: string, containers: ContainerOrderUpdate[]) => {
      console.log(`Container order changed in ${projectId}`, containers);

      // Broadcast to all users in the room (including sender)
      io.to(projectId).emit("containers-order-changed", JSON.stringify(containers));
    }
  );

  // Container single action (ADD/EDIT/DELETE)
  socket.on(
    "container-action",
    (
      projectId: string,
      container: ContainerAction,
      type: "ADD" | "EDIT" | "DELETE"
    ) => {
      // console.log(
      //   `\n📦 Container ${type} received in ${projectId} from ${socket.id}:`,
      //   container.id
      // );

      // Broadcast to all users in the room
      // const usersInRoom = io.sockets.adapter.rooms.get(projectId)?.size || 0;
      // console.log(`📢 Broadcasting to ${usersInRoom} users in room ${projectId}`);
      io.to(projectId).emit("container-single-action", JSON.stringify(container), type);
    }
  );

  // ==========================================
  // TASK EVENTS
  // ==========================================

  // Task created
  socket.on("task-created", (projectId: string, task: ITask) => {
    // console.log(`\n✅ Task created in ${projectId} from ${socket.id}: ${task.id}`);
    // const usersInRoom = io.sockets.adapter.rooms.get(projectId)?.size || 0;
    // console.log(`📢 Broadcasting to ${usersInRoom} users in room ${projectId}`);
    io.to(projectId).emit("task:created", task);
  });

  // Task updated
  socket.on("task-updated", (projectId: string, task: TaskUpdate) => {
    // console.log(`\n📝 Task updated in ${projectId} from ${socket.id}: ${task.id}`);
    // const usersInRoom = io.sockets.adapter.rooms.get(projectId)?.size || 0;
    // console.log(`📢 Broadcasting to ${usersInRoom} users in room ${projectId}`);
    io.to(projectId).emit("task:updated", task);
  });

  // Task deleted
  socket.on("task-deleted", (projectId: string, taskId: string) => {
    // console.log(`\n🗑️ Task deleted in ${projectId} from ${socket.id}: ${taskId}`);
    // const usersInRoom = io.sockets.adapter.rooms.get(projectId)?.size || 0;
    // console.log(`📢 Broadcasting to ${usersInRoom} users in room ${projectId}`);
    io.to(projectId).emit("task:deleted", { id: taskId });
  });

  // Task moved to different container
  socket.on(
    "task-moved",
    (projectId: string, task: ITask) => {
      // console.log(`\n➡️ Task moved in ${projectId} from ${socket.id}: ${task.id}`);
      // const usersInRoom = io.sockets.adapter.rooms.get(projectId)?.size || 0;
      // console.log(`📢 Broadcasting to ${usersInRoom} users in room ${projectId}`);
      io.to(projectId).emit("task:moved", task);
    }
  );

  // ==========================================
  // DISCONNECT
  // ==========================================
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove user from all rooms
    activeRooms.forEach((users, projectId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        io.to(projectId).emit("user-left", {
          userId: socket.id,
          timestamp: new Date(),
        });
      }
    });
  });

  // ==========================================
  // ERROR HANDLING
  // ==========================================
  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// ==========================================
// SERVER SETUP
// ==========================================


const PORT = env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
