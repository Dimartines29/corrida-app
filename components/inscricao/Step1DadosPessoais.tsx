// Step1DadosPessoais.tsx
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, FileText, Calendar, Phone, MapPin, Home, Building2 } from "lucide-react";
import type { InscricaoCompleta } from "@/lib/validations/inscricao";

interface Step1Props {
  form: UseFormReturn<InscricaoCompleta>;
}

export function Step1DadosPessoais({ form }: Step1Props) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r bg-[#FFE66D] p-4 sm:p-6 rounded-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <User className="w-6 h-6 sm:w-8 sm:h-8 text-[#E53935]" />
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#E53935]">Dados Pessoais</h3>
            <p className="text-xs sm:text-sm text-gray-700">Preencha suas informações pessoais</p>
          </div>
        </div>
      </div>

      {/* Nome Completo */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
        <FormField
          control={form.control}
          name="nomeCompleto"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                Nome Completo *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="João da Silva"
                  {...field}
                  className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* CPF e RG */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* CPF */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  CPF *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="000.000.000-00"
                    {...field}
                    className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* RG */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
          <FormField
            control={form.control}
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                  RG *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="00.000.000-0"
                    {...field}
                    className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Data de Nascimento e Telefone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Data de Nascimento */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
          <FormField
            control={form.control}
            name="dataNascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  Data de Nascimento *
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base"
                    lang="pt-BR"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Telefone */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  Telefone *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="(00) 00000-0000"
                    {...field}
                    className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* 🆕 SEÇÃO DE ENDEREÇO COMPLETO COM FUNDO AMARELO */}
      <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffe033] p-4 sm:p-6 rounded-xl border-2 border-[#E53935]">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#E53935]" />
          <h4 className="text-base sm:text-lg font-black text-[#E53935]">Endereço Completo</h4>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Endereço e Bairro - LADO A LADO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Endereço */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                      <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                      Endereço *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Avenida Tapajós, 123"
                        {...field}
                        className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bairro */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      Bairro *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Centro"
                        {...field}
                        className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Cidade, Estado e CEP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Cidade */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      Cidade *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Betim"
                        {...field}
                        className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Estado */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      Estado *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MG"
                        maxLength={2}
                        {...field}
                        className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base uppercase"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* CEP */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#E53935] font-bold flex items-center gap-2 text-sm sm:text-base">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      CEP *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00000-000"
                        {...field}
                        className="border-2 focus:border-[#00B8D4] transition-all text-sm sm:text-base"
                      />
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