// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import ModalChurrasco from '@/components/ModalChurrasco';
import { MainHeader } from '@/components/MainHeader';

export default function Home() {
  const { data: session } = useSession()
  const [timeLeft, setTimeLeft] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = session?.user?.role === 'ADMIN'
  const isAuthenticated = !!session?.user

  useEffect(() => {
    const targetDate = new Date('2026-01-25T06:30:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <MainHeader isAdmin={isAdmin} isAuthenticated={isAuthenticated} />

      {/* HERO SECTION */}
      <section id="inicio" className="min-h-[90vh] bg-[#ffde41] flex items-center justify-center pt-16 sm:pt-20 px-4 relative">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-start">

          <div className="flex flex-col items-center justify-center order-2 lg:order-1 mt-4 sm:mt-6 lg:mt-18">

            <div className="mb-6 sm:mb-8 w-full mt-0 lg:mt-18">

              <div className="mb-8 sm:mb-6 flex justify-center">
                <img src="/logo-principal.png" alt="Todo Mundo Corre com o Chris" className="w-full max-w-xs sm:max-w-md h-auto -mt-6 sm:-mt-24 lg:-mt-28"/>
              </div>

              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">FALTAM:</p>

              <div className="flex justify-center gap-2 md:gap-4">
                <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-lg w-16 sm:w-20 md:w-28 flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-3xl md:text-5xl font-black text-[#E53935] text-center">{timeLeft.days}</div>
                  <div className="text-[10px] sm:text-xs md:text-base font-semibold text-gray-600 text-center">DIAS</div>
                </div>

                <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-lg w-16 sm:w-20 md:w-28 flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-3xl md:text-5xl font-black text-[#E53935] text-center">{timeLeft.hours}</div>
                  <div className="text-[10px] sm:text-xs md:text-base font-semibold text-gray-600 text-center">HORAS</div>
                </div>

                <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-lg w-16 sm:w-20 md:w-28 flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-3xl md:text-5xl font-black text-[#E53935] text-center">{timeLeft.minutes}</div>
                  <div className="text-[10px] sm:text-xs md:text-base font-semibold text-gray-600 text-center">MIN</div>
                </div>

                <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-lg w-16 sm:w-20 md:w-28 flex flex-col items-center justify-center">
                  <div className="text-2xl sm:text-3xl md:text-5xl font-black text-[#E53935] text-center">{timeLeft.seconds}</div>
                  <div className="text-[10px] sm:text-xs md:text-base font-semibold text-gray-600 text-center">SEG</div>
                </div>
              </div>
            </div>

            <Link href={"/register"} className="bg-[#E53935] text-white text-base sm:text-lg md:text-xl font-bold px-6 sm:px-8 md:px-12 py-3 md:py-4 rounded-full hover:bg-[#c62828] transition-all transform hover:scale-105 shadow-xl">GARANTA SUA VAGA AGORA!</Link>
          </div>

          <div className="flex items-start justify-center order-1 lg:order-2 -mt-28 md:-mt-22 lg:-mt-12">
            <img src="/chris-pendurado.png" alt="Chris pendurado" className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl -mt-0 lg:-mt-18"/>
          </div>
        </div>
      </section>

      {/* INSCRIÇÕES E KIT DE PARTICIPAÇÃO */}
      <section id="inscricoes" className="py-12 sm:py-16 lg:py-20 bg-[#FFE66D]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-[#00B8D4] mb-6 sm:mb-8 lg:mb-4">INSCRIÇÃO</h2><br></br>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">

            {/* COLUNA ESQUERDA - Card do Kit Oficial */}
            <div className="space-y-6">
              <div className="bg-[url('/kit-oficial-logo.png')] bg-cover bg-center rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-20 relative min-h-[500px] sm:min-h-[500px]">
                {/* Badge do Primeiro Lote */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#FFE66D] via-[#ffd700] to-[#ffb700] text-[#E53935] px-5 py-3 rounded-2xl shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform">
                  <div className="text-center">
                    <p className="text-xl font-black flex items-center gap-1">
                      <span></span> 1º LOTE <span></span>
                    </p>
                  </div>
                </div>

                <div className="bg-[#00B8D4] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-center mb-6 -mt-10 sm:-mt-14 lg:-mt-16 shadow-lg">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black">KIT OFICIAL</h3>
                </div>

                <div className="text-center mb-32 sm:mb-120">
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#E53935] mb-2">R$ 100</div>
                  <p className="text-sm sm:text-base text-gray-600">Por pessoa</p>
                </div>

                <Link href="/register" className="block w-full absolute bottom-6 left-1/2 -translate-x-1/2 max-w-xs sm:max-w-sm lg:max-w-md bg-[#E53935] text-white py-3 sm:py-4 rounded-xl font-black text-lg sm:text-xl hover:bg-[#c62828] transition-all transform hover:scale-105 shadow-lg text-center">
                  GARANTIR MEU KIT!
                </Link>
              </div>
            </div>

            {/* COLUNA DIREITA - Informações adicionais */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-center mb-0">
                <img src="/julius.png" alt="Julius" className="w-full max-w-xs sm:max-w-sm h-auto -mt-8 sm:-mt-14 lg:-mt-28"/>
              </div>

              {/* 🆕 COMPONENTE MODAL DO CHURRASCO */}
              <ModalChurrasco />

            </div>

          </div>
        </div>
      </section>

      {/* PERCURSO */}
      <section id="percurso" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-[#00B8D4] mb-3 sm:mb-4">
            PERCURSO
          </h2>

          <p className="text-center text-gray-700 text-base sm:text-lg mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Circuito seguro, plano e sem o Caruso jogando você pra fora da pista.
          </p>

          <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#E53935] mb-6 sm:mb-8">
            ESCOLHA SUA DISTÂNCIA
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div
              onClick={() => setSelectedDistance(6)}
              className={`p-4 sm:p-6 rounded-xl shadow-lg transition cursor-pointer sm:col-span-2 md:col-span-1 ${
                selectedDistance === 6 ? 'bg-[#00B8D4] text-white' : 'bg-[#FFE66D]'
              }`}
            >
              <div className="text-center mb-3 sm:mb-4">
                <h3 className={`text-3xl sm:text-4xl font-black mb-2 ${
                  selectedDistance === 6 ? 'text-white' : 'text-[#E53935]'
                }`}>
                  6KM
                </h3>
                <p className={`text-xs sm:text-sm font-semibold ${
                  selectedDistance === 6 ? 'text-white' : 'text-gray-700'
                }`}>
                  CORRIDA
                </p>
              </div>
            </div>

            <div
              onClick={() => setSelectedDistance(10)}
              className={`p-4 sm:p-6 rounded-xl shadow-lg transition cursor-pointer border-4 ${
                selectedDistance === 10 ? 'bg-[#E53935] text-white border-[#E53935]' : 'bg-[#FFE66D] border-[#E53935]'
              }`}
            >
              <div className="text-center mb-3 sm:mb-4">
                <h3 className={`text-3xl sm:text-4xl font-black mb-2 ${
                  selectedDistance === 10 ? 'text-white' : 'text-[#E53935]'
                }`}>
                  10KM
                </h3>
                <p className={`text-xs sm:text-sm font-semibold ${
                  selectedDistance === 10 ? 'text-white' : 'text-gray-700'
                }`}>
                  CORRIDA
                </p>
              </div>
            </div>

            <div
              onClick={() => setSelectedDistance(3)}
              className={`p-4 sm:p-6 rounded-xl shadow-lg transition cursor-pointer ${
                selectedDistance === 3 ? 'bg-[#00B8D4] text-white' : 'bg-[#FFE66D]'
              }`}
            >
              <div className="text-center mb-3 sm:mb-4">
                <h3 className={`text-3xl sm:text-4xl font-black mb-2 ${
                  selectedDistance === 3 ? 'text-white' : 'text-[#E53935]'
                }`}>
                  3KM
                </h3>
                <p className={`text-xs sm:text-sm font-semibold ${
                  selectedDistance === 3 ? 'text-white' : 'text-gray-700'
                }`}>
                  CAMINHADA
                </p>
              </div>
            </div>
          </div>

          {selectedDistance && (
            <div className="mt-8 sm:mt-12 bg-gray-100 p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-center text-[#E53935] mb-4">
                📍 MAPA DO PERCURSO - {selectedDistance}KM
              </h3>

              <div className="bg-gradient-to-br from-[#FFE66D] to-[#ffd93d] rounded-lg p-12 sm:p-16 shadow-lg flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-6xl sm:text-7xl mb-4">🗺️</div>
                  <p className="text-xl sm:text-2xl font-black text-[#E53935] mb-2">
                    📍 Os mapas dos percursos serão divulgados em breve!
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 font-semibold">
                    Fique atento às nossas redes sociais para atualizações
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8 mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-[#E53935] mb-6 flex items-center justify-center gap-2">
              <span className="text-2xl">🏃‍♂️</span> CARACTERÍSTICAS DO CIRCUITO
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-[#FFE66D] p-4 rounded-xl text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-2">🛣️</div>
                <h4 className="font-bold text-[#E53935] mb-2 text-sm">Terreno</h4>
                <p className="text-xs text-gray-700">Predominantemente plano com inclinações suaves</p>
              </div>

              <div className="bg-[#FFE66D] p-4 rounded-xl text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-2">🚧</div>
                <h4 className="font-bold text-[#E53935] mb-2 text-sm">Segurança</h4>
                <p className="text-xs text-gray-700">Circuito fechado ao tráfego de veículos</p>
              </div>

              <div className="bg-[#FFE66D] p-4 rounded-xl text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-2">🗺️</div>
                <h4 className="font-bold text-[#E53935] mb-2 text-sm">Marcação</h4>
                <p className="text-xs text-gray-700">Sinais, placas e fitas ao longo do trajeto</p>
              </div>

              <div className="bg-[#FFE66D] p-4 rounded-xl text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-2">💧</div>
                <h4 className="font-bold text-[#E53935] mb-2 text-sm">Hidratação</h4>
                <p className="text-xs text-gray-700">Postos a cada 2,5 km com água e suprimentos</p>
              </div>

              <div className="bg-[#FFE66D] p-4 rounded-xl text-center hover:scale-105 transition-transform col-span-2 lg:col-span-1">
                <div className="text-3xl mb-2">⏱️</div>
                <h4 className="font-bold text-[#E53935] mb-2 text-sm">Cronometragem</h4>
                <p className="text-xs text-gray-700">Registro eletrônico de tempo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFORMAÇÕES DO EVENTO */}
      <section id="informacoes" className="py-12 sm:py-16 lg:py-20 bg-[#FFE66D]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-[#00B8D4] mb-8 sm:mb-12">INFORMAÇÕES DO EVENTO</h2>

          {/* Cronograma */}
          <div className="bg-gradient-to-br from-[#E53935] to-[#c62828] p-6 sm:p-8 rounded-2xl shadow-2xl text-white">
            <h3 className="text-2xl sm:text-3xl font-black text-center mb-6 flex items-center justify-center gap-3">
              <span className="text-3xl">🕐</span> CRONOGRAMA DO DIA
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <p className="font-black text-lg mb-1">06:30</p>
                <p className="text-sm">Abertura da Arena <strong>The Chris</strong></p>
              </div>

              <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <p className="font-black text-lg mb-1">07:30</p>
                <p className="text-sm">Alongamento</p>
              </div>

              <div className="bg-[#FFE66D] text-[#E53935] p-4 rounded-xl border-2 border-white font-bold hover:scale-105 transition-transform">
                <p className="font-black text-lg mb-1">07:45 🏃</p>
                <p className="text-sm font-black">LARGADA CORRIDA 10KM</p>
              </div>

              <div className="bg-[#FFE66D] text-[#E53935] p-4 rounded-xl border-2 border-white font-bold hover:scale-105 transition-transform">
                <p className="font-black text-lg mb-1">07:55 🏃</p>
                <p className="text-sm font-black">LARGADA CORRIDA 6KM</p>
              </div>

              <div className="bg-[#FFE66D] text-[#E53935] p-4 rounded-xl border-2 border-white font-bold hover:scale-105 transition-transform">
                <p className="font-black text-lg mb-1">08:05 🏃</p>
                <p className="text-sm font-black">LARGADA CAMINHADA 3KM</p>
              </div>

              <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <p className="font-black text-lg mb-1">09:30</p>
                <p className="text-sm">Início do Show</p>
              </div>

              <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <p className="font-black text-lg mb-1">10:30</p>
                <p className="text-sm">Início da Cerimônia de Premiação</p>
              </div>

              <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                <p className="font-black text-lg mb-1">11:00</p>
                <p className="text-sm">Sorteio de Brindes</p>
              </div>

              <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all md:col-span-2 lg:col-span-1">
                <p className="font-black text-lg mb-1">12:00</p>
                <p className="text-sm">Término do Evento</p>
              </div>
            </div>
          </div><br></br>

          <div className="mb-6 sm:mb-8">
            {/* Card Principal */}
            <div className="bg-gradient-to-br from-[#00B8D4] via-[#0099b8] to-[#00B8D4] p-6 sm:p-8 rounded-2xl shadow-2xl text-white">
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {/* DJ */}
                <div>
                  <div className="flex flex-col items-center">
                    {/* Foto do DJ */}
                    <div className="w-48 h-48 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-4 border-[#FFE66D] shadow-2xl mb-4 bg-gray-300">
                      <img
                        src="/dj.jpeg"
                        alt="DJ do Evento"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 30%' }}
                      />
                    </div>

                    {/* Nome e Descrição */}
                    <div className="text-center">
                      <h4 className="text-2xl sm:text-3xl font-black mb-2">DJ IVAN LEAL</h4>
                      <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                        Comanda o som da arena com um set cheio de hits energia lá em cima no pós-corrida!
                      </p>
                    </div>
                  </div>
                </div>

                {/* LOCUTOR */}
                <div>
                  <div className="flex flex-col items-center">
                    {/* Foto do Locutor */}
                    <div className="w-48 h-48 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-4 border-[#FFE66D] shadow-2xl mb-4 bg-gray-300">
                      <img
                        src="/locutor.jpeg"
                        alt="Locutor do Evento"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 40%' }}
                      />
                    </div>

                    {/* Nome e Descrição */}
                    <div className="text-center">
                      <h4 className="text-2xl sm:text-3xl font-black mb-2">BRENO COUTO</h4>
                      <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                        Vai narrar cada momento da corrida e comandar as atividades com muita energia e animação!
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Percurso e Arena */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-[#E53935] mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
                <span className="text-2xl">📍</span> ARENA THE CHRIS
              </h3>

              <div className="space-y-4">
                <div className="bg-[#FFE66D] p-4 rounded-xl">
                  <h4 className="font-bold text-base sm:text-lg mb-2 text-[#E53935]">🏁 Concentração</h4>
                  <p className="text-sm sm:text-base text-gray-800">Estacionamento do <strong>Monte Carmo Shopping</strong> em frente ao <strong>The Chris</strong>.</p>
                </div>

                <div className="bg-[#FFE66D] p-4 rounded-xl">
                  <h4 className="font-bold text-base sm:text-lg mb-2 text-[#E53935]">🚀 Largada e Chegada</h4>
                  <p className="text-sm sm:text-base text-gray-800">Estacionamento <strong>Monte Carmo Shopping</strong>.</p>
                </div>

                <div className="bg-[#FFE66D] p-4 rounded-xl">
                  <h4 className="font-bold text-base sm:text-lg mb-2 text-[#E53935]">🏆 Premiação</h4>
                  <p className="text-sm sm:text-base text-gray-800">Medalhas para todos os concluintes, troféus apenas aos 3 primeiros colocados masculino e aos 3 primeiros colocados feminino na prova de <strong>10 km</strong>.</p>
                </div>

                <div className="bg-[#FFE66D] p-4 rounded-xl">
                  <h4 className="font-bold text-base sm:text-lg mb-2 text-[#E53935]">🎉 Pós-Corrida</h4>
                  <p className="text-sm sm:text-base text-gray-800">Evento com DJ, premiação e sorteios no <strong>The Chris</strong>.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#00B8D4] p-6 sm:p-8 rounded-2xl shadow-lg text-white">
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 flex items-center justify-center gap-2">
                <span className="text-2xl">🏥</span> ESTRUTURA DE APOIO
              </h3>

              <p className="text-sm sm:text-base text-center mb-4 sm:mb-6">Todo suporte necessário aos participantes:</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 backdrop-blur p-3 sm:p-4 rounded-xl text-center border border-white/30 hover:bg-white/30 transition-all">
                  <div className="text-3xl mb-2">🚑</div>
                  <p className="font-semibold text-xs sm:text-sm">Ambulância</p>
                </div>

                <div className="bg-white/20 backdrop-blur p-3 sm:p-4 rounded-xl text-center border border-white/30 hover:bg-white/30 transition-all">
                  <div className="text-3xl mb-2">👨‍⚕️</div>
                  <p className="font-semibold text-xs sm:text-sm">Equipe Médica</p>
                </div>

                <div className="bg-white/20 backdrop-blur p-3 sm:p-4 rounded-xl text-center border border-white/30 hover:bg-white/30 transition-all">
                  <div className="text-3xl mb-2">🍽️</div>
                  <p className="font-semibold text-xs sm:text-sm">Praça de Alimentação</p>
                </div>

                <div className="bg-white/20 backdrop-blur p-3 sm:p-4 rounded-xl text-center border border-white/30 hover:bg-white/30 transition-all">
                  <div className="text-3xl mb-2">🎒</div>
                  <p className="font-semibold text-xs sm:text-sm">Guarda Volumes</p>
                </div>

                <div className="bg-white/20 backdrop-blur p-3 sm:p-4 rounded-xl text-center border border-white/30 hover:bg-white/30 transition-all">
                  <div className="text-3xl mb-2">👟</div>
                  <p className="font-semibold text-xs sm:text-sm">Espaço Atleta</p>
                </div>

                <div className="bg-white/20 backdrop-blur p-3 sm:p-4 rounded-xl text-center border border-white/30 hover:bg-white/30 transition-all">
                  <div className="text-3xl mb-2">🚻</div>
                  <p className="font-semibold text-xs sm:text-sm">Banheiros<br></br></p>
                </div>

                <div className="bg-white/20 backdrop-blur p-3 sm:p-4 rounded-xl text-center border border-white/30 hover:bg-white/30 transition-all">
                  <div className="text-3xl mb-2">🅿️</div>
                  <p className="font-semibold text-xs sm:text-sm">Estacionamento<br></br></p>
                </div>

                <div className="bg-white/20 backdrop-blur p-3 sm:p-4 rounded-xl text-center border border-white/30 hover:bg-white/30 transition-all">
                  <div className="text-3xl mb-2">💧</div>
                  <p className="font-semibold text-xs sm:text-sm">Postos de Hidratação<br></br></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            </div>
          </div>

          {/* APOIO - Logos Menores */}
          <div className="mb-10 sm:mb-14">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
              <div className="bg-white w-full h-32 sm:h-42 rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="/logo-rafacar.jpeg"
                  alt="Apoio - Rafacar"
                  className="w-full h-full object-contain p-3 sm:p-4"
                />
              </div>
              <div className="bg-white w-full h-32 sm:h-42 rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="/logo-brenda.jpeg"
                  alt="Apoio - Brenda"
                  className="w-full h-full object-contain p-3 sm:p-4"
                />
              </div>
              <div className="bg-white w-full h-32 sm:h-42 rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
                <img
                  src="/logo-estacio.png"
                  alt="Apoio - Brenda"
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
