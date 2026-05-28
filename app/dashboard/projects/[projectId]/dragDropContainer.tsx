"use client"
import { createTask, moveTask, editTasksOrders } from "@/app/actions/task-actions"; // Added a mock update action
import { ProjectMember, Task, User } from "@/app/generated/prisma/client";
import Draggable from "@/app/dashboard/projects/[projectId]/draggable";
import DropDownContainer from "@/components/dropDownContainer";
import Droppable from "@/app/dashboard/projects/[projectId]/droppable";
import { TaskDrawer } from "@/app/dashboard/projects/[projectId]/taskDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Plus } from "lucide-react";
import { useEffect, useState, startTransition } from "react";
import {
    Active,
    DndContext,
    Over,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    horizontalListSortingStrategy,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableContainer from "./sortableContainer";
import { editContainersOrders } from "@/app/actions/container-actions";
import SortableTask from "./sortableTask";
export interface IProject {
    // ... (Your interface remains the same)
    members: { id: string; role: string; projectId: string; userId: string; user: User }[];
    containers: ({
        tasks: {
            title: string;
            id: string;
            order: number;
            description: string;
            containerId: string;
            assignedId: string;
            assigned: { id: string; role: string; projectId: string; userId: string; user: User } | null
            progress: number;
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

    // Configure sensors for drag activation
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement before drag starts
            },
        })
    );


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
const moveContainers = (currentProj: IProject, active: Active, over: Over) => {
    const oldIndex = currentProj.containers.findIndex(c => c.id === active.id);
    const newIndex = currentProj.containers.findIndex(c => c.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // ۱. جابه‌جایی در آرایه (بدون درگیری با ریاضی)
    const movedArray = arrayMove(currentProj.containers, oldIndex, newIndex);

    // ۲. اصلاح orderها بر اساس ایندکس جدید (0, 1, 2, ...)
    const updatedContainers = movedArray.map((container, index) => ({
        ...container,
        order: index + 1 // ترتیب جدید بر اساس مکان فعلی در آرایه
    }));

    setProject({ ...currentProj, containers: updatedContainers });
    const rawdata = updatedContainers.map(c => ({ id: c.id, order: c.order }));
    editContainersOrders(rawdata);
    // حالا در بک‌-اند فقط کافیست لیست آیدی‌ها را به همین ترتیب بفرستی
    // یا کل اشیاء جدید را آپدیت کنی
};

const reorderTasksInContainer = (currentProj: IProject, active: Active, over: Over) => {
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
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={(event) => {
                const { active, over } = event;
                console.log("Drag ended. Active:", active, "Over:", over);
                if (!over) return;

                // Handle container reordering
                if (active.data?.current?.type === "container") {
                    moveContainers(project, active, over);
                    return;
                }

                // Handle task reordering within the same container
   
                    const draggedTask = active.data.current as Task;
                    const targetTaskContainerId = over.id as string;

                    // If dragging over a task (reordering within container)
                    if (over.data?.current?.type === "task") {
                        const overTask = over.data.current as Task;
                        if (draggedTask.containerId === overTask.containerId) {
                            reorderTasksInContainer(project, active, over);
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
                
            }}
        >
            <div className="flex gap-4 p-4">



                <SortableContext
                    strategy={horizontalListSortingStrategy}
                    items={project.containers.map((c) => c.id)}
                >
                    {project.containers.map((container) => (
                        <SortableContainer
                            key={container.id}

                            container={container}
                        >
                                <Droppable id={container.id} >
                                    <SortableContext
                                        items={container.tasks.map(t => t.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="p-2 grow flex flex-col gap-2 w-full" draggable={false}>
                                            {container.tasks.map((task) => (
                                                <SortableTask key={task.id} task={task}>
                                                    <Draggable
                                                        id={task.id}
                                                        data={task}
                                                    >
                                                        <TaskDrawer
                                                            task={task}
                                                            projectMembers={project.members}
                                                        >
                                                            <div className="bg-white p-3 overflow-hidden rounded shadow-sm border border-gray-200 w-full hover:border-blue-500 cursor-grab active:cursor-grabbing relative">
                                                                <span
                                                                    className="absolute left-0 top-0 bg-green-500/20 h-full transition-all duration-500"
                                                                    style={{
                                                                        width: `${task.progress}%`,
                                                                    }}
                                                                />

                                                                <span className="absolute left-0 bg-green-500 h-full w-1 top-0" />

                                                                <div className="relative z-30 flex items-center justify-between">
                                                                    <p className="font-manrope font-bold">
                                                                        {task.title}
                                                                    </p>

                                                                    {task.assigned && (
                                                                        <Badge>
                                                                            {task.assigned.user.name}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TaskDrawer>
                                                    </Draggable>
                                                </SortableTask>
                                            ))}
                                        </div>
                                    </SortableContext>

                                    <div className="p-2 mt-auto">
                                        {taskAddingContainer !== container.id && (
                                            <Button
                                                className="w-full"
                                                variant="ghost"
                                                onClick={() =>
                                                    setTaskAddingContainer(container.id)
                                                }
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add task
                                            </Button>
                                        )}

                                        {taskAddingContainer === container.id && (
                                            <div className="mt-2 space-y-2">
                                                <Input
                                                    value={taskName}
                                                    onChange={(e) =>
                                                        setTaskName(e.target.value)
                                                    }
                                                    placeholder="Task title"
                                                    autoFocus
                                                    className="text-center bg-black/5"
                                                />

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={addTask}
                                                    >
                                                        Add
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setTaskAddingContainer("")
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Droppable>
                
                        </SortableContainer>
                    ))}
                </SortableContext>


            </div>
        </DndContext>
    );
}

export default DragDropContainer;
