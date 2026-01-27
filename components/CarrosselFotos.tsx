'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 📸 TIPOS
interface Foto {
  id: number;
  src: string;
  alt: string;
  legenda: string;
}

const FOTOS: Foto[] = [
  {
    id: 1,
    src: '/fotos/foto1.jpeg',
    alt: '',
    legenda: ''
  },
  {
    id: 2,
    src: '/fotos/foto2.jpeg',
    alt: '',
    legenda: ''
  },
  {
    id: 3,
    src: '/fotos/foto3.jpeg',
    alt: '',
    legenda: ''
  },
  {
    id: 4,
    src: '/fotos/foto4.jpeg',
    alt: '',
    legenda: ''
  },
  {
    id: 5,
    src: '/fotos/foto5.jpg',
    alt: '',
    legenda: ''
  },
  {
    id: 6,
    src: '/fotos/foto6.jpeg',
    alt: '',
    legenda: ''
  },
  {
    id: 7,
    src: '/fotos/foto7.jpeg',
    alt: '',
    legenda: ''
  },
  {
    id: 8,
    src: '/fotos/foto8.jpeg',
    alt: '',
    legenda: ''
  },
  {
    id: 9,
    src: '/fotos/foto9.jpeg',
    alt: '',
    legenda: ''
  },
  {
    id: 10,
    src: '/fotos/foto10.jpg',
    alt: '',
    legenda: ''
  },
  {
    id: 11,
    src: '/fotos/foto11.jpg',
    alt: '',
    legenda: ''
  },
  {
    id: 12,
    src: '/fotos/foto12.jpg',
    alt: '',
    legenda: ''
  },
  {
    id: 13,
    src: '/fotos/foto13.jpg',
    alt: '',
    legenda: ''
  },
  {
    id: 14,
    src: '/fotos/foto14.jpg',
    alt: '',
    legenda: ''
  },
  {
    id: 15,
    src: '/fotos/foto15.jpg',
    alt: '',
    legenda: ''
  },
  {
    id: 16,
    src: '/fotos/foto16.jpg',
    alt: '',
    legenda: ''
  },
  {
    id: 17,
    src: '/fotos/foto17.jpg',
    alt: '',
    legenda: ''
  },
  {
    id: 18,
    src: '/fotos/foto18.jpg',
    alt: '',
    legenda: ''
  },
  {
    id: 19,
    src: '/fotos/foto19.jpg',
    alt: '',
    legenda: ''
  },
  {
    id: 20,
    src: '/fotos/foto20.jpg',
    alt: '',
    legenda: ''
  },
];

export default function CarrosselFotos() {
  const [fotoAtual, setFotoAtual] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // ⏱️ AUTOPLAY (troca a cada 5 segundos)
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      proximaFoto();
    }, 5000);

    return () => clearInterval(interval);
  }, [fotoAtual, autoplay]);

  const proximaFoto = () => {
    setFotoAtual((atual) => (atual + 1) % FOTOS.length);
  };

  const fotoAnterior = () => {
    setFotoAtual((atual) => (atual - 1 + FOTOS.length) % FOTOS.length);
  };

  const irParaFoto = (index: number) => {
    setFotoAtual(index);
    setAutoplay(false); // Para o autoplay quando clica manualmente
  };

  return (
    <section id="momentos" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#FFE66D] via-[#ffd93d] to-[#FFE66D]">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* 📸 TÍTULO */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-[#E53935] mb-8 sm:mb-12">
          📸 MOMENTOS DA CORRIDA
        </h2>

        {/* 🎠 CARROSSEL - SEM FUNDOS */}
        <div className="relative">
          
          {/* 🖼️ FOTO PRINCIPAL - MAIOR E SOLTA */}
          <div className="relative">
            <div 
              className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
              style={{ maxHeight: '700px' }}
            >
              <img
                src={FOTOS[fotoAtual].src}
                alt={FOTOS[fotoAtual].alt}
                className="w-full h-full object-contain transition-all duration-500"
                style={{ maxHeight: '700px' }}
                onError={(e) => {
                  // Fallback se a imagem não carregar
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23ddd" width="800" height="450"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="40" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImagem não encontrada%3C/text%3E%3C/svg%3E';
                }}
              />
              
              {/* OVERLAY COM GRADIENTE NA PARTE INFERIOR */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* 💬 LEGENDA */}
            <div className="absolute bottom-8 left-8 right-8 sm:bottom-12 sm:left-12 sm:right-12 z-10">
              <p className="text-white text-lg sm:text-xl md:text-2xl font-black drop-shadow-lg">
                {FOTOS[fotoAtual].legenda}
              </p>
            </div>
          </div>

          {/* ◀️ BOTÃO ANTERIOR */}
          <button
            onClick={fotoAnterior}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-[#E53935] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-[#c62828] hover:scale-110 transition-all z-20 border-4 border-white"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* ▶️ BOTÃO PRÓXIMA */}
          <button
            onClick={proximaFoto}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-[#E53935] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-[#c62828] hover:scale-110 transition-all z-20 border-4 border-white"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        {/* ⚫ INDICADORES (DOTS) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
          {FOTOS.map((foto, index) => (
            <button
              key={foto.id}
              onClick={() => irParaFoto(index)}
              className={`transition-all duration-300 rounded-full ${
                index === fotoAtual
                  ? 'w-12 sm:w-16 h-3 sm:h-4 bg-[#E53935] scale-110'
                  : 'w-3 sm:w-4 h-3 sm:h-4 bg-white border-2 border-[#E53935] hover:bg-[#E53935]/50'
              }`}
              aria-label={`Ir para foto ${index + 1}`}
            />
          ))}
        </div>

        {/* 🔢 CONTADOR */}
        <div className="text-center mt-4">
          <p className="text-[#E53935] font-bold text-lg">
            {fotoAtual + 1} / {FOTOS.length}
          </p>
        </div>

        {/* ⏯️ CONTROLE DE AUTOPLAY (OPCIONAL) */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setAutoplay(!autoplay)}
            className="bg-white text-[#E53935] px-6 py-3 rounded-full font-bold border-4 border-[#E53935] hover:bg-[#E53935] hover:text-white transition-all shadow-lg"
          >
            {autoplay ? '⏸️ Pausar' : '▶️ Continuar'}
          </button>
        </div>
      </div>
    </section>
  );
}