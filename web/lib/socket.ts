import { io } from "socket.io-client";

function getSocketUrl() {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";
  }
  return process.env.SOCKET_URL ?? "http://socket:3001";
}

export const socket = io(getSocketUrl(), {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ["websocket", "polling"],
});

if (typeof window !== "undefined") {
  socket.on("connect", () => {
    console.log("✅ Socket connected to backend on port 3001");
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️ Socket disconnected:", reason);
  });
}

export const safeSocketEmit = (eventName: string, ...args: any[]) => {
  if (!socket.connected) {
    socket.connect();
  }

  if (socket.connected) {
    socket.emit(eventName, ...args);
  } else {
    socket.once("connect", () => {
      socket.emit(eventName, ...args);
    });
  }
};
