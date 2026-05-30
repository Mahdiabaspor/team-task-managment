"use server"

import { prisma } from "@/lib/prisma"
import { sessionCheck } from "./session-cheker"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function findUserByEmail(email: string) {
    if (email.trim() === "") return null
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    console.log("Found user:", user)
    return user?.id ? user : null
}


interface inviteProps {
    userId: string;
    projectId: string;
    invitedById: string
}
export async function InviteUser(data: inviteProps) {
    await sessionCheck()
    if (!data.invitedById) return

    const inviteExist = await prisma.invitations.findFirst({
        where: {

            projectId: data.projectId,
            userId: data.userId,
            invitedById: data.invitedById

        }

    })
    if(inviteExist){
        throw new Error("this user is already Invited")
    }
    const invite = await prisma.invitations.create({
        data: {
            invitedById: data.invitedById,
            projectId: data.projectId,
            userId: data.userId
        }
    })

    return invite
}

export async function getPendingInvitations() {
    const userId = await sessionCheck()
    if (!userId) return []

    const invitations = await prisma.invitations.findMany({
        where: {
            userId: userId,
        },
        include: {
            project: true,
            invitedBy: true,
        },
    })

    return invitations
}

export async function acceptInvitation(invitationId: string) {
    const userId = await sessionCheck()
    if (!userId) throw new Error("Not authenticated")

    const invitation = await prisma.invitations.findUnique({
        where: { id: invitationId },
    })

    if (!invitation) throw new Error("Invitation not found")
    if (invitation.userId !== userId) throw new Error("Unauthorized")

    await prisma.projectMember.create({
        data: {
            userId: invitation.userId,
            projectId: invitation.projectId,
            role: "MEMBER",
        },
    })

    await prisma.invitations.delete({
        where: { id: invitationId },
    })
    revalidatePath("/")
    return true
}

export async function rejectInvitation(invitationId: string) {
    const userId = await sessionCheck()
    if (!userId) throw new Error("Not authenticated")

    const invitation = await prisma.invitations.findUnique({
        where: { id: invitationId },
    })

    if (!invitation) throw new Error("Invitation not found")
    if (invitation.userId !== userId) throw new Error("Unauthorized")

    await prisma.invitations.delete({
        where: { id: invitationId },
    })

    return true
}
