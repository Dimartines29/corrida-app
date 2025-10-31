// app/inscricao/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { InscricaoForm } from '@/components/inscricao/InscricaoForm'
import { handleSignOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

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
      {/* CABEÇALHO DA PÁGINA */}
      <header className="fixed top-0 w-full bg-gray-100 shadow-md z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <img
                  src="/logo-chris.png"
                  alt="Todo Mundo Corre com o Chris"
                  className="h-10 sm:h-13 w-auto cursor-pointer"
                />
              </Link>
            </div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
              <button
                onClick={() => scrollToSection('inicio')}
                className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection('inscricoes')}
                className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg"
              >
                Inscrições
              </button>
              <button
                onClick={() => scrollToSection('informacoes')}
                className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg"
              >
                Informações
              </button>
              <button
                onClick={() => scrollToSection('percurso')}
                className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg"
              >
                Percurso
              </button>
            </div>

            {/* Botões Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              {renderHeaderButton()}
            </div>

            {/* Menu Mobile Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#E53935] p-2"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Mobile */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 bg-gray-100">
              <button
                onClick={() => scrollToSection('inicio')}
                className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection('inscricoes')}
                className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded"
              >
                Inscrições
              </button>
              <button
                onClick={() => scrollToSection('informacoes')}
                className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded"
              >
                Informações
              </button>
              <button
                onClick={() => scrollToSection('percurso')}
                className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded"
              >
                Percurso
              </button>
              {renderMobileButton()}
            </div>
          )}
        </nav>
      </header>

      {/* FORMULÁRIO DE INSCRIÇÃO */}
      <div className="pt-20">
        <InscricaoForm />
      </div>
    </main>
  )
}
