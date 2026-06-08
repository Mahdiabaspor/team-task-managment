import { auth } from "@/auth";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getAvatarNumber(id: string): number {

  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 26) + 1;
}





export  function isProjectOwnerWithSession(projectOwnerId: string, session: any): boolean {
  if(session?.user) {
    const userId = session.user.id
    // Assuming you have a function to fetch project details by ID

    return projectOwnerId === userId
  }
  return false
}
