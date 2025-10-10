'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { InscricaoForm } from "@/components/inscricao/InscricaoForm";

export default function InscricaoPage() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = session?.user?.role === 'ADMIN';
  const user = session?.user;

  const renderHeaderButton = () => {
    if (isAdmin) {
      return (
        <div>
          <Link href="/admin" className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
            Painel Admin
          </Link>
          <Link className="text-[#E53935] hover:text-[#c62828] text-base xl:text-lg pl-4" href="/api/auth/signout">
            Sair
          </Link>
        </div>
      );
    }

    if (user) {
      return (
        <div>
          <Link href="/minha-area" className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
            Minha Área
          </Link>
          <Link className="text-[#E53935] hover:text-[#c62828] text-base xl:text-lg pl-4" href="/api/auth/signout">
            Sair
          </Link>
        </div>
      );
    }
  };

  const renderMobileButton = () => {
    if (isAdmin) {
      return (
        <div>
          <Link href="/admin" className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded">
            Painel Admin
          </Link>
          <Link className="text-[#E53935] hover:text-[#c62828] text-base xl:text-lg pl-4" href="/api/auth/signout">
            Sair
          </Link>
        </div>
      );
    }

    if (user) {
      return (
        <div>
          <Link href="/minha-area" className="w-full mt-4 bg-[#E53935] text-white px-6 py-3 rounded-md font-bold hover:bg-[#c62828] transition text-center block">
            Minha área
          </Link>
          <Link className="text-[#E53935] hover:text-[#c62828] text-base xl:text-lg pl-4" href="/api/auth/signout">
            Sair
          </Link>
        </div>
      );
    }

    return (
      <Link href="/inscricao" className="w-full mt-4 bg-[#E53935] text-white px-6 py-3 rounded-md font-bold hover:bg-[#c62828] transition text-center block">
        INSCREVA-SE
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-white">
      {/* CABEÇALHO DA PÁGINA */}
      <header className="fixed top-0 w-full bg-gray-100 shadow-md z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex-shrink-0">
              <Link href="/">
                <img src="/logo-chris.png" alt="Todo Mundo Corre com o Chris" className="h-10 sm:h-13 w-auto"/>
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
              <Link href="/#inicio" className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">Início</Link>
              <Link href="/#inscricoes" className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">Inscrições</Link>
              <Link href="/#percurso" className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">Percurso</Link>
              <Link href="/#informacoes" className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">Informações</Link>
            </div>

            <div className="hidden lg:block">
              {renderHeaderButton()}
            </div>

            <div className="lg:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#E53935] p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 bg-gray-100">
              <Link href="/#inicio" className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded">Início</Link>
              <Link href="/#inscricoes" className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded">Inscrições</Link>
              <Link href="/#percurso" className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded">Percurso</Link>
              <Link href="/#informacoes" className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded">Informações</Link>
              {renderMobileButton()}
            </div>
          )}
        </nav>
      </header>

      {/* CONTEÚDO DA PÁGINA */}
      <div className="pt-20">
        <InscricaoForm />
      </div>
    </main>
  );
}