import * as React from "react"
import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import navList from "@/lib/navList"

const data = {
  workspace: [
    {
      name: "Scale Sure",
      discription: "Digitised warrenty on whatsapp",
      avatar: "https://www.scalesure.in/images/logo_small.png",
    },
    {
      name: "BirdVision",
      discription: "Whatsapp Based Solution.",
      avatar: "/avatars/shadcn.jpg",
    },
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: navList,
};
export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        Space switcher
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
