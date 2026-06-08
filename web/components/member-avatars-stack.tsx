"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MemberListDialog } from "./member-list-dialog"

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

interface MemberAvatarsStackProps {
  members: Member[]
  invitations?: Invitation[]
  projectId: string
  currentUserRole: string
  currentUserId: string
  maxDisplay?: number
}

export function MemberAvatarsStack({
  members,
  invitations = [],
  projectId,
  currentUserRole,
  currentUserId,
  maxDisplay = 3,
}: MemberAvatarsStackProps) {
  const displayMembers = members.slice(0, maxDisplay)
  const hiddenCount = members.length - displayMembers.length

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {displayMembers.map((member) => (
          <Avatar
            key={member.id}
            className="h-8 w-8 border-2 border-background cursor-pointer hover:z-10 transition-all"
            title={member.user.name || "User"}
          >
            <AvatarImage src={member.user.image || ""} />
            <AvatarFallback className="text-xs">
              {member.user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        ))}

        {hiddenCount > 0 && (
          <Avatar className="h-8 w-8 border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
            +{hiddenCount}
          </Avatar>
        )}
      </div>

      <MemberListDialog
        members={members}
        invitations={invitations}
        projectId={projectId}
        currentUserRole={currentUserRole}
        currentUserId={currentUserId}
        memberCount={members.length + (invitations?.length || 0)}
      />
    </div>
  )
}
