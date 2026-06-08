
import Draggable from '@/app/dashboard/projects/[projectId]/components/draggable';
import Droppable from '@/app/dashboard/projects/[projectId]/components/droppable';
import { NewContainerDialog } from '@/components/newContainer-dialog-alert'
import { Button } from '@/components/ui/button'
import { SelectSeparator } from '@/components/ui/select'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

import { Folder, FolderArchive, Plus } from 'lucide-react'
import DragDropContainer, { IProject } from './components/dragDropContainer';
import { InviteMemberDialog } from '@/components/invite-dialog-alert';
import { MemberAvatarsStack } from '@/components/member-avatars-stack';
// import RoomProvider from './room';
import { socket } from '@/lib/socket';

async function page({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const session = await auth()

  if (projectId === undefined) return <div>Project not found</div>

  const project = await prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({
      where: {
        id: projectId
      },
      include: {
        members: {
          include: { user: true }
        },
        containers: {
          include: { tasks: { include: { assigned: { include: { user: true } } } } }
        },
        invitation: {
          include: {
            user: true,
            invitedBy: true
          }
        }
      }
    })


    return project
  })

  // Get current user's role in this project
  const currentUserMembership = project?.members.find(m => m.userId === session?.user?.id)
  const currentUserRole = currentUserMembership?.role || "MEMBER"





  return (
    <div className='h-full w-full p-6' >
      {/* <RoomProvider projectId={projectId} /> */}
      <div className='flex items-center justify-between'>
        <div className='text-2xl font-bold flex items-center justify-start gap-3'>
          <FolderArchive className='size-7!' />
          {project?.name}
        </div>
        <div className='flex gap-2 items-center'>
          {project?.members && (
            <MemberAvatarsStack
              members={project.members}
              invitations={project?.invitation || []}
              projectId={projectId}
              currentUserRole={currentUserRole}
              currentUserId={session?.user?.id || ""}
              maxDisplay={3}
            />
          )}
          <NewContainerDialog projectId={projectId} />
          <InviteMemberDialog projectId={projectId} />
        </div>
      </div>
      <SelectSeparator className='mt-3' />
      <div className='flex items-start gap-5 mt-5 h-full overflow-x-auto'>
        <DragDropContainer project={project as IProject} />
      </div>

    </div>
  )
}

export default page
