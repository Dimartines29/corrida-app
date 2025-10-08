// app/admin/layout.tsx

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-destructive mb-4">
            Acesso Negado
          </h1>
          <p className="text-muted-foreground mb-6">
            Você não tem permissão para acessar esta área.
          </p>
          <Link
            href="/"
            className="text-primary underline hover:no-underline"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    )
  }

  const userData = {
    name: session.user.name || "Usuário",
    email: session.user.email || "",
  }

  return (
    <SidebarProvider>
      <AppSidebar userData={userData} />
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
