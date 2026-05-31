
import type { Metadata } from "next";
import SideBar from "@/components/sidebar/sidebar-parent";


export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <SideBar>
        {children}
      </SideBar>

  );
}
