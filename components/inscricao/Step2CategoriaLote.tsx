// Step2CategoriaLote.tsx
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Flag, DollarSign, Calendar, Shirt, UtensilsCrossed, MapPin, Tag, Check, X, Loader2, Percent } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";
import { toast } from "sonner";

// 💰 VALORES FIXOS
const TAXA_INSCRICAO = 4.00;
const VALOR_ALMOCO = 35.90;

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

interface CupomValidado {
  id: string;
  codigo: string;
  desconto: number;
  tipoDesconto: "PERCENTUAL" | "FIXO";
  valorDesconto: number;
  origem: string;
}

export function Step2CategoriaLote({ form }: Step2Props) {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [cupomCodigo, setCupomCodigo] = useState("");
  const [cupomValidado, setCupomValidado] = useState<CupomValidado | null>(null);
  const [validandoCupom, setValidandoCupom] = useState(false);

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
    'Corrida - 6km',
    'Corrida - 10km',
  ];

  const categoriaIdSelecionada = form.watch("categoria");
  const loteIdSelecionado = form.watch("loteId");
  const valeAlmoco = form.watch("valeAlmoco") || false;

  const categoriaSelecionada = categorias.find(
    (cat) => cat === categoriaIdSelecionada
  );

  const loteSelecionado = lotes.find((lote) => lote.id === loteIdSelecionado);

  // Validar cupom
  const validarCupom = async () => {
    if (!cupomCodigo.trim()) {
      toast.error("Digite um código de cupom");
      return;
    }

    if (!loteSelecionado) {
      toast.error("Selecione um lote primeiro");
      return;
    }

    setValidandoCupom(true);

    try {
      const response = await fetch("/api/cupons/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: cupomCodigo,
          valorLote: loteSelecionado.preco
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Cupom inválido");
        setCupomValidado(null);
        form.setValue("cupomCodigo", undefined);
        return;
      }

      setCupomValidado(data.cupom);
      form.setValue("cupomCodigo", data.cupom.codigo);
      toast.success(`Cupom aplicado! Desconto de R$ ${data.cupom.valorDesconto.toFixed(2)}`);

    } catch (error) {
      console.error("Erro ao validar cupom:", error);
      toast.error("Erro ao validar cupom");
    } finally {
      setValidandoCupom(false);
    }
  };

  const removerCupom = () => {
    setCupomValidado(null);
    setCupomCodigo("");
    form.setValue("cupomCodigo", undefined);
    toast.info("Cupom removido");
  };

  // Cálculo do valor total
  const calcularTotal = () => {
    if (!loteSelecionado) return 0;

    let valorLote = loteSelecionado.preco;

    // Aplicar desconto APENAS no valor do lote
    if (cupomValidado) {
      valorLote -= cupomValidado.valorDesconto;
    }

    let total = valorLote + TAXA_INSCRICAO;

    if (valeAlmoco) {
      total += VALOR_ALMOCO;
    }

    return total;
  };

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
            <h3 className="text-lg sm:text-xl font-black text-[#E53935]">Categoria e Opções</h3>
            <p className="text-xs sm:text-sm text-gray-700">Escolha sua distância, lote e adicionais</p>
          </div>
        </div>
      </div>

      {/* Categoria */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
        <FormField control={form.control} name="categoria" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#E53935] font-bold text-base sm:text-lg flex items-center gap-2">
                <Flag className="w-4 h-4 sm:w-5 sm:h-5" /> Categoria da Corrida *
              </FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-[#00B8D4] h-10 sm:h-12 text-sm sm:text-base text-black">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria} className="text-sm sm:text-base">
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormDescription className="text-gray-600 text-xs sm:text-sm">
                Escolha a distância desejada.
              </FormDescription>

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
                  <div className="text-center">
                    <p className="text-3xl font-black leading-tight break-words">
                      {categoriaSelecionada.split(' - ')[0]}
                    </p>
                    <p className="text-5xl font-black mt-1">
                      {categoriaSelecionada.split(' - ')[1]}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/30">
                    <p className="text-sm text-white/90 leading-relaxed text-center">
                      {categoriaSelecionada === 'Caminhada - 3km'
                        ? 'Ideal para iniciantes e quem quer aproveitar o evento com tranquilidade.'
                        : categoriaSelecionada === 'Corrida - 6km'
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
                  <div className="flex items-center justify-center">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur">
                      <Flag className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-white/80 mb-2">Categoria Selecionada</p>
                    <p className="text-2xl font-black leading-tight break-words">
                      {categoriaSelecionada.split(' - ')[0]}
                    </p>
                    <p className="text-4xl font-black mt-1">
                      {categoriaSelecionada.split(' - ')[1]}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/30">
                    <p className="text-xs text-white/90 leading-relaxed text-center">
                      {categoriaSelecionada === 'Caminhada - 3km'
                        ? 'Ideal para iniciantes e quem quer aproveitar o evento.'
                        : categoriaSelecionada === 'Corrida - 6km'
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

      {/* Lote */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-300 hover:border-[#E53935] transition-all">
        <FormField control={form.control} name="loteId" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#E53935] font-bold text-base sm:text-lg flex items-center gap-2">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" /> Lote de Inscrição *
              </FormLabel>

              <Select onValueChange={(value) => {
                field.onChange(value);
                // Remover cupom ao trocar de lote
                if (cupomValidado) {
                  removerCupom();
                }
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-[#E53935] h-10 sm:h-12 text-sm sm:text-base text-black">
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
                      <SelectItem key={lote.id} value={lote.id} className="text-sm sm:text-base">
                        {lote.nome} - R$ {lote.preco.toFixed(2)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              <FormDescription className="text-gray-600 text-xs sm:text-sm">
                O preço varia de acordo com o lote disponível.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* 🆕 CUPOM DE DESCONTO */}
      {loteSelecionado && (
        <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-[#FFE66D] hover:border-[#E53935] transition-all">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#E53935]" />
              <h4 className="text-[#E53935] font-bold text-base sm:text-lg">
                Cupom de Desconto (Opcional)
              </h4>
            </div>

            {!cupomValidado ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o código do cupom"
                  value={cupomCodigo}
                  onChange={(e) => setCupomCodigo(e.target.value.toUpperCase())}
                  className="border-2 border-[#FFE66D] uppercase"
                  maxLength={20}
                  disabled={validandoCupom}
                />
                <Button
                  type="button"
                  onClick={validarCupom}
                  disabled={validandoCupom || !cupomCodigo.trim()}
                  className="bg-[#E53935] hover:bg-[#c62828]"
                >
                  {validandoCupom ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Aplicar"
                  )}
                </Button>
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-green-800 text-base flex items-center gap-2">
                        {cupomValidado.codigo}
                        <Badge className="bg-green-600 text-white">
                          {cupomValidado.tipoDesconto === "PERCENTUAL"
                            ? `${cupomValidado.desconto}%`
                            : `R$ ${cupomValidado.desconto}`}
                        </Badge>
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Desconto de <span className="font-bold">R$ {cupomValidado.valorDesconto.toFixed(2)}</span> aplicado no valor do lote
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Origem: {cupomValidado.origem}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removerCupom}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-600">
              💡 O desconto é aplicado apenas no valor do lote. Taxa de inscrição e vale-almoço não têm desconto.
            </p>
          </div>
        </div>
      )}

      {/* RETIRADA DO KIT */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
        <FormField control={form.control} name="retiradaKit" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#E53935] font-bold text-base sm:text-lg flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" /> Local de Retirada do Kit *
              </FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value || "The Chris - Monte Carmo Shopping"}>
                <FormControl>
                  <SelectTrigger className="border-2 border-[#00B8D4] h-10 sm:h-12 text-sm sm:text-base text-black">
                    <SelectValue placeholder="Selecione o local de retirada" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="The Chris - Shopping do avião" className="text-sm sm:text-base">
                    The Chris - Shopping do avião
                  </SelectItem>
                  <SelectItem value="The Chris - Monte Carmo Shopping" className="text-sm sm:text-base">
                    The Chris - Monte Carmo Shopping
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormDescription className="text-gray-600 text-xs sm:text-sm">
                Escolha o shopping mais conveniente para retirar seu kit de corrida.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* ALMOÇO COM CHURRASCO */}
      <div className={`p-4 sm:p-6 rounded-xl border-2 transition-all ${
        valeAlmoco
          ? 'bg-gradient-to-r from-[#E53935] to-[#c62828] border-[#E53935]'
          : 'bg-white border-gray-300 hover:border-[#E53935]'
      }`}>
        <FormField
          control={form.control}
          name="valeAlmoco"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className={`mt-1 border-2 ${
                    valeAlmoco
                      ? 'border-white data-[state=checked]:bg-white data-[state=checked]:text-[#E53935]'
                      : 'border-[#E53935] data-[state=checked]:bg-[#E53935]'
                  }`}
                />
              </FormControl>
              <div className="space-y-1 leading-none flex-1">
                <FormLabel className={`font-bold text-base sm:text-lg flex items-center gap-2 cursor-pointer ${
                  valeAlmoco ? 'text-white' : 'text-[#E53935]'
                }`}>
                  <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
                  Adicionar Almoço com Churrasco (+R$ {VALOR_ALMOCO.toFixed(2)})
                </FormLabel>
                <FormDescription className={`text-xs sm:text-sm ${
                  valeAlmoco ? 'text-white/90' : 'text-gray-600'
                }`}>
                  Depois de cruzar a linha de chegada, aproveite o self-service à vontade com churrasco.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* CARD RESUMO MOBILE */}
      {loteSelecionado && (
        <Card className="bg-gradient-to-r from-[#E53935] to-[#c62828] border-none shadow-lg xl:hidden">
          <CardContent className="pt-6 pb-6 px-4">
            <div className="space-y-3 text-white">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <Badge variant="secondary" className="bg-white text-[#E53935] font-bold px-3 py-1.5 text-sm">
                  {loteSelecionado.nome}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="w-4 h-4" />
                <p className="text-sm">
                  Válido até {new Date(loteSelecionado.dataFim).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div className="pt-3 border-t border-white/30 space-y-3">
                {/* Valor do Lote */}
                <div className="flex justify-between items-center">
                  <p className="text-xs text-white/80">Valor do lote:</p>
                  <p className="text-lg font-bold">R$ {loteSelecionado.preco.toFixed(2)}</p>
                </div>

                {/* Desconto do Cupom */}
                {cupomValidado && (
                  <div className="flex justify-between items-center text-green-300">
                    <p className="text-xs flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      Desconto ({cupomValidado.codigo}):
                    </p>
                    <p className="text-lg font-bold">- R$ {cupomValidado.valorDesconto.toFixed(2)}</p>
                  </div>
                )}

                {/* Taxa de Inscrição */}
                <div className="flex justify-between items-center">
                  <p className="text-xs text-white/80">Taxa de inscrição:</p>
                  <p className="text-lg font-bold">R$ {TAXA_INSCRICAO.toFixed(2)}</p>
                </div>

                {/* Almoço */}
                {valeAlmoco && (
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-white/80">Almoço com Churrasco:</p>
                    <p className="text-lg font-bold">R$ {VALOR_ALMOCO.toFixed(2)}</p>
                  </div>
                )}

                <div className="border-t border-white/30 my-2"></div>

                {/* Total */}
                <div className="flex justify-between items-center pt-2">
                  <p className="text-sm text-white/90">TOTAL:</p>
                  <p className="text-3xl font-black">
                    R$ {calcularTotal().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CARD RESUMO DESKTOP FLUTUANTE */}
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
                    <Shirt className="w-3 h-3 sm:w-4 sm:h-4"/>
                    Kit Oficial
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <p className="text-sm sm:text-base">
                    Válido até {new Date(loteSelecionado.dataFim).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-white/30 space-y-3">
                  {/* Valor do Lote */}
                  <div className="flex justify-between items-center">
                    <p className="text-xs sm:text-sm text-white/80">Valor do lote:</p>
                    <p className="text-xl sm:text-2xl font-bold">
                      R$ {loteSelecionado.preco.toFixed(2)}
                    </p>
                  </div>

                  {/* Desconto do Cupom */}
                  {cupomValidado && (
                    <div className="flex justify-between items-center text-green-300 bg-white/10 p-2 rounded-lg">
                      <div>
                        <p className="text-xs sm:text-sm flex items-center gap-1">
                          <Percent className="w-3 h-3" />
                          Desconto:
                        </p>
                        <p className="text-[10px] text-white/60">{cupomValidado.codigo}</p>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold">
                        - R$ {cupomValidado.valorDesconto.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Taxa de Inscrição */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs sm:text-sm text-white/80">Taxa de inscrição:</p>
                      <p className="text-[10px] text-white/60">Processamento e serviços</p>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold">
                      R$ {TAXA_INSCRICAO.toFixed(2)}
                    </p>
                  </div>

                  {/* Almoço */}
                  {valeAlmoco && (
                    <div className="flex justify-between items-center pb-3">
                      <div>
                        <p className="text-xs sm:text-sm text-white/80">Almoço c/ Churrasco:</p>
                        <p className="text-[10px] text-white/60">Após a corrida</p>
                      </div>
                      <p className="text-xl sm:text-2xl font-bold">
                        R$ {VALOR_ALMOCO.toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-white/30"></div>

                  {/* Total */}
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur">
                    <div className="flex justify-between items-center">
                      <p className="text-sm sm:text-base text-white/90">TOTAL:</p>
                      <p className="text-4xl sm:text-4xl font-black">
                        R$ {calcularTotal().toFixed(2)}
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
            <p className="text-xs sm:text-sm text-yellow-800 font-semibold">
              ⚠️ Não há lotes disponíveis no momento. Entre em contato com a organização do evento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
