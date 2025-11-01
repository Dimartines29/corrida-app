import { se } from "date-fns/locale";
import { z } from "zod";

const validarCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  const digitoVerificador1 = resto >= 10 ? 0 : resto;

  if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  const digitoVerificador2 = resto >= 10 ? 0 : resto;

  return digitoVerificador2 === parseInt(cpf.charAt(10));
};

export const step1Schema = z.object({
  nomeCompleto: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome muito longo"),

  cpf: z
    .string()
    .min(11, "CPF inválido")
    .refine(validarCPF, "CPF inválido"),

  sexo: z
    .string()
    .refine(
      (val) => ["Masculino", "Feminino", "Outro"].includes(val),
      { message: "Selecione uma opção válida para sexo" }
    ),

  rg: z
    .string()
    .min(5, "RG deve ter no mínimo 5 caracteres")
    .max(20, "RG inválido"),

  dataNascimento: z
    .string()
    .refine((data) => {
      const nascimento = new Date(data);
      const hoje = new Date();
      const idade = hoje.getFullYear() - nascimento.getFullYear();
      return idade >= 18;
    }, "Você deve ter pelo menos 18 anos"),

  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/,
      "Formato inválido. Use (99) 99999-9999"),

  endereco: z
    .string()
    .min(5, "Endereço muito curto"),

  bairro: z
    .string()
    .min(3, "Bairro obrigatório"),

  cidade: z
    .string()
    .min(2, "Cidade inválida"),

  estado: z
    .string()
    .length(2, "Use a sigla do estado (ex: SP, RJ)")
    .toUpperCase(),

  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido. Use o formato 99999-999"),
});

export const step2Schema = z.object({
  categoria: z
    .string()
    .min(1, "Selecione uma categoria"),

  loteId: z
    .string()
    .min(1, "Selecione um lote"),

  retiradaKit: z
    .string()
    .refine(
      (val) => ["The Chris - Shopping do avião", "The Chris - Monte Carmo Shopping"].includes(val),
      { message: "Selecione uma opção válida para retirada do kit" }
    ),

  valeAlmoco: z
    .boolean(),
});

export const step3Schema = z.object({
  tamanhoCamisa: z
    .string()
    .refine(
      (val) => ["PP", "P", "M", "G", "GG", "XG"].includes(val),
      { message: "Selecione um tamanho válido" }
    ),
});

export const step4Schema = z.object({
  possuiPlanoSaude: z
    .boolean(),

  contatoEmergencia: z
    .string()
    .min(3, "Nome do contato é obrigatório"),

  telefoneEmergencia: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/,
      "Formato inválido. Use (99) 99999-9999"),

  declaracaoSaude: z
    .boolean()
    .refine((val) => val === true,
      "Você deve aceitar a declaração de saúde"),
});

export const inscricaoCompletaSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
});

// Schema específico para inscrição manual (admin)
export const inscricaoManualSchema = inscricaoCompletaSchema.extend({
  statusInscricao: z
    .enum(["PENDENTE", "PAGO", "CANCELADO"])
    .default("PENDENTE"),

  statusPagamento: z
    .enum(["PENDENTE", "APROVADO", "RECUSADO", "REEMBOLSADO"])
    .default("PENDENTE"),

  metodoPagamento: z
    .string()
    .min(1, "Método de pagamento é obrigatório")
    .default("manual"),

  enviarEmail: z
    .boolean()
    .default(true),
});

export type InscricaoManual = z.infer<typeof inscricaoManualSchema>;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
export type InscricaoCompleta = z.infer<typeof inscricaoCompletaSchema>;
