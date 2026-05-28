"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, Cell } from "recharts"
import confetti from "canvas-confetti"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { ProjectMember, Task } from "@/app/generated/prisma/client"
import { editTaskFromForm } from "@/app/actions/task-actions"
import { IProject } from "@/app/dashboard/projects/[projectId]/dragDropContainer"

const data = [
    { goal: 0 },
    { goal: 10 },
    { goal: 20 },
    { goal: 30 },
    { goal: 40 },
    { goal: 50 },
    { goal: 60 },
    { goal: 70 },
    { goal: 80 },
    { goal: 90 },
    { goal: 100 },
]

export function TaskDrawer({ children, task, projectMembers }: { children: React.ReactNode, task: Task, projectMembers: IProject["members"] }) {
    const [goal, setGoal] = React.useState(task.progress ?? 0)
    const [title, setTitle] = React.useState(task.title)
    const [description, setDescription] = React.useState(task.description)
    const [assignedId, setAssignedId] = React.useState(task.assignedId ?? "")
    const [isPending, setIsPending] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const prevGoalRef = React.useRef(task.progress ?? 0)
    const formRef = React.useRef<HTMLFormElement>(null)

    // Trigger confetti when progress reaches 100
    React.useEffect(() => {
        if (goal === 100 && prevGoalRef.current !== 100) {
            confetti({
                particleCount: 300,
                spread: 200,
                origin: { y: 0.6 },
            })
        }
        prevGoalRef.current = goal
    }, [goal])

    function onClick(adjustment: number) {
        setGoal(Math.max(0, Math.min(100, goal + adjustment)))
    }

    function hasChanges(): boolean {
        return (
            goal !== (task.progress ?? 0) ||
            title !== task.title ||
            description !== task.description ||
            assignedId !== (task.assignedId ?? "")
        )
    }

    async function handleSubmit() {
        if (!hasChanges()) {
            setError("No changes detected")
            return
        }

        setError(null)
        setIsPending(true)

        try {
            if (formRef.current) {
                await new Promise((resolve, reject) => {
                    const formData = new FormData(formRef.current!)
                    editTaskFromForm(formData)
                        .then(resolve)
                        .catch((err) => {
                            setError(err.message || "Failed to update task")
                            reject(err)
                        })
                })
            }
        } catch (err) {
            console.error("Submission error:", err)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                {/* <Button variant="outline">Open Drawer</Button> */}
                {children}
            </DrawerTrigger>
            <DrawerContent className="flex items-center">
                <div className="mx-auto w-full max-w-5xl">
                    <DrawerHeader>
                        <DrawerTitle>Task Progress & Details</DrawerTitle>
                        <DrawerDescription>Set your task progress. and assignment </DrawerDescription>
                    </DrawerHeader>
                    <div className="w-full flex flex-col md:flex-row items-start gap-4">
                        <div className="p-4 pb-0 w-full md:w-1/3 flex flex-col">
                            <div className="flex items-center justify-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 rounded-full"
                                    onClick={() => onClick(-10)}
                                    disabled={goal <= 0}
                                >
                                    <Minus />
                                    <span className="sr-only">Decrease</span>
                                </Button>
                                <div className="flex-1 text-center">
                                    <div className="text-7xl font-bold tracking-tighter">
                                        {goal} %
                                    </div>
                                    <div className="text-[0.70rem] text-muted-foreground uppercase">
                                        progress
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 rounded-full"
                                    onClick={() => onClick(10)}
                                    disabled={goal >= 100}
                                >
                                    <Plus />
                                    <span className="sr-only">Increase</span>
                                </Button>
                            </div>
                            <div className="mt-3 h-[120px] w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <Bar dataKey="goal" fill="var(--chart-1)">
                                            {data.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={goal >= entry.goal ? "black" : "var(--chart-1)"}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <form ref={formRef} action={editTaskFromForm} className="p-4 w-full md:w-2/3">
                            <input type="hidden" name="id" value={task.id} />
                            <input type="hidden" name="progress" value={goal.toString()} />
                            <div className="space-y-3">
                                <label className="block">
                                    <div className="text-sm font-medium">Title</div>
                                    <input
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="mt-1 w-full rounded border p-2"
                                    />
                                </label>

                                <label className="block">
                                    <div className="text-sm font-medium">Description</div>
                                    <textarea
                                        name="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="mt-1 w-full rounded border p-2"
                                        rows={4}
                                    />
                                </label>

                                <label className="block">
                                    <div className="text-sm font-medium">Assign To</div>
                                    <select
                                        name="assignedId"
                                        value={assignedId}
                                        onChange={(e) => setAssignedId(e.target.value)}
                                        className="mt-1 w-full rounded border p-2"
                                    >
                                        <option value="">Unassigned</option>
                                        {projectMembers.map((m) => (
                                            <option key={m.id} value={m.id}>{m.user.name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
                        </form>
                    </div>

                    <DrawerFooter>
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || !hasChanges()}
                        >
                            {isPending ? "Submitting..." : "Submit"}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>

            </DrawerContent>
        </Drawer>
    )
}
