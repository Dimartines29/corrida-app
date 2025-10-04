"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Inscrição para Corrida
          </CardTitle>
        </CardHeader>

        <CardContent>
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

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleBack(e)}
                  disabled={currentStep === 1}
                >
                  Voltar
                </Button>

                {currentStep < 5 ? (
                  <Button
                    type="button"
                    onClick={(e) => handleNext(e)}
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processando..." : "Confirmar Inscrição"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
