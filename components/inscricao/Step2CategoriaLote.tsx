// Step2CategoriaLote.tsx
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag, DollarSign, Calendar } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

interface Step2Props {
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
  dataInicio: string;
  dataFim: string;
}

export function Step2CategoriaLote({ form }: Step2Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasRes = await fetch("/api/categorias");
        const categoriasData = await categoriasRes.json();
        setCategorias(categoriasData);

        const lotesRes = await fetch("/api/lotes");
        const lotesData = await lotesRes.json();
        setLotes(lotesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoriaIdSelecionada = form.watch("categoriaId");
  const loteIdSelecionado = form.watch("loteId");

  const categoriaSelecionada = categorias.find(
    (cat) => cat.id === categoriaIdSelecionada
  );

  const loteSelecionado = lotes.find((lote) => lote.id === loteIdSelecionado);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#00B8D4] border-t-transparent"></div>
        <p className="text-gray-600 mt-4 font-semibold">Carregando categorias e lotes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Mesmo padrão do Step1 */}
      <div className="bg-[#FFE66D] p-6 rounded-xl">
        <div className="flex items-center gap-3">
          <Flag className="w-8 h-8 text-[#E53935]" />
          <div>
            <h3 className="text-xl font-black text-[#E53935]">Categoria e Lote</h3>
            <p className="text-sm text-gray-700">Escolha sua distância e lote de inscrição</p>
          </div>
        </div>
      </div>

      {/* Categoria */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
        <FormField
          control={form.control}
          name="categoriaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#E53935] font-bold text-lg flex items-center gap-2">
                <Flag className="w-5 h-5" />
                Categoria da Corrida *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-[#00B8D4] h-12 text-base">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id} className="text-base">
                      {categoria.nome} - {categoria.distancia}km
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-600">
                Escolha a distância que você deseja correr
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {categoriaSelecionada && (
        <Card className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-3 text-white">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-white text-[#00B8D4] font-bold px-3 py-1">
                  {categoriaSelecionada.nome}
                </Badge>
                <span className="text-lg font-bold">
                  {categoriaSelecionada.distancia}km
                </span>
              </div>
              <p className="text-white/90">
                {categoriaSelecionada.descricao}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lote */}
      <div className="bg-white p-6 rounded-xl border-2 border-gray-300 hover:border-[#E53935] transition-all">
        <FormField
          control={form.control}
          name="loteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#E53935] font-bold text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Lote de Inscrição *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-[#E53935] h-12 text-base">
                    <SelectValue placeholder="Selecione o lote" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lotes.length === 0 ? (
                    <SelectItem value="none" disabled>
                      Nenhum lote disponível no momento
                    </SelectItem>
                  ) : (
                    lotes.map((lote) => (
                      <SelectItem key={lote.id} value={lote.id} className="text-base">
                        {lote.nome} - R$ {lote.preco.toFixed(2)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-600">
                O preço varia de acordo com o lote escolhido
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {loteSelecionado && (
        <Card className="bg-gradient-to-r from-[#E53935] to-[#c62828] border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <Badge variant="secondary" className="bg-white text-[#E53935] font-bold px-3 py-1 mb-2">
                  {loteSelecionado.nome}
                </Badge>
                <p className="text-sm text-white/90 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Válido até {new Date(loteSelecionado.dataFim).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black">
                  R$ {loteSelecionado.preco.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {lotes.length === 0 && (
        <Card className="bg-yellow-50 border-2 border-yellow-300">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800 font-semibold">
              ⚠️ Não há lotes disponíveis no momento. Entre em contato com a organização do evento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
