// app/api/cupons/validar/route.ts

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const { codigo, valorLote } = await request.json()

    if (!codigo) {
      return NextResponse.json(
        { error: "Código do cupom é obrigatório" },
        { status: 400 }
      )
    }

    // Buscar cupom
    const cupom = await prisma.cupom.findUnique({
      where: { codigo: codigo.toUpperCase() },
      include: {
        _count: {
          select: { inscricoes: true }
        }
      }
    })

    if (!cupom) {
      return NextResponse.json(
        { error: "Cupom não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se está ativo
    if (!cupom.ativo) {
      return NextResponse.json(
        { error: "Cupom inativo" },
        { status: 400 }
      )
    }

    // Verificar validade
    const agora = new Date()
    const dataInicio = new Date(cupom.dataInicio)
    const dataValidade = new Date(cupom.dataValidade)

    if (agora < dataInicio) {
      return NextResponse.json(
        { error: "Cupom ainda não está válido" },
        { status: 400 }
      )
    }

    if (agora > dataValidade) {
      return NextResponse.json(
        { error: "Cupom expirado" },
        { status: 400 }
      )
    }

    // Verificar uso máximo
    if (cupom.usoMaximo && cupom._count.inscricoes >= cupom.usoMaximo) {
      return NextResponse.json(
        { error: "Cupom atingiu o limite de usos" },
        { status: 400 }
      )
    }

    // Verificar uso por usuário
    if (cupom.usoPorUsuario) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        const usosDoUsuario = await prisma.inscricao.count({
          where: {
            userId: user.id,
            cupomId: cupom.id
          }
        })

        if (usosDoUsuario >= cupom.usoPorUsuario) {
          return NextResponse.json(
            { error: "Você já utilizou este cupom o número máximo de vezes" },
            { status: 400 }
          )
        }
      }
    }

    // Verificar valor mínimo (apenas do lote)
    if (cupom.valorMinimo && valorLote < cupom.valorMinimo) {
      return NextResponse.json(
        { 
          error: `Este cupom é válido apenas para inscrições acima de R$ ${cupom.valorMinimo.toFixed(2)}` 
        },
        { status: 400 }
      )
    }

    // Calcular desconto (APENAS no valor do lote)
    let valorDesconto = 0
    if (cupom.tipoDesconto === "PERCENTUAL") {
      valorDesconto = (valorLote * cupom.desconto) / 100
    } else {
      valorDesconto = cupom.desconto
    }

    // Não permitir desconto maior que o valor do lote
    if (valorDesconto > valorLote) {
      valorDesconto = valorLote
    }

    return NextResponse.json({
      valido: true,
      cupom: {
        id: cupom.id,
        codigo: cupom.codigo,
        desconto: cupom.desconto,
        tipoDesconto: cupom.tipoDesconto,
        valorDesconto: valorDesconto,
        origem: cupom.origem
      }
    })

  } catch (error) {
    console.error("Erro ao validar cupom:", error)
    return NextResponse.json(
      { error: "Erro ao validar cupom" },
      { status: 500 }
    )
  }
}
