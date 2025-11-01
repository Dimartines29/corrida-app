// components/MainHeader.tsx
'use client'

import { useState } from 'react';
import Link from 'next/link';
import { RegulamentoModal } from '@/components/RegulamentoModal';
import { Button } from '@/components/ui/button';
import { handleSignOut } from '@/app/actions/auth';

interface MainHeaderProps {
  isAdmin: boolean;
  isAuthenticated: boolean;
  userName?: string;
}

export function MainHeader({ isAdmin, isAuthenticated }: MainHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const renderHeaderButton = () => {
    if (isAdmin) {
      return (
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
            Painel Admin
          </Link>

          <Button onClick={async () => { await handleSignOut() }} className="text-[#E53935] hover:text-[#c62828] text-base xl:text-lg bg-transparent" >
            Sair
          </Button>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="flex items-center gap-4">
          <Link href="/minha-area" className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
            Minha Área
          </Link>

          <Button onClick={async () => { await handleSignOut() }} className="text-[#E53935] hover:text-[#c62828] text-base xl:text-lg bg-transparent" >
            Sair
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Link href="/register">
            <Button className="bg-[#E53935] text-white px-4 xl:px-6 py-2 xl:py-3 rounded-md font-bold text-base xl:text-lg hover:bg-[#c62828] transition-colors">
              INSCREVA-SE
            </Button>
        </Link>
        <Link href="/login" className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
          Entrar
        </Link>
      </div>
    );
  };

  const renderMobileButton = () => {
    if (isAdmin) {
      return (
        <div className="grid grid-cols-2 px-4 pb-2">
          <Link href="/admin" className="block w-full text-center mt-2 text-[#ffffff] font-bold text-base xl:text-lg bg-[#E53935] p-2 rounded-md hover:bg-[#c62828] transition">
            Painel Admin
          </Link>

          <Button onClick={async () => { await handleSignOut() }} className="block  text-center mt-2 text-[#E53935] font-bold text-base xl:text-lg bg-trasparent">
            Sair
          </Button>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="grid grid-cols-2 px-4 pb-2">
          <Link href="/minha-area" className="w-full mt-2 bg-[#E53935] text-white px-6 py-3 rounded-md font-bold hover:bg-[#c62828] transition text-center block">
            Minha área
          </Link>

          <Button onClick={async () => { await handleSignOut() }} className="block  text-center mt-2 text-[#E53935] font-bold text-base xl:text-lg bg-trasparent">
            Sair
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 px-4 pb-2">
        <Link href="/register" className="block w-full text-center mt-2 text-[#ffffff] font-bold text-base xl:text-lg bg-[#E53935] p-2 rounded-md hover:bg-[#c62828] transition">
          Inscreva-se
        </Link>

        <Link href="/login" className="block w-full text-center mt-4 text-[#E53935] font-bold text-base xl:text-lg">
          Entrar
        </Link>
      </div>
    );
  };

  return (
    <header className="fixed top-0 w-full bg-gray-100 shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex-shrink-0">
            <Link href="/">
                <img src="/logo-chris.png" alt="Todo Mundo Corre com o Chris" className="h-10 sm:h-13 w-auto"/>
            </Link>
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            <Button onClick={() => scrollToSection('inicio')} className="text-[#E53935] bg-transparent font-bold text-base xl:text-lg">
              Início
            </Button>
            <Button onClick={() => scrollToSection('inscricoes')} className="text-[#E53935] bg-transparent font-bold text-base xl:text-lg">
              Inscrições
            </Button>
            {/* <Button onClick={() => scrollToSection('percurso')} className="text-[#E53935] bg-transparent font-bold text-base xl:text-lg">
              Percurso
            </Button> */}
            <Button onClick={() => scrollToSection('informacoes')} className="text-[#E53935] bg-transparent font-bold text-base xl:text-lg">
              Informações
            </Button>

            <RegulamentoModal origin='desktop' />
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

        {/* MENU MOBILE */}
        {mobileMenuOpen && (
            <div className="lg:hidden pb-4 bg-gray-100 flex flex-col space-y-2 items-center">
                {renderMobileButton()}

                <Button onClick={() => scrollToSection('inicio')} className=" w-full text-[#E53935] font-semibold">
                    Início
                </Button>

                <Button onClick={() => scrollToSection('inscricoes')} className=" w-full text-[#E53935] font-semibold">
                    Inscrições
                </Button>

                {/* <Button onClick={() => scrollToSection('percurso')} className=" w-full text-[#E53935] font-semibold">
                    Percurso
                </Button> */}

                <Button onClick={() => scrollToSection('informacoes')} className=" w-full text-[#E53935] font-semibold">
                    Informações
                </Button>

                <RegulamentoModal origin='mobile' />
            </div>
        )}
      </nav>
    </header>
  );
}
