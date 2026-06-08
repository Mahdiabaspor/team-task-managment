"use server"

import { auth } from "@/auth"

export const sessionCheck = async () => {
        const session = await auth()
        const userId = session?.user?.id as string | undefined
    
        if (!userId) {
            throw new Error("Unauthorized")
        }

        return userId
    
}