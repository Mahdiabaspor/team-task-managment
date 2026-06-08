"use client"

import React, { useState } from "react"
import { IconBell, IconCheck, IconX } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { acceptInvitation, rejectInvitation } from "@/app/actions/user-acitons"
import { toast } from "sonner"

interface Invitation {
  id: string
  projectId: string
  userId: string
  invitedById: string
  project: {
    id: string
    name: string
    ownerId: string
  }
  invitedBy: {
    id: string
    name: string | null
    image: string | null
  }
}

export function NavInvitations({ invitations }: { invitations: Invitation[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [items, setItems] = useState(invitations)

  if (items.length === 0) return null

  const handleAccept = async (id: string) => {
    setLoading(id)
    try {
      await acceptInvitation(id)
      setItems(items.filter((item) => item.id !== id))
      toast.success("Invitation accepted!")
    } catch (error: any) {
      toast.error(error.message || "Failed to accept invitation")
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (id: string) => {
    setLoading(id)
    try {
      await rejectInvitation(id)
      setItems(items.filter((item) => item.id !== id))
      toast.success("Invitation rejected!")
    } catch (error: any) {
      toast.error(error.message || "Failed to reject invitation")
    } finally {
      setLoading(null)
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center gap-2">
        <IconBell className="size-4" />
        Pending Invites ({items.length})
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-2">
          {items.map((invitation) => (
            <SidebarMenuItem key={invitation.id}>
              <Card className="p-3 border">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-foreground">
                      {invitation.project.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Invited by{" "}
                      <span className="font-medium">
                        {invitation.invitedBy.name || "Unknown"}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1 h-8 text-xs"
                      onClick={() => handleAccept(invitation.id)}
                      disabled={loading === invitation.id}
                    >
                      <IconCheck className="size-3 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs"
                      onClick={() => handleReject(invitation.id)}
                      disabled={loading === invitation.id}
                    >
                      <IconX className="size-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
