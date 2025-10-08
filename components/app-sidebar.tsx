"use client"

import * as React from "react"
import { IconInnerShadowTop, IconSettings, IconUser, IconUserEdit, IconBookmarkEdit } from "@tabler/icons-react"
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
      icon: IconUser,
    },
    {
      title: "Inscrição Manual",
      url: "/admin/inscricao-manual",
      icon: IconUserEdit,
    },
    {
      title: "Lotes e Categorias",
      url: "/admin/lotes-categorias",
      icon: IconBookmarkEdit,
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/admin/configuracoes",
      icon: IconSettings,
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
