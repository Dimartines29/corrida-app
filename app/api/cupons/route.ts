// app/api/cupons/route.ts

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma";
import { cupomSchema } from "@/lib/validations/cupom"

// GET - Listar todos os cupons
export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const cupons = await prisma.cupom.findMany({
      include: {
        _count: {
          select: { inscricoes: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // Adicionar informação se está expirado
    const cuponsComStatus = cupons.map(cupom => ({
      ...cupom,
      expirado: new Date(cupom.dataValidade) < new Date(),
      totalUsos: cupom._count.inscricoes
    }))

    return NextResponse.json(cuponsComStatus)

  } catch (error) {
    console.error("Erro ao buscar cupons:", error)
    return NextResponse.json(
      { error: "Erro ao buscar cupons" },
      { status: 500 }
    )
  }
}

// POST - Criar novo cupom
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = cupomSchema.parse(body)

    // Verificar se código já existe
    const cupomExistente = await prisma.cupom.findUnique({
      where: { codigo: validatedData.codigo }
    })

    if (cupomExistente) {
      return NextResponse.json(
        { error: "Código de cupom já existe" },
        { status: 400 }
      )
    }

    // Criar cupom
    const cupom = await prisma.cupom.create({
      data: {
        codigo: validatedData.codigo,
        desconto: validatedData.desconto,
        tipoDesconto: validatedData.tipoDesconto,
        origem: validatedData.origem,
        ativo: validatedData.ativo,
        dataInicio: new Date(validatedData.dataInicio),
        dataValidade: new Date(validatedData.dataValidade),
        usoMaximo: validatedData.usoMaximo,
        usoPorUsuario: validatedData.usoPorUsuario,
        valorMinimo: validatedData.valorMinimo,
      }
    })

    return NextResponse.json(cupom, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar cupom:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro ao criar cupom" },
      { status: 500 }
    )
  }
}
