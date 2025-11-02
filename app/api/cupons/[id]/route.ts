// app/api/cupons/[id]/route.ts

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma";
import { cupomUpdateSchema } from "@/lib/validations/cupom"
import type { Cupom } from "@/types/types"

// PUT - Atualizar cupom
export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = cupomUpdateSchema.parse(body)

    // Verificar se cupom existe
    const cupomExistente = await prisma.cupom.findUnique({
      where: { id: params.id }
    })

    if (!cupomExistente) {
      return NextResponse.json(
        { error: "Cupom não encontrado" },
        { status: 404 }
      )
    }

    // Preparar dados para atualização
    const updateData: Partial<Omit<Cupom, 'id' | 'codigo' | 'createdAt' | 'updatedAt' | 'totalUsos' | 'expirado'>> = {}

    if (validatedData.desconto !== undefined) updateData.desconto = validatedData.desconto
    if (validatedData.tipoDesconto !== undefined) updateData.tipoDesconto = validatedData.tipoDesconto
    if (validatedData.origem !== undefined) updateData.origem = validatedData.origem
    if (validatedData.ativo !== undefined) updateData.ativo = validatedData.ativo
    if (validatedData.dataInicio !== undefined) updateData.dataInicio = new Date(validatedData.dataInicio)
    if (validatedData.dataValidade !== undefined) updateData.dataValidade = new Date(validatedData.dataValidade)
    if (validatedData.usoMaximo !== undefined) updateData.usoMaximo = validatedData.usoMaximo
    if (validatedData.usoPorUsuario !== undefined) updateData.usoPorUsuario = validatedData.usoPorUsuario
    if (validatedData.valorMinimo !== undefined) updateData.valorMinimo = validatedData.valorMinimo

    // Atualizar cupom
    const cupom = await prisma.cupom.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(cupom)

  } catch (error) {
    console.error("Erro ao atualizar cupom:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao atualizar cupom" },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete (desativar cupom)
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    // Verificar se cupom existe
    const cupomExistente = await prisma.cupom.findUnique({
      where: { id: params.id }
    })

    if (!cupomExistente) {
      return NextResponse.json(
        { error: "Cupom não encontrado" },
        { status: 404 }
      )
    }

    // Soft delete - apenas desativar
    const cupom = await prisma.cupom.update({
      where: { id: params.id },
      data: { ativo: false }
    })

    return NextResponse.json({
      message: "Cupom desativado com sucesso",
      cupom
    })

  } catch (error) {
    console.error("Erro ao deletar cupom:", error)
    return NextResponse.json(
      { error: "Erro ao deletar cupom" },
      { status: 500 }
    )
  }
}
