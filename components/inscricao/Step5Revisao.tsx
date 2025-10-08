// Step5Revisao.tsx
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  MapPin, 
  Flag, 
  Shirt, 
  Heart, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Phone,
  CreditCard,
  Package
} from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

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
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [kit, setKit] = useState<Kit | null>(null);
  const [lote, setLote] = useState<Lote | null>(null);
  const [loading, setLoading] = useState(true);

  const formData = form.getValues();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasRes = await fetch("/api/categorias");
        const categorias = await categoriasRes.json();
        const catSelecionada = Array.isArray(categorias) 
          ? categorias.find((c: Categoria) => c.id === formData.categoriaId)
          : undefined;
        setCategoria(catSelecionada);

        const lotesRes = await fetch("/api/lotes");
        const lotes = await lotesRes.json();
        const loteSelecionado = Array.isArray(lotes)
          ? lotes.find((l: Lote) => l.id === formData.loteId)
          : undefined;
        setLote(loteSelecionado);

        const kitsRes = await fetch("/api/kits");
        const kits = await kitsRes.json();
        const kitSelecionado = Array.isArray(kits)
          ? kits.find((k: Kit) => k.id === formData.kitId)
          : undefined;
        setKit(kitSelecionado);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formData.categoriaId, formData.loteId, formData.kitId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#00B8D4] border-t-transparent"></div>
        <p className="text-gray-600 mt-4 font-semibold">Carregando resumo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-white" />
          <div>
            <h3 className="text-xl font-black text-white">Revisão Final da Inscrição</h3>
            <p className="text-sm text-white/90">
              Confira todos os dados antes de confirmar o pagamento
            </p>
          </div>
        </div>
      </div>

      {/* Alerta Principal */}
      <Alert className="bg-[#FFE66D] border-2 border-[#E53935]">
        <AlertCircle className="h-6 w-6 text-[#E53935]" />
        <AlertDescription className="text-base text-gray-800 font-semibold">
          ⚠️ Após confirmar, você será redirecionado para o pagamento. Certifique-se de que todos os dados estão corretos, pois não será possível alterá-los posteriormente.
        </AlertDescription>
      </Alert>

      {/* Dados Pessoais */}
      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#00B8D4] p-3 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black text-[#00B8D4]">Dados Pessoais</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoBox 
                label="Nome Completo" 
                value={formData.nomeCompleto}
                icon={<User className="w-4 h-4 text-[#00B8D4]" />}
              />
              <InfoBox 
                label="CPF" 
                value={formData.cpf}
                icon={<User className="w-4 h-4 text-[#00B8D4]" />}
              />
              <InfoBox 
                label="RG" 
                value={formData.rg}
                icon={<User className="w-4 h-4 text-[#00B8D4]" />}
              />
              <InfoBox 
                label="Data de Nascimento" 
                value={new Date(formData.dataNascimento).toLocaleDateString("pt-BR")}
                icon={<Calendar className="w-4 h-4 text-[#00B8D4]" />}
              />
              <InfoBox 
                label="Telefone" 
                value={formData.telefone}
                icon={<Phone className="w-4 h-4 text-[#00B8D4]" />}
              />
            </div>

            <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffe033] p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E53935] mt-1" />
                <div>
                  <p className="font-bold text-[#E53935] mb-2">Endereço Completo</p>
                  <p className="text-gray-800 font-semibold">
                    {formData.endereco}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {formData.cidade} - {formData.estado}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    CEP: {formData.cep}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tamanho da Camisa */}
      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#E53935] p-3 rounded-lg">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black text-[#E53935]">Camisa do Participante</h3>
          </div>

          <div className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] p-6 rounded-lg">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl font-black text-[#00B8D4]">
                  {formData.tamanhoCamisa}
                </span>
              </div>
              <div className="text-white">
                <p className="text-2xl font-black mb-1">
                  Tamanho {formData.tamanhoCamisa}
                </p>
                <p className="text-sm text-white/90 font-semibold">
                  Camisa oficial em tecido dry-fit de alta performance
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ficha Médica */}
      <Card className="bg-white border-2 border-gray-200 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-black text-red-500">Informações Médicas</h3>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${
              formData.possuiPlanoSaude 
                ? "bg-green-50 border-green-400" 
                : "bg-gray-50 border-gray-300"
            }`}>
              <div className="flex items-center gap-3">
                {formData.possuiPlanoSaude ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-gray-500" />
                )}
                <div>
                  <p className="font-bold text-gray-800">Plano de Saúde</p>
                  <p className="text-sm text-gray-600 font-semibold">
                    {formData.possuiPlanoSaude ? "Possui plano de saúde" : "Não possui plano de saúde"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
              <p className="font-bold text-red-600 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contato de Emergência
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoBox 
                  label="Nome" 
                  value={formData.contatoEmergencia}
                  icon={<User className="w-4 h-4 text-red-500" />}
                />
                <InfoBox 
                  label="Telefone" 
                  value={formData.telefoneEmergencia}
                  icon={<Phone className="w-4 h-4 text-red-500" />}
                />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-400">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
                <div>
                  <p className="font-black text-green-800 text-base">
                    Declaração de Saúde Confirmada
                  </p>
                  <p className="text-green-700 text-sm mt-1 font-semibold">
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
          <CardContent className="pt-8 pb-8 px-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-[#00B8D4]" />
              </div>
              <h3 className="text-2xl font-black text-white">Resumo do Pagamento</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-white/20 p-4 rounded-lg backdrop-blur">
                <div className="flex justify-between items-center text-white mb-2">
                  <span className="font-semibold">Inscrição - {lote.nome}</span>
                  <span className="font-bold text-xl">
                    R$ {lote.preco.toFixed(2)}
                  </span>
                </div>
                <p className="text-white/80 text-sm font-semibold">
                  Inclui todos os itens do kit selecionado
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">VALOR TOTAL</p>
                    <p className="text-4xl font-black text-[#E53935]">
                      R$ {lote.preco.toFixed(2)}
                    </p>
                  </div>
                  <Package className="w-12 h-12 text-[#00B8D4]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aviso Final */}
      <Alert className="bg-red-50 border-2 border-red-500">
        <AlertCircle className="h-6 w-6 text-red-600" />
        <AlertDescription className="text-base text-red-800 font-semibold">
          <strong className="text-red-900">⚠️ ATENÇÃO:</strong> Após a confirmação da inscrição, não será possível realizar alterações nos dados informados. Revise tudo cuidadosamente antes de prosseguir para o pagamento.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Componente auxiliar para InfoBox
function InfoBox({ 
  label, 
  value, 
  icon 
}: { 
  label: string; 
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-[#00B8D4] transition-all">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs text-gray-600 font-bold uppercase">{label}</p>
      </div>
      <p className="text-base font-bold text-gray-800">{value}</p>
    </div>
  );
}