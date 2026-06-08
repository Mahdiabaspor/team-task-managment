import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { SidebarMenuButton } from './ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { IconCreditCard, IconDotsVertical, IconLogout, IconNotification, IconUserCircle, IconCopy } from '@tabler/icons-react'
import { Settings, Trash } from 'lucide-react'
import { signOut } from '@/auth'
import { AlertDialogDeleteProject } from './delete-project-dialog-alert'
import { Button } from './ui/button'


export default function dropDownProject({projectId}:{projectId:string}) {
    return (

        <DropdownMenu >
            <DropdownMenuTrigger asChild className='absolute top-4  right-4 z-20 '>

                <IconDotsVertical className="ml-auto size-5" />

            </DropdownMenuTrigger>


            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-40 rounded-lg "
                side={"bottom"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    {/* <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
        
                  </span>
                </div>
              </div> */}
                </DropdownMenuLabel>
                {/* <DropdownMenuSeparator /    > */}
                <DropdownMenuGroup>
                    <DropdownMenuItem >
                        <IconCopy />
                        Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem className="disabled:cursor-not-allowed" disabled>
                        <Settings />
                        Setting
                    </DropdownMenuItem>

                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <AlertDialogDeleteProject projectId={projectId}>
                    <Button className='bg-transparent p-2  justify-start hover:bg-red-50'  variant="destructive">
                        <Trash />
                        Delete Project
                    </Button>
                </AlertDialogDeleteProject>
            </DropdownMenuContent>
        </DropdownMenu>


    )
}


