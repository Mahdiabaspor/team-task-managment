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




 // ---------------- CREATE ----------------
    socket.on("task:created", (task: any) => {
      setProject((prev) => ({
        ...prev,
        containers: prev.containers.map((c) =>
          c.id === task.containerId
            ? { ...c, tasks: [...c.tasks, task] }
            : c
        ),
      }));
    });

    // ---------------- UPDATE ----------------
    socket.on("task:updated", (task: any) => {
      setProject((prev) => ({
        ...prev,
        containers: prev.containers.map((c) => ({
          ...c,
          tasks: c.tasks.map((t) =>
            t.id === task.id ? { ...t, ...task } : t
          ),
        })),
      }));
    });

    // ---------------- DELETE ----------------
    socket.on("task:deleted", (task: any) => {
      setProject((prev) => ({
        ...prev,
        containers: prev.containers.map((c) => ({
          ...c,
          tasks: c.tasks.filter((t) => t.id !== task.id),
        })),
      }));
    });

    // ---------------- MOVE ----------------
    socket.on("task:moved", (task: any) => {
      setProject((prev) => {
        const containers = prev.containers.map((c) => {
          // remove from all containers
          const filteredTasks = c.tasks.filter((t) => t.id !== task.id);

          // add to new container
          if (c.id === task.containerId) {
            return {
              ...c,
              tasks: [...filteredTasks, task],
            };
          }

          return {
            ...c,
            tasks: filteredTasks,
          };
        });

        return { ...prev, containers };
      });
    });





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



  socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
      socket.off("task:moved");


      socket.emit("leave-room", projectIdRef.current);
    };
  }, [projectId, setProject]);
}