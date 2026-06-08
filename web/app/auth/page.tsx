"use client"
import GoogleSignInButton from "@/components/google-sign-in-button"
import GitHubSignInButton from "@/components/github-sign-in-button"
import { AlertDialogSignOut } from "@/components/sign-out-dialog-alert"
import { useSession } from "next-auth/react"
import SignOutButton from "@/components/sign-out-btn"


export default function SignInPage() {
    const { data: session } = useSession()
    return (
        <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg mx-4">
                <div className="text-center flex flex-col items-center justify-center">
                    <svg className="my-7" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none" id="Logo"> <g id="logomark"> <path d="M30 28V12C30 10.8954 29.1046 10 28 10H27.8994C27.369 10 26.8604 10.2109 26.4854 10.5859L10.5859 26.4854C10.2109 26.8604 10 27.369 10 27.8994V40H0V27.8994C2.15312e-05 24.7168 1.26423 21.6645 3.51465 19.4141L19.4141 3.51465C21.6645 1.26423 24.7168 2.1373e-05 27.8994 0H28C34.6274 0 40 5.37258 40 12V28C40 34.6274 34.6274 40 28 40H14V30H28C29.1046 30 30 29.1046 30 28ZM0 0H17L7 10H0V0Z" fill="#FF4D00"></path> </g> </svg>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome to Draft team
                    </h2>
                    <p className="text-gray-600">

                        {session ? "We are glad to see you again" : "Sign in to post jobs or apply for opportunities"}
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    {session ? (
                        <AlertDialogSignOut >
                            <SignOutButton />
                        </AlertDialogSignOut>
                    ) : (
                        <>
                            <GitHubSignInButton />
                            <GoogleSignInButton />
                        </>
                    )}

                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    By signing in, you agree to our{" "}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">
                        Privacy Policy
                    </a>
                </div>
            </div>
        </div>
    )
}
