"use client"

import { useState } from "react"
import { Users, Clock, X } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MemberManagementDialog } from "./member-management-dialog"
import { cancelInvitation } from "@/app/actions/member-actions"

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

interface Invitation {
  id: string
  userId: string
  projectId: string
  invitedById: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  invitedBy: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

interface MemberListDialogProps {
  members: Member[]
  invitations: Invitation[]
  projectId: string
  currentUserRole: string
  currentUserId: string
  memberCount?: number
}

export function MemberListDialog({
  members,
  invitations,
  projectId,
  currentUserRole,
  currentUserId,
  memberCount,
}: MemberListDialogProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [cancelingInvitation, setCancelingInvitation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const canManageMembers = currentUserRole === "OWNER" || currentUserRole === "ADMIN"

  const handleCancelInvitation = async (invitationId: string) => {
    setError(null)
    setCancelingInvitation(invitationId)
    try {
      await cancelInvitation({
        projectId,
        invitationId,
      })
      setCancelingInvitation(null)
    } catch (err: any) {
      setError(err.message || "Failed to cancel invitation")
      setCancelingInvitation(null)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="w-4 h-4 mr-2" />
          Members ({memberCount || members.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Project Members</DialogTitle>
          <DialogDescription>
            Manage your project team members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {error && (
            <div className="flex gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Active Members */}
          {members.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Active Members ({members.length})
              </h3>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.user.image || ""} />
                        <AvatarFallback>
                          {member.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.user.name}
                          {member.userId === currentUserId && (
                            <span className="text-xs text-muted-foreground ml-2">(You)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.user.email}
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {member.role}
                      </span>
                    </div>

                    {canManageMembers && 
                      member.userId !== currentUserId &&
                      member.role !== "OWNER" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => setSelectedMember(member)}
                      >
                        ...
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Invitations */}
          {invitations && invitations.length > 0 && (
            <div className="pt-2 border-t">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Pending Invitations ({invitations.length})
              </h3>
              <div className="space-y-2">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-3 border border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50/50 dark:bg-amber-950/20"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="shrink-0">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {invitation.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {invitation.user.email}
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100/50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                        Pending
                      </span>
                    </div>

                    {canManageMembers && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleCancelInvitation(invitation.id)}
                        disabled={cancelingInvitation === invitation.id}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {members.length === 0 && (!invitations || invitations.length === 0) && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No members yet</p>
            </div>
          )}
        </div>

        {selectedMember && (
          <MemberManagementDialog
            member={selectedMember}
            projectId={projectId}
            currentUserRole={currentUserRole}
            currentUserId={currentUserId}
            onClose={() => setSelectedMember(null)}
            isOpen={!!selectedMember}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
