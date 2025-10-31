// app/api/pagamento/confirmar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { inscricaoId, paymentId } = await request.json();

    if (!inscricaoId) {
      return NextResponse.json({ error: 'inscricaoId obrigatório' }, { status: 400 });
    }

    const inscricao = await prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      include: { pagamento: true },
    });

    if (!inscricao) {
      return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
    }

    if (inscricao.userId !== session.user.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    if (inscricao.status === 'PAGO') {
      return NextResponse.json({ success: true, message: 'Já processado' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.inscricao.update({
        where: { id: inscricaoId },
        data: { status: 'PAGO' },
      });

      await tx.pagamento.update({
        where: { inscricaoId },
        data: {
          status: 'APROVADO',
          metodoPagamento: 'card',
          ...(paymentId && { transacaoId: paymentId }),
        },
      });
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erro ao confirmar:", error);
    return NextResponse.json({ error: 'Erro ao confirmar' }, { status: 500 });
  }
}
