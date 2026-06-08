"use client"

import { LogOut, Trash2Icon } from "lucide-react"
import { signOut } from "next-auth/react"
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

export function AlertDialogDeleteProject({ children, projectId }: { children: any; projectId: string }) {
    const handleDeleteProject = async () => {
        // signOut()
        deleteProject(projectId)
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
                    <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will not be reversible. Are you sure you want to delete this project?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleDeleteProject}>Delete Project</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
