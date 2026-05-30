
import { auth } from "@/auth";
import { NewProjectDialog } from "@/components/newProject-dialog-alert";
import { CardImage } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";


import { redirect, } from "next/navigation";

export default async function Home() {

  const session = await auth()
  if (!session || !session.user) {
    redirect("/auth")
  }
  // await new Promise((resolve) => setTimeout(resolve, 50000))
  const projects = await prisma.project.findMany({
    where: {
      owner: { email: { equals: session.user.email } }
    },
    include: {
      members: true,
    }
  })


  const projectsMembers = await prisma.projectMember.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      project:{include:{members:true}}
    }
  })
  const UserProjects = projectsMembers.map((p)=>p.project)
  return (
    <div className="h-screen flex flex-col items-center justify-center ">
      {
        projects.length === 0 ? (
          <>
            <svg className="my-7" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" id="Logo"> <g id="logomark"> <path d="M30 28V12C30 10.8954 29.1046 10 28 10H27.8994C27.369 10 26.8604 10.2109 26.4854 10.5859L10.5859 26.4854C10.2109 26.8604 10 27.369 10 27.8994V40H0V27.8994C2.15312e-05 24.7168 1.26423 21.6645 3.51465 19.4141L19.4141 3.51465C21.6645 1.26423 24.7168 2.1373e-05 27.8994 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H14V30H28C29.1046 30 30 29.1046 30 28ZM0 0H17L7 10H0V0Z" fill="#FF4D00"></path> </g> </svg>

            <h3 className="font-bold text-4xl text-black/80">    Welcome to the Draft team app</h3>
            <h3 className=" text-lg mt-3 text-black/50">    You don't have any project yet . get a one and start collaborating!</h3>
            <NewProjectDialog>
              <Button type="button" variant={"outline"} className="mt-5 " >
                <Plus />
                New Project
              </Button>
            </NewProjectDialog>
          </>
        ) : (
          <div className="flex flex-wrap gap-5 px-10 items-start justify-center mt-17 h-full">
            {UserProjects.map((p) => (
              <CardImage key={p.id} project={p} membersCount={p.members.length} />
            ))}
          </div>
        )
      }

    </div>
  );
}