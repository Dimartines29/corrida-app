// Step4FichaMedica.tsx
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Heart, Phone, Shield, UserPlus } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

interface Step4Props {
  form: UseFormReturn<InscricaoCompleta>;
}

export function Step4FichaMedica({ form }: Step4Props) {
  const declaracaoAceita = form.watch("declaracaoSaude");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r bg-[#FFE66D] p-4 sm:p-6 rounded-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-[#E53935]" />

          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#E53935]">Ficha Médica e Declaração de Saúde</h3>

            <p className="text-xs sm:text-sm text-black/90">Informações importantes para sua segurança</p>
          </div>
        </div>
      </div>

      <Alert className="bg-yellow-50 border-2 border-yellow-400">
        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />

        <AlertDescription className="text-sm sm:text-base text-yellow-800 font-semibold">⚠️ Em caso de emergência, entraremos em contato com a pessoa indicada abaixo. Certifique-se de informar dados corretos.</AlertDescription>
      </Alert>

      {/* Plano de Saúde */}
      <div className={`p-4 sm:p-6 rounded-xl border-2 transition-all ${
        form.watch("possuiPlanoSaude") ? "bg-gradient-to-br from-[#00B8D4] to-[#00a0c0] border-[#00B8D4]" : "bg-white border-gray-200 hover:border-[#00B8D4]"}`}>
        <FormField control={form.control} name="possuiPlanoSaude" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} className={`w-4 h-4 sm:w-5 sm:h-5 border-2 ${field.value ? "bg-white border-white data-[state=checked]:bg-white data-[state=checked]:text-[#00B8D4]" : "border-gray-300 data-[state=unchecked]:border-gray-300"}`}/>
              </FormControl>

              <div className="space-y-1 leading-none">
                <FormLabel className={`flex items-center gap-2 font-bold text-sm sm:text-base ${field.value ? "text-white" : "text-[#E53935]"}`}>
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />Possuo plano de saúde
                </FormLabel>

                <FormDescription className={`text-xs sm:text-sm ${field.value ? "text-white/90" : "text-gray-600"}`}>Esta informação ajuda a organização em caso de emergência</FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Contato de Emergência */}
      <Card className="border-2 border-[#00B8D4] bg-gradient-to-br from-white to-[#00B8D4]/5">
        <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#00B8D4]"/>

            <h4 className="font-black text-[#00B8D4] text-base sm:text-lg">Contato de Emergência</h4>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-100 hover:border-[#00B8D4] transition-all">
            <FormField control={form.control} name="contatoEmergencia" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                    <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />Nome Completo *
                  </FormLabel>

                  <FormControl>
                    <Input placeholder="Nome da pessoa para contato" {...field} className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base"/>
                  </FormControl>

                  <FormDescription className="text-gray-600 text-xs sm:text-sm">Informe um familiar ou amigo próximo</FormDescription>

                  <FormMessage/>
                </FormItem>
              )}
            />
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-100 hover:border-[#00B8D4] transition-all">
            <FormField control={form.control} name="telefoneEmergencia" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" /> Telefone *
                  </FormLabel>

                  <FormControl>
                    <Input placeholder="(11) 98765-4321" maxLength={15} {...field} className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base"/>
                  </FormControl>

                  <FormDescription className="text-gray-600 text-xs sm:text-sm">Número com DDD para contato em emergências</FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Declaração de Saúde */}
      <Card
        className={`border-4 transition-all ${declaracaoAceita ? "border-green-400 bg-gradient-to-br from-green-50 to-green-100" : "border-red-400 bg-gradient-to-br from-red-50 to-red-100"}`}>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <Shield className={`w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 ${declaracaoAceita ? "text-green-600" : "text-red-600"}`}/>

            <div className="flex-1">
              <h4 className="font-black text-gray-800 mb-2 sm:mb-3 text-base sm:text-lg">Declaração de Saúde e Responsabilidade</h4>

              <div className="text-xs sm:text-sm text-gray-700 space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 bg-white p-3 sm:p-4 rounded-lg">
                <p className="font-semibold">Ao participar deste evento, declaro que:</p>

                <ul className="list-none space-y-1.5 sm:space-y-2 ml-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00B8D4] font-bold text-xs sm:text-sm">✓</span>
                    <span className="text-xs sm:text-sm">Estou em boas condições de saúde física e mental para participar da corrida</span>
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="text-[#00B8D4] font-bold text-xs sm:text-sm">✓</span>
                    <span className="text-xs sm:text-sm">Não possuo nenhuma condição médica que me impeça de praticar atividades físicas intensas</span>
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="text-[#00B8D4] font-bold text-xs sm:text-sm">✓</span>
                    <span className="text-xs sm:text-sm">Consultei um médico recentemente e fui considerado(a) apto(a) para corridas</span>
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="text-[#00B8D4] font-bold text-xs sm:text-sm">✓</span>
                    <span className="text-xs sm:text-sm">Assumo total responsabilidade por minha participação no evento</span>
                  </li>

                  <li className="flex items-start gap-2">
                    <span className="text-[#00B8D4] font-bold text-xs sm:text-sm">✓</span>
                    <span className="text-xs sm:text-sm">Isento a organização de qualquer responsabilidade sobre problemas de saúde que possam ocorrer durante ou após o evento</span>
                  </li>
                </ul>
              </div>

              <FormField control={form.control} name="declaracaoSaude" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-200">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 data-[state=unchecked]:border-gray-300"/>
                    </FormControl>

                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-black text-[#E53935] text-sm sm:text-base cursor-pointer">Li e aceito a declaração acima *</FormLabel>

                      <FormMessage/>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {!declaracaoAceita && (
            <Alert className="mt-3 sm:mt-4 bg-white border-2 border-red-400">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#dc2626' }} /> {/* Vermelho direto */}
              <AlertDescription className="text-xs sm:text-sm text-red-800 font-semibold">
                Você precisa aceitar a declaração de saúde para prosseguir com a inscrição.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Alert className="bg-yellow-50 border-2 border-yellow-400">
        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
        <AlertDescription className="text-sm sm:text-base text-yellow-800 font-semibold">⚠️ Antes de qualquer evento esportivo, é importante passar por uma avaliação médica. Consulte seu médico e realize exames cardiológicos se necessário.
        </AlertDescription>
      </Alert>
    </div>
  );
}