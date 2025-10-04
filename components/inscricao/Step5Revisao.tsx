import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  MapPin,
  Flag,
  Shirt,
  Heart,
  CheckCircle2,
  AlertCircle,
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
}

export function Step5Revisao({ form }: Step5Props) {
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [lote, setLote] = useState<Lote | null>(null);
  const [loading, setLoading] = useState(true);

  const formData = form.getValues();

  // Busca informações da categoria e lote selecionados
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca categoria
        const categoriasRes = await fetch("/api/categorias");
        const categorias = await categoriasRes.json();
        const catSelecionada = categorias.find(
          (c: Categoria) => c.id === formData.categoriaId
        );
        setCategoria(catSelecionada);

        // Busca lote
        const lotesRes = await fetch("/api/lotes");
        const lotes = await lotesRes.json();
        const loteSelecionado = lotes.find(
          (l: Lote) => l.id === formData.loteId
        );
        setLote(loteSelecionado);
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
      <div className="text-center py-8">
        <p className="text-gray-500">Carregando resumo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Revisão Final</h3>
        <p className="text-sm text-gray-600">
          Revise todas as informações antes de confirmar sua inscrição. Você
          poderá voltar e editar qualquer campo se necessário.
        </p>
      </div>

      {/* Alerta de confirmação */}
      <Alert className="bg-blue-50 border-blue-300">
        <CheckCircle2 className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-900">
          Ao confirmar, você será redirecionado para o pagamento. Certifique-se
          de que todos os dados estão corretos.
        </AlertDescription>
      </Alert>

      {/* Card: Dados Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-5 h-5 text-blue-500" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Nome" value={formData.nomeCompleto} />
            <InfoItem label="CPF" value={formData.cpf} />
            <InfoItem label="RG" value={formData.rg} />
            <InfoItem
              label="Data de Nascimento"
              value={new Date(formData.dataNascimento).toLocaleDateString(
                "pt-BR"
              )}
            />
            <InfoItem label="Telefone" value={formData.telefone} />
          </div>
          <Separator />
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <p className="font-medium text-gray-700">Endereço</p>
              <p className="text-gray-600">
                {formData.endereco}, {formData.cidade} - {formData.estado},{" "}
                CEP: {formData.cep}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card: Categoria e Lote */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Flag className="w-5 h-5 text-green-500" />
            Categoria e Lote
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categoria && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <Badge variant="secondary" className="mb-1">
                  {categoria.nome}
                </Badge>
                <p className="text-sm text-gray-600">{categoria.descricao}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Distância: {categoria.distancia}km
                </p>
              </div>
            </div>
          )}

          {lote && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">{lote.nome}</p>
                <p className="text-xs text-gray-600">Inscrição válida</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-700">
                  R$ {lote.preco.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card: Kit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shirt className="w-5 h-5 text-purple-500" />
            Kit do Participante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-purple-700">
                {formData.tamanhoCamisa}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                Camisa tamanho {formData.tamanhoCamisa}
              </p>
              <p className="text-xs text-gray-600">
                Tecido dry-fit de alta performance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card: Ficha Médica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="w-5 h-5 text-red-500" />
            Ficha Médica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoItem
            label="Possui Plano de Saúde"
            value={formData.possuiPlanoSaude ? "Sim" : "Não"}
          />
          <Separator />
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Contato de Emergência
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Nome" value={formData.contatoEmergencia} />
              <InfoItem label="Telefone" value={formData.telefoneEmergencia} />
            </div>
          </div>
          <Separator />
          <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-green-800">
                Declaração de Saúde Aceita
              </p>
              <p className="text-green-700 text-xs mt-1">
                Você declarou estar apto(a) para participar da corrida
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card: Resumo do Pagamento */}
      {lote && (
        <Card className="border-2 border-blue-300 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              💰 Resumo do Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Inscrição ({lote.nome})</span>
              <span className="font-semibold">
                R$ {lote.preco.toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-bold text-blue-700">
                R$ {lote.preco.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aviso final */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Importante:</strong> Após a confirmação, não será possível
          alterar os dados da inscrição. Revise com atenção antes de prosseguir.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Componente auxiliar para exibir informações
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
