// Step3Kit.tsx
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Flag, Shirt, Ruler, AlertCircle } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

interface Step3Props {
  form: UseFormReturn<InscricaoCompleta>;
}

interface Kit {
  id: string;
  nome: string;
  preco: number;
  itens: string;
}

const tamanhos = [
  {
    value: "P",
    label: "P",
    nome: "Pequeno",
    medidas: "Largura: 50cm | Comprimento: 68cm",
  },
  {
    value: "M",
    label: "M",
    nome: "Médio",
    medidas: "Largura: 54cm | Comprimento: 71cm",
  },
  {
    value: "G",
    label: "G",
    nome: "Grande",
    medidas: "Largura: 58cm | Comprimento: 74cm",
  },
  {
    value: "GG",
    label: "GG",
    nome: "Extra Grande",
    medidas: "Largura: 62cm | Comprimento: 77cm",
  },
  {
    value: "XG",
    label: "XG",
    nome: "Extra Extra Grande",
    medidas: "Largura: 66cm | Comprimento: 80cm",
  },
];

export function Step3Kit({ form }: Step3Props) {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kitsRes = await fetch("/api/kits");
        const kitsData = await kitsRes.json();
        setKits(kitsData);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const kitIdSelecionado = form.watch("kitId");

  const kitSelecionado = kits.find(
    (kit) => kit.id === kitIdSelecionado
  );

  const tamanhoSelecionado = form.watch("tamanhoCamisa");

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#00B8D4] border-t-transparent"></div>
        <p className="text-gray-600 mt-4 font-semibold">Carregando kits disponíveis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#FFE66D] to-[#00B8D4] p-6 rounded-xl">
        <div className="flex items-center gap-3">
          <Shirt className="w-8 h-8 text-[#E53935]" />
          <div>
            <h3 className="text-xl font-black text-[#E53935]">Kit do Participante</h3>
            <p className="text-sm text-gray-700">Selecione o tamanho da sua camisa oficial</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
        <FormField
          control={form.control}
          name="kitId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#E53935] font-bold text-lg flex items-center gap-2">
                <Flag className="w-5 h-5" />
                Escolha seu Kit *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-[#00B8D4] h-12 text-base">
                    <SelectValue placeholder="Selecione o kit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {kits.map((kit) => (
                    <SelectItem key={kit.id} value={kit.id} className="text-base">
                      {kit.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-600">
                Escolha o kit que deseja para a corrida
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {kitSelecionado && (
        <Card className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-3 text-white">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-white text-[#00B8D4] font-bold px-3 py-1">
                  {kitSelecionado.nome}
                </Badge>
                <span className="text-lg font-bold">
                  {kitSelecionado.itens}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <FormField
        control={form.control}
        name="tamanhoCamisa"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#E53935] font-bold text-lg flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Tamanho da Camisa *
            </FormLabel>
            <FormDescription className="text-gray-600 mb-4">
              Escolha o tamanho que melhor se ajusta a você
            </FormDescription>
            <FormControl>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                {tamanhos.map((tamanho) => {
                  const isSelected = field.value === tamanho.value;

                  return (
                    <Card
                      key={tamanho.value}
                      className={`
                        cursor-pointer transition-all hover:shadow-xl transform hover:scale-105
                        ${
                          isSelected
                            ? "border-[#00B8D4] border-4 bg-gradient-to-br from-[#00B8D4] to-[#00a0c0] shadow-lg"
                            : "border-gray-200 hover:border-[#FFE66D] bg-white"
                        }
                      `}
                      onClick={() => field.onChange(tamanho.value)}
                    >
                      <CardContent className="p-4 text-center">
                        {isSelected && (
                          <div className="flex justify-end mb-2">
                            <div className="bg-white rounded-full p-1 shadow-md">
                              <Check className="w-4 h-4 text-[#00B8D4]" />
                            </div>
                          </div>
                        )}

                        <div className={`text-4xl font-black mb-1 ${isSelected ? 'text-white' : 'text-[#E53935]'}`}>
                          {tamanho.label}
                        </div>

                        <div className={`text-xs font-semibold mb-2 ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                          {tamanho.nome}
                        </div>

                        {isSelected && (
                          <Badge variant="secondary" className="text-xs bg-white text-[#00B8D4] font-bold">
                            Selecionado
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {tamanhoSelecionado && (
        <Card className="bg-gradient-to-r from-[#FFE66D] to-[#00B8D4] border-none shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="text-2xl px-4 py-2 bg-white text-[#E53935] font-black">
                  {tamanhoSelecionado}
                </Badge>
                <span className="font-black text-xl text-[#E53935]">
                  {tamanhos.find((t) => t.value === tamanhoSelecionado)?.nome}
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="font-bold mb-2 text-[#E53935] flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Medidas aproximadas:
                </p>
                <p className="text-gray-700 font-semibold">
                  {tamanhos.find((t) => t.value === tamanhoSelecionado)?.medidas}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-[#00B8D4]">
                <p className="font-bold mb-2 text-[#00B8D4] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Dica:
                </p>
                <p className="text-gray-700 text-sm">
                  Se você estiver em dúvida entre dois tamanhos, recomendamos escolher o tamanho maior para maior conforto durante a corrida.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white border-2 border-gray-200">
        <CardContent className="pt-6">
          <h4 className="font-black text-[#E53935] mb-3 text-lg flex items-center gap-2">
            <Shirt className="w-5 h-5" />
            Informações Importantes
          </h4>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#00B8D4] font-bold">•</span>
              <span>A camisa é de tecido tecnológico dry-fit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00B8D4] font-bold">•</span>
              <span>Não será possível trocar o tamanho após a inscrição</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00B8D4] font-bold">•</span>
              <span>Escolha com atenção baseando-se nas medidas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00B8D4] font-bold">•</span>
              <span>Em caso de dúvida, entre em contato com a organização</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}