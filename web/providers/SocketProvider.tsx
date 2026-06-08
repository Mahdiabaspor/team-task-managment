"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function SocketProvider() {
  useEffect(() => {
    // connect
    if(socket.disconnected){
    socket.connect()

    }

    socket.on("connect", () => {
      console.log("connected:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <></>;
}