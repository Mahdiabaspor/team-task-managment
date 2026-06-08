"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { sessionCheck } from "./session-cheker"

export async function createProject(name: string) {

    if (!name || name.trim() === "") {
        throw new Error("Project name cannot be empty")
    }
    const userId = await sessionCheck()

    const result = await prisma.$transaction(async (tx) => {

        const project = await tx.project.create({
            data: {
                name: name.trim(),
                ownerId: userId,
                containers:{
                    createMany:{data:[
                        {order:1,title:"Todo"},
                        {order:2,title:"In Progress"},
                        {order:3,title:"Finished"},
                    ]}
                }
            },
        })

        await tx.projectMember.create({
            data: {
                projectId: project.id,
                userId: userId,
                role: "OWNER",
            },
        })




        return project
    })

    revalidatePath("/")
    return result
}

export async function deleteProject(projectId: string) {

    const userId = await sessionCheck()

    const result = await prisma.$transaction(async (tx) => {
        const project = await tx.project.findUnique({
            where: {
                id: projectId,
            },
        })

        if (!project) {
            throw new Error("Project not found")
        }

        if (project.ownerId !== userId) {
            throw new Error("Unauthorized")
        }

        await tx.project.delete({
            where: {
                id: projectId,
            },
        })
        return project
    })

    revalidatePath("/")
    return result
}