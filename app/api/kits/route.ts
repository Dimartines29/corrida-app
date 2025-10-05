import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const kits = await prisma.kit.findMany({
      select: {
        id: true,
        nome: true,
        preco: true,
        itens: true,
        disponivel: true,
      },
    });

    return NextResponse.json(kits);

  } catch (error) {
    console.error("Erro ao buscar kits:", error);

    return NextResponse.json(
      { error: "Erro ao buscar kits" },
      { status: 500 }
    );
  }
}
