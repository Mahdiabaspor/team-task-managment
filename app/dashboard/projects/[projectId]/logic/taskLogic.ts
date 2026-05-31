import { arrayMove } from "@dnd-kit/sortable";
import { IProject } from "../components/dragDropContainer";
import { Active, Over } from "@dnd-kit/core";
import { createTask, editTasksOrders } from "@/app/actions/task-actions";
import { Dispatch, SetStateAction } from "react";

   export function moveTaskLogic(currentProj: IProject, draggedTask: any, targetContainerId: string) {
        // ۱. پیدا کردن ایندکس‌ها
        const sourceIdx = currentProj.containers.findIndex(c => c.id === draggedTask.containerId);
        const targetIdx = currentProj.containers.findIndex(c => c.id === targetContainerId);

        if (sourceIdx === -1 || targetIdx === -1) return currentProj;

        // ۲. کپی عمیق از کانتینرها
        const newContainers = currentProj.containers.map((container, index) => {
            // حذف تسک از کانتینر مبدا
            if (index === sourceIdx) {
                return {
                    ...container,
                    tasks: container.tasks.filter(t => t.id !== draggedTask.id)
                };
            }
            // اضافه کردن تسک به کانتینر مقصد (فقط اگر از قبل آنجا نباشد)
            if (index === targetIdx) {
                const alreadyExists = container.tasks.some(t => t.id === draggedTask.id);
                if (alreadyExists) return container; // جلوگیری از دیتای تکراری

                const updatedTask = { ...draggedTask, containerId: targetContainerId };
                return {
                    ...container,
                    tasks: [...container.tasks, updatedTask]
                };
            }
            return container;
        });

        return { ...currentProj, containers: newContainers };
    }




   export const reorderTasksInContainer = (currentProj: IProject, active: Active, over: Over, setProject: Dispatch<SetStateAction<IProject>>) => {
        // Find which container contains these tasks
        const container = currentProj.containers.find(c =>
            c.tasks.some(t => t.id === active.id)
        );

        if (!container) return currentProj;

        const oldIndex = container.tasks.findIndex(t => t.id === active.id);
        const newIndex = container.tasks.findIndex(t => t.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return currentProj;
        if (oldIndex === newIndex) return currentProj;

        // Reorder tasks within the container
        const reorderedTasks = arrayMove(container.tasks, oldIndex, newIndex);
        const updatedTasks = reorderedTasks.map((task, index) => ({
            ...task,
            order: index + 1
        }));

        // Update the entire project with new task orders
        const updatedContainers = currentProj.containers.map(c =>
            c.id === container.id ? { ...c, tasks: updatedTasks } : c
        );

        const newProj = { ...currentProj, containers: updatedContainers };
        setProject(newProj);

        // Save to database
        const taskOrderData = updatedTasks.map(t => ({ id: t.id, order: t.order }));
        editTasksOrders(taskOrderData);

        return newProj;
    };




      export  const addTask = async (projectId:string, taskName:string,setTaskName: (value: SetStateAction<string>) => void,setTaskAddingContainer: (value: SetStateAction<string>,) => void,taskAddingContainer:string) => {
            if (!taskName) return;
            await createTask(projectId,taskName, taskAddingContainer);
            setTaskName("");
            setTaskAddingContainer("");
        };