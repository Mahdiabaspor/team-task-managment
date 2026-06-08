"use client"

import { useState } from "react"
import { PlusCircleIcon } from "lucide-react"
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


export function NewProjectDialog({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMakeProject = async () => {
    setError(null)
    setLoading(true)
    try {
      await createProject(name)
      // اینجا می‌تونی:
      // - دیالوگ رو ببندی
      // - state رو خالی کنی
      // - به صفحه دیگه redirect کنی (با useRouter)
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
            <PlusCircleIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>New Project</AlertDialogTitle>
          <AlertDialogDescription>
            Choose a name for your project
            <Input
              placeholder="Project Name"
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
            onClick={handleMakeProject}
            disabled={loading || !name.trim()}
          >
            {loading ? "Creating..." : "Create Project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
