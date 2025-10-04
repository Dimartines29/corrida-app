'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const targetDate = new Date('2026-01-25T08:00:00').getTime();

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

      {/* CABEÇALHO DA PAGINA */}
      <header className="fixed top-0 w-full bg-gray-100 shadow-md z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">

            <div className="flex-shrink-0">
              <img src="/logo-chris.png" alt="Todo Mundo Corre com o Chris" className="h-10 sm:h-13 w-auto"/>
            </div>

            <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
              <button onClick={() => scrollToSection('inicio')} className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">Início</button>
              <button onClick={() => scrollToSection('inscricoes')} className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">Inscrições</button>
              <button onClick={() => scrollToSection('informacoes')} className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">Informações</button>
              <button onClick={() => scrollToSection('percurso')} className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">Percurso</button>
            </div>

            <div className="hidden lg:block">
              <button onClick={() => scrollToSection('inscricoes')} className="bg-[#E53935] text-white px-4 xl:px-6 py-2 xl:py-3 rounded-md font-bold text-base xl:text-lg hover:bg-[#c62828] transition-colors">INSCREVA-SE</button>
            </div>

            <div className="lg:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#E53935] p-2"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {mobileMenuOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />)}</svg></button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 bg-gray-100">
              <button onClick={() => scrollToSection('inicio')} className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded">Início</button>
              <button onClick={() => scrollToSection('inscricoes')} className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded">Inscrições</button>
              <button onClick={() => scrollToSection('informacoes')} className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded">Informações</button>
              <button onClick={() => scrollToSection('percurso')} className="block w-full text-left py-3 text-[#E53935] font-semibold hover:bg-gray-200 px-4 rounded">Percurso</button>
              <button onClick={() => scrollToSection('inscricoes')}className="w-full mt-4 bg-[#E53935] text-white px-6 py-3 rounded-md font-bold hover:bg-[#c62828] transition">INSCREVA-SE</button>
            </div>
          )}
        </nav>
      </header>

      {/* HERO SECTION */}
      <section id="inicio" className="min-h-[90vh] bg-[#ffde41] flex items-center justify-center pt-16 sm:pt-20 px-4">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-start">

          <div className="flex flex-col items-center justify-center order-2 lg:order-1 mt-4 sm:mt-6 lg:mt-18">

            <div className="mb-6 sm:mb-8 w-full mt-0 lg:mt-18">

              <div className="mb-6 sm:mb-8 flex justify-center">
                <img src="/teste2.png" alt="Todo Mundo Corre com o Chris" className="w-full max-w-xs sm:max-w-md h-auto -mt-8 sm:-mt-14 lg:-mt-24"/>
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

            <button onClick={() => scrollToSection('inscricoes')} className="bg-[#E53935] text-white text-base sm:text-lg md:text-xl font-bold px-6 sm:px-8 md:px-12 py-3 md:py-4 rounded-full hover:bg-[#c62828] transition-all transform hover:scale-105 shadow-xl">GARANTA SUA VAGA AGORA!</button>
          </div>

          <div className="flex items-start justify-center order-1 lg:order-2 lg:-mt-4">
            <img src="/chris-pendurado.png" alt="Chris pendurado" className="w-full max-w-sm sm:max-w-lg lg:max-w-2xl -mt-0 lg:-mt-28"/>
          </div>
        </div>
      </section>

      {/* INSCRIÇÕES E KIT DE PARTICIPAÇÃO */}
      <section id="inscricoes" className="py-12 sm:py-16 lg:py-20 bg-[#FFE66D]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-[#00B8D4] mb-6 sm:mb-8 lg:mb-4">INSCRIÇÃO</h2>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center">

            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
              <div className="bg-[#00B8D4] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-center mb-6 -mt-10 sm:-mt-14 lg:-mt-16 shadow-lg">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black">KIT DE PARTICIPAÇÃO</h3>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#E53935] mb-2">R$ 100</div>
                <p className="text-sm sm:text-base text-gray-600">Por pessoa</p>
              </div>

              <div className="mb-6 sm:mb-8">
                <h4 className="text-lg sm:text-xl font-bold text-[#E53935] mb-3 sm:mb-4">O que está incluído:</h4>

                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2 sm:mr-3 text-lg sm:text-xl">✓</span>
                    <span className="text-black text-sm sm:text-base">Camiseta oficial do evento</span>
                  </li>

                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2 sm:mr-3 text-lg sm:text-xl">✓</span>
                    <span className="text-black text-sm sm:text-base">Medalha de participação</span>
                  </li>

                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2 sm:mr-3 text-lg sm:text-xl">✓</span>
                    <span className="text-black text-sm sm:text-base">Número de peito</span>
                  </li>

                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2 sm:mr-3 text-lg sm:text-xl">✓</span>
                    <span className="text-black text-sm sm:text-base">Sacochila</span>
                  </li>

                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2 sm:mr-3 text-lg sm:text-xl">✓</span>
                    <span className="text-black text-sm sm:text-base">1 vale chopp</span>
                  </li>

                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2 sm:mr-3 text-lg sm:text-xl">✓</span>
                    <span className="text-black text-sm sm:text-base">Brindes exclusivos</span>
                  </li>
                </ul>
              </div>

              <button className="w-full bg-[#E53935] text-white py-3 sm:py-4 rounded-xl font-black text-lg sm:text-xl hover:bg-[#c62828] transition-all transform hover:scale-105 shadow-lg">GARANTIR MINHA VAGA</button>
            </div>

            <div className="space-y-4 sm:space-y-6">

              <div className="flex justify-center mb-0">
                <img src="/julius.png" alt="Julius" className="w-full max-w-xs sm:max-w-sm h-auto -mt-8 sm:-mt-14 lg:-mt-28"/>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                <h4 className="text-xl sm:text-2xl font-bold text-[#E53935] mb-2">📍 Retirada do Kit</h4>
                <p className="text-sm sm:text-base text-gray-700"> Os kits poderão ser retirados no dia do evento a partir das <strong>06:30</strong> ou em local a ser divulgado nos dias anteriores.</p>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                <h4 className="text-xl sm:text-2xl font-bold text-[#E53935] mb-2">👕 Tamanhos Disponíveis</h4>

                <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-1">Camisetas disponíveis nos tamanhos:</p>

                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#FFE66D] px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-sm sm:text-base">P</span>
                  <span className="bg-[#FFE66D] px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-sm sm:text-base">M</span>
                  <span className="bg-[#FFE66D] px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-sm sm:text-base">G</span>
                  <span className="bg-[#FFE66D] px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-sm sm:text-base">GG</span>
                  <span className="bg-[#FFE66D] px-3 sm:px-4 py-1 sm:py-2 rounded-full font-semibold text-sm sm:text-base">XG</span>
                </div>
              </div>

              <div className="bg-[#00B8D4] p-4 sm:p-6 rounded-xl shadow-lg text-white">
                <h4 className="text-xl sm:text-2xl font-bold mb-2">⚡ Vagas Limitadas!</h4>

                <p className="text-sm sm:text-base">As inscrições são limitadas. Garanta sua vaga o quanto antes para não ficar de fora dessa experiência incrível!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERCURSO */}
      <section id="percurso" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-[#00B8D4] mb-3 sm:mb-4">PERCURSO</h2>

          <p className="text-center text-gray-700 text-base sm:text-lg mb-8 sm:mb-12 max-w-3xl mx-auto px-4">Circuito seguro e acessível para todos os níveis de condicionamento físico</p>

          <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#E53935] mb-6 sm:mb-8">ESCOLHA SUA DISTÂNCIA</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div onClick={() => setSelectedDistance(3)}className={`p-4 sm:p-6 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer ${selectedDistance === 3 ? 'bg-[#00B8D4] text-white' : 'bg-[#FFE66D]'}`}>

              <div className="text-center mb-3 sm:mb-4">
                <h3 className={`text-3xl sm:text-4xl font-black mb-2 ${selectedDistance === 3 ? 'text-white' : 'text-[#E53935]'}`}>3KM</h3>

                <p className={`text-xs sm:text-sm font-semibold ${selectedDistance === 3 ? 'text-white' : 'text-gray-700'}`}>CAMINHADA</p>
              </div>

              <ul className={`space-y-2 text-sm sm:text-base ${selectedDistance === 3 ? 'text-white' : 'text-gray-800'}`}>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Largada às 08:20</span>
                </li>

                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Ritmo tranquilo</span>
                </li>

                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Ideal para iniciantes e famílias</span>
                </li>
              </ul>
            </div>

            <div onClick={() => setSelectedDistance(5)}className={`p-4 sm:p-6 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer border-4 ${selectedDistance === 5 ? 'bg-[#E53935] text-white border-[#E53935]' : 'bg-[#FFE66D] border-[#E53935]'}`}>
              <div className="text-center mb-3 sm:mb-4">
                <h3 className={`text-3xl sm:text-4xl font-black mb-2 ${selectedDistance === 5 ? 'text-white' : 'text-[#E53935]'}`}>5KM</h3>

                <p className={`text-xs sm:text-sm font-semibold ${selectedDistance === 5 ? 'text-white' : 'text-gray-700'}`}>CORRIDA</p>
              </div>

              <ul className={`space-y-2 text-sm sm:text-base ${selectedDistance === 5 ? 'text-white' : 'text-gray-800'}`}>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Largada às 08:15</span>
                </li>

                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Percurso predominantemente plano</span>
                </li>

                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Cronometragem oficial</span>
                </li>
              </ul>
            </div>

            <div onClick={() => setSelectedDistance(10)}className={`p-4 sm:p-6 rounded-xl shadow-lg transform hover:scale-105 transition cursor-pointer sm:col-span-2 md:col-span-1 ${selectedDistance === 10 ? 'bg-[#00B8D4] text-white' : 'bg-[#FFE66D]'}`}>
              <div className="text-center mb-3 sm:mb-4">
                <h3 className={`text-3xl sm:text-4xl font-black mb-2 ${selectedDistance === 10 ? 'text-white' : 'text-[#E53935]'}`}>10KM</h3>

                <p className={`text-xs sm:text-sm font-semibold ${selectedDistance === 10 ? 'text-white' : 'text-gray-700'}`}>CORRIDA</p>
              </div>

              <ul className={`space-y-2 text-sm sm:text-base ${selectedDistance === 10 ? 'text-white' : 'text-gray-800'}`}>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Largada às 08:00</span>
                </li>

                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Para corredores experientes</span>
                </li>

                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Desafio completo</span>
                </li>
              </ul>
            </div>
          </div>

          {selectedDistance && (
            <div className="mt-8 sm:mt-12 bg-gray-100 p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-center text-[#E53935] mb-4">📍 MAPA DO PERCURSO - {selectedDistance}KM</h3>

              <div className="bg-gray-300 h-48 sm:h-64 rounded-lg flex items-center justify-center">
                {selectedDistance === 3 && (<p className="text-gray-600 text-base sm:text-lg px-4 text-center">Mapa de 3km será divulgado em breve</p>)}
                {selectedDistance === 5 && (<p className="text-gray-600 text-base sm:text-lg px-4 text-center">Mapa de 5km será divulgado em breve</p>)}
                {selectedDistance === 10 && (<p className="text-gray-600 text-base sm:text-lg px-4 text-center">Mapa de 10km será divulgado em breve</p>)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* INFORMAÇÕES DO EVENTO */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#FFE66D]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-[#00B8D4] mb-8 sm:mb-12">INFORMAÇÕES DO EVENTO</h2>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-[#E53935] mb-4 sm:mb-6 text-center">📍 ARENA THE CHRIS</h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1 text-[#00B8D4]">Concentração:</h4>

                  <p className="text-sm sm:text-base text-gray-800">Rua de Minas no Shopping Monte Carmo em frente ao The Chris Gastrobar</p>
                </div>

                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1 text-[#00B8D4]">Largada e Chegada:</h4>

                  <p className="text-sm sm:text-base text-gray-800">Estacionamento Monte Carmo Shopping</p>
                </div>

                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1 text-[#00B8D4]">Trajeto:</h4>

                  <p className="text-sm sm:text-base text-gray-800">Av. Marco Tulio Isaac e Edméia Mattos Lazzarotti</p>
                </div>

                <div className="bg-[#FFE66D] p-3 sm:p-4 rounded-lg mt-4">
                  <p className="text-sm sm:text-base text-gray-800"><strong>Pós-corrida:</strong> Premiação e confraternização no The Chris Gastrobar</p>
                </div>
              </div>
            </div>

            <div className="bg-[#00B8D4] p-6 sm:p-8 rounded-2xl shadow-lg text-white">
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">🏥 ESTRUTURA DE APOIO</h3>
              <p className="text-sm sm:text-base text-center mb-4 sm:mb-6">Todo suporte necessário aos participantes:</p>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-white/10 p-2 sm:p-3 rounded-lg text-center">
                  <p className="font-semibold text-xs sm:text-sm">🚑 Ambulância</p>
                </div>

                <div className="bg-white/10 p-2 sm:p-3 rounded-lg text-center">
                  <p className="font-semibold text-xs sm:text-sm">🍽️ Praça de Alimentação</p>
                </div>

                <div className="bg-white/10 p-2 sm:p-3 rounded-lg text-center">
                  <p className="font-semibold text-xs sm:text-sm">🎒 Guarda Volumes</p>
                </div>

                <div className="bg-white/10 p-2 sm:p-3 rounded-lg text-center">
                  <p className="font-semibold text-xs sm:text-sm">👟 Espaço Atleta</p>
                </div>

                <div className="bg-white/10 p-2 sm:p-3 rounded-lg text-center">
                  <p className="font-semibold text-xs sm:text-sm">🚻 Banheiros</p>
                </div>

                <div className="bg-white/10 p-2 sm:p-3 rounded-lg text-center">
                  <p className="font-semibold text-xs sm:text-sm">🏆 Área de Premiação</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-[#E53935] mb-4 sm:mb-6">CARACTERÍSTICAS DO CIRCUITO</h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#FFE66D] p-3 sm:p-4 rounded-xl text-center">
                <div className="text-2xl sm:text-3xl mb-2">🛣️</div>
                <h4 className="font-bold text-[#E53935] mb-1 text-xs sm:text-sm">Terreno</h4>

                <p className="text-[10px] sm:text-xs text-gray-700">Predominantemente plano com inclinações suaves</p>
              </div>

              <div className="bg-[#FFE66D] p-3 sm:p-4 rounded-xl text-center">
                <div className="text-2xl sm:text-3xl mb-2">🚧</div>
                <h4 className="font-bold text-[#E53935] mb-1 text-xs sm:text-sm">Segurança</h4>

                <p className="text-[10px] sm:text-xs text-gray-700">Circuito fechado ao tráfego de veículos</p>
              </div>

              <div className="bg-[#FFE66D] p-3 sm:p-4 rounded-xl text-center">
                <div className="text-2xl sm:text-3xl mb-2">🗺️</div>
                <h4 className="font-bold text-[#E53935] mb-1 text-xs sm:text-sm">Marcação</h4>

                <p className="text-[10px] sm:text-xs text-gray-700">Sinais, placas e fitas ao longo do trajeto</p>
              </div>

              <div className="bg-[#FFE66D] p-3 sm:p-4 rounded-xl text-center col-span-2 lg:col-span-1">
                <div className="text-2xl sm:text-3xl mb-2">💧</div>
                <h4 className="font-bold text-[#E53935] mb-1 text-xs sm:text-sm">Hidratação</h4>

                <p className="text-[10px] sm:text-xs text-gray-700">Postos a cada 2,5 km com água e suprimentos</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PATROCINADORES */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-[#00B8D4] mb-8 sm:mb-12">PATROCINADORES</h2>

          <div className="mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-[#E53935] mb-4 sm:mb-6">PATROCÍNIO MASTER</h3>

            <div className="flex justify-center">
              <div className="bg-gray-100 w-48 sm:w-64 h-24 sm:h-32 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-gray-400 text-sm sm:text-base">Logo Patrocinador</span>
              </div>
            </div>
          </div>

          <div className="mb-8 sm:mb-12">
            <h3 className="text-lg sm:text-xl font-bold text-center text-[#00B8D4] mb-4 sm:mb-6">PATROCÍNIO OURO</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 h-20 sm:h-24 rounded-lg flex items-center justify-center shadow">
                  <span className="text-gray-400 text-xs sm:text-sm">Logo</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-center text-[#00B8D4] mb-4 sm:mb-6">APOIO</h3>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 h-16 sm:h-20 rounded-lg flex items-center justify-center shadow">
                  <span className="text-gray-400 text-[10px] sm:text-xs">Logo</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">Quer ser um patrocinador?</p>

            <button className="bg-[#E53935] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-md font-bold hover:bg-[#c62828] transition text-sm sm:text-base">ENTRE EM CONTATO</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#FFE66D]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-[#00B8D4] mb-8 sm:mb-12">DÚVIDAS FREQUENTES</h2>

          <div className="space-y-3 sm:space-y-4">
            <details className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <summary className="font-bold text-base sm:text-lg cursor-pointer text-[#E53935]">Como faço para me inscrever?</summary>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700">Basta escolher seu kit acima e clicar em "Comprar Agora". Você será direcionado para o sistema de pagamento seguro.</p>
            </details>

            <details className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <summary className="font-bold text-base sm:text-lg cursor-pointer text-[#E53935]">Posso retirar o kit no dia do evento?</summary>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700">Sim! Haverá retirada de kits no dia do evento a partir das 06:30. Recomendamos chegar com antecedência.</p>
            </details>

            <details className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <summary className="font-bold text-base sm:text-lg cursor-pointer text-[#E53935]">Crianças podem participar?</summary>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700">Sim! Menores de 18 anos podem participar do percurso de 5km acompanhados de um responsável.</p>
            </details>

            <details className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <summary className="font-bold text-base sm:text-lg cursor-pointer text-[#E53935]">O que acontece em caso de chuva?</summary>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700">O evento acontece com chuva ou sol! Só será adiado em casos de condições climáticas extremas.</p>
            </details>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#FFE66D] mb-3 sm:mb-4">TODO MUNDO CORRE COM O CHRIS</h3>

              <p className="text-sm sm:text-base text-gray-400">A corrida mais divertida e nostálgica do ano!</p>
            </div>

            <div>
              <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">CONTATO</h4>

              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>📧 contato@corridachris.com.br</li>
                <li>📱 (31) 99999-9999</li>
                <li>📍 Betim, Minas Gerais</li>
              </ul>
            </div>

            <div className="sm:col-span-2 md:col-span-1">
              <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">REDES SOCIAIS</h4>

              <div className="flex gap-3 sm:gap-4">
                <button className="bg-[#E53935] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#c62828] transition text-sm sm:text-base">f</button>

                <button className="bg-[#E53935] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#c62828] transition text-sm sm:text-base">📷</button>

                <button className="bg-[#E53935] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#c62828] transition text-sm sm:text-base">🐦</button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-xs sm:text-sm">&copy; 2025 Todo Mundo Corre com o Chris. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}