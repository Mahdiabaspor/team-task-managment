
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./app-side-bar"
import React from "react"

export default function SideBar({children}:{children:React.ReactNode}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarTrigger className="mt-5 "/>
      <SidebarInset className="overflow-y-scroll">
      {children}

      </SidebarInset>
    </SidebarProvider>
  )
}