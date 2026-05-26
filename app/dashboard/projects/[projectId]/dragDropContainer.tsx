"use client"
import { createTask, moveTask } from "@/app/actions/task-actions"; // Added a mock update action
import { Task } from "@/app/generated/prisma/client";
import Draggable from "@/components/draggable";
import Droppable from "@/components/droppable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DragDropProvider } from "@dnd-kit/react";
import { Plus } from "lucide-react";
import { useEffect, useState, startTransition } from "react";

export interface IProject {
    // ... (Your interface remains the same)
    members: { id: string; role: string; projectId: string; userId: string; }[];
    containers: ({
        tasks: {
            title: string;
            id: string;
            order: number;
            description: string;
            containerId: string;
            assignedId: string;
        }[];
    } & {
        title: string;
        id: string;
        order: number;
        projectId: string;
    })[];
}


function DragDropContainer({ project: initialProject }: { project: IProject }) {
    // 1. Initialize local state with the prop
    const [project, setProject] = useState<IProject>(initialProject);
    const [taskAddingContainer, setTaskAddingContainer] = useState("");
    const [taskName, setTaskName] = useState("");


    function moveTaskLogic(currentProj: IProject, draggedTask: any, targetContainerId: string) {
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



    // Update local state if the prop changes from parent
    useEffect(() => {
        setProject(initialProject);
    }, [initialProject]);

    const addTask = async () => {
        if (!taskName) return;
        await createTask(taskName, taskAddingContainer);
        setTaskName("");
        setTaskAddingContainer("");
        // Note: You might want to update local state here too for instant feedback
    };

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                const { operation } = event;
                if (event.canceled || !operation.target || !operation.source) return;

                const draggedTask = operation.source.data as Task;
                const targetContainerId = operation.target.id as string;

                // If dropped in the same container, do nothing
                if (draggedTask.containerId === targetContainerId) return;

                // Update UI optimistically
                const updatedProject = moveTaskLogic(project, draggedTask, targetContainerId);
                setProject(updatedProject);

                // Update server in background without using useOptimistic
                startTransition(async () => {
                    try {
                        await moveTask(draggedTask.id, targetContainerId);
                    } catch (error) {
                        console.error("failed to move task", error);
                        // Revert on error
                        setProject(project);
                    }
                });

            }}
        >
            <div className="flex gap-4 p-4">
                {project.containers.map((container) => (
                    <div key={container.id} className="w-72 min-h-100 bg-gray-50 rounded-xl flex flex-col border">
                        <div className="bg-black p-3 w-full rounded-t-xl">
                            <h3 className="font-bold text-center text-white">{container.title}</h3>
                        </div>

                        <Droppable id={container.id} key={container.id} >
                            <div className="p-2 grow flex flex-col gap-2 w-full">
                                {container.tasks.map((task) => (
                                    <Draggable key={task.id} id={task.id} data={task}>
                                        <div className="bg-white p-3 rounded shadow-sm border border-gray-200 w-full hover:border-blue-500 cursor-grab active:cursor-grabbing">
                                            {task.title}
                                        </div>
                                    </Draggable>
                                ))}
                            </div>

                            <div className="p-2 mt-auto">
                                {taskAddingContainer !== container.id && (
                                    <Button
                                        className="w-full"
                                        variant="ghost"
                                        onClick={() => setTaskAddingContainer(container.id)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add task
                                    </Button>
                                )}


                                {taskAddingContainer === container.id && (
                                    <div className="mt-2 space-y-2">
                                        <Input
                                            value={taskName}
                                            onChange={(e) => setTaskName(e.target.value)}
                                            placeholder="Task title"
                                            autoFocus

                                            className="text-center bg-black/5"

                                        />
                                        <div className="flex gap-2">
                                            <Button size="sm" className="flex-1" onClick={addTask}>Add</Button>
                                            <Button size="sm" variant="outline" onClick={() => setTaskAddingContainer("")}>Cancel</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropProvider>
    );
}

export default DragDropContainer;
