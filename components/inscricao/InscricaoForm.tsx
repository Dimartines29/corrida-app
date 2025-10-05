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
      dataNascimento: "",
      telefone: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      categoriaId: "",
      loteId: "",
      tamanhoCamisa: "",
      possuiPlanoSaude: false,
      contatoEmergencia: "",
      telefoneEmergencia: "",
      declaracaoSaude: false,
    },
    mode: "onChange",
  });

  const stepSchemas = [
    step1Schema,
    step2Schema,
    step3Schema,
    step4Schema,
  ];

  const handleNext = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentStep === 5) return;

    const currentSchema = stepSchemas[currentStep - 1];
    const values = form.getValues();
    const result = await currentSchema.safeParseAsync(values);

    if (result.success) {
      setCurrentStep(currentStep + 1);
    } else {
      result.error.issues.forEach((issue) => {
        form.setError(issue.path[0] as any, {
          type: "manual",
          message: issue.message,
        });
      });
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: InscricaoCompleta) => {
    if (currentStep !== 5) {
      return;
    }

    setIsSubmitting(true);

    try {
      const inscricaoResponse = await fetch("/api/inscricao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const inscricaoResult = await inscricaoResponse.json();

      if (!inscricaoResponse.ok) {
        alert(inscricaoResult.error || "Erro ao criar inscrição");
        return;
      }

      const pagamentoResponse = await fetch('/api/pagamento/criar-preferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inscricaoId: inscricaoResult.inscricao.id
        })
      });

      const pagamentoResult = await pagamentoResponse.json();

      if (!pagamentoResponse.ok) {
        alert(`Inscrição criada, mas erro ao gerar pagamento: ${pagamentoResult.error}`);
        window.location.href = `/dashboard`;
        return;
      }

      const checkoutUrl = pagamentoResult.sandboxInitPoint;

      if (checkoutUrl) {
        alert(
          `✅ Inscrição criada com sucesso!\n\n` +
          `Código: ${inscricaoResult.inscricao.codigo}\n` +
          `Categoria: ${inscricaoResult.inscricao.categoria}\n` +
          `Valor: R$ ${inscricaoResult.inscricao.valor.toFixed(2)}\n\n` +
          `Você será redirecionado para o pagamento...`
        );

        window.location.href = checkoutUrl;
      } else {
        alert("Erro: Link de pagamento não foi gerado");
        window.location.href = `/dashboard`;
      }

    } catch (error) {
      alert(
        "Erro ao processar inscrição. " +
        "Verifique sua conexão e tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFE66D] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="shadow-2xl rounded-2xl overflow-hidden bg-white">
          <div className="bg-[#E53935] text-white py-8 relative">
            {/* Logo à esquerda */}
            <img
              src="/logo-chris.png"
              alt="Todo Mundo Corre com o Chris"
              className="h-16 w-auto absolute left-6 top-1/2 -translate-y-1/2"
            />

            {/* Título centralizado */}
            <h2 className="text-xl md:text-2xl font-black text-white text-center">
              FORMULÁRIO DE INSCRIÇÃO
            </h2>
          </div>

          <div className="p-6 md:p-8 bg-white">
            <ProgressIndicator currentStep={currentStep} totalSteps={5} />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && currentStep !== 5) {
                    e.preventDefault();
                  }
                }}
              >

                {currentStep === 1 && <Step1DadosPessoais form={form} />}
                {currentStep === 2 && <Step2CategoriaLote form={form} />}
                {currentStep === 3 && <Step3Kit form={form} />}
                {currentStep === 4 && <Step4FichaMedica form={form} />}
                {currentStep === 5 && <Step5Revisao form={form} />}

                <div className="flex justify-between pt-6 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => handleBack(e)}
                    disabled={currentStep === 1}
                    className="border-2 border-gray-300 hover:border-[#00B8D4] hover:bg-[#00B8D4] hover:text-white transition-all px-8"
                  >
                    Voltar
                  </Button>

                  {currentStep < 5 ? (
                    <Button
                      type="button"
                      onClick={(e) => handleNext(e)}
                      className="bg-[#E53935] hover:bg-[#c62828] text-white font-bold px-8 transition-all transform hover:scale-105"
                    >
                      Próximo
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#00B8D4] hover:bg-[#00a0c0] text-white font-bold px-8 transition-all transform hover:scale-105"
                    >
                      {isSubmitting ? "Processando..." : "Confirmar Inscrição"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-700">
            Dúvidas? Entre em contato: <strong className="text-[#E53935]">contato@corridachris.com.br</strong>
          </p>
        </div>
      </div>
    </div>
  );
}