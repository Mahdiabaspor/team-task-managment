"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { sessionCheck } from "./session-cheker"

export async function createContainer(name: string, projectId: string) {

    if (!name || name.trim() === "") {
        throw new Error("Container name cannot be empty")

    }
    await sessionCheck()



    const result = await prisma.$transaction(async (tx) => {
        const container = await tx.container.create({
            data: {
                title: name.trim(),
                order: 0,
                projectId: projectId,
            },
        })

        return container
    })

    revalidatePath("/")
    return result
}