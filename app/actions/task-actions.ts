"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { sessionCheck } from "./session-cheker"
import { Task } from "../generated/prisma/client"

export async function createTask(
  title: string,
  containerId: string,
  description: string = "",
  assignedId?: string
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
    },
  })

  revalidatePath("/dashboard/projects")
  return task
}



export async function moveTask(taskId: string, containerId: string) {
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
  revalidatePath("/dashboard/projects")
  return EditedTask

}




export async function editTask(taskId: string, payload: Task) {
    if (!taskId) {
        throw new Error("Task title cannot be empty")

    }
    await sessionCheck()
    const editedTask = await prisma.task.update({
        where: { id: taskId },
        data: payload
    })
    revalidatePath("/dashboard/projects")
    return editedTask
}


export async function deleteTask(TaskId: string) {
    if (!TaskId ) {
        throw new Error("Task id cannot be empty")
    }
    await sessionCheck()
    const deletedTask = await prisma.task.delete({
        where: { id: TaskId },

    })
    revalidatePath("/dashboard/projects")
    return deletedTask
}


