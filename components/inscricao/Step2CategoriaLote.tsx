// Step2CategoriaLote.tsx
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag, DollarSign, Calendar, Shirt } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

interface Step2Props {
  form: UseFormReturn<InscricaoCompleta>;
}

interface Lote {
  id: string;
  nome: string;
  preco: number;
  dataInicio: string;
  dataFim: string;
}

interface Kit {
  id: string;
  nome: string;
}

export function Step2CategoriaLote({ form }: Step2Props) {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  const categorias = [
    'Caminhada - 3km',
    'Corrida - 5km',
    'Corrida - 10km',
  ]

  const categoriaIdSelecionada = form.watch("categoria");
  const loteIdSelecionado = form.watch("loteId");

  const categoriaSelecionada = categorias.find(
    (cat) => cat === categoriaIdSelecionada
  );

  const loteSelecionado = lotes.find((lote) => lote.id === loteIdSelecionado);

  if (loading) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-[#00B8D4] border-t-transparent"></div>
        <p className="text-gray-600 mt-3 sm:mt-4 font-semibold text-sm sm:text-base">Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="bg-[#FFE66D] p-4 sm:p-6 rounded-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <Flag className="w-6 h-6 sm:w-8 sm:h-8 text-[#E53935]" />
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#E53935]">Categoria e Lote</h3>
            <p className="text-xs sm:text-sm text-gray-700">Escolha sua distância e lote de inscrição</p>
          </div>
        </div>
      </div>

      {/* Categoria */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
        <FormField control={form.control} name="categoria" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#E53935] font-bold text-base sm:text-lg flex items-center gap-2">
                <Flag className="w-4 h-4 sm:w-5 sm:h-5" /> Categoria da Corrida
              </FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-[#00B8D4] h-10 sm:h-12 text-sm sm:text-base text-black">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {categorias.map((categoria) => (<SelectItem key={categoria} value={categoria} className="text-sm sm:text-base">{categoria}</SelectItem>))}
                </SelectContent>
              </Select>

              <FormDescription className="text-gray-600 text-xs sm:text-sm"> Escolha a distância que você deseja correr</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Card de Categoria - Desktop e Mobile */}
      {categoriaSelecionada && (
        <>
          {/* Versão Desktop - Flutuante */}
          <div className="hidden xl:block fixed top-24 right-6 z-40 w-80">
            <Card className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] border-none shadow-2xl">
              <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="space-y-3 sm:space-y-4 text-white">
                  <p className="text-xs sm:text-sm text-white/80 mb-2">Distância do percurso:</p>
                  <p className="text-4xl sm:text-5xl font-black">{categoriaSelecionada}</p>

                  {categoriaSelecionada && (<div className="pt-3 sm:pt-4 border-t border-white/30"><p className="text-sm sm:text-base text-white/90 leading-relaxed">{categoriaSelecionada}</p></div>)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Versão Mobile/Tablet - Inline */}
          <div className="xl:hidden">
            <Card className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] border-none shadow-lg">
              <CardContent className="pt-6 pb-6 px-4">
                <div className="space-y-3 text-white">
                  <p className="text-xs text-white/80 mb-2">Distância do percurso:</p>
                  <p className="text-3xl sm:text-4xl font-black">{categoriaSelecionada} KM</p>

                  {categoriaSelecionada && (<div className="pt-3 border-t border-white/30"><p className="text-sm text-white/90 leading-relaxed">{categoriaSelecionada}</p></div>)}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Grid: Kit e Lote lado a lado em telas grandes, empilhados em mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Escolha do Kit (sempre primeiro) */}
        {/* <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-300 hover:border-[#E53935] transition-all">
          <FormField control={form.control} name="kitId" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#E53935] font-bold text-base sm:text-lg flex items-center gap-2">
                  <Shirt className="w-4 h-4 sm:w-5 sm:h-5" /> Escolha seu Kit *
                </FormLabel>

                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-2 border-[#00B8D4] h-10 sm:h-12 text-sm sm:text-base text-black">
                      <SelectValue placeholder="Selecione o kit" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {Array.isArray(kits) && kits.length > 0 ? (kits.map((kit) => (<SelectItem key={kit.id} value={kit.id} className="text-sm sm:text-base">{kit.nome}</SelectItem>))) : (<SelectItem value="none" disabled>Nenhum kit disponível</SelectItem>)}
                  </SelectContent>
                </Select>

                <FormDescription className="text-gray-600 text-xs sm:text-sm">Escolha o kit que deseja para a corrida</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}

        {/* Lote (sempre segundo) */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-300 hover:border-[#E53935] transition-all">
          <FormField control={form.control} name="loteId" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#E53935] font-bold text-base sm:text-lg flex items-center gap-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" /> Lote de Inscrição *
                </FormLabel>

                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-2 border-[#E53935] h-10 sm:h-12 text-sm sm:text-base text-black">
                      <SelectValue placeholder="Selecione o lote" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {lotes.length === 0 ? (<SelectItem value="none" disabled> Nenhum lote disponível no momento</SelectItem>) : (lotes.map((lote) => (<SelectItem key={lote.id} value={lote.id} className="text-sm sm:text-base">{lote.nome} - R$ {lote.preco.toFixed(2)}</SelectItem>)))}
                  </SelectContent>
                </Select>

                <FormDescription className="text-gray-600 text-xs sm:text-sm">O preço varia de acordo com o lote escolhido</FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Cards do Kit e Lote lado a lado em mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Card do Kit */}
        {/* {kitSelecionado && (
          <Card className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] border-none shadow-lg xl:hidden">
            <CardContent className="pt-6 pb-6 px-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="bg-[#E53935] text-white font-bold px-3 py-1.5 text-sm">
                    {kitSelecionado.nome}
                  </Badge>
                </div>

                <div className="pt-3 border-t border-gray-300">
                  <p className="text-xs text-gray-700 mb-2 font-bold">Itens inclusos:</p>
                  <p className="text-base sm:text-lg font-bold text-gray-800 leading-relaxed">{kitSelecionado.itens}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Card de Lote */}
        {loteSelecionado && (
          <Card className="bg-gradient-to-r from-[#E53935] to-[#c62828] border-none shadow-lg xl:hidden">
            <CardContent className="pt-6 pb-6 px-4">
              <div className="space-y-3 text-white">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white text-[#E53935] font-bold px-3 py-1.5 text-sm">{loteSelecionado.nome}</Badge>
                </div>

                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4" />
                  <p className="text-sm">Válido até {new Date(loteSelecionado.dataFim).toLocaleDateString("pt-BR")}</p>
                </div>

                <div className="pt-3 border-t border-white/30">
                  <p className="text-xs text-white/80 mb-2">Valor da inscrição:</p>
                  <p className="text-3xl sm:text-4xl font-black">R$ {loteSelecionado.preco.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Card Flutuante Desktop - Lote com Badge do Kit */}
      {loteSelecionado && (
        <div className="hidden xl:block fixed top-[400px] right-6 z-40 w-80">
          <Card className="bg-gradient-to-r from-[#E53935] to-[#c62828] border-none shadow-2xl">
            <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4 text-white">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white text-[#E53935] font-bold px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
                    {loteSelecionado.nome}
                  </Badge>
                  <Badge variant="secondary" className="bg-[#FFE66D] text-gray-800 font-bold px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base flex items-center gap-1">
                    <Shirt className="w-3 h-3 sm:w-4 sm:h-4"/>Kit Oficial
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <p className="text-sm sm:text-base">Válido até {new Date(loteSelecionado.dataFim).toLocaleDateString("pt-BR")}</p>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-white/30">
                  <p className="text-xs sm:text-sm text-white/80 mb-2">Valor da inscrição:</p>
                  <p className="text-4xl sm:text-5xl font-black">R$ {loteSelecionado.preco.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {lotes.length === 0 && (
        <Card className="bg-yellow-50 border-2 border-yellow-300">
          <CardContent className="pt-4 sm:pt-6">
            <p className="text-xs sm:text-sm text-yellow-800 font-semibold">⚠️ Não há lotes disponíveis no momento. Entre em contato com a organização do evento.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
