// Step5Revisao.tsx
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, MapPin, Flag, Shirt, Heart, CheckCircle2, AlertCircle, DollarSign } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";
import { Inter } from "next/font/google";

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
}

interface Kit {
  id: string;
  nome: string;
  itens: string;
  preco: number;
}

export function Step5Revisao({ form }: Step5Props) {
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [kit, setkit] = useState<Kit | null>(null);
  const [lote, setLote] = useState<Lote | null>(null);
  const [loading, setLoading] = useState(true);

  const formData = form.getValues();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasRes = await fetch("/api/categorias");
        const categorias = await categoriasRes.json();
        const catSelecionada = categorias.find(
          (c: Categoria) => c.id === formData.categoriaId
        );
        setCategoria(catSelecionada);

        const lotesRes = await fetch("/api/lotes");
        const lotes = await lotesRes.json();
        const loteSelecionado = lotes.find(
          (l: Lote) => l.id === formData.loteId
        );
        setLote(loteSelecionado);

        const kitsRes = await fetch("/api/kits");
        const kits = await kitsRes.json();
        const kitSelecionado = kits.find(
          (k: Kit) => k.id === formData.kitId
        );
        setkit(kitSelecionado);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formData.categoriaId, formData.loteId]);

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
      <div className="bg-gradient-to-r from-[#00B8D4] to-[#E53935] p-6 rounded-xl">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-white" />
          <div>
            <h3 className="text-xl font-black text-white">Revisão Final</h3>
            <p className="text-sm text-white/90">
              Confira todos os dados antes de confirmar
            </p>
          </div>
        </div>
      </div>

      <Alert className="bg-[#FFE66D] border-2 border-[#00B8D4]">
        <CheckCircle2 className="h-5 w-5 text-[#00B8D4]" />
        <AlertDescription className="text-sm text-gray-800 font-semibold">
          Ao confirmar, você será redirecionado para o pagamento. Certifique-se de que todos os dados estão corretos.
        </AlertDescription>
      </Alert>

      {/* Dados Pessoais */}
      <Card className="border-2 border-[#00B8D4] shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0]">
          <CardTitle className="flex items-center gap-2 text-white font-black">
            <User className="w-6 h-6" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Nome" value={formData.nomeCompleto} />
            <InfoItem label="CPF" value={formData.cpf} />
            <InfoItem label="RG" value={formData.rg} />
            <InfoItem
              label="Data de Nascimento"
              value={new Date(formData.dataNascimento).toLocaleDateString("pt-BR")}
            />
            <InfoItem label="Telefone" value={formData.telefone} />
          </div>
          <Separator />
          <div className="flex items-start gap-2 text-sm bg-gray-50 p-4 rounded-lg">
            <MapPin className="w-5 h-5 text-[#E53935] mt-1" />
            <div>
              <p className="font-bold text-[#E53935] mb-1">Endereço</p>
              <p className="text-gray-700">
                {formData.endereco}, {formData.cidade} - {formData.estado}, CEP: {formData.cep}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categoria e Lote */}
      <Card className="border-2 border-[#E53935] shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#E53935] to-[#c62828]">
          <CardTitle className="flex items-center gap-2 text-white font-black">
            <Flag className="w-6 h-6" />
            Categoria e Lote
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {categoria && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] rounded-lg">
              <div>
                <Badge variant="secondary" className="mb-2 bg-white text-[#00B8D4] font-bold">
                  {categoria.nome}
                </Badge>
                <p className="text-sm text-white">{categoria.descricao}</p>
                <p className="text-xs text-white/90 mt-1 font-semibold">
                  Distância: {categoria.distancia}km
                </p>
              </div>
            </div>
          )}

          {lote && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFE66D] to-[#ffe033] rounded-lg">
              <div>
                <p className="font-black text-[#E53935] text-lg">{lote.nome}</p>
                <p className="text-xs text-gray-700 font-semibold">Inscrição válida</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#E53935]">
                  R$ {lote.preco.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kit */}
      <Card className="border-2 border-[#FFE66D] shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#FFE66D] to-[#ffe033]">
          <CardTitle className="flex items-center gap-2 text-[#E53935] font-black">
            <Shirt className="w-6 h-6" />
            Kit do Participante
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {kit && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] rounded-lg">
              <div>
                <Badge variant="secondary" className="mb-2 bg-white text-[#00B8D4] font-bold">
                  {kit.nome}
                </Badge>
                <p className="text-sm text-white">{kit.nome}</p>
                <p className="text-xs text-white/90 mt-1 font-semibold">
                  Itens: {kit.itens}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] rounded-lg">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl font-black text-[#00B8D4]">
                {formData.tamanhoCamisa}
              </span>
            </div>
            <div>
              <p className="font-black text-white text-lg">
                Camisa tamanho {formData.tamanhoCamisa}
              </p>
              <p className="text-sm text-white/90 font-semibold">
                Tecido dry-fit de alta performance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ficha Médica */}
      <Card className="border-2 border-red-300 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-500 to-red-600">
          <CardTitle className="flex items-center gap-2 text-white font-black">
            <Heart className="w-6 h-6" />
            Ficha Médica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <InfoItem
            label="Possui Plano de Saúde"
            value={formData.possuiPlanoSaude ? "Sim" : "Não"}
          />
          <Separator />
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-bold text-[#E53935] mb-3">
              Contato de Emergência
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Nome" value={formData.contatoEmergencia} />
              <InfoItem label="Telefone" value={formData.telefoneEmergencia} />
            </div>
          </div>
          <Separator />
          <div className="flex items-start gap-2 p-4 bg-green-50 rounded-lg border-2 border-green-300">
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-black text-green-800">
                Declaração de Saúde Aceita
              </p>
              <p className="text-green-700 text-xs mt-1 font-semibold">
                Você declarou estar apto(a) para participar da corrida
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Pagamento */}
      {lote && (
        <Card className="border-4 border-[#00B8D4] bg-gradient-to-br from-[#00B8D4] to-[#00a0c0] shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-black text-xl">
              <DollarSign className="w-7 h-7" />
              Resumo do Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-white">
              <span className="font-semibold">Inscrição ({lote.nome})</span>
              <span className="font-bold text-lg">
                R$ {lote.preco.toFixed(2)}
              </span>
            </div>
            <Separator className="bg-white/30" />
            <div className="flex justify-between items-center text-2xl bg-white p-4 rounded-lg">
              <span className="font-black text-[#00B8D4]">Total</span>
              <span className="font-black text-[#E53935]">
                R$ {lote.preco.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aviso final */}
      <Alert className="bg-red-50 border-2 border-red-400">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-sm text-red-800 font-semibold">
          <strong>Importante:</strong> Após a confirmação, não será possível alterar os dados da inscrição. Revise com atenção antes de prosseguir.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Componente auxiliar para exibir informações
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200">
      <p className="text-xs text-gray-500 mb-1 font-semibold">{label}</p>
      <p className="text-sm font-bold text-gray-800">{value}</p>
    </div>
  );
}