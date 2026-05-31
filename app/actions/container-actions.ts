"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { sessionCheck } from "./session-cheker"
import { socket } from "@/lib/socket"

export async function createContainer(name: string, projectId: string) {

    if (!name || name.trim() === "") {
        throw new Error("Container name cannot be empty")

    }
    await sessionCheck()




    const container = await prisma.container.create({
        data: {
            title: name.trim(),
            order: 0,
            projectId: projectId,
        },
    })



    socket.emit("container-single-action-socket", JSON.stringify(container), "ADD")
    revalidatePath("/")
    return container
}



export async function editContainerName(title: string, containerId: string) {
    if (!title || title.trim() === "") {
        throw new Error("Container title cannot be empty")

    }
    await sessionCheck()
    const editedContainer = await prisma.container.update({
        where: { id: containerId },
        data: {
            title: title
        }
    })
    socket.emit("container-single-action-socket", JSON.stringify(editedContainer), "EDIT")
    revalidatePath("/")
    return editedContainer
}


export async function deleteContainer(containerId: string) {
    if (!containerId) {
        throw new Error("Container id cannot be empty")
    }
    await sessionCheck()
    const deletedContainer = await prisma.container.delete({
        where: { id: containerId },

    })
    revalidatePath("/")
    socket.emit("container-single-action-socket", JSON.stringify(deletedContainer), "DELETE")
    return deletedContainer
}




export async function editContainersOrders(containerIds: { id: string, order: number }[],) {

    await sessionCheck()
    const result = await prisma.$transaction(async (tx) => {
        let containers = []
        for (const { id, order } of containerIds) {
            const data = await tx.container.update({
                where: { id: id },
                data: {
                    order: order,
                }
            })
            containers.push(data)
        }
        return containers
    })
    if (result && result.length !== 0) {
        socket.emit("change-containers-order", JSON.stringify(result))
    }
    revalidatePath("/")
}
