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

export function AlertDialogSignOut({ children }: { children: any }) {
    const handleSignOut = async () => {
        signOut()
    }

    return (
        <AlertDialog >
            <AlertDialogTrigger asChild className="h-full w-full">
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent  size="sm" >
                <AlertDialogHeader >
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <LogOut />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Sign out?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will sign you out of your account.
            
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleSignOut}>Sign Out</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
