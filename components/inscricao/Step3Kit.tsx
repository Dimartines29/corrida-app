import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

interface Step3Props {
  form: UseFormReturn<InscricaoCompleta>;
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
  const tamanhoSelecionado = form.watch("tamanhoCamisa");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Kit do Participante</h3>
        <p className="text-sm text-gray-600">
          Selecione o tamanho da sua camisa. Você receberá sua camisa oficial
          da corrida no dia da retirada do kit.
        </p>
      </div>

      <FormField
        control={form.control}
        name="tamanhoCamisa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tamanho da Camisa *</FormLabel>
            <FormDescription>
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
                        cursor-pointer transition-all hover:shadow-md
                        ${
                          isSelected
                            ? "border-blue-500 border-2 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }
                      `}
                      onClick={() => field.onChange(tamanho.value)}
                    >
                      <CardContent className="p-4 text-center">
                        {/* Check icon se selecionado */}
                        {isSelected && (
                          <div className="flex justify-end mb-2">
                            <div className="bg-blue-500 rounded-full p-1">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}

                        {/* Label grande do tamanho */}
                        <div className="text-3xl font-bold text-gray-800 mb-1">
                          {tamanho.label}
                        </div>

                        {/* Nome do tamanho */}
                        <div className="text-xs font-medium text-gray-600 mb-2">
                          {tamanho.nome}
                        </div>

                        {/* Badge se selecionado */}
                        {isSelected && (
                          <Badge variant="secondary" className="text-xs">
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

      {/* Card com informações do tamanho selecionado */}
      {tamanhoSelecionado && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {tamanhoSelecionado}
                </Badge>
                <span className="font-semibold text-gray-800">
                  {
                    tamanhos.find((t) => t.value === tamanhoSelecionado)
                      ?.nome
                  }
                </span>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">📏 Medidas aproximadas:</p>
                <p>
                  {
                    tamanhos.find((t) => t.value === tamanhoSelecionado)
                      ?.medidas
                  }
                </p>
              </div>
              <div className="text-xs text-gray-600 mt-3 p-3 bg-white rounded border border-blue-200">
                <p className="font-medium mb-1">💡 Dica:</p>
                <p>
                  Se você estiver em dúvida entre dois tamanhos, recomendamos
                  escolher o tamanho maior para maior conforto durante a
                  corrida.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações adicionais */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-gray-800 mb-2">
            ℹ️ Informações Importantes
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• A camisa é de tecido tecnológico dry-fit</li>
            <li>• Não será possível trocar o tamanho após a inscrição</li>
            <li>• Escolha com atenção baseando-se nas medidas</li>
            <li>
              • Em caso de dúvida, entre em contato com a organização
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
