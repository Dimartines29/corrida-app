// app/inscricao/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { InscricaoForm } from '@/components/inscricao/InscricaoForm'
import { handleSignOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { MainHeader } from '@/components/MainHeader';

/**
 * Página de Inscrição
 *
 * NOTA IMPORTANTE:
 * - Esta página é protegida pelo layout.tsx (Server-Side)
 * - Só é acessível para usuários autenticados
 * - Não precisa verificar autenticação aqui, pois o layout já fez isso
 * - useSession() aqui é apenas para mostrar informações do usuário no header
 */
export default function InscricaoPage() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAdmin = session?.user?.role === 'ADMIN'
  const user = session?.user
  const isAuthenticated = !!session?.user

  const scrollToSection = (id: string) => {
    window.location.href = `/#${id}`
    setMobileMenuOpen(false)
  }

  // Função para renderizar botões do header (desktop)
  const renderHeaderButton = () => {
    if (isAdmin) {
      return (
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
            Painel Admin
          </Link>
          <Button
            onClick={async () => { await handleSignOut() }}
            className="text-[#E53935] hover:text-[#c62828] text-base xl:text-lg hover:underline bg-transparent"
          >
            Sair
          </Button>
        </div>
      )
    }

    if (user) {
      return (
        <div className="flex items-center gap-4">
          <Link href="/minha-area" className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
            Minha Área
          </Link>
          <Button
            onClick={async () => { await handleSignOut() }}
            className="text-[#E53935] hover:text-[#c62828] text-base xl:text-lg hover:underline bg-transparent"
          >
            Sair
          </Button>
        </div>
      )
    }

    return null
  }

  // Função para renderizar botões do menu mobile
  const renderMobileButton = () => {
    if (isAdmin) {
      return (
        <div>
          <Link href="/admin" className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded">
            Painel Admin
          </Link>
          <Button
            onClick={async () => { await handleSignOut() }}
            className="w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded bg-transparent"
          >
            Sair
          </Button>
        </div>
      )
    }

    if (user) {
      return (
        <div>
          <Link href="/minha-area" className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded">
            Minha Área
          </Link>
          <Button
            onClick={async () => { await handleSignOut() }}
            className="w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded bg-transparent"
          >
            Sair
          </Button>
        </div>
      )
    }

    return null
  }

  return (
    <main className="min-h-screen bg-white">
      <MainHeader isAdmin={isAdmin} isAuthenticated={isAuthenticated} />
      <div className="pt-20">
        <InscricaoForm />
      </div>
    </main>
  )
}
