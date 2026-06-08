import * as React from "react"
import { Button as UiButton } from "@/components/ui/button"

type Props = React.ComponentProps<typeof UiButton> & {
  isSmall?: boolean
}

const SignOutButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ isSmall, className, children, ...props }, ref) => {
    return (
      <UiButton
        ref={ref}
        type="button"
        className={
          `w-full flex items-center justify-center gap-3 px-4  border ${isSmall ? 'px-6 py-2!' : ' py-3!'} border-red-300 rounded-lg text-red-500 hover:text-red-600 bg-white hover:bg-red-50 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${className ?? ""}`
        }
        {...props}
      >
        <span className="text-base font-medium">{isSmall ? "Sign out" : "Sign out from your account"}</span>
        {children}
      </UiButton>
    )
  }
)

SignOutButton.displayName = "SignOutButton"

export default SignOutButton
