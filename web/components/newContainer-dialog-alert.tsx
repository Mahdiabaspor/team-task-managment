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
import { createContainer } from "@/app/actions/container-actions"
import { Button } from "./ui/button"


export function NewContainerDialog({  projectId }: { projectId: string }) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMakeContainer = async () => {
    setError(null)
    setLoading(true)
    try {
      await createContainer(name, projectId)

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
            <Button className='p-4'>
              <Plus /> New container
            </Button> 
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-black/10 text-default dark:bg-default/20 dark:text-default">
            <Container />
          </AlertDialogMedia>
          <AlertDialogTitle>New Container</AlertDialogTitle>
          <AlertDialogDescription>
            Choose a name for your Container
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
            onClick={handleMakeContainer}
            disabled={loading || !name.trim()}
          >
            {loading ? "Creating..." : "Create Project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
