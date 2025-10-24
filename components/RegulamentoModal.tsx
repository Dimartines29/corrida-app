// components/RegulamentoModal.tsx
"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { FileText, X } from 'lucide-react'

export function RegulamentoModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* BOTÃO - SEMPRE VISÍVEL */}
      <button
        onClick={() => setOpen(true)}
        className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg transition-colors"
      >
        Regulamento
      </button>

      {/* MODAL - SÓ APARECE QUANDO OPEN === TRUE */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="bg-[#E53935] p-6 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-[#E53935]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">REGULAMENTO OFICIAL</h2>
                    <p className="text-white/90 font-semibold text-sm">
                      Todo Mundo Corre com o Chris - 25 de Janeiro de 2025
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Conteúdo com Scroll - BARRA BRANCA */}
              <div 
                className="overflow-y-auto p-6 flex-1"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'white #E53935'
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    width: 12px;
                  }
                  div::-webkit-scrollbar-track {
                    background: #E53935;
                    border-radius: 10px;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: white;
                    border-radius: 10px;
                    border: 2px solid #E53935;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: #FFE66D;
                  }
                `}</style>

                <div className="space-y-6 text-gray-800">
                  {/* 1 - A COMPETIÇÃO */}
                  <section>
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">1</span>
                      A COMPETIÇÃO
                    </h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <p><strong>1.1)</strong> O Evento Esportivo "TODO MUNDO CORRE COM O CHRIS", doravante denominada EVENTO, será realizado no Monte Carmo Shopping e imediações, em Betim, no dia <strong>25 de janeiro de 2025</strong>, em qualquer condição climática, com participação de pessoas, homens ou mulheres devidamente inscritas, doravante denominadas ATLETAS.</p>
                      <p><strong>1.2)</strong> O EVENTO é composto pela realização de 3 modalidades de pedestrianismo independentes: Corrida de 10 km, Corrida de 6 km e caminhada de 3 km.</p>
                      <p><strong>1.3)</strong> O EVENTO é de realização do THE CHRIS GASTROBAR e organização da V.A GESTÃO ESPORTIVA.</p>
                      <p><strong>1.4)</strong> O EVENTO terá LARGADAS e CHEGADAS no estacionamento do Monte Carmo Shopping, localizado no Bairro Ingá Alto, conforme percursos e distâncias detalhados em mapas divulgados no site do evento.</p>
                    </div>
                  </section>

                  {/* 2 - CRONOGRAMA */}
                  <section className="bg-[#FFE66D]/20 p-4 rounded-xl">
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">2</span>
                      CRONOGRAMA
                    </h2>
                    <div className="space-y-2 text-sm font-semibold">
                      <p>🕖 <strong>07h00</strong> – Abertura da Arena</p>
                      <p>🤸 <strong>07h30</strong> – Alongamento</p>
                      <p>🏃 <strong>07h45</strong> – Largada Corrida de 10 km</p>
                      <p>🏃 <strong>07h55</strong> – Largada Corrida de 6 km</p>
                      <p>🚶 <strong>08h05</strong> – Largada Caminhada de 3 km</p>
                      <p>🎤 <strong>09h30</strong> – Início do show</p>
                      <p>🏆 <strong>10h30</strong> – Início da Cerimônia de Premiação</p>
                      <p>🎁 <strong>11h00</strong> – Sorteio de Brindes</p>
                      <p>🏁 <strong>12h00</strong> – Término do Evento</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-3"><strong>2.1)</strong> Os horários e distâncias citados acima poderão variar por necessidades técnicas.</p>
                  </section>

                  {/* 3 - REGRAS GERAIS */}
                  <section>
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">3</span>
                      REGRAS GERAIS DO EVENTO
                    </h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <p><strong>3.1)</strong> Ao participar deste EVENTO, o ATLETA assume total responsabilidade pelos dados fornecidos, aceita e acata totalmente o REGULAMENTO e suas regras, assume as despesas de transporte, hospedagem e alimentação, seguros e quaisquer outras despesas necessárias ou provenientes da sua participação antes, durante e depois do EVENTO.</p>
                      <p><strong>3.2)</strong> Ao participar deste EVENTO, o ATLETA cede todos os direitos de utilização de sua imagem, inclusive direito de arena.</p>
                      <p><strong>3.3)</strong> Haverá, para atendimento emergencial aos atletas, um serviço de apoio médico com ambulância para prestar o 1º atendimento e eventuais remoções.</p>
                      <p><strong>3.10)</strong> Ao se inscrever para o EVENTO o atleta assume o compromisso e a responsabilidade de ter feito rigorosa avaliação médica, inclusive a realização de teste ergométrico prévio, exames médicos e avaliações físicas pertinentes com profissionais competentes da área da saúde e declara estar apto e autorizado para competir.</p>
                    </div>
                  </section>

                  {/* 4 - INSCRIÇÕES */}
                  <section className="bg-[#00B8D4]/10 p-4 rounded-xl">
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">4</span>
                      INSCRIÇÕES, VALORES E PRAZOS
                    </h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <p><strong>4.1)</strong> As inscrições poderão ser feitas Online no site do evento.</p>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="font-bold text-[#E53935] mb-2">💰 VALORES - Público Geral:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• <strong>1º Lote</strong> – R$ 100,00 até 30/11/2025</li>
                          <li>• <strong>2º Lote</strong> – R$ 115,00 até 31/12/2025</li>
                          <li>• <strong>3º Lote</strong> – R$ 130,00 até 23/01/2026 (ou enquanto houver vagas)</li>
                        </ul>
                      </div>
                      <p><strong>4.4.1)</strong> Aos ATLETAS com idade igual ou acima de 60 anos, o desconto de 50% no valor da inscrição. Para fazer jus ao benefício, entre em contato pelo e-mail studiobravo0@gmail.com.</p>
                      <p><strong>4.4.2)</strong> Aos ATLETAS Portadores de Deficiência o desconto de 50% no valor da inscrição. Para fazer jus ao benefício, entre em contato pelo e-mail studiobravo0@gmail.com.</p>
                      <p><strong>4.9)</strong> A inscrição é de forma pessoal e intransferível, não havendo possibilidade de transferência desta inscrição para outro ATLETA, bem como reembolso do valor da inscrição com antecedência inferior a 30 dias da realização da prova.</p>
                    </div>
                  </section>

                  {/* 5 - KIT DE PARTICIPAÇÃO */}
                  <section>
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">5</span>
                      KIT DE PARTICIPAÇÃO
                    </h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <p><strong>5.2)</strong> O Kit de Participação do evento somente será entregue aos ATLETAS regularmente inscritos.</p>
                      <p><strong>5.3)</strong> O tamanho da camiseta deverá ser escolhido no ato da inscrição.</p>
                      <p><strong>5.4)</strong> Não haverá entrega de kit de participação no dia do evento, nem após o mesmo.</p>
                      <p><strong>5.7)</strong> Para retirar o Kit do ATLETA, é necessário apresentar Documento de Identidade com foto original (RG ou Carteira de Motorista), COMPROVANTE DE PAGAMENTO ou o BOLETO BANCÁRIO pago.</p>
                    </div>
                  </section>

                  {/* 6 - REGULAMENTO ESPECÍFICO */}
                  <section className="bg-[#FFE66D]/20 p-4 rounded-xl">
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">6</span>
                      REGULAMENTO ESPECÍFICO DA CORRIDA E DA CAMINHADA
                    </h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <div className="bg-white p-3 rounded-lg">
                        <p className="font-bold text-[#00B8D4] mb-2">📏 Modalidades:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• <strong>CORRIDA 10 KM</strong></li>
                          <li>• <strong>CORRIDA 06 KM</strong></li>
                          <li>• <strong>CAMINHADA 03 KM</strong></li>
                        </ul>
                      </div>
                      <p><strong>6.2)</strong> Os competidores deverão manter durante todo o tempo uma conduta desportiva, ser responsáveis pela sua própria segurança e a segurança de outros.</p>
                      <p><strong>6.6)</strong> Todos os atletas da CORRIDA e da CAMINHADA que completarem os percursos corretamente receberão ao final do evento uma medalha de participação. Os 3 primeiros colocados no geral masculino e no geral feminino na competição de 10 KM receberão um troféu ou medalha especial cada.</p>
                      <p><strong>6.7)</strong> A idade mínima exigida para a participação nos eventos é de 14 anos e será válida a idade que o ATLETA terá em 31 de dezembro de 2026.</p>
                    </div>
                  </section>

                  {/* 7 - TERMO DE RESPONSABILIDADE */}
                  <section className="bg-red-50 border-2 border-red-200 p-4 rounded-xl">
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#E53935] text-white px-3 py-1 rounded-lg">7</span>
                      TERMO DE RESPONSABILIDADE
                    </h2>
                    <div className="text-sm leading-relaxed">
                      <p className="font-bold mb-2">IMPORTANTE: ao se inscrever, todo ATLETA declara automaticamente que está de acordo com o termo de responsabilidade:</p>
                      <p className="italic">"Declaro que assumo total responsabilidade pelos dados fornecidos, aceito e acato totalmente o REGULAMENTO e suas regras, assumo as despesas de transporte, hospedagem e alimentação, seguros e quaisquer outras despesas necessárias ou provenientes da minha participação antes, durante e depois do EVENTO, e isento de qualquer responsabilidade os Organizadores, Patrocinadores e Realizadores, em meu nome e de meus sucessores. Assumo o compromisso e a responsabilidade de ter feito rigorosa avaliação médica, inclusive a realização de teste ergométrico prévio, exames médicos e avaliações físicas pertinentes com profissionais competentes da área da saúde e declara estar apto e autorizado para competir."</p>
                    </div>
                  </section>

                  {/* 8 - CONSIDERAÇÕES FINAIS */}
                  <section>
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">8</span>
                      CONSIDERAÇÕES FINAIS
                    </h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <p><strong>8.1)</strong> Dúvidas e informações técnicas serão esclarecidas com a ORGANIZAÇÃO, através do "Fale Conosco" no site do EVENTO.</p>
                      <p><strong>8.2)</strong> A ORGANIZAÇÃO poderá, a seu critério ou conforme as necessidades do EVENTO, incluir ou alterar este REGULAMENTO, total ou parcialmente.</p>
                    </div>
                  </section>

                  {/* Contato */}
                  <section className="bg-[#00B8D4]/10 p-4 rounded-xl text-center">
                    <p className="font-bold text-[#E53935] text-base mb-2">📧 Dúvidas?</p>
                    <p className="text-sm">Entre em contato: <a href="mailto:studiobravo0@gmail.com" className="text-[#00B8D4] font-bold hover:underline">studiobravo0@gmail.com</a></p>
                  </section>
                </div>
              </div>

              {/* Footer VERMELHO com bordas arredondadas + Botão AMARELO */}
              <div className="bg-[#E53935] p-4 rounded-b-2xl flex justify-end">
                <Button 
                  onClick={() => setOpen(false)}
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
  )
}