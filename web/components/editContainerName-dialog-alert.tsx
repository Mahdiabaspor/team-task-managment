"use client"

import { useState } from "react"
import { Container, Plus, PlusCircleIcon } from "lucide-react"
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
import { Input } from "./ui/input"
import { createProject } from "@/app/actions/project-actions"
import { createContainer, editContainerName } from "@/app/actions/container-actions"
import { Button } from "./ui/button"


export function EditContainerNameDialog({ children, containerId }: { children: React.ReactNode; containerId: string }) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEditContainerName = async () => {
    setError(null)
    setLoading(true)
    try {
      await editContainerName(name, containerId)
      setName("")
    } catch (err: any) {
      setError(err.message ?? "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-black/10 text-default dark:bg-default/20 dark:text-default">
            <Container />
          </AlertDialogMedia>
          <AlertDialogTitle>Edit Container Name</AlertDialogTitle>
          <AlertDialogDescription>
            Choose a new name for your Container
            <Input
              placeholder="Container Name"
              className="mt-4 text-center w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="default"
            onClick={handleEditContainerName}
            disabled={loading || !name.trim()}
          >
            {loading ? "Editing..." : "Edit Container Name"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
