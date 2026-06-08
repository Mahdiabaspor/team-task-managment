import { io } from "socket.io-client";

export const socket = io("http://localhost:3001", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("✅ Socket connected to backend on port 3001");
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Socket disconnected:", reason);
});

// Helper function to emit safely with connection check
export const safeSocketEmit = (eventName: string, ...args: any[]) => {
  if (socket.connected) {
    console.log(`📤 Emitting event: ${eventName}`, args);
    socket.emit(eventName, ...args);
  } else {
    console.warn(`⚠️ Socket not connected, queuing event: ${eventName}`);
    socket.once("connect", () => {
      console.log(`📤 Socket connected, now emitting queued event: ${eventName}`, args);
      socket.emit(eventName, ...args);
    });
  }
};

