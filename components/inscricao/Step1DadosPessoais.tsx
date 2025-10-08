// Step1DadosPessoais.tsx
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, FileText, Calendar, Phone, MapPin, Home } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

interface Step1Props {
  form: UseFormReturn<InscricaoCompleta>;
}

export function Step1DadosPessoais({ form }: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r bg-[#FFE66D] p-6 rounded-xl">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-[#E53935]" />

          <div>
            <h3 className="text-xl font-black text-[#E53935]">Dados Pessoais</h3>
            <p className="text-sm text-gray-700">Preencha suas informações pessoais</p>
          </div>
        </div>
      </div>

      {/* Nome Completo */}
      <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
        <FormField control={form.control} name="nomeCompleto" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#E53935] font-bold flex items-center gap-2">
                <User className="w-4 h-4" /> Nome Completo *
              </FormLabel>

              <FormControl>
                <Input placeholder="João da Silva" {...field} className="border-2 focus:border-[#00B8D4] transition-all"/>
              </FormControl>

              <FormMessage/>
            </FormItem>
          )}
        />
      </div>

      {/* CPF e RG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
          <FormField control={form.control} name="cpf" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#E53935] font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4" /> CPF *
                </FormLabel>

                <FormControl>
                  <Input placeholder="000.000.000-00" maxLength={14} {...field} className="border-2 focus:border-[#00B8D4] transition-all"/>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
          <FormField control={form.control} name="rg" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#E53935] font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4" /> RG *
                </FormLabel>

                <FormControl>
                  <Input placeholder="00.000.000-0" {...field} className="border-2 focus:border-[#00B8D4] transition-all"/>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Data de Nascimento e Telefone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
          <FormField control={form.control} name="dataNascimento" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#E53935] font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Data de Nascimento *
                </FormLabel>

                <FormControl>
                  <Input type="date" {...field} className="border-2 focus:border-[#00B8D4] transition-all"/>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
          <FormField control={form.control} name="telefone" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#E53935] font-bold flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Telefone *
                </FormLabel>

                <FormControl>
                  <Input placeholder="(31) 98765-4321" maxLength={15} {...field} className="border-2 focus:border-[#00B8D4] transition-all"/>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-gradient-to-r bg-[#FFE66D] p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-[#E53935]" />
          <h4 className="font-bold text-[#E53935]">Endereço</h4>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
            <FormField control={form.control} name="endereco" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#E53935] font-bold flex items-center gap-2">
                    <Home className="w-4 h-4" /> Endereço Completo *
                  </FormLabel>

                  <FormControl>
                    <Input placeholder="Rua, número, bairro" {...field} className="border-2 focus:border-[#00B8D4] transition-all"/>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
              <FormField control={form.control} name="cidade" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E53935] font-bold">Cidade *</FormLabel>

                    <FormControl>
                      <Input placeholder="Betim" {...field} className="border-2 focus:border-[#00B8D4] transition-all"/>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
              <FormField control={form.control} name="estado" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E53935] font-bold">Estado *</FormLabel>

                    <FormControl>
                      <Input placeholder="MG" maxLength={2} {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} className="border-2 focus:border-[#00B8D4] transition-all"/>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
              <FormField control={form.control} name="cep" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E53935] font-bold">CEP *</FormLabel>

                    <FormControl>
                      <Input placeholder="00000-000" maxLength={9} {...field} className="border-2 focus:border-[#00B8D4] transition-all"/>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}