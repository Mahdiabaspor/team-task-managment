import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { SidebarMenuButton } from './ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { IconCreditCard, IconDotsVertical, IconLogout, IconNotification, IconUserCircle, IconCopy } from '@tabler/icons-react'
import { EditIcon, Settings, Trash } from 'lucide-react'
import { signOut } from '@/auth'
import { AlertDialogDeleteProject } from './delete-project-dialog-alert'
import { Button } from './ui/button'
import { EditContainerNameDialog } from './editContainerName-dialog-alert'
import { AlertDialogDeleteContainer } from './delete-container-dialog-alert'


export default function dropDownContainer({ containerId }: { containerId: string }) {
    return (

        <DropdownMenu >
            <DropdownMenuTrigger asChild className='absolute top-4  right-4 z-20 '>
                <IconDotsVertical className="ml-auto size-5 text-white fill-white " />
            </DropdownMenuTrigger>


            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-40 rounded-lg "
                side={"bottom"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                </DropdownMenuLabel>
                {/* <DropdownMenuSeparator /    > */}
                <DropdownMenuGroup>

                    <EditContainerNameDialog containerId={containerId}>
                        <Button className='' variant="ghost">
                            <EditIcon />
                            Edit title
                        </Button>
                    </EditContainerNameDialog>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <AlertDialogDeleteContainer containerId={containerId}>
                    <Button className='bg-transparent p-2  justify-start hover:bg-red-50' variant="destructive">
                        <Trash />
                        Delete Project
                    </Button>
                </AlertDialogDeleteContainer>
            </DropdownMenuContent>
        </DropdownMenu>


    )
}


