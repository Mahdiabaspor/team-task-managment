"use client";

import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { IProject } from "../components/dragDropContainer";

export function useProjectSocket(
  projectId: string,
  setProject: React.Dispatch<React.SetStateAction<IProject>>
) {
  // مهم: جلوگیری از stale project / handler capture
  const projectIdRef = useRef(projectId);

  useEffect(() => {
    projectIdRef.current = projectId;
  }, [projectId]);

  useEffect(() => {
    socket.emit("join-room", projectId);

    // -------------------------
    // ORDER UPDATE
    // -------------------------
    const handleContainersOrder = (data: string) => {
      const updated = JSON.parse(data);

      setProject((prev) => {
        const containers = prev.containers.map((c) => {
          const found = updated.find((u: any) => u.id === c.id);
          return found ? { ...c, order: found.order } : c;
        });

        containers.sort((a, b) => a.order - b.order);

        return {
          ...prev,
          containers,
        };
      });
    };

    // -------------------------
    // SINGLE ACTION (ADD / EDIT / DELETE)
    // -------------------------
    const handleContainerAction = (
      data: string,
      type: "ADD" | "EDIT" | "DELETE"
    ) => {
      const updated = JSON.parse(data);

      setProject((prev) => {
        let containers = [...prev.containers];

        // ---------------- ADD ----------------
        if (type === "ADD") {
          containers = [...containers, {...updated,task:[]}];
        }

        // ---------------- DELETE ----------------
        if (type === "DELETE") {
          containers = containers.filter((c) => c.id !== updated.id);
        }

        // ---------------- EDIT ----------------
        if (type === "EDIT") {
          containers = containers.map((c) =>
            c.id === updated.id ? { ...c, ...updated } : c
          );
        }

        // همیشه sort
        // containers.sort((a, b) =>   b.order -a.order);

        return {
          ...prev,
          containers,
        };
      });
    };

    // -------------------------
    // SOCKET EVENTS
    // -------------------------
    socket.on("containers-order-changed", handleContainersOrder);
    socket.on("container-single-action", handleContainerAction);

    // -------------------------
    // CLEANUP
    // -------------------------
    return () => {
      socket.off("containers-order-changed", handleContainersOrder);
      socket.off("container-single-action", handleContainerAction);

      socket.emit("leave-room", projectIdRef.current);
    };
  }, [projectId, setProject]);
}