import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription,} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="text-center py-8">
        <p className="text-gray-500">Carregando categorias e lotes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Categoria e Lote</h3>

      {/* Seletor de Categoria */}
      <FormField
        control={form.control}
        name="categoriaId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria da Corrida *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.nome} - {categoria.distancia}km
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Escolha a distância que você deseja correr
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {categoriaSelecionada && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{categoriaSelecionada.nome}</Badge>
                <span className="text-sm text-gray-600">
                  {categoriaSelecionada.distancia}km
                </span>
              </div>
              <p className="text-sm text-gray-700">
                {categoriaSelecionada.descricao}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <FormField
        control={form.control}
        name="loteId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lote de Inscrição *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
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
                    <SelectItem key={lote.id} value={lote.id}>
                      {lote.nome} - R$ {lote.preco.toFixed(2)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormDescription>
              O preço varia de acordo com o lote escolhido
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {loteSelecionado && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="secondary">{loteSelecionado.nome}</Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    Válido até{" "}
                    {new Date(loteSelecionado.dataFim).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-700">
                    R$ {loteSelecionado.preco.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {lotes.length === 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-sm text-yellow-800">
              ⚠️ Não há lotes disponíveis no momento. Entre em contato com a
              organização do evento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
