"use client"

import * as React from "react"
import { IconInnerShadowTop, IconHome, IconUsers, IconUserEdit, IconBookmarkEdit } from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userData: {
    name: string
    email: string
  }
}

const data = {
  navMain: [
    {
      title: "Inscrições",
      url: "/admin",
      icon: IconUsers,
    },
    {
      title: "Inscrição Manual",
      url: "/admin/inscricao-manual",
      icon: IconUserEdit,
    },
    {
      title: "Cupons de desconto",
      url: "/admin/cupons",
      icon: IconBookmarkEdit,
    },
  ],
  navSecondary: [
    {
      title: "Página inicial",
      url: "/",
      icon: IconHome,
    }
  ]
}

export function AppSidebar({ userData, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Corrida - The Chris</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
