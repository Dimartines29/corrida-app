// Step3Kit.tsx
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shirt, Ruler, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

interface Step3Props {
  form: UseFormReturn<InscricaoCompleta>;
}

const tamanhos = [
  {
    value: "PP",
    label: "PP",
    nome: "Extra Pequeno",
    medidas: "Largura: 49cm | Comprimento: 65cm",
  },
  {
    value: "P",
    label: "P",
    nome: "Pequeno",
    medidas: "Largura: 51cm | Comprimento: 67cm",
  },
  {
    value: "M",
    label: "M",
    nome: "Médio",
    medidas: "Largura: 54cm | Comprimento: 70cm",
  },
  {
    value: "G",
    label: "G",
    nome: "Grande",
    medidas: "Largura: 56cm | Comprimento: 73cm",
  },
  {
    value: "GG",
    label: "GG",
    nome: "Extra Grande",
    medidas: "Largura: 59cm | Comprimento: 76cm",
  },
  {
    value: "XG",
    label: "XG",
    nome: "Extra Extra Grande",
    medidas: "Largura: 63cm | Comprimento: 79cm",
  },
];

export function Step3Kit({ form }: Step3Props) {
  const tamanhoSelecionado = form.watch("tamanhoCamisa");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r bg-[#FFE66D] p-4 sm:p-6 rounded-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <Shirt className="w-6 h-6 sm:w-8 sm:h-8 text-[#E53935]" />
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#E53935]">Tamanho da Camisa</h3>
            <p className="text-xs sm:text-sm text-gray-700">Escolha o tamanho que melhor se ajusta a você</p>
          </div>
        </div>
      </div>

      <FormField control={form.control} name="tamanhoCamisa" render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                {tamanhos.map((tamanho) => {
                  const isSelected = field.value === tamanho.value;

                  return (
                    <Card key={tamanho.value} className={`cursor-pointer transition-all hover:shadow-xl transform hover:scale-105 ${isSelected? "border-[#00B8D4] border-4 bg-gradient-to-br from-[#00B8D4] to-[#00a0c0] shadow-lg": "border-gray-200 hover:border-[#FFE66D] bg-white"}`}onClick={() => field.onChange(tamanho.value)}>
                      <CardContent className="p-2 sm:p-3 text-center h-[70px] sm:h-[90px] flex flex-col items-center justify-center relative">

                        {isSelected && (<div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1"><div className="bg-white rounded-full p-0.5 shadow-md"><Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00B8D4]" /></div></div>)}

                        <div className={`text-2xl sm:text-3xl font-black mb-0.5 ${isSelected ? 'text-white' : 'text-[#E53935]'}`}>{tamanho.label}</div>

                        <div className={`text-[10px] sm:text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>{tamanho.nome}</div>
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

      <Alert className="bg-yellow-50 border-2 border-yellow-400">
        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
        <AlertDescription className="text-sm sm:text-base text-yellow-800 font-semibold">⚠️ O tamanho escolhido é definitivo e não poderá ser alterado!
        </AlertDescription>
      </Alert>

      {tamanhoSelecionado && (
        <Card className="bg-gradient-to-r bg-[#FFE66D] border-none shadow-lg">
          <CardContent className="pt-4 sm:pt-6">
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Badge variant="secondary" className="text-xl sm:text-2xl px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-[#E53935] font-black">
                  {tamanhoSelecionado}
                </Badge>

                <span className="font-black text-lg sm:text-xl text-[#E53935]">{tamanhos.find((t) => t.value === tamanhoSelecionado)?.nome}</span>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg">
                <p className="font-bold mb-1 sm:mb-2 text-[#E53935] flex items-center gap-2 text-sm sm:text-base"> <Ruler className="w-3 h-3 sm:w-4 sm:h-4" />Medidas aproximadas:</p>
                <p className="text-gray-700 font-semibold text-xs sm:text-base">{tamanhos.find((t) => t.value === tamanhoSelecionado)?.medidas}</p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-[#00B8D4]">
                <p className="font-bold mb-1 sm:mb-2 text-[#00B8D4] flex items-center gap-2 text-sm sm:text-base"><AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />Dica:</p>
                <p className="text-gray-700 text-xs sm:text-sm">Se você estiver em dúvida entre dois tamanhos, recomendamos escolher o tamanho maior para maior conforto durante a corrida.</p>
              </div>
            </div><br></br>

            <h4 className="font-black text-[#E53935] mb-2 text-base sm:text-lg flex gap-2"><Shirt className="w-5 h-5 sm:w-6 sm:h-6" />Informações Importantes</h4>

            <ul className="space-y-1.5 sm:space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#00B8D4] font-bold">•</span>
                <span className="text-gray-700 font-semibold text-xs sm:text-sm">A camisa é de tecido tecnológico dry-fit</span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-[#00B8D4] font-bold">•</span>
                <span className="text-gray-700 font-semibold text-xs sm:text-sm">Escolha com atenção baseando-se nas medidas</span>
              </li>

              <li className="flex items-start gap-2">
                <span className="text-[#00B8D4] font-bold">•</span>
                <span className="text-gray-700 font-semibold text-xs sm:text-sm">Em caso de dúvida, entre em contato com a organização</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
