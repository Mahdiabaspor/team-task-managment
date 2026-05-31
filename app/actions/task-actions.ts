"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { sessionCheck } from "./session-cheker"
import { Task } from "../generated/prisma/client"
import { socket } from "@/lib/socket"

export async function createTask(
  projectId : string ,
  title: string,
  containerId: string,
  description: string = "",
  assignedId?: string,
  progress: number = 0,
) {
  if (!title || title.trim() === "") {
    throw new Error("Task title cannot be empty")
  }

  if (!containerId || containerId.trim() === "") {
    throw new Error("Container ID is required")
  }

  const userId = await sessionCheck()

  // Verify container exists
  const container = await prisma.container.findUnique({
    where: { id: containerId },
  })

  if (!container) {
    throw new Error("Container not found")
  }

  // Get the last task order in this container
  const lastTask = await prisma.task.findFirst({
    where: { containerId },
    orderBy: { order: "desc" },
  })

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description.trim() || "",
      order: (lastTask?.order ?? -1) + 1,
      containerId,
      assignedId,
      progress,
    },
  })
  socket.emit(
    "task:created",
    JSON.stringify({ ...task, projectId })
  );
  revalidatePath("/dashboard/projects")
  return task
}



export async function moveTask(taskId: string, containerId: string,projectId:string) {
  const userId = await sessionCheck()
  if (!taskId || !containerId) {
    throw new Error("influents data")
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId }
  })
  if (!task) {
    throw new Error("the moving task didn't found")
  }
  const EditedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      containerId: containerId
    }
  })
    socket.emit(
    "task:moved",
    JSON.stringify({
      ...EditedTask,
      projectId,
    })
  );
  revalidatePath("/dashboard/projects")
  return EditedTask

}






export async function deleteTask(TaskId: string,projectId:string) {
  if (!TaskId) {
    throw new Error("Task id cannot be empty")
  }
  await sessionCheck()
  const deletedTask = await prisma.task.delete({
    where: { id: TaskId },

  })
    socket.emit(
    "task:deleted",
    JSON.stringify({ ...deletedTask, projectId })
  );

  revalidatePath("/dashboard/projects")
  return deletedTask
}

export async function editTaskFromForm(formData: FormData,projectId:string) {
  const userId = await sessionCheck()

  const id = formData.get("id")?.toString()
  const title = formData.get("title")?.toString() ?? ""
  const description = formData.get("description")?.toString() ?? ""
  const assignedId = formData.get("assignedId")?.toString() || null
  const progressRaw = formData.get("progress")?.toString()
  const progress = progressRaw ? parseInt(progressRaw, 10) : 0

  if (!id) throw new Error("Task id is required")
  if (!title || title.trim() === "") throw new Error("Task title cannot be empty")

  const existing = await prisma.task.findUnique({ where: { id } })
  if (!existing) throw new Error("Task not found")

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      title: title.trim(),
      description: description.trim() || "",
      assignedId: assignedId,
      progress: Math.max(0, Math.min(100, progress)),
    },
  })

  socket.emit(
    "task:updated",
    JSON.stringify({ ...updatedTask, projectId: projectId })
  );


  revalidatePath("/dashboard/projects")
}
export async function editTasksOrders(taskIds: { id: string; order: number }[]) {
  await sessionCheck()
  await prisma.$transaction(async (tx) => {
    for (const { id, order } of taskIds) {
      await tx.task.update({
        where: { id },
        data: {
          order,
        },
      })
    }
  })

  revalidatePath("/dashboard/projects")
}
