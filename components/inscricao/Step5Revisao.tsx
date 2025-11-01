// Step5Revisao.tsx
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, MapPin, Shirt, Heart, CheckCircle2, AlertCircle, Calendar, Phone, CreditCard, Package, UtensilsCrossed } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

// 💰 VALORES FIXOS
const TAXA_INSCRICAO = 4.00;
const VALOR_ALMOCO = 35.90;

interface Step5Props {
  form: UseFormReturn<InscricaoCompleta>;
}

interface Categoria {
  id: string;
  nome: string;
  descricao: string;
  distancia: number;
}

interface Lote {
  id: string;
  nome: string;
  preco: number;
  dataFim: string;
}

interface Kit {
  id: string;
  nome: string;
  itens: string;
  preco: number;
}

export function Step5Revisao({ form }: Step5Props) {
  const [lote, setLote] = useState<Lote | null>(null);
  const [loading, setLoading] = useState(true);

  const formData = form.getValues();
  const valeAlmoco = formData.valeAlmoco || false;

  // Função para calcular o total
  const calcularTotal = () => {
    if (!lote) return 0;
    let total = lote.preco + TAXA_INSCRICAO;
    if (valeAlmoco) {
      total += VALOR_ALMOCO;
    }
    return total;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lotesRes = await fetch("/api/lotes");
        const lotes = await lotesRes.json();
        const loteSelecionado = Array.isArray(lotes)
          ? lotes.find((l: Lote) => l.id === formData.loteId)
          : undefined;
        setLote(loteSelecionado);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formData.loteId]);

  if (loading) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-[#00B8D4] border-t-transparent"></div>
        <p className="text-gray-600 mt-3 sm:mt-4 font-semibold text-sm sm:text-base">Carregando resumo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3">
          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white">Revisão Final da Inscrição</h3>
            <p className="text-xs sm:text-sm text-white/90">
              Confira todos os dados antes de confirmar o pagamento
            </p>
          </div>
        </div>
      </div>

      {/* Alerta Principal */}
      <Alert className="bg-yellow-50 border-2 border-yellow-400">
        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
        <AlertDescription className="text-sm sm:text-base text-yellow-800 font-semibold">
          ⚠️ Após confirmar, você será redirecionado para o pagamento. Certifique-se de que todos os dados estão corretos, pois não será possível alterá-los posteriormente.
        </AlertDescription>
      </Alert>

      {/* Dados Pessoais */}
      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-[#E53935] p-2 sm:p-3 rounded-lg">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#E53935]">Dados Pessoais</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InfoBox
                label="Nome Completo"
                value={formData.nomeCompleto}
                icon={<User className="w-3 h-3 sm:w-4 sm:h-4 text-[#00B8D4]" />}
              />
              <InfoBox
                label="CPF"
                value={formData.cpf}
                icon={<User className="w-3 h-3 sm:w-4 sm:h-4 text-[#00B8D4]" />}
              />
              <InfoBox
                label="RG"
                value={formData.rg}
                icon={<User className="w-3 h-3 sm:w-4 sm:h-4 text-[#00B8D4]" />}
              />
              <InfoBox
                label="Data de Nascimento"
                value={new Date(formData.dataNascimento).toLocaleDateString("pt-BR")}
                icon={<Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#00B8D4]" />}
              />
              <InfoBox
                label="Telefone"
                value={formData.telefone}
                icon={<Phone className="w-3 h-3 sm:w-4 sm:h-4 text-[#00B8D4]" />}
              />
            </div>

            <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 sm:p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-[#E53935]" />
                </div>
                <h3 className="font-black text-[#E53935] text-base sm:text-lg">ENDEREÇO COMPLETO</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Rua/Endereço */}
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Rua/Avenida
                  </p>
                  <p className="text-sm font-bold text-gray-800">{formData.endereco}</p>
                </div>

                {/* Bairro */}
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Bairro
                  </p>
                  <p className="text-sm font-bold text-gray-800">{formData.bairro}</p>
                </div>

                {/* Cidade */}
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Cidade
                  </p>
                  <p className="text-sm font-bold text-gray-800">{formData.cidade}</p>
                </div>

                {/* Estado */}
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Estado
                  </p>
                  <p className="text-sm font-bold text-gray-800">{formData.estado}</p>
                </div>

                {/* CEP */}
                <div className="bg-white p-3 rounded-lg sm:col-span-2">
                  <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> CEP
                  </p>
                  <p className="text-sm font-bold text-gray-800">{formData.cep}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tamanho da Camisa */}
      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-[#E53935] p-2 sm:p-3 rounded-lg">
              <Shirt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#E53935]">Camisa do Participante</h3>
          </div>

          <div className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] p-4 sm:p-6 rounded-lg">
            <div className="flex items-center gap-4 sm:gap-6 flex-col sm:flex-row text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl sm:text-4xl font-black text-[#00B8D4]">
                  {formData.tamanhoCamisa}
                </span>
              </div>
              <div className="text-white">
                <p className="text-xl sm:text-2xl font-black mb-1">
                  Tamanho {formData.tamanhoCamisa}
                </p>
                <p className="text-xs sm:text-sm text-white/90 font-semibold">
                  Camisa oficial em tecido dry-fit de alta performance
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ficha Médica */}
      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-red-500 p-2 sm:p-3 rounded-lg">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-red-500">Informações Médicas</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className={`p-3 sm:p-4 rounded-lg border-2 ${
              formData.possuiPlanoSaude
                ? "bg-green-50 border-green-400"
                : "bg-gray-50 border-gray-300"
            }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                {formData.possuiPlanoSaude ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                )}
                <div>
                  <p className="font-bold text-gray-800 text-sm sm:text-base">Plano de Saúde</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold">
                    {formData.possuiPlanoSaude ? "Possui plano de saúde" : "Não possui plano de saúde"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-3 sm:p-4 rounded-lg border-2 border-red-300">
              <p className="font-bold text-red-600 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                Contato de Emergência
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <InfoBox
                  label="Nome"
                  value={formData.contatoEmergencia}
                  icon={<User className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />}
                />
                <InfoBox
                  label="Telefone"
                  value={formData.telefoneEmergencia}
                  icon={<Phone className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />}
                />
              </div>
            </div>

            <div className="bg-green-50 p-3 sm:p-4 rounded-lg border-2 border-green-400">
              <div className="flex items-start gap-2 sm:gap-3">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-0.5" />
                <div>
                  <p className="font-black text-green-800 text-sm sm:text-base">
                    Declaração de Saúde Confirmada
                  </p>
                  <p className="text-green-700 text-xs sm:text-sm mt-1 font-semibold">
                    Você declarou estar em boas condições de saúde e apto(a) para participar da corrida
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Pagamento */}
      {lote && (
        <Card className="bg-gradient-to-br from-[#00B8D4] to-[#00a0c0] border-none shadow-2xl">
          <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="bg-white p-2 sm:p-3 rounded-lg">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-[#00B8D4]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Resumo do Pagamento</h3>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Valor do Lote */}
              <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur border-2 border-white/30">
                <div className="flex justify-between items-center text-white mb-2">
                  <span className="font-semibold text-sm sm:text-base">Inscrição - {lote.nome}</span>
                  <span className="font-bold text-lg sm:text-xl">
                    R$ {lote.preco.toFixed(2)}
                  </span>
                </div>
                <span className="text-white/80 text-xs">Inclui todos os itens do kit selecionado</span>
              </div>

              {/* Taxa de Inscrição */}
              <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur border-2 border-white/30">
                <div className="flex justify-between items-center text-white">
                  <div>
                    <span className="font-semibold text-sm sm:text-base block">Taxa de Inscrição</span>
                    <span className="text-white/80 text-xs">Processamento e serviços</span>
                  </div>
                  <span className="font-bold text-lg sm:text-xl">
                    R$ {TAXA_INSCRICAO.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 🆕 Almoço com Churrasco (condicional) */}
              {valeAlmoco && (
                <div className="bg-white/20 p-3 sm:p-4 rounded-lg backdrop-blur border-2 border-white/30">
                  <div className="flex justify-between items-center text-white">
                    <div>
                      <span className="font-semibold text-sm sm:text-base block flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4" />
                        Almoço com Churrasco
                      </span>
                      <span className="text-white/80 text-xs">Self-service à vontade com churrasco e sobremesas!</span>
                    </div>
                    <span className="font-bold text-lg sm:text-xl">
                      R$ {VALOR_ALMOCO.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Linha Divisória */}
              <div className="border-t-2 border-white/30 my-2"></div>

              {/* Total Final */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center flex-col sm:flex-row gap-3 sm:gap-0">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-1">VALOR TOTAL</p>
                    <p className="text-3xl sm:text-4xl font-black text-[#E53935]">
                      R$ {calcularTotal().toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Lote: R$ {lote.preco.toFixed(2)} + Taxa: R$ {TAXA_INSCRICAO.toFixed(2)}
                      {valeAlmoco && ` + Almoço: R$ ${VALOR_ALMOCO.toFixed(2)}`}
                    </p>
                  </div>
                  <Package className="w-10 h-10 sm:w-12 sm:h-12 text-[#00B8D4]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aviso Final */}
      <Alert className="bg-yellow-50 border-2 border-yellow-400">
        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
        <AlertDescription className="text-sm sm:text-base text-yellow-800 font-semibold">⚠️ Após a confirmação da inscrição, não será possível realizar alterações nos dados informados. Revise tudo cuidadosamente antes de prosseguir para o pagamento.</AlertDescription>
      </Alert>
    </div>
  );
}

// Componente auxiliar para InfoBox
function InfoBox({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-[#00B8D4] transition-all">
      <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
        {icon}
        <p className="text-[10px] sm:text-xs text-gray-600 font-bold uppercase">{label}</p>
      </div>
      <p className="text-sm sm:text-base font-bold text-gray-800 break-words">{value}</p>
    </div>
  );
}