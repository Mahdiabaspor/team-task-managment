"use client"
import { createTask, moveTask, editTasksOrders } from "@/app/actions/task-actions"; // Added a mock update action
import { Container, ProjectMember, Task, User } from "@/app/generated/prisma/client";
import Draggable from "@/app/dashboard/projects/[projectId]/components/draggable";
import DropDownContainer from "@/components/dropDownContainer";
import Droppable from "@/app/dashboard/projects/[projectId]/components/droppable";
import { TaskDrawer } from "@/app/dashboard/projects/[projectId]/components/taskDrawer";
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
import { socket } from "@/lib/socket";
import { useProjectSocket } from "../hooks/useProjectSocket";
import { moveContainers } from "../logic/containerLogic";
import { addTask, moveTaskLogic, reorderTasksInContainer } from "../logic/taskLogic";
import { DragEndLogic } from "../logic/dragEndLogic";
export interface IProject {
    // ... (Your interface remains the same)
    id: string
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

    const [project, setProject] = useState<IProject>(initialProject);
    const [taskAddingContainer, setTaskAddingContainer] = useState("");
    const [taskName, setTaskName] = useState("");
    useProjectSocket(project.id, setProject);


    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );







    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={(e)=>{
                DragEndLogic(e,project,setProject)
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
                                    items={container?.tasks?.map(t => t.id) ?? []}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="p-2 grow flex flex-col gap-2 w-full" draggable={false}>
                                        {container?.tasks?.map((task) => (
                                            <SortableTask key={task.id} task={task}>
                                                <Draggable
                                                    id={task.id}
                                                    data={task}
                                                >
                                                    <TaskDrawer
                                                        task={task}
                                                        projectMembers={project.members}
                                                        projectId={project.id}
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
                                                    onClick={() => {
                                                        addTask(project.id,taskName, setTaskName, setTaskAddingContainer, taskAddingContainer)
                                                    }}
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
