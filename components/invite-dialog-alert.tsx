"use client"

import { useState } from "react"
import { PlusCircleIcon, UserPlus2 } from "lucide-react"

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
import { Button } from "./ui/button"
import { findUserByEmail, InviteUser } from "@/app/actions/user-acitons"
import { SelectRole } from "./role-select"
import { useSession } from "next-auth/react"
import { sessionCheck } from "@/app/actions/session-cheker"


export function InviteMemberDialog({ projectId }: { projectId: string }) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [foundedUser, setFoundedUser] = useState<any>(undefined)
  const [SubmittedEmail, setSubmittedEmail] = useState("")
  const [selectedRole, setSelected] = useState("MEMBER")
  const [isOpen, setIsOpen] = useState(false)
  const session = useSession()

  // const handleMakeProject = async () => {
  //   setError(null)
  //   setLoading(true)
  //   try {
  //     await createProject(email)
  //     // اینجا می‌تونی:
  //     // - دیالوگ رو ببندی
  //     // - state رو خالی کنی
  //     // - به صفحه دیگه redirect کنی (با useRouter)
  //     setemail("")
  //   } catch (err: any) {
  //     setError(err.message ?? "Something went wrong")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleSearchUser = async () => {
    setError(null)
    setLoading(true)
    const user = await findUserByEmail(email)
    setSubmittedEmail(email)
    if (user === null) {
      setError("User not found")
      setLoading(false)
      return
    }
    setFoundedUser(user)
    setLoading(false)
  }
  const invitePlayer = async () => {
    setError(null)
    setLoading(true)
    
    if (!session.data?.user) {
      setError("Not authenticated")
      setLoading(false)
      return
    }
    
    const invitedBy = session.data.user.id
    if (!projectId) {
      setError("Project not found")
      setLoading(false)
      return
    }
    if (!invitedBy) {
      setError("User not found")
      setLoading(false)
      return
    }

    try {
      const result = await InviteUser({
        invitedById: invitedBy,
        projectId: projectId,
        userId: foundedUser.id,
        role: selectedRole
      })
      
      setLoading(false)
      setSuccess(true)
      
      // Close dialog after short delay to show success
      setTimeout(() => {
        setEmail("")
        setError(null)
        setSuccess(false)
        setFoundedUser(undefined)
        setSelected("MEMBER")
        setIsOpen(false)
      }, 1000)
    } catch (err: any) {
      setError(err.message || "Failed to invite user")
      setLoading(false)
    }
  }



  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        setEmail("")
        setError(null)
        setSuccess(false)
        setFoundedUser(undefined)
        setSelected("MEMBER")
      }
    }}>
      <AlertDialogTrigger asChild>
        <Button className="" variant={"outline"}><UserPlus2 /> Invite Member</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="min-w-120" size="default">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-black/10 text-default dark:bg-default/20 dark:text-default">
            <PlusCircleIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Invite Member</AlertDialogTitle>
          <AlertDialogDescription>
            invite member by email to your project
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 px-4">
          <Input
            placeholder="@Email"
            className="w-full text-start"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            disabled={foundedUser || loading}
          />
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-600 font-medium">
              ✓ Invitation sent successfully!
            </p>
          )}
          {foundedUser && (
            <div className="p-3 border rounded-md flex items-center gap-3">
              <img src={foundedUser.image} alt={foundedUser.name} className="w-8 h-8 rounded-full" />
              <div className="mr-10">
                <p className="text-sm font-medium">{foundedUser.name}</p>
                <p className="text-xs text-gray-500">{foundedUser.email}</p>
              </div>
              <SelectRole setSelected={setSelected} Selected={selectedRole} />
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">
            Cancel
          </AlertDialogCancel>
          {!foundedUser && (
            <Button
              variant="default"
              onClick={handleSearchUser}
              disabled={loading || !email.trim() || SubmittedEmail === email}
            >
              {loading ? "searching..." : "search"}
            </Button>

          )}
          {foundedUser && (
            <Button className="!px-6" variant="default" onClick={invitePlayer} >
              Invite
            </Button>
          )}

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
