// lib/validations/cupom.ts

import { z } from "zod"

// Regex para apenas letras maiúsculas e números
const codigoRegex = /^[A-Z0-9]+$/

export const cupomSchema = z.object({
  codigo: z
    .string()
    .min(3, "Código deve ter no mínimo 3 caracteres")
    .max(20, "Código deve ter no máximo 20 caracteres")
    .regex(codigoRegex, "Apenas letras MAIÚSCULAS e números são permitidos")
    .transform(str => str.toUpperCase()),

  desconto: z
    .number()
    .min(0.01, "Desconto deve ser maior que 0")
    .max(100, "Desconto não pode ser maior que 100"),

  tipoDesconto: z.enum(["PERCENTUAL", "FIXO"], {
    message: "Tipo de desconto é obrigatório",
  }),

  origem: z
    .string()
    .min(2, "Origem deve ter no mínimo 2 caracteres")
    .max(100, "Origem deve ter no máximo 100 caracteres"),

  ativo: z.boolean(),

  dataInicio: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Data inválida"),

  dataValidade: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Data inválida"),

  usoMaximo: z
    .number()
    .int()
    .min(1)
    .nullable()
    .optional(),

  usoPorUsuario: z
    .number()
    .int()
    .min(1)
    .nullable()
    .optional(),

  valorMinimo: z
    .number()
    .min(0)
    .nullable()
    .optional(),
}).refine(
  (data) => new Date(data.dataInicio) < new Date(data.dataValidade),
  {
    message: "Data de início deve ser anterior à data de validade",
    path: ["dataValidade"],
  }
)

export const cupomUpdateSchema = z.object({
  desconto: z.number().min(0.01).max(100).optional(),
  tipoDesconto: z.enum(["PERCENTUAL", "FIXO"]).optional(),
  origem: z.string().min(2).max(100).optional(),
  ativo: z.boolean().optional(),
  dataInicio: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
  dataValidade: z.string().refine((date) => !isNaN(Date.parse(date))).optional(),
  usoMaximo: z.number().int().min(1).nullable().optional(),
  usoPorUsuario: z.number().int().min(1).nullable().optional(),
  valorMinimo: z.number().min(0).nullable().optional(),
})

export type CupomFormData = z.infer<typeof cupomSchema>
export type CupomUpdateData = z.infer<typeof cupomUpdateSchema>
