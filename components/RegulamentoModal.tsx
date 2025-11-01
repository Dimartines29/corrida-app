// components/RegulamentoModal.tsx
"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { FileText, X } from 'lucide-react'

export function RegulamentoModal({origin}: {origin: string} ) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* BOTÃO - SEMPRE VISÍVEL */}
      {origin === 'mobile' ? (
        <Button
          onClick={() => setOpen(true)}
          className=" w-full text-[#E53935] font-semibold"
        >
          Regulamento
        </Button>

      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="text-[#E53935] bg-transparent font-bold text-base xl:text-lg"
        >
          Regulamento
        </Button>
      )}

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
                      Todo Mundo Corre com o Chris - 25 de Janeiro de 2026
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setOpen(false)}
                  className="bg-[#FFE66D] text-[#E53935] hover:bg-[#ffd93d] font-black px-4 py-3 text-lg shadow-lg hover:scale-105 transition-all"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Conteúdo com Scroll - BARRA BRANCA */}
              <div className="overflow-y-auto p-6 flex-1">

                <div className="space-y-6 text-gray-800">
                  {/* 1 - A COMPETIÇÃO */}
                  <section>
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">1</span>
                      A COMPETIÇÃO
                    </h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <p><strong>1.1</strong> O Evento Esportivo TODO MUNDO CORRE COM O CHRIS, doravante denominada EVENTO, será realizado no Monte Carmo Shopping e imediações, em Betim, no dia <strong>25 de janeiro de 2026</strong>, em qualquer condição climática, com participação de pessoas, homens ou mulheres devidamente inscritas, doravante denominadas ATLETAS.</p>
                      <p><strong>1.2</strong> O EVENTO é composto pela realização de 3 modalidades de pedestrianismo independentes: Corrida de 10 km, Corrida de 6 km e caminhada de 3 km.</p>
                      <p><strong>1.3</strong> O EVENTO é de realização do THE CHRIS GASTROBAR e organização da V.A GESTÃO ESPORTIVA.</p>
                      <p><strong>1.4</strong> O EVENTO terá LARGADAS e CHEGADAS no estacionamento do Monte Carmo Shopping, localizado no Bairro Ingá Alto, conforme percursos e distâncias detalhados em mapas divulgados no site do evento.</p>
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
                    <p className="text-xs text-gray-600 mt-3"><strong>2.1</strong> Os horários e distâncias citados acima poderão variar por necessidades técnicas.</p>
                  </section>

                  {/* 3 - REGRAS GERAIS */}
                  <section>
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">3</span>
                      REGRAS GERAIS DO EVENTO
                    </h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <p><strong>3.1</strong> Ao participar deste EVENTO, o ATLETA assume total responsabilidade pelos dados fornecidos, aceita e acata totalmente o REGULAMENTO e suas regras, assume as despesas de transporte, hospedagem e alimentação, seguros e quaisquer outras despesas necessárias ou provenientes da sua participação antes, durante e depois do EVENTO. É de responsabilidade do ATLETA cadastrar um e-mail válido no ato de sua inscrição, ler os informativos enviados ao seu endereço eletrônico e acessar com frequência o site do evento para verificar possíveis modificações deste regulamento, notícias e informações para sua participação na prova.</p>
                      <p><strong>3.2</strong> Ao participar deste EVENTO, o ATLETA cede todos os direitos de utilização de sua imagem, inclusive direito de arena, renunciando ao recebimento de qualquer renda que vier a ser auferida com direitos a televisão ou qualquer outro tipo de transmissão e/ ou divulgação, promoções, Internet e qualquer mídia em qualquer tempo.</p>
                      <p><strong>3.3</strong> Haverá, para atendimento emergencial aos atletas, um serviço de apoio médico com ambulância para prestar o 1º atendimento e eventuais remoções. A continuidade do atendimento médico propriamente dito tanto de emergência como de qualquer outra necessidade será efetuado na REDE PÚBLICA sob responsabilidade desta. A ORGANIZAÇÃO não tem responsabilidade sobre as despesas médicas que o atleta venha a ter durante ou após a prova.</p>
                      <p><strong>3.4</strong> O ATLETA ou seu (sua) acompanhante responsável poderá se decidir por outro sistema de atendimento médico (remoção/transferência, hospital, serviço de emergência e médico entre outros) eximindo a ORGANIZAÇÃO de qualquer responsabilidade, direta ou indireta sobre as consequências desta decisão.</p>
                      <p><strong>3.5</strong> A segurança do EVENTO receberá apoio dos órgãos competentes e haverá monitores para a orientação dos participantes.</p>
                      <p><strong>3.6</strong> Serão colocados à disposição dos ATLETAS inscritos, Sanitários e Guarda-Volumes na regiãoda LARGADA e CHEGADA.</p>
                      <p><strong>3.7</strong> A ORGANIZAÇÃO não recomenda que sejam deixados VALORES no Guarda-Volumes tais como; relógios, roupas ou acessórios de alto valor, equipamentos eletrônicos, de som ou celulares, cheques, cartões de crédito etc.</p>
                      <p><strong>3.8</strong> A ORGANIZAÇÃO não se responsabilizará por qualquer objeto deixado no guarda volumes.</p>
                      <p><strong>3.9</strong> Não haverá reembolso, por parte da ORGANIZAÇÃO, bem como seus PATROCINADORES, APOIADORES E REALIZADORES, de nenhum valor correspondente a equipamentos e/ ou acessórios utilizados pelos ATLETAS no EVENTO, independente de qual for o motivo, nem por qualquer extravio de materiais ou prejuízo que por ventura os ATLETAS venham a sofrer durante a participação do EVENTO.</p>
                      <p><strong>3.10</strong> Ao se inscrever para o EVENTO o atleta assume o compromisso e a responsabilidade de ter feito rigorosa avaliação médica, inclusive a realização de teste ergométrico prévio, exames médicos e avaliações físicas pertinentes com profissionais competentes da área da saúde e declara estar apto e autorizado para competir. O ATLETA assume e expressamente declara que é conhecedor de seu estado de saúde, que tem condições de saúde para participar do EVENTO, quem tem capacidade atlética necessária, e que treinou adequadamente para o EVENTO.</p>
                      <p><strong>3.11</strong> Os acessos às áreas de Concentração e Largada serão sinalizados, sendo proibido pular as grades que delimitam estas áreas sob qualquer pretexto.</p>
                      <p><strong>3.12</strong> O posicionamento escolhido pelo ATLETA nos locais de LARGADA, disponíveis no evento, previstos no regulamento ou disponibilizados pela ORGANIZAÇÃO é de única e exclusiva responsabilidade do mesmo.</p>
                      <p><strong>3.13</strong> O ATLETA deverá observar o trajeto ou percurso balizado para a prova, não sendo permitido qualquer outro meio auxiliar para alcançar qualquer tipo de vantagem ou corte do percurso indicado.</p>
                      <p><strong>3.14</strong> É proibido o auxílio de terceiros bem como o uso de qualquer recurso tecnológico sem prévia autorização, por escrito, da ORGANIZAÇÃO.</p>
                      <p><strong>3.15</strong> A ORGANIZAÇÃO do EVENTO, bem como seus PATROCINADORES, APOIADORES E REALIZADORES, não se responsabilizam por prejuízos ou danos causados pelo ATLETA inscrito no EVENTO, seja ao patrimônio publico, a terceiros ou outros participantes, sendo esses de única e exclusiva responsabilidade do Autor.</p>
                      <p><strong>3.16</strong> Qualquer reclamação sobre o resultado EXTRA OFICIAL da competição deverá ser feita, por escrito, à ORGANIZAÇÃO, em até 30 dias após a primeira publicação do resultado no site do EVENTO.</p>
                      <p><strong>3.17</strong> Poderão os ORGANIZADORES / REALIZADORES suspender o EVENTO, ou partes dele, ou mesmo alterá-lo, por questões de segurança pública, atos públicos, vandalismo e/ ou motivos de força maior.</p>
                      <p><strong>3.18</strong> O ATLETA que em qualquer momento deixe de atender as regras descritas neste REGULAMENTO, que deixe de comunicar (com registro por escrito e devidamente recebido pelos ORGANIZADORES) a ORGANIZAÇÃO qualquer impedimento de sua parte ou que não manter uma conduta educada e esportiva poderá a qualquer tempo ser desclassificado do EVENTO.</p>
                      <p><strong>3.19</strong> Não haverá pagamento de cachê de participação para nenhum ATLETA.</p>
                      <p><strong>3.20</strong> A ORGANIZAÇÃO reserva-se o direito de incluir no EVENTO ATLETAS especialmente convidados.</p>
                      <p><strong>3.21</strong> A ORGANIZAÇÃO se reserva o direito de alterar qualquer dos itens deste regulamento sem aviso prévio, conforme as necessidades do EVENTO informando estas alterações na retirada do Kit.</p>
                    </div>
                  </section>

                  {/* 4 - INSCRIÇÕES */}
                  <section className="bg-[#00B8D4]/10 p-4 rounded-xl">
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">4</span>
                      INSCRIÇÕES, VALORES E PRAZOS
                    </h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <p><strong>4.1</strong> As inscrições poderão ser feitas Online no site do evento (sujeito a cobrança de taxa de conveniência, cobrada pelo prestador do serviço de inscrição online terceirizado) na Internet e também presencialmente em pontos de inscrição a serem informados no site do evento.</p>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="font-bold text-[#E53935] mb-2"><strong>4.2 VALORES - Público Geral:</strong> </p>
                        <ul className="space-y-1 ml-4">
                          <li>• <strong>1º Lote</strong> – R$ 100,00 até 30/11/2025</li>
                          <li>• <strong>2º Lote</strong> – R$ 115,00 até 31/12/2025</li>
                          <li>• <strong>3º Lote</strong> – R$ 130,00 até 23/01/2026 (ou enquanto houver vagas)</li>
                        </ul>
                      </div>
                      <p><strong>4.3</strong> A ORGANIZAÇÃO poderá a qualquer tempo suspender ou prorrogar prazos ou ainda adicionar ou limitar o número de vagas em qualquer das modalidades do EVENTO em função de necessidades, disponibilidades técnicas ou estruturais sem prévio aviso.</p>
                      <p><strong>4.4</strong> Em atenção à Legislação vigente e Termos de Ajustes de Conduta firmados com o Ministério Público, para IDOSOS e PESSOAS COM DEFICIÊNCIA, a ORGANIZAÇÃO disponibilizará:</p>
                      <p><strong>4.4.1</strong> Aos ATLETAS com idade igual ou acima de 60 (sessenta) anos, o desconto de 50% (cinquenta por cento) no valor da inscrição. IMPORTANTE: os atletas acima de 60 anos deverão retirar os itens para a competição pessoalmente, portando documento de identidade, ficando vedada a retirada de KITS por terceiros. Para o idoso para fazer jus ao benefício de 50% (cinquenta) de desconto no valor da inscrição, será necessário entrar em contato pelo e-mail studiobravo0@gmail.com, informar os dados pessoais e enviar digitalizada, uma cópia do documento de identidade com foto (RG ou CNH). Os ATLETAS com idade igual ou acima de 60 (sessenta) anos, que optarem pelo desconto de 50% terão direito ao número de peito e medalha do evento. <br></br><strong>* Parágrafo único.</strong> Os atletas idosos que realizarem a inscrição pelo sistema Online disponível na Internet renunciarão neste ato ao direito do desconto, diante da impossibilidade de comprovação da sua condição de idoso através deste sistema. </p>
                      <p><strong>4.4.2</strong> Aos ATLETAS Portadores de Deficiência o desconto de 50% (cinquenta por cento) no valor da inscrição. IMPORTANTE: os atletas PCD deverão retirar os itens para a competição pessoalmente, portando documento de identidade, ficando vedada a retirada de KITS por terceiros. A pessoa com deficiência visual terá o direito de participar da competição com o auxílio de um atleta-guia. O atleta-guia estará isento do pagamento da taxa de inscrição, mas como é acompanhante do atleta com deficiência visual não receberá nenhum item do kit atleta. Para os atletas PCD fazer jus ao benefício de 50% (cinquenta) de desconto no valor da inscrição, será necessário entrar em contato pelo e-mail studiobravo0@gmail.com, informar os dados pessoais e enviar digitalizada, uma cópia do documento de identidade com foto (RG ou CNH), Certificado da Pessoa com Deficiência ou Laudo médico que comprove sua condição. A pessoa com deficiência visual deverá enviar, ainda, os dados do atleta-guia que o acompanhará na prova. Os ATLETAS PCD, que optarem pelo desconto de 50% terão o direito de camiseta, número de peito e medalha do evento.<br></br><strong>* Parágrafo único.</strong> Os(as) atletas PCD que realizarem a inscrição pelo sistema Online disponível na Internet renunciarão neste ato ao direito do desconto, diante da impossibilidade de comprovação da sua condição de idoso através deste sistema.</p>
                      <p><strong>4.5</strong> Sob nenhuma circunstância serão aceitos como válidos boletos pagos após a data de vencimento.</p>
                      <p><strong>4.6</strong> A inscrição só será considerada efetivada a partir da data da efetivação do PAGAMENTO, e não da data de preenchimento da ficha.</p>
                      <p><strong>4.7</strong> O COMPROVANTE DE PAGAMENTO é um documento único, não tendo a ORGANIZAÇÃO cópia do mesmo.</p>
                      <p><strong>4.8</strong> O ATLETA assume que participa deste EVENTO por livre e espontânea vontade, isentando de qualquer responsabilidade os ORGANIZADORES, REALIZADORES E PATROCINADORES, em seu nome e de seus sucessores.</p>
                      <p><strong>4.9</strong> Ao se inscrever no EVENTO o ATLETA o faz de forma pessoal e intransferível, não havendo possibilidade de transferência desta inscrição para outro ATLETA, bem como reembolso do valor da inscrição com antecedência inferior a 30 (trinta) dias da realização da prova. Caso o ATLETA solicite o reembolso independente do motivo, o mesmo fica ciente que será descontado o valor da taxa do boleto e 30% sobre o valor líquido da inscrição referente a taxa de serviço para administração do processo de reembolso.</p>
                      <p><strong>4.10</strong> Ao se inscrever no EVENTO o ATLETA disponibiliza seus dados e autoriza aos ORGANIZADORES, PATROCINADORES, APOIADORES, REALIZADORES E PARCEIROS, para que a qualquer tempo enviem em seu nome, no endereço eletrônico ou físico (ou qualquer outro fornecido) informativos, mala direta ou qualquer outro tipo de correspondência.</p>
                      <p><strong>4.11</strong> A inscrição de ATLETAS com idade igual ou acima de 60 (sessenta) anos encerra 1 semana antes do evento ou (Enquanto houver vagas).</p>
                      <p><strong>4.12</strong> Para retirar o kit de terceiros temos um limite de 5 kits por pessoa, para a retirada de mais kits o responsável precisa entrar na fila novamente.</p>
                      <p><strong>4.13</strong> A Troca de titularidade só é permitida até 5 dias uteis antes da entrega dos kits, não é permitido a troca de titularidade na entrega dos kits e nem no dia do evento.</p>
                      <p><strong>4.14</strong> A Troca de distância só é permitida até 5 dias uteis antes da entrega dos kits, não é permitido a troca de distância na entrega dos kits e nem no dia do evento.</p>
                    </div>
                  </section>

                  {/* 5 - KIT DE PARTICIPAÇÃO */}
                  <section>
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">5</span>
                      KIT DE PARTICIPAÇÃO
                    </h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <p><strong>5.1</strong> Ao se inscrever e pagar a taxa de inscrição o ATLETA está apenas ativando sua participação e acesso ao EVENTO, bem como o uso da infraestrutura de apoio.</p>
                      <p><strong>5.2</strong> O Kit de Participação do evento somente será entregue aos ATLETAS regularmente inscritos e, portanto, estará vinculado à taxa de inscrição. O Kit tem itens de uso obrigatório conforme o evento ao qual o atleta se inscreveu.</p>
                      <p><strong>5.3</strong> O tamanho da camiseta deverá ser escolhido no ato da inscrição. O atleta com idade superior a 60 anos não tem direito a camiseta.</p>
                      <p><strong>5.4</strong> Não haverá entrega de kit de participação no dia do evento, nem após o mesmo.</p>
                      <p><strong>5.5</strong> A entrega dos KITS aos atletas será feita em local, dias e horários a ser informado no site do evento.</p>
                      <p><strong>5.6</strong> A entrega será para todos os atletas inscritos, em qualquer uma das categorias disponíveis no regulamento da prova sem exceção.</p>
                      <p><strong>5.7</strong> Para retirar o Kit do ATLETA, é necessário apresentar Documento de Identidade com foto original (RG ou Carteira de Motorista), COMPROVANTE DE PAGAMENTO ou o BOLETO BANCÁRIO pago. Esse comprovante será retido na entrega do Kit.</p>
                      <p><strong>5.8</strong> Para terceiros retirarem o kit do ATLETA é necessário os mesmos documentos acima mencionados. Os atletas acima de 60 anos deverão retirar os seu KIT PESSOALMENTE, caso contrário não terão direito ao desconto de 50% no valor da inscrição.</p>
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
                        <p className="font-bold text-[#00B8D4] mb-2"><strong>6.1 Modalidades:</strong></p>
                        <ul className="space-y-1 ml-4">
                          <li>• <strong>CORRIDA 10 KM</strong></li>
                          <li>• <strong>CORRIDA 6 KM</strong></li>
                          <li>• <strong>CAMINHADA 3 KM</strong></li>
                        </ul>
                      </div>
                      <p><strong>6.2</strong> CONDUTA - Os competidores deverão: manter durante todo o tempo uma conduta desportiva; ser responsáveis pela sua própria segurança e a segurança de outros; ser responsáveis pela compreensão e pelo cumprimento deste Regulamento; tratar a todos com respeito e cortesia; não fazer uso da linguagem vulgar ou de baixo calão; em eventual abandono informar à organização.</p>
                      <p><strong>6.3</strong> LARGADA - Na largada o atleta deverá estar posicionado na área de largada de acordo com a orientação do árbitro; se a largada for queimada deverá ser repetido três vezes o sinal sonoro; quando houver uma largada queimada, os atletas deverão retornar ao ponto de partida conforme orientação do árbitro. O atleta que não retornar será desclassificado; o atleta que causar duas queimadas de largada será desclassificado.</p>
                      <p><strong>6.4</strong> CORRIDA - É de responsabilidade do atleta manter-se no percurso; o atleta pode correr ou caminhar não sendo permitido engatinhar ou se arrastar; o atleta não poderá correr com o torso nu; o número de competição deve ser colocado na parte da frente do corpo, entre o peito e a cintura, de forma que fique bem visível; o número fornecido pela organização não pode ser recortado ou sofrer qualquer alteração; qualquer atleta que aparentar perigo para ele mesmo ou outro poderá ser desclassificado e retirado da Competição (Ex.: falta de coordenação motora); não é permitido usar qualquer tipo de equipamento ou acessório que possa colocar em risco outros competidores ou a si próprio (Ex.: fones de ouvido, recipientes de vidro, walkman, jóias e etc.); o atleta não poderá correr acompanhado de pessoa externa a competição; os percursos tem distâncias que podem variar por necessidades técnicas.</p>
                      <p><strong>6.5</strong> CHEGADA - Será considerada a chegada de um atleta quando qualquer parte do seu torso cruzar a linha de chegada; o atleta deverá obrigatoriamente cruzar a linha de chegada entre o pórtico de chegada; ao cruzar a linha de chegada o atleta assume o seu resultado final, não havendo qualquer possibilidade o atleta retornar a competição novamente; o atleta deve manter uma atitude desportiva, não desmerecendo a classificação dos seus adversários; se houver empate na chegada entre dois ou mais atletas a classificação da chegada será decidida pelo Árbitro de Cronometragem, que poderá recorrer aos recursos de foto ou vídeo para dar seu parecer final; a CORRIDA DE 10 KM durará no máximo 1h40 a CORRIDA DE 6 KM durará no máximo 1h20 sendo que a área da linha de Chegada e seus equipamentos e serviços poderão ser desligados e desativados após este período; o ATLETA que não estiver dentro do tempo projetado, em qualquer ponto do percurso, será convidado a retirar-se da competição, finalizando a prova neste ponto, a partir do qual a ORGANIZAÇÃO não será mais responsável por qualquer tipo de serviço ou apoio.</p>
                      <p><strong>6.6</strong> PREMIAÇÃO - Todos os atletas da CORRIDA e da CAMINHADA que completarem os percursos corretamente receberão ao final do evento uma medalha de participação; os 3 primeiros colocados no geral masculino e no geral feminino na competição de 10 KM receberão um troféu ou medalha especial cada; a ORGANIZAÇÃO poderá a seu critério incluir algum tipo de bonificação ou participação especial. A CAMINHADA tem caráter exclusivamente participativo e não terá nenhuma premiação, somente a medalha de participação.</p>
                      <p><strong>6.7</strong> A idade mínima exigida para a participação nos eventos é de 14 anos e será válida a idade que o ATLETA terá em 31 de dezembro de 2026.</p>
                      <p><strong>6.8</strong> O percurso começa e termina no estacionamento do Monte Carmo Shopping. Por questões de segurança exigidas pelo mesmo, não será permitida a participação de pessoas que não estejam devidamente inscritas no EVENTO. A identificação dos atletas será feita pelo número de peito devidamente posicionado e visível na parte da frente da camisa.</p>
                    </div>
                  </section>

                  {/* 7 - TERMO DE RESPONSABILIDADE */}
                  <section className="bg-red-50 border-2 border-red-200 p-4 rounded-xl">
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#E53935] text-white px-3 py-1 rounded-lg">7</span>
                      TERMO DE RESPONSABILIDADE
                    </h2>
                    <div className="text-sm leading-relaxed">
                      <p className="font-bold mb-2">IMPORTANTE: ao se inscrever, todo ATLETA declara automaticamente que está de acordo com o termo de responsabilidade abaixo:</p>
                      <p className="italic">Declaro que assumo total responsabilidade pelos dados fornecidos, aceito e acato totalmente o REGULAMENTO e suas regras, assumo as despesas de transporte, hospedagem e alimentação, seguros e quaisquer outras despesas necessárias ou provenientes da minha participação antes, durante e depois do EVENTO, e isento de qualquer responsabilidade os Organizadores, Patrocinadores e Realizadores, em meu nome e de meus sucessores. Assumo o compromisso e a responsabilidade de ter feito rigorosa avaliação médica, inclusive a realização de teste ergométrico prévio, exames médicos e avaliações físicas pertinentes com profissionais competentes da área da saúde e declara estar apto e autorizado para competir. Assumo e expressamente declaro que sou conhecedor de meu estado de saúde, que tenho condições de saúde para participar do EVENTO, quem tenho capacidade atlética necessária, e que treinei adequadamente para o EVENTO.</p>
                    </div>
                  </section>

                  {/* 8 - CONSIDERAÇÕES FINAIS */}
                  <section>
                    <h2 className="text-xl font-black text-[#E53935] mb-3 flex items-center gap-2">
                      <span className="bg-[#FFE66D] px-3 py-1 rounded-lg">8</span>
                      CONSIDERAÇÕES FINAIS
                    </h2>
                    <div className="space-y-3 text-sm leading-relaxed">
                      <p><strong>8.1</strong> Dúvidas e informações técnicas serão esclarecidas com a ORGANIZAÇÃO, através do Fale Conosco no site do EVENTO.</p>
                      <p><strong>8.2</strong> A ORGANIZAÇÃO poderá, a seu critério ou conforme as necessidades do EVENTO, incluir ou alterar este REGULAMENTO, total ou parcialmente.</p>
                      <p><strong>8.2</strong> As dúvidas ou omissões deste REGULAMENTO serão dirimidas pela Comissão ORGANIZADORA e/ ou pelos ORGANIZADORES / REALIZADORES de forma soberana, não cabendo recurso a estas decisões.</p>
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
