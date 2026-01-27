// app/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react'
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { MainHeader } from '@/components/MainHeader';
import TabelaResultados from '@/components/TabelaResultados';
import CarrosselFotos from '@/components/CarrosselFotos';

export default function Home() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = session?.user?.role === 'ADMIN'
  const isAuthenticated = !!session?.user

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <MainHeader isAdmin={isAdmin} isAuthenticated={isAuthenticated} />

      {/* HERO SECTION - SEM COUNTDOWN */}
      <section id="inicio" className="min-h-[90vh] bg-[#ffde41] flex items-center justify-center pt-16 sm:pt-20 px-4 relative">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-2 items-center">

          {/* LOGO */}
          <div className="flex flex-col items-center justify-center order-2 lg:order-1">
            <div className="mb-6 sm:mb-8 w-full">
              <div className="flex justify-center">
                <img 
                  src="/logo-principal.png"
                  alt="Todo Mundo Corre com o Chris"
                  className="w-full max-w-xs sm:max-w-md h-auto mt-25 sm:-mt-12 lg:-mt-16"
                />
              </div>
            </div>
          </div>

          {/* CHRIS PENDURADO */}
          <div className="flex items-start justify-center order-1 lg:order-2 -mt-28 md:-mt-28 lg:-mt-12">
            <img 
              src="/chris-pendurado.png" 
              alt="Chris pendurado" 
              className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl -mt-0 lg:-mt-86"
            />
          </div>
        </div>
      </section>

      {/* 🏆 TABELA DE RESULTADOS - NOVA SEÇÃO */}
      <TabelaResultados />

      {/* 📸 CARROSSEL DE FOTOS - NOVO */}
      <CarrosselFotos />

      {/* PATROCINADORES */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-[#00B8D4] mb-10 sm:mb-14">
            PATROCINADORES
          </h2>

          {/* PATROCÍNIO OURO - Logos Grandes */}
          <div className="mb-10 sm:mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5 max-w-6xl mx-auto">
              <div className="bg-white w-full h-48 sm:h-64 rounded-xl flex items-center justify-center shadow-xl border-2 border-gray-100">
                <img
                  src="/logo-elitelab.png"
                  alt="Patrocinador Ouro - Elite Lab"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>

              <div className="bg-white w-full h-48 sm:h-64 rounded-xl flex items-center justify-center shadow-xl border-2 border-gray-100">
                <img
                  src="/logo-hamburguer.png"
                  alt="Patrocinador Ouro - Power"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>

              <div className="bg-white w-full h-48 sm:h-64 rounded-xl flex items-center justify-center shadow-xl border-2 border-gray-100">
                <img
                  src="/logo-power.png"
                  alt="Patrocinador Ouro - Power"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>
              <div className="bg-white w-full h-48 sm:h-64 rounded-xl flex items-center justify-center shadow-xl border-2 border-gray-100">
                <img
                  src="/logo-keesen.jpeg"
                  alt="Patrocinador Ouro - Olavo Keesen"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>
              <div className="bg-white w-full h-48 sm:h-64 rounded-xl flex items-center justify-center shadow-xl border-2 border-gray-100">
                <img
                  src="/logo-drvinicius.jpeg"
                  alt="Patrocinador Ouro - Dr. Vinicius"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>
              <div className="bg-white w-full h-48 sm:h-64 rounded-xl flex items-center justify-center shadow-xl border-2 border-gray-100">
                <img
                  src="/logo-max.png"
                  alt="Patrocinador Ouro - Max Muscles"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>
              <div className="bg-white w-full h-48 sm:h-64 rounded-xl flex items-center justify-center shadow-xl border-2 border-gray-100">
                <img
                  src="/logo-newpower.jpg"
                  alt="Patrocinador Ouro - New Power Energy Drink"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>
              <div className="bg-white w-full h-48 sm:h-64 rounded-xl flex items-center justify-center shadow-xl border-2 border-gray-100">
                <img
                  src="/logo-brasilembalagens.jpeg"
                  alt="Patrocinador Ouro - Brasil Embalagens"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>
              <div className="bg-white w-full h-48 sm:h-64 rounded-xl flex items-center justify-center shadow-xl border-2 border-gray-100">
                <img
                  src="/logo-sapao.png"
                  alt="Patrocinador Ouro - Hortifruti ABC do Sapão"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>
              <div className="bg-white w-full h-48 sm:h-64 rounded-xl flex items-center justify-center shadow-xl border-2 border-gray-100">
                <img
                  src="/logo-laser.png"
                  alt="Patrocinador Ouro - Liber Laser Academy"
                  className="w-full h-full object-contain p-6 sm:p-8"
                />
              </div>
            </div>
          </div>

          {/* APOIO - Logos Menores */}
          <div className="mb-10 sm:mb-14">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
              <div className="bg-white w-full h-32 sm:h-42 rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="/logo-ruy.jpg"
                  alt="Apoio - Ruy Store"
                  className="w-full h-full object-contain p-3 sm:p-4"
                />
              </div>
              <div className="bg-white w-full h-32 sm:h-42 rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="/logo-estacio.png"
                  alt="Apoio - Estácio"
                  className="w-full h-full object-contain p-3 sm:p-4"
                />
              </div>
              <div className="bg-white w-full h-32 sm:h-42 rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="/logo-kordex.png"
                  alt="Apoio - Kordex"
                  className="w-full h-full object-contain p-3 sm:p-4"
                />
              </div>
              <div className="bg-white w-full h-32 sm:h-42 rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="/logo-acai.jpeg"
                  alt="Apoio - Açaízinho BH"
                  className="w-full h-full object-contain p-3 sm:p-4"
                />
              </div>
              <div className="bg-white w-full h-32 sm:h-42 rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="/logo-wiliane.jpeg"
                  alt="Apoio - Nutricionista Wiliane"
                  className="w-full h-full object-contain p-3 sm:p-4"
                />
              </div>
              <div className="bg-white w-full h-32 sm:h-42 rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="/logo-brazon.png"
                  alt="Apoio - Brazon Purificadores"
                  className="w-full h-full object-contain p-3 sm:p-4"
                />
              </div>
              <div className="bg-white w-full h-32 sm:h-42 rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="/logo-cartaodetodos.jpeg"
                  alt="Apoio - Cartão de Todos"
                  className="w-full h-full object-contain p-3 sm:p-4"
                />
              </div>
              <div className="bg-white w-full h-32 sm:h-42 rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="/logo-betim.png"
                  alt="Apoio - Betim"
                  className="w-full h-full object-contain p-3 sm:p-4"
                />
              </div>
            </div>
          </div>

          {/* Call to Action - Seja Patrocinador */}
          <div className="flex justify-center">
            <div className="px-6 sm:px-8 py-4 sm:py-5">
              <p className="text-center text-base sm:text-lg font-bold text-gray-800 mb-2">
                🤝 Seja um patrocinador!
              </p>
              <p className="text-center text-sm sm:text-base text-gray-700">
                Entre em contato:{' '}
                <a
                  href="mailto:studiobravo0@gmail.com"
                  className="text-[#E53935] font-black hover:text-[#c62828] underline transition-colors"
                >
                  studiobravo0@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REALIZAÇÃO */}
      <section className="py-6 lg:py-10 bg-gradient-to-br from-[#FFE66D] via-[#ffd93d] to-[#FFE66D]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-center text-[#E53935] mb-10 sm:mb-14">
            ORGANIZAÇÃO
          </h2>

          {/* Realizador Principal - DESTAQUE */}
          <div className="flex justify-center sm:mb-12 -mt-10">
            <div className="h-44 sm:h-48 lg:h-56 flex items-center justify-center">
              <img
                src="/logo-bravo-petro.png"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-center text-[#E53935] mb-10 sm:mb-14">
            REALIZAÇÃO
          </h2>

          {/* Outros 2 Realizadores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-6 max-w-4xl mx-auto">
            {[
              { name: "The Chris", role: "Local do Evento", img: "/logo-thechris.png" },
              { name: "Monte Carmo Shopping", role: "Apoio Institucional", img: "/logo-montecarmo.png" }
            ].map((realizador, i) => (
              <div key={`realizador-${i}`}>
                <div className="space-y-3 -mt-4">
                  <div className="h-28 sm:h-32 flex items-center justify-center">
                    <img
                      src={realizador.img}
                      alt={realizador.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 sm:py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-6 sm:gap-4 mb-8 sm:mb-8">
            <div>
              <h3 className="text-xl sm:text-xl font-bold text-[#FFE66D] mb-4 sm:mb-5">TODO MUNDO CORRE COM O CHRIS</h3>
              <p className="text-sm sm:text-base text-gray-400">Todo Mundo Odeia o Chris mas vai amar essa corrida!</p>
            </div>

            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">CONTATO</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>📧 studiobravo0@gmail.com</li>
                <li>📍 Betim, Minas Gerais</li>
              </ul>
            </div>

            <div className="sm:col-span-2 md:col-span-1">
              <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">REDE SOCIAL</h4>

              <div className="flex gap-3 sm:gap-4">
                <a href="https://www.instagram.com/corridathechris?igsh=MWV0Y2I2NHhwYWZocA==" target="_blank" rel="noopener noreferrer" className="bg-[#E53935] w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center hover:bg-[#c62828] hover:scale-110 transition-all shadow-lg">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-gray-400">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <p className="text-xs sm:text-sm">&copy; Copyright © 2025 All Rights Reserved. Desenvolvido e mantido por</p>
            <a
              href="https://wa.me/5531988280047"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo-branco.png"
                alt="Logo da empresa"
                className="h-40 md:h-48"
              />
            </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
