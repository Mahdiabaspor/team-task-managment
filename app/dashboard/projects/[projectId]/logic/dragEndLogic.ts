import { DragEndEvent } from "@dnd-kit/core";
import { moveTaskLogic, reorderTasksInContainer } from "./taskLogic";
import { moveContainers } from "./containerLogic";
import { Task } from "@/app/generated/prisma/client";
import { IProject } from "../components/dragDropContainer";
import { Dispatch, SetStateAction, startTransition } from "react";
import { moveTask } from "@/app/actions/task-actions";

export const DragEndLogic = (event:DragEndEvent,project:IProject,setProject: Dispatch<SetStateAction<IProject>>) => {
    const { active, over } = event;
    console.log("Drag ended. Active:", active, "Over:", over);
    if (!over) return;

    // Handle container reordering
    if (active.data?.current?.type === "container") {
        moveContainers(project, active, over, setProject);
        return;
    }

    // Handle task reordering within the same container

    const draggedTask = active.data.current as Task;
    const targetTaskContainerId = over.id as string;

    // If dragging over a task (reordering within container)
    if (over.data?.current?.type === "task") {
        const overTask = over.data.current as Task;
        if (draggedTask.containerId === overTask.containerId) {
            reorderTasksInContainer(project, active, over, setProject);
            return;
        }
    }

    // If dragging over a container (moving to different container)
    if (draggedTask.containerId !== targetTaskContainerId) {
        const updatedProject = moveTaskLogic(
            project,
            draggedTask,
            targetTaskContainerId
        );

        setProject(updatedProject);

        startTransition(async () => {
            try {
                await moveTask(draggedTask.id, targetTaskContainerId);
            } catch (error) {
                console.error(error);
                setProject(project);
            }
        });
    }
    return;

}