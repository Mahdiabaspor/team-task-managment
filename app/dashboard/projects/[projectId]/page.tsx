
import Draggable from '@/app/dashboard/projects/[projectId]/components/draggable';
import Droppable from '@/app/dashboard/projects/[projectId]/components/droppable';
import { NewContainerDialog } from '@/components/newContainer-dialog-alert'
import { Button } from '@/components/ui/button'
import { SelectSeparator } from '@/components/ui/select'
import prisma from '@/lib/prisma'

import { Folder, FolderArchive, Plus } from 'lucide-react'
import DragDropContainer, { IProject } from './components/dragDropContainer';
import { InviteMemberDialog } from '@/components/invite-dialog-alert';
// import RoomProvider from './room';
import { socket } from '@/lib/socket';

async function page({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params

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
        }
      }
    })


    return project
  })





  return (
    <div className='h-full w-full p-6' >
      {/* <RoomProvider projectId={projectId} /> */}
      <div className='flex items-center justify-between'>
        <div className='text-2xl font-bold flex items-center justify-start gap-3'>
          <FolderArchive className='size-7!' />
          {project?.name}
        </div>
        <div className='flex gap-2'>
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
