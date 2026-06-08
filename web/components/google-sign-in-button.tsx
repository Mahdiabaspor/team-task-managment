"use client"


import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"

import Image from "next/image"
import SvgSpinnersBarsScale from "./spinerIconLoading"
export default function GoogleSignInButton() {
  const { data: session } = useSession()
  const [isPending, setIsPending] = useState(false)

  const handleAuthClick = async () => {
    if (isPending) return

    setIsPending(true)

    if (session) {
      try {
        await signOut()
      } finally {
        setIsPending(false)
      }
      return
    }

    try {
      await signIn("google")
    } catch {
      setIsPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleAuthClick}
      disabled={isPending}

      className={`w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg ${session ? "text-red-500 hover:text-red-600" : "text-gray-700 hover:text-gray-800"} bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {isPending ? (
        <>
          <SvgSpinnersBarsScale className="w-5 h-5" />
          <span className="text-base font-medium">Redirecting...</span>
        </>
      ) : (
        <>
          <Image src={"/icons8-google-48.png"} alt="img" width={40} className="w-6 h-6" height={40}/>
          <span className="text-base font-medium">{session ? "Sign out from google" : "Continue with google"}</span>
        </>
      )}
    </button>
  )
}
