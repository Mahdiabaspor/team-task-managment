"use server"

import { prisma } from "@/lib/prisma"
import { sessionCheck } from "./session-cheker"
import { revalidatePath } from "next/cache"

interface UpdateMemberRoleProps {
  projectId: string
  memberId: string
  newRole: string
}

export async function updateMemberRole({
  projectId,
  memberId,
  newRole,
}: UpdateMemberRoleProps) {
  const userId = await sessionCheck()
  if (!userId) throw new Error("Not authenticated")

  // Check if user is owner or admin
  const userProject = await prisma.projectMember.findFirst({
    where: {
      userId: userId,
      projectId: projectId,
    },
  })

  if (!userProject || (userProject.role !== "OWNER" && userProject.role !== "ADMIN")) {
    throw new Error("Unauthorized: Only owner or admin can change roles")
  }

  // Prevent removing owner role
  const memberToUpdate = await prisma.projectMember.findUnique({
    where: { id: memberId },
  })

  if (memberToUpdate?.role === "OWNER") {
    throw new Error("Cannot change owner role")
  }

  const updated = await prisma.projectMember.update({
    where: { id: memberId },
    data: { role: newRole },
  })

  revalidatePath("/dashboard/projects")
  return updated
}

interface RemoveMemberProps {
  projectId: string
  memberId: string
}

export async function removeMember({ projectId, memberId }: RemoveMemberProps) {
  const userId = await sessionCheck()
  if (!userId) throw new Error("Not authenticated")

  // Check if user is owner or admin
  const userProject = await prisma.projectMember.findFirst({
    where: {
      userId: userId,
      projectId: projectId,
    },
  })

  if (!userProject || (userProject.role !== "OWNER" && userProject.role !== "ADMIN")) {
    throw new Error("Unauthorized: Only owner or admin can remove members")
  }

  // Prevent removing owner
  const memberToRemove = await prisma.projectMember.findUnique({
    where: { id: memberId },
  })

  if (memberToRemove?.role === "OWNER") {
    throw new Error("Cannot remove owner")
  }

  // Prevent removing yourself
  if (memberToRemove?.userId === userId) {
    throw new Error("Cannot remove yourself")
  }

  await prisma.projectMember.delete({
    where: { id: memberId },
  })

  revalidatePath("/dashboard/projects")
}

export async function getProjectMembers(projectId: string) {
  const userId = await sessionCheck()
  if (!userId) throw new Error("Not authenticated")

  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: { user: true },
  })

  return members
}

interface CancelInvitationProps {
  projectId: string
  invitationId: string
}

export async function cancelInvitation({
  projectId,
  invitationId,
}: CancelInvitationProps) {
  const userId = await sessionCheck()
  if (!userId) throw new Error("Not authenticated")

  // Check if user is owner or admin
  const userProject = await prisma.projectMember.findFirst({
    where: {
      userId: userId,
      projectId: projectId,
    },
  })

  if (!userProject || (userProject.role !== "OWNER" && userProject.role !== "ADMIN")) {
    throw new Error("Unauthorized: Only owner or admin can cancel invitations")
  }

  const invitation = await prisma.invitations.findUnique({
    where: { id: invitationId },
  })

  if (!invitation || invitation.projectId !== projectId) {
    throw new Error("Invitation not found")
  }

  await prisma.invitations.delete({
    where: { id: invitationId },
  })

  revalidatePath("/dashboard/projects")
}

export async function getPendingInvitations(projectId: string) {
  const userId = await sessionCheck()
  if (!userId) throw new Error("Not authenticated")

  // Check if user has access to this project
  const userProject = await prisma.projectMember.findFirst({
    where: {
      userId: userId,
      projectId: projectId,
    },
  })

  if (!userProject) {
    throw new Error("Unauthorized: You are not a member of this project")
  }

  const invitations = await prisma.invitations.findMany({
    where: { projectId },
    include: {
      user: true,
      invitedBy: true,
    },
  })

  return invitations
}
