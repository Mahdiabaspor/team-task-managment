"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import SignOutButton from "./sign-out-btn"
import { IconTrashFilled } from "@tabler/icons-react"
import { deleteProject } from "@/app/actions/project-actions"
import { deleteContainer } from "@/app/actions/container-actions"

export function AlertDialogDeleteContainer({ children, containerId }: { children: any; containerId: string }) {
    const handleDeleteProject = async () => {

        deleteContainer(containerId)
    }

    return (
        <AlertDialog >
            <AlertDialogTrigger asChild className="h-full w-full">
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent  size="sm" >
                <AlertDialogHeader >
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <IconTrashFilled />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Container?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will not be reversible. Are you sure you want to delete this container and the tasks in it??
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleDeleteProject}>Delete Container</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
