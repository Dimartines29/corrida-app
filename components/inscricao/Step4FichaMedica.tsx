import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Heart, Phone, Shield } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

interface Step4Props {
  form: UseFormReturn<InscricaoCompleta>;
}

export function Step4FichaMedica({ form }: Step4Props) {
  const declaracaoAceita = form.watch("declaracaoSaude");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Ficha Médica e Declaração de Saúde
        </h3>
        <p className="text-sm text-gray-600">
          Estas informações são importantes para sua segurança durante o evento.
        </p>
      </div>

      {/* Aviso importante */}
      <Alert className="bg-yellow-50 border-yellow-300">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-sm text-yellow-800">
          Em caso de emergência, entraremos em contato com a pessoa indicada
          abaixo. Certifique-se de informar dados corretos.
        </AlertDescription>
      </Alert>

      {/* Possui Plano de Saúde */}
      <FormField
        control={form.control}
        name="possuiPlanoSaude"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-gray-50">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Possuo plano de saúde
              </FormLabel>
              <FormDescription>
                Esta informação ajuda a organização em caso de emergência
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {/* Card de Contato de Emergência */}
      <Card className="border-blue-200">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-blue-500" />
            <h4 className="font-semibold text-gray-800">
              Contato de Emergência
            </h4>
          </div>

          {/* Nome do Contato */}
          <FormField
            control={form.control}
            name="contatoEmergencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome da pessoa para contato"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Informe um familiar ou amigo próximo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Telefone do Contato */}
          <FormField
            control={form.control}
            name="telefoneEmergencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(11) 98765-4321"
                    maxLength={15}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Número com DDD para contato em emergências
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Declaração de Saúde - OBRIGATÓRIO */}
      <Card
        className={`border-2 ${
          declaracaoAceita
            ? "border-green-300 bg-green-50"
            : "border-red-300 bg-red-50"
        }`}
      >
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 mb-4">
            <Shield
              className={`w-6 h-6 flex-shrink-0 ${
                declaracaoAceita ? "text-green-600" : "text-red-600"
              }`}
            />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Declaração de Saúde e Responsabilidade
              </h4>
              <div className="text-sm text-gray-700 space-y-2 mb-4">
                <p>
                  Ao participar deste evento, declaro que:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Estou em boas condições de saúde física e mental para
                    participar da corrida
                  </li>
                  <li>
                    Não possuo nenhuma condição médica que me impeça de
                    praticar atividades físicas intensas
                  </li>
                  <li>
                    Consultei um médico recentemente e fui considerado(a) apto(a)
                    para corridas
                  </li>
                  <li>
                    Assumo total responsabilidade por minha participação no
                    evento
                  </li>
                  <li>
                    Isento a organização de qualquer responsabilidade sobre
                    problemas de saúde que possam ocorrer durante ou após o
                    evento
                  </li>
                </ul>
              </div>

              <FormField
                control={form.control}
                name="declaracaoSaude"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-semibold">
                        Li e aceito a declaração acima *
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {!declaracaoAceita && (
            <Alert className="mt-4 bg-white border-red-300">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-800">
                Você precisa aceitar a declaração de saúde para prosseguir com
                a inscrição.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Informação adicional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900">
            <strong>💡 Recomendação:</strong> Antes de qualquer evento
            esportivo, é importante passar por uma avaliação médica. Consulte
            seu médico e realize exames cardiológicos se necessário.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
