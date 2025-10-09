import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const inscricoes = await prisma.inscricao.findMany({
      select: {
        id: true,
        nomeCompleto: true,
        cpf: true,
        categoria: true,
        kit: true,
        tamanhoCamisa: true,
        status: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(inscricoes);

  } catch (error) {
    console.error("Erro ao buscar inscrições:", error);

    return NextResponse.json(
      { error: "Erro ao buscar inscrições" },
      { status: 500 }
    );
  }
}
