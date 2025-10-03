import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const agora = new Date();

    const lotes = await prisma.lote.findMany({
      where: {
        ativo: true,
        dataInicio: {
          lte: agora,
        },
        dataFim: {
          gte: agora,
        },
      },
      select: {
        id: true,
        nome: true,
        preco: true,
        dataInicio: true,
        dataFim: true,
      },
      orderBy: {
        dataInicio: "asc",
      },
    });

    return NextResponse.json(lotes);

  } catch (error) {
    console.error("Erro ao buscar lotes:", error);

    return NextResponse.json(
      { error: "Erro ao buscar lotes" },
      { status: 500 }
    );
  }
}
