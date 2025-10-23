// Step2CategoriaLote.tsx
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flag, DollarSign, Calendar, Shirt } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

// 💰 TAXA FIXA DE INSCRIÇÃO
const TAXA_INSCRICAO = 4.00;

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

              <FormDescription className="text-gray-600 text-xs sm:text-sm"> Escolha a distância desejada.</FormDescription>

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
                <div className="space-y-4 text-white">
                  {/* Nome da Categoria */}
                  <div className="text-center">
                    <p className="text-3xl font-black leading-tight break-words">
                      {categoriaSelecionada.split(' - ')[0]}
                    </p>
                    <p className="text-5xl font-black mt-1">
                      {categoriaSelecionada.split(' - ')[1]}
                    </p>
                  </div>

                  {/* Descrição */}
                  <div className="pt-4 border-t border-white/30">
                    <p className="text-sm text-white/90 leading-relaxed text-center">
                      {categoriaSelecionada === 'Caminhada - 3km'
                        ? 'Ideal para iniciantes e quem quer aproveitar o evento com tranquilidade.'
                        : categoriaSelecionada === 'Corrida - 5km'
                        ? 'Distância perfeita para corredores iniciantes e intermediários.'
                        : 'Desafio para corredores experientes que buscam superar seus limites.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Versão Mobile/Tablet - Inline */}
          <div className="xl:hidden">
            <Card className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] border-none shadow-lg">
              <CardContent className="pt-6 pb-6 px-4">
                <div className="space-y-4 text-white">
                  {/* Ícone */}
                  <div className="flex items-center justify-center">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur">
                      <Flag className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Nome da Categoria */}
                  <div className="text-center">
                    <p className="text-xs text-white/80 mb-2">Categoria Selecionada</p>
                    <p className="text-2xl font-black leading-tight break-words">
                      {categoriaSelecionada.split(' - ')[0]}
                    </p>
                    <p className="text-4xl font-black mt-1">
                      {categoriaSelecionada.split(' - ')[1]}
                    </p>
                  </div>

                  {/* Descrição */}
                  <div className="pt-3 border-t border-white/30">
                    <p className="text-xs text-white/90 leading-relaxed text-center">
                      {categoriaSelecionada === 'Caminhada - 3km'
                        ? 'Ideal para iniciantes e quem quer aproveitar o evento.'
                        : categoriaSelecionada === 'Corrida - 5km'
                        ? 'Distância perfeita para corredores iniciantes e intermediários.'
                        : 'Desafio para corredores experientes.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <div className="bg-white p-4 sm:p-1 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
        {/* Lote */}
        <div className="bg-white p-10 sm:p-6 rounded-xl border-gray-300 hover:border-[#E53935] transition-all">
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

                <FormDescription className="text-gray-600 text-xs sm:text-sm">O preço varia de acordo com o lote disponível.</FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* 🆕 CARD MOBILE - COM TAXA DE INSCRIÇÃO */}
      {loteSelecionado && (
        <Card className="bg-gradient-to-r from-[#E53935] to-[#c62828] border-none shadow-lg xl:hidden">
          <CardContent className="pt-6 pb-6 px-4">
            <div className="space-y-3 text-white">
              {/* Badge do Lote */}
              <div className="flex items-start justify-between flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white text-[#E53935] font-bold px-3 py-1.5 text-sm">
                  {loteSelecionado.nome}
                </Badge>
              </div>

              {/* Data de Validade */}
              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="w-4 h-4" />
                <p className="text-sm">Válido até {new Date(loteSelecionado.dataFim).toLocaleDateString("pt-BR")}</p>
              </div>

              {/* Breakdown de Valores */}
              <div className="pt-3 border-t border-white/30 space-y-3">
                {/* Valor do Lote */}
                <div className="flex justify-between items-center">
                  <p className="text-xs text-white/80">Valor do lote:</p>
                  <p className="text-lg font-bold">R$ {loteSelecionado.preco.toFixed(2)}</p>
                </div>

                {/* Taxa de Inscrição */}
                <div className="flex justify-between items-center">
                  <p className="text-xs text-white/80">Taxa de inscrição:</p>
                  <p className="text-lg font-bold">R$ {TAXA_INSCRICAO.toFixed(2)}</p>
                </div>

                {/* Linha Divisória */}
                <div className="border-t border-white/30 my-2"></div>

                {/* Total */}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-3xl font-black">
                    R$ {(loteSelecionado.preco + TAXA_INSCRICAO).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 🆕 CARD DESKTOP FLUTUANTE - COM TAXA DE INSCRIÇÃO */}
      {loteSelecionado && (
        <div className="hidden xl:block fixed top-[400px] right-6 z-40 w-80">
          <Card className="bg-gradient-to-r from-[#E53935] to-[#c62828] border-none shadow-2xl">
            <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4 text-white">
                {/* Badges */}
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white text-[#E53935] font-bold px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
                    {loteSelecionado.nome}
                  </Badge>
                  <Badge variant="secondary" className="bg-[#FFE66D] text-gray-800 font-bold px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base flex items-center gap-1">
                    <Shirt className="w-3 h-3 sm:w-4 sm:h-4"/>
                    Kit Oficial
                  </Badge>
                </div>

                {/* Data de Validade */}
                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <p className="text-sm sm:text-base">
                    Válido até {new Date(loteSelecionado.dataFim).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                {/* Breakdown de Valores */}
                <div className="pt-3 sm:pt-4 border-t border-white/30 space-y-3">
                  {/* Valor do Lote */}
                  <div className="flex justify-between items-center">
                    <p className="text-xs sm:text-sm text-white/80">Valor do lote:</p>
                    <p className="text-xl sm:text-2xl font-bold">
                      R$ {loteSelecionado.preco.toFixed(2)}
                    </p>
                  </div>

                  {/* Taxa de Inscrição */}
                  <div className="flex justify-between items-center pb-3 border-b border-white/30">
                    <div>
                      <p className="text-xs sm:text-sm text-white/80">Taxa de inscrição:</p>
                      <p className="text-[10px] text-white/60">Processamento e serviços</p>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">
                      R$ {TAXA_INSCRICAO.toFixed(2)}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur">
                    <div className="flex justify-between items-center">
                      <p className="text-4xl sm:text-5xl font-black">
                        R$ {(loteSelecionado.preco + TAXA_INSCRICAO).toFixed(2)}
                      </p>
                    </div>
                  </div>
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