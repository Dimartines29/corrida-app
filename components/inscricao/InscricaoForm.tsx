// InscricaoForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ProgressIndicator } from "./ProgressIndicator";
import { Step1DadosPessoais } from "./Step1DadosPessoais";
import { Step2CategoriaLote } from "./Step2CategoriaLote";
import { Step3Kit } from "./Step3Kit";
import { Step4FichaMedica } from "./Step4FichaMedica";
import { Step5Revisao } from "./Step5Revisao";
import { inscricaoCompletaSchema, step1Schema, step2Schema, step3Schema, step4Schema, type InscricaoCompleta } from "@/lib/validations/inscricao";

export function InscricaoForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InscricaoCompleta>({
    resolver: zodResolver(inscricaoCompletaSchema),
    defaultValues: {
      nomeCompleto: "",
      cpf: "",
      rg: "",
      sexo: "",
      dataNascimento: "",
      telefone: "",
      endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      categoria: "",
      loteId: "",
      retiradaKit: "The Chris Monte Carmo Shopping",
      tamanhoCamisa: "",
      possuiPlanoSaude: false,
      valeAlmoco: false,
      contatoEmergencia: "",
      telefoneEmergencia: "",
      declaracaoSaude: false,
    },
    mode: "onChange",
  });

  const stepSchemas = [step1Schema, step2Schema, step3Schema, step4Schema];

  const handleNext = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (currentStep === 5) return

    const currentSchema = stepSchemas[currentStep - 1]
    const values = form.getValues()
    const result = await currentSchema.safeParseAsync(values)

    if (result.success) {
      setCurrentStep(currentStep + 1)
    } else {
      result.error.issues.forEach((issue) => {
        form.setError(issue.path[0] as keyof InscricaoCompleta, {
          type: "manual",
          message: issue.message,
        })
      })
    }
  }

  const handleBack = (e?: React.MouseEvent) => {
    if (e) {e.preventDefault(); e.stopPropagation();}

    if (currentStep > 1) {setCurrentStep(currentStep - 1);}
  };

  const onSubmit = async (data: InscricaoCompleta) => {
    if (currentStep !== 5) {return;}

    setIsSubmitting(true);

    try {
      // Primeira tentativa de capturar o Device ID
      let deviceId = window.MP_DEVICE_SESSION_ID || null;

      // Se não existir, aguarda 1 segundo e tenta novamente
      if (!deviceId) {
        console.warn('Device ID não encontrado na primeira tentativa. Aguardando...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        deviceId = window.MP_DEVICE_SESSION_ID || null;
      }

      // Se ainda não existir, mostra erro e para
      if (!deviceId) {
        console.error('Device ID não foi gerado após tentativas');
        alert(
          'Erro ao gerar identificador de segurança.\n\n' +
          'Por favor, recarregue a página e tente novamente.\n\n' +
          'Se o problema persistir, limpe o cache do navegador.'
        );
        return;
      }

      const inscricaoResponse = await fetch("/api/inscricao", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          ...data,
          deviceId: deviceId
        })
      });

      const inscricaoResult = await inscricaoResponse.json();

      if (!inscricaoResponse.ok) {
        alert(inscricaoResult.error || "Erro ao criar inscrição");
        return;
      }

      const pagamentoResponse = await fetch('/api/pagamento/criar-preferencia', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ inscricaoId: inscricaoResult.inscricao.id})
      });

      const pagamentoResult = await pagamentoResponse.json();

      if (!pagamentoResponse.ok) {
        alert(`Inscrição criada, mas erro ao gerar pagamento: ${pagamentoResult.error}`);
        window.location.href = `/minha-area`;
        return;
      }

      const checkoutUrl = pagamentoResult.initPoint;

      if (checkoutUrl) {
        alert(
          `✅ Inscrição criada com sucesso!\n\n` +
          `Código: ${inscricaoResult.inscricao.codigo}\n` +
          `Categoria: ${inscricaoResult.inscricao.categoria}\n` +
          `Valor: R$ ${inscricaoResult.inscricao.valor.toFixed(2)}\n\n` +
          `Você será redirecionado para o pagamento...`
        );

        window.location.href = `/pagamento/escolher-metodo?inscricaoId=${inscricaoResult.inscricao.id}`;
      }

      else {
        alert("Erro: Link de pagamento não foi gerado");
        window.location.href = `/minha-area`;
      }
    }

    catch (error) {
      console.error('Erro ao processar inscrição:', error);
      alert("Erro ao processar inscrição. " + "Verifique sua conexão e tente novamente.");
    }

    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFE66D] py-6 sm:py-8 md:py-12 px-3 sm:px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden bg-white">
          <div className="bg-[#E53935] text-white py-6 sm:py-8 px-4 sm:px-6 relative">
            {/* Logo à esquerda - Responsivo */}
            <img src="/logo-chris.png" alt="Todo Mundo Corre com o Chris" className="h-10 sm:h-12 md:h-16 w-auto absolute left-3 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 hidden sm:block"/>

            {/* Título centralizado - Responsivo */}
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white text-center px-2 sm:px-0"> FORMULÁRIO DE INSCRIÇÃO</h2>
          </div>

          <div className="p-4 sm:p-6 md:p-8 bg-white">
            <ProgressIndicator currentStep={currentStep} totalSteps={5} />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6" onKeyDown={(e) => {if (e.key === "Enter" && currentStep !== 5) {e.preventDefault();}}}>

                {currentStep === 1 && <Step1DadosPessoais form={form} />}
                {currentStep === 2 && <Step2CategoriaLote form={form} />}
                {currentStep === 3 && <Step3Kit form={form} />}
                {currentStep === 4 && <Step4FichaMedica form={form} />}
                {currentStep === 5 && <Step5Revisao form={form} />}

                <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 gap-3 sm:gap-4">
                  {currentStep > 1 && (
                    <Button type="button" onClick={(e) => handleBack(e)} className="w-full sm:w-auto bg-[#E53935] hover:bg-[#c62828] text-white font-bold px-6 sm:px-8 transition-all transform hover:scale-105 order-2 sm:order-1"> Voltar</Button>)}

                  {currentStep < 5 ? (
                    <Button type="button" onClick={(e) => handleNext(e)} className="w-full sm:w-auto bg-[#E53935] hover:bg-[#c62828] text-white font-bold px-6 sm:px-8 transition-all transform hover:scale-105 sm:ml-auto order-1 sm:order-2">Próximo</Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-[#E53935] hover:bg-[#c62828] text-white font-bold px-6 sm:px-8 transition-all transform hover:scale-105 sm:ml-auto order-1 sm:order-2"
                    >
                      {isSubmitting ? "Processando..." : "Confirmar Inscrição"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Footer Info - Responsivo */}
        <div className="mt-4 sm:mt-6 text-center px-2">
          <p className="text-xs sm:text-sm text-gray-700">Dúvidas? Entre em contato: <strong className="text-[#E53935]">studiobravo0@gmail.com</strong></p>
        </div>
      </div>
    </div>
  );
}
