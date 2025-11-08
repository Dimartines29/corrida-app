// app/api/inscricoes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // ✅ Usuário precisa estar logado
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const inscricao = await prisma.inscricao.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        lote: true,
        pagamento: true,
      },
    });

    if (!inscricao) {
      return NextResponse.json(
        { error: "Inscrição não encontrada" },
        { status: 404 }
      );
    }

    const isOwner = inscricao.userId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Sem permissão para acessar esta inscrição" },
        { status: 403 }
      );
    }

    return NextResponse.json(inscricao);

  } catch (error) {
    console.error("Erro ao buscar inscrição:", error);
    return NextResponse.json(
      { error: "Erro ao buscar inscrição" },
      { status: 500 }
    );
  }
}