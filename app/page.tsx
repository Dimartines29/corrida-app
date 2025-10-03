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

  // Countdown para 25/10/2025
  useEffect(() => {
    const targetDate = new Date('2026-01-16T08:00:00').getTime();

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

  return (
    <div className="min-h-screen bg-white">
      {/* CABEÇALHO DA PAGINA */}
      <header className="fixed top-0 w-full bg-gray-100 shadow-md z-50">
        <nav className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-30">
            {/* LOGO */}
            <div className="flex-shrink-0">
              <img
                src="/logo-chris.png"
                alt="Todo Mundo Corre com o Chris"
                className="h-23 w-auto"
              />
            </div>

            {/* BOTOES MENU */}
            <div className="hidden md:flex items-center space-x-12">
              <button onClick={() => scrollToSection('inicio')} className="text-[#E53935] hover:text-[#c62828] font-bold text-[23px]">
                Início
              </button>
              <button onClick={() => scrollToSection('inscricoes')} className="text-[#E53935] hover:text-[#c62828] font-bold text-[23px]">
                Inscrições
              </button>
              <button onClick={() => scrollToSection('informacoes')} className="text-[#E53935] hover:text-[#c62828] font-bold text-[23px]">
                Informações
              </button>
              <button onClick={() => scrollToSection('percurso')} className="text-[#E53935] hover:text-[#c62828] font-bold text-[23px]">
                Percurso
              </button>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => scrollToSection('inscricoes')}
                className="bg-[#E53935] text-white px-8 py-4 rounded-md font-bold text-[25px] hover:bg-[#c62828] transition-colors"
              >
                INSCREVA-SE
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#E53935] p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4">
              <button onClick={() => scrollToSection('inicio')} className="block w-full text-left py-2 text-[#E53935] font-medium">
                Início
              </button>
              <button onClick={() => scrollToSection('inscricoes')} className="block w-full text-left py-2 text-[#E53935] font-medium">
                Inscrições
              </button>
              <button onClick={() => scrollToSection('informacoes')} className="block w-full text-left py-2 text-[#E53935] font-medium">
                Informações
              </button>
              <button onClick={() => scrollToSection('percurso')} className="block w-full text-left py-2 text-[#E53935] font-medium">
                Percurso
              </button>
              <button 
                onClick={() => scrollToSection('inscricoes')}
                className="w-full mt-2 bg-[#E53935] text-white px-6 py-2 rounded-md font-semibold"
              >
                INSCREVA-SE
              </button>
            </div>
          )}
        </nav>
      </header>

{/* HERO SECTION */}
<section id="inicio" className="min-h-screen bg-[#ffde41] flex items-center justify-center pt-6 px-4">
  <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">

    {/* Countdown e CTA - Lado Esquerdo/Centro */}
    <div className="flex flex-col items-center justify-center order-2 lg:order-1">
      {/* Countdown */}
      <div className="mb-8">
        {/* Imagem acima do countdown */}
        <div className="mb-8 flex justify-center">
          <img
            src="/teste2.png"
            alt="Descrição da imagem"
            className="w-96 h-auto"
          />
        </div>
        <p className="text-2xl font-bold text-gray-800 mb-4">FALTAM:</p>
        <div className="flex justify-center gap-4 md:gap-8">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-4xl md:text-5xl font-black text-[#E53935]">{timeLeft.days}</div>
            <div className="text-sm md:text-base font-semibold text-gray-600">DIAS</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-4xl md:text-5xl font-black text-[#E53935]">{timeLeft.hours}</div>
            <div className="text-sm md:text-base font-semibold text-gray-600">HORAS</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-4xl md:text-5xl font-black text-[#E53935]">{timeLeft.minutes}</div>
            <div className="text-sm md:text-base font-semibold text-gray-600">MIN</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-4xl md:text-5xl font-black text-[#E53935]">{timeLeft.seconds}</div>
            <div className="text-sm md:text-base font-semibold text-gray-600">SEG</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => scrollToSection('inscricoes')}
        className="bg-[#E53935] text-white text-xl font-bold px-12 py-4 rounded-full hover:bg-[#c62828] transition-all transform hover:scale-105 shadow-xl"
      >
        GARANTA SUA VAGA AGORA!
      </button>
    </div>

    {/* Logo - Lado Direito */}
    <div className="flex items-start justify-center  order-1 lg:order-2">
      <img 
        src="/chris-pendurado.png"
        alt="Todo Mundo Corre com o Chris"
        className="w-full max-w-8xl -mt-25 lg:-mt-94"
      />
    </div>

  </div>
</section>

      {/* KITS E INSCRIÇÕES */}
      <section id="inscricoes" className="py-20 bg-[#FFE66D]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-black text-center text-[#00B8D4] mb-12">KITS E INSCRIÇÕES</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Kit 1 */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition">
              <div className="bg-[#00B8D4] text-white py-4 text-center">
                <h3 className="text-2xl font-black">KIT BÁSICO</h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-5xl font-black text-[#E53935]">R$ 80</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2">✓</span>
                    <span>Camisa oficial do evento</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2">✓</span>
                    <span>Número de peito</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2">✓</span>
                    <span>Chip de cronometragem</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2">✓</span>
                    <span>Medalha de participação</span>
                  </li>
                </ul>
                <button className="w-full bg-[#E53935] text-white py-3 rounded-md font-bold hover:bg-[#c62828] transition">
                  COMPRAR AGORA
                </button>
              </div>
            </div>

            {/* Kit 2 */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition border-4 border-[#E53935]">
              <div className="bg-[#E53935] text-white py-4 text-center relative">
                <div className="absolute -top-3 right-4 bg-[#FFE66D] text-[#E53935] px-3 py-1 rounded-full text-sm font-black">
                  POPULAR
                </div>
                <h3 className="text-2xl font-black">KIT PREMIUM</h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-5xl font-black text-[#E53935]">R$ 130</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#E53935] mr-2">✓</span>
                    <span className="font-semibold">Tudo do Kit Básico +</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#E53935] mr-2">✓</span>
                    <span>Boné exclusivo</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#E53935] mr-2">✓</span>
                    <span>Mochila saco</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#E53935] mr-2">✓</span>
                    <span>Kit lanche</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#E53935] mr-2">✓</span>
                    <span>Acesso VIP à área de largada</span>
                  </li>
                </ul>
                <button className="w-full bg-[#E53935] text-white py-3 rounded-md font-bold hover:bg-[#c62828] transition">
                  COMPRAR AGORA
                </button>
              </div>
            </div>

            {/* Kit 3 */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition">
              <div className="bg-[#00B8D4] text-white py-4 text-center">
                <h3 className="text-2xl font-black">KIT VIP</h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-5xl font-black text-[#E53935]">R$ 200</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2">✓</span>
                    <span className="font-semibold">Tudo do Kit Premium +</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2">✓</span>
                    <span>Segunda camisa exclusiva</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2">✓</span>
                    <span>Garrafinha térmica</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2">✓</span>
                    <span>Toalha de microfibra</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2">✓</span>
                    <span>Foto profissional</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#00B8D4] mr-2">✓</span>
                    <span>Massagem pós-corrida</span>
                  </li>
                </ul>
                <button className="w-full bg-[#E53935] text-white py-3 rounded-md font-bold hover:bg-[#c62828] transition">
                  COMPRAR AGORA
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERCURSO */}
      <section id="percurso" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-black text-center text-[#00B8D4] mb-12">PERCURSO</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#FFE66D] p-8 rounded-lg shadow-lg">
              <h3 className="text-3xl font-black text-[#E53935] mb-4">🏃‍♂️ 5KM</h3>
              <p className="text-lg mb-4">Percurso perfeito para iniciantes e famílias! Corrida ou caminhada permitida.</p>
              <ul className="space-y-2">
                <li>✓ Largada às 08:00</li>
                <li>✓ Percurso plano</li>
                <li>✓ Pontos de hidratação</li>
              </ul>
            </div>

            <div className="bg-[#FFE66D] p-8 rounded-lg shadow-lg">
              <h3 className="text-3xl font-black text-[#E53935] mb-4">🏃‍♀️ 10KM</h3>
              <p className="text-lg mb-4">Para os corredores mais experientes! Desafio e diversão garantidos.</p>
              <ul className="space-y-2">
                <li>✓ Largada às 08:30</li>
                <li>✓ Percurso misto</li>
                <li>✓ Cronometragem oficial</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-gray-100 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-center mb-4">📍 MAPA DO PERCURSO</h3>
            <div className="bg-gray-300 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-600 text-lg">Mapa será divulgado em breve</p>
            </div>
          </div>
        </div>
      </section>

      {/* REGRAS E INFORMAÇÕES */}
      <section id="informacoes" className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-black text-center text-[#00B8D4] mb-12">REGRAS E INFORMAÇÕES</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-[#E53935] mb-4">📋 REGULAMENTO</h3>
              <ul className="space-y-3">
                <li>• Idade mínima: 16 anos (5km) / 18 anos (10km)</li>
                <li>• Uso obrigatório do número de peito</li>
                <li>• Menores devem estar acompanhados</li>
                <li>• Atestado médico recomendado</li>
                <li>• Não é permitido uso de bicicletas</li>
                <li>• Animais de estimação não são permitidos</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-[#E53935] mb-4">🎒 O QUE LEVAR</h3>
              <ul className="space-y-3">
                <li>• Documento de identidade original</li>
                <li>• Roupas e tênis confortáveis</li>
                <li>• Protetor solar</li>
                <li>• Boné ou viseira</li>
                <li>• Garrafinha de água</li>
                <li>• Muita energia e bom humor!</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-[#FFE66D] p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-[#E53935] mb-4">🏆 CATEGORIAS</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-bold mb-2">MASCULINO</h4>
                <ul className="text-sm space-y-1">
                  <li>• 16-29 anos</li>
                  <li>• 30-39 anos</li>
                  <li>• 40-49 anos</li>
                  <li>• 50+ anos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">FEMININO</h4>
                <ul className="text-sm space-y-1">
                  <li>• 16-29 anos</li>
                  <li>• 30-39 anos</li>
                  <li>• 40-49 anos</li>
                  <li>• 50+ anos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">ESPECIAL</h4>
                <ul className="text-sm space-y-1">
                  <li>• PCD</li>
                  <li>• Equipes</li>
                  <li>• Geral</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PATROCINADORES */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-5xl font-black text-center text-[#00B8D4] mb-12">PATROCINADORES</h2>
          
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center text-[#E53935] mb-6">PATROCÍNIO MASTER</h3>
            <div className="flex justify-center">
              <div className="bg-gray-100 w-64 h-32 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-gray-400">Logo Patrocinador</span>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-center text-[#00B8D4] mb-6">PATROCÍNIO OURO</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 h-24 rounded-lg flex items-center justify-center shadow">
                  <span className="text-gray-400 text-sm">Logo</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-center text-[#00B8D4] mb-6">APOIO</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 h-20 rounded-lg flex items-center justify-center shadow">
                  <span className="text-gray-400 text-xs">Logo</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-4">Quer ser um patrocinador?</p>
            <button className="bg-[#E53935] text-white px-8 py-3 rounded-md font-bold hover:bg-[#c62828] transition">
              ENTRE EM CONTATO
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#FFE66D]">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl font-black text-center text-[#00B8D4] mb-12">DÚVIDAS FREQUENTES</h2>
          
          <div className="space-y-4">
            <details className="bg-white p-6 rounded-lg shadow-lg">
              <summary className="font-bold text-lg cursor-pointer text-[#E53935]">
                Como faço para me inscrever?
              </summary>
              <p className="mt-4 text-gray-700">
                Basta escolher seu kit acima e clicar em "Comprar Agora". Você será direcionado para o sistema de pagamento seguro.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg shadow-lg">
              <summary className="font-bold text-lg cursor-pointer text-[#E53935]">
                Posso retirar o kit no dia do evento?
              </summary>
              <p className="mt-4 text-gray-700">
                Sim! Haverá retirada de kits no dia do evento a partir das 06:30. Recomendamos chegar com antecedência.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg shadow-lg">
              <summary className="font-bold text-lg cursor-pointer text-[#E53935]">
                Crianças podem participar?
              </summary>
              <p className="mt-4 text-gray-700">
                Sim! Menores de 18 anos podem participar do percurso de 5km acompanhados de um responsável.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg shadow-lg">
              <summary className="font-bold text-lg cursor-pointer text-[#E53935]">
                O que acontece em caso de chuva?
              </summary>
              <p className="mt-4 text-gray-700">
                O evento acontece com chuva ou sol! Só será adiado em casos de condições climáticas extremas.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-[#FFE66D] mb-4">TODO MUNDO CORRE COM O CHRIS</h3>
              <p className="text-gray-400">
                A corrida mais divertida e nostálgica do ano!
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">CONTATO</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 contato@corridachris.com.br</li>
                <li>📱 (31) 99999-9999</li>
                <li>📍 Betim, Minas Gerais</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">REDES SOCIAIS</h4>
              <div className="flex gap-4">
                <button className="bg-[#E53935] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#c62828] transition">
                  f
                </button>
                <button className="bg-[#E53935] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#c62828] transition">
                  📷
                </button>
                <button className="bg-[#E53935] w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#c62828] transition">
                  🐦
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Todo Mundo Corre com o Chris. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
