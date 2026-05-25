"use client"

import { NewProjectDialog } from "@/components/newProject-dialog-alert"
import SignOutButton from "@/components/sign-out-btn"
import { AlertDialogSignOut } from "@/components/sign-out-dialog-alert"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { signIn, useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { useEffect } from "react"

function Navbar() {
    const { data, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()

useEffect(() => {
    // مسیرهای عمومی که همه می‌توانند ببینند
    const isPublicPage = pathname === "/auth" || pathname === "/";
    
    // اگر کاربر لاگین نیست و در صفحه عمومی نیست، بفرست به auth
    if (!data && !isPublicPage) {
        router.push("/auth");
        return;
    }

    // اگر کاربر لاگین است و در صفحه لاگین است، بفرست به داشبورد
    if (data && pathname === "/auth") {
        router.push("/dashboard/projects");
        return;
    }
    
    // ریدایرکت از صفحه اصلی به داشبورد
    if (data && pathname === "/") {
        router.push("/dashboard/projects");
        return;
    }

}, [pathname, data, router]);

    return (
        <nav className="bg-gray-50 relative w-full h-16 shadow-xl z-50 flex items-center justify-between font-manrope px-8">
            <div className="flex items-center justify-center sm:gap-10 gap-2">
                <Link href={"/"} className="flex items-center h-full  cursor-pointer gap-4 font-manrope font-semibold text-2xl text-black/70">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" id="Logo"> <g id="logomark"> <path d="M30 28V12C30 10.8954 29.1046 10 28 10H27.8994C27.369 10 26.8604 10.2109 26.4854 10.5859L10.5859 26.4854C10.2109 26.8604 10 27.369 10 27.8994V40H0V27.8994C2.15312e-05 24.7168 1.26423 21.6645 3.51465 19.4141L19.4141 3.51465C21.6645 1.26423 24.7168 2.1373e-05 27.8994 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H14V30H28C29.1046 30 30 29.1046 30 28ZM0 0H17L7 10H0V0Z" fill="#FF4D00"></path> </g> </svg>
                    <p className="font-manrope hidden sm:flex ">DRAFT TEAM</p>

                </Link>

                <NewProjectDialog>
                    <Button type="button" variant={"outline"} className="" >
                        <Plus />
                        New Project
                    </Button>
                </NewProjectDialog>
            </div>

            <div className="  text-black  w">

                {data && (

                    <div className="flex items-center gap-4 w-full">

                        <AlertDialogSignOut >

                            <SignOutButton isSmall={true} />
                        </AlertDialogSignOut>

                    </div>

                )}
                {!data && (
                    <Button type="button" variant={"outline"} className={` px-8 py-4 `} onClick={() => router.push("/auth")}>
                        SIGN IN
                    </Button>
                )}

            </div>

        </nav>
    )
}

export default Navbar
