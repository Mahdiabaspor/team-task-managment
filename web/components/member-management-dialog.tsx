"use client"

import { useState } from "react"
import { useTransition } from "react"
import { AlertCircle, Trash2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SelectRole } from "./role-select"
import { updateMemberRole, removeMember } from "@/app/actions/member-actions"

interface Member {
  id: string
  userId: string
  role: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

interface MemberManagementDialogProps {
  member: Member
  projectId: string
  currentUserRole: string
  currentUserId: string
  onClose: () => void
  isOpen: boolean
}

export function MemberManagementDialog({
  member,
  projectId,
  currentUserRole,
  currentUserId,
  onClose,
  isOpen,
}: MemberManagementDialogProps) {
  const [selectedRole, setSelectedRole] = useState(member.role)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isCurrentUser = member.userId === currentUserId
  const canChangeRole = (currentUserRole === "OWNER" || currentUserRole === "ADMIN") && !isCurrentUser
  const hasChanges = selectedRole !== member.role

  const handleUpdateRole = () => {
    if (!hasChanges) {
      onClose()
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        await updateMemberRole({
          projectId,
          memberId: member.id,
          newRole: selectedRole,
        })
        onClose()
      } catch (err: any) {
        setError(err.message || "Failed to update role")
      }
    })
  }

  const handleRemove = () => {
    setError(null)
    startTransition(async () => {
      try {
        await removeMember({
          projectId,
          memberId: member.id,
        })
        setShowDeleteConfirm(false)
        onClose()
      } catch (err: any) {
        setError(err.message || "Failed to remove member")
        setShowDeleteConfirm(false)
      }
    })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Member</DialogTitle>
            <DialogDescription>
              Manage role and permissions for this member
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Member Info */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.user.image || ""} />
                <AvatarFallback>
                  {member.user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{member.user.name}</p>
                <p className="text-xs text-muted-foreground">{member.user.email}</p>
                {isCurrentUser && (
                  <p className="text-xs text-blue-600 font-medium mt-1">That's you!</p>
                )}
              </div>
            </div>

            {/* Current User Warning */}
            {isCurrentUser && (
              <div className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 rounded-lg border border-blue-200 dark:border-blue-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-sm">You cannot edit your own profile in this project.</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Role Selection */}
            {canChangeRole && member.role !== "OWNER" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Change Role</label>
                <SelectRole
                  setSelected={setSelectedRole}
                  Selected={selectedRole}
                />
              </div>
            )}

            {/* Current Role Display (if read-only) */}
            {(!canChangeRole || isCurrentUser) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Role</label>
                <div className="px-3 py-2 bg-muted rounded text-sm font-medium">
                  {member.role}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>

            {canChangeRole && member.role !== "OWNER" && !isCurrentUser && (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isPending}
                  className="ml-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>

                {hasChanges && (
                  <Button
                    onClick={handleUpdateRole}
                    disabled={isPending}
                  >
                    {isPending ? "Saving..." : "Save Changes"}
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {member.user.name} from this project?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
