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

  const handleNext = async () => {
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: InscricaoCompleta) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inscricao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar inscrição");
      }

      const result = await response.json();

      console.log("Inscrição criada:", result);

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar inscrição. Tente novamente.");
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {currentStep === 1 && <Step1DadosPessoais form={form} />}
              {currentStep === 2 && <Step2CategoriaLote form={form} />}
              {currentStep === 3 && <div>Step 3 - Em breve</div>}
              {currentStep === 4 && <div>Step 4 - Em breve</div>}
              {currentStep === 5 && <div>Step 5 - Em breve</div>}

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Voltar
                </Button>

                {currentStep < 5 ? (
                  <Button type="button" onClick={handleNext}>
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
