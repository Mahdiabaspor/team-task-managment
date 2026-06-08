"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Project } from "@/app/generated/prisma/client"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAvatarNumber, isProjectOwnerWithSession } from "@/lib/utils"

import { useSession } from "next-auth/react"
import { Users } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DropDownProject from "./dropDownProject"
export function CardImage({ project, membersCount }: { project: Project; membersCount: number }) {
  const router = useRouter()

  const { data } = useSession()
  const hasAccess = isProjectOwnerWithSession(project.ownerId, data)
  return (
    <Card className="shrink-0 relative  w-full max-w-sm pt-0 group ma">
      <div className="absolute inset-0 z-1- aspect-video bg-black/5" />
      <img
        src={`/cards/${getAvatarNumber(project.id)}.svg`}
        alt="Event cover"
        className="relative z-20 aspect-video w-full p-5 group-hover:scale-105 transition-all duration-700   "
      />
        
      <DropDownProject projectId={project.id} />
      <CardHeader>
        <CardAction className=" flex  gap-2">
          <Badge className="hidden sm:flex " variant={hasAccess ? "default" : "secondary"}>
            {hasAccess ? "Your project" : "Partner project"}
          </Badge>

          <Badge className="hidden sm:flex " variant="outline">
            {membersCount} <Users />
          </Badge>
        </CardAction>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>
          One board for everything,no task left behind. From backlog to done,
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={`/dashboard/projects/${project.id}`} className="w-full">
          <Button variant={"default"} className="w-full" >View Project</Button>
        </Link>


      </CardFooter>
    </Card>
  )
}
