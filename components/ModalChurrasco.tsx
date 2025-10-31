import { useState } from 'react';
import { X, Clock, MapPin, Check, UtensilsCrossed } from 'lucide-react';
import { Button } from "@/components/ui/button"

export default function ModalChurrasco() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* CARD DO CHURRASCO COM BOTÃO SAIBA MAIS */}
      <div className="bg-gradient-to-br from-[#E53935] via-[#d32f2f] to-[#c62828] p-6 sm:p-8 rounded-xl shadow-2xl text-white relative overflow-hidden">
        {/* Efeito de brilho */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Título */}
          <h4 className="text-2xl sm:text-3xl font-black text-center mb-3 flex items-center justify-center gap-2">
            <span className="text-3xl">🍖</span>
            ALMOÇO COM CHURRASCO
          </h4>

          {/* Descrição */}
          <p className="text-center text-base sm:text-lg font-semibold text-[#FFE66D] mb-4">
            Self-Service à vontade com churrasco e sobremesas!
          </p>

          {/* Linha divisória */}
          <div className="w-20 h-1 bg-[#FFE66D] mx-auto mb-4 rounded-full"></div>

          {/* Preço */}
          <div className="text-center mb-4">
            <p className="text-sm sm:text-base mb-2">Adicione por apenas:</p>
            <div className="inline-block bg-white/20 backdrop-blur px-6 py-3 rounded-lg border-2 border-[#FFE66D]">
              <p className="text-3xl sm:text-4xl font-black text-[#FFE66D]">R$ 35,90</p>
            </div>
          </div>

          {/* Aviso de vagas */}
          <div className="bg-[#FFE66D]/20 backdrop-blur px-4 py-3 rounded-lg border border-[#FFE66D]/50 mb-4">
            <p className="text-sm sm:text-base font-bold text-center flex items-center justify-center gap-2">
              <span className="text-lg">⚠️</span>
              LIMITADO A 200 VAGAS
            </p>
          </div>

          {/* Botão SAIBA MAIS */}
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-[#FFE66D] text-[#E53935] py-3 px-6 rounded-lg font-black text-base sm:text-lg hover:bg-[#ffd700] transition-all transform hover:scale-105 shadow-lg mb-3"
          >
            SAIBA MAIS
          </button>

          {/* Instrução */}
          <p className="text-xs sm:text-sm text-center text-white/90">
            💡 Marque a opção durante sua inscrição
          </p>
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">

              {/* Header */}
              <div className="bg-gradient-to-r from-[#E53935] to-[#c62828] text-white p-6 sm:p-8 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-lg">
                    <UtensilsCrossed className="w-6 h-6 text-[#E53935]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">ALMOÇO COM CHURRASCO</h2>
                    <p className="text-white/90 font-semibold text-sm">
                      Self-Service à vontade para recarregar as energias!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Conteúdo com Scroll */}
              <div className="overflow-y-auto p-6 flex-1">
                <div className="space-y-6">

                  {/* Galeria de Fotos */}
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-200 rounded-xl overflow-hidden h-48 sm:h-64 flex items-center justify-center">
                        <img src="/churrasco.jpeg" alt="Churrasco" className="w-full h-full object-cover" />
                      </div>
                      <div className="bg-gray-200 rounded-xl overflow-hidden h-48 sm:h-64 flex items-center justify-center">
                        <img src="/almoco.jpeg" alt="Buffet" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* O que está incluído */}
                  <div className="bg-gradient-to-br from-[#E53935] to-[#c62828] text-white p-6 rounded-xl">
                    <h3 className="text-2xl font-black mb-4 text-center">🍖 O QUE ESTÁ INCLUSO?</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-[#FFE66D]" />
                        <span className="font-semibold">Churrasco (carnes variadas)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-[#FFE66D]" />
                        <span className="font-semibold">Saladas variadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-[#FFE66D]" />
                        <span className="font-semibold">Buffet completo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-[#FFE66D]" />
                        <span className="font-semibold">Sobremesas</span>
                      </div>
                    </div>
                    {/* Aviso sobre bebidas */}
                    <div className="mt-4 pt-4 border-t border-white/30">
                      <p className="text-center text-sm">
                        <strong>⚠️ IMPORTANTE:</strong> Bebidas não estão incluídas e serão cobradas à parte.
                      </p>
                    </div>
                  </div>

                  {/* Preço e CTA */}
                  <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd700] p-6 rounded-xl text-center relative overflow-hidden">
                    {/* Imagem no canto direito */}
                    <img
                      src="/julius-prato.png"
                      alt="Decoração"
                      className="absolute right-0 top-0 h-full w-auto  object-cover"
                      style={{ maxWidth: '40%' }}
                    />

                    {/* Conteúdo com z-index para ficar acima da imagem */}
                    <div className="relative z-10">
                      <p className="text-xl font-bold text-gray-800 mb-3">
                        Adicione por apenas:
                      </p>
                      <p className="text-5xl font-black text-[#E53935] mb-4">
                        R$ 35,90
                      </p>
                      <p className="text-base text-gray-800 font-semibold mb-4">
                        ⚠️ LIMITADO A APENAS 200 VAGAS
                      </p>
                      <p className="text-sm text-gray-700">
                        💡 Marque a opção durante sua inscrição para garantir!
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer VERMELHO com botão AMARELO */}
              <div className="bg-[#E53935] p-4 rounded-b-2xl flex justify-end">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-[#FFE66D] text-[#E53935] hover:bg-[#ffd93d] font-black px-4 py-3 text-lg shadow-lg hover:scale-105 transition-all"
                >
                  FECHAR
                </Button>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}