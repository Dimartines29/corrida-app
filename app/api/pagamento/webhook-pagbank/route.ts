// app/api/pagamento/webhook-pagbank/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // PagBank envia notificações em diferentes formatos
    // Precisamos pegar o ID da transação/charge
    const chargeId = body.id || body.charges?.[0]?.id;
    const referenceId = body.reference_id;

    if (!referenceId) {
      return NextResponse.json({ received: true });
    }

    // Buscar inscrição pelo reference_id
    const inscricao = await prisma.inscricao.findUnique({
      where: { id: referenceId },
      include: { pagamento: true },
    });

    if (!inscricao) {
      return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
    }

    // Determinar status baseado na notificação
    const status = body.status || body.charges?.[0]?.status;
    console.log('📊 Status do pagamento:', status);

    let novoStatusInscricao: "PENDENTE" | "PAGO" | "CANCELADO" = "PENDENTE";
    let novoStatusPagamento: "PENDENTE" | "APROVADO" | "RECUSADO" | "REEMBOLSADO" = "PENDENTE";

    // Mapeamento de status do PagBank
    switch (status) {
      case "PAID":
      case "AUTHORIZED":
        novoStatusInscricao = "PAGO";
        novoStatusPagamento = "APROVADO";
        break;
      case "WAITING":
      case "IN_ANALYSIS":
        novoStatusInscricao = "PENDENTE";
        novoStatusPagamento = "PENDENTE";
        break;
      case "DECLINED":
      case "CANCELED":
        novoStatusInscricao = "CANCELADO";
        novoStatusPagamento = "RECUSADO";
        break;
      default:
    }


    // Atualizar no banco
    await prisma.$transaction(async (tx) => {
      await tx.inscricao.update({
        where: { id: inscricao.id },
        data: { status: novoStatusInscricao },
      });

      await tx.pagamento.update({
        where: { inscricaoId: inscricao.id },
        data: {
          status: novoStatusPagamento,
          transacaoId: chargeId || inscricao.pagamento?.transacaoId || 'unknown',
        },
      });
    });

    return NextResponse.json({
      success: true,
      inscricaoId: inscricao.id,
      statusInscricao: novoStatusInscricao,
      statusPagamento: novoStatusPagamento,
    });

  } catch (error) {
    console.error("Erro no webhook PagBank:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 200 } // Retorna 200 para não reenviar
    );
  }
}

// Aceitar GET também (para teste)
export async function GET() {
  return NextResponse.json({
    message: "Webhook PagBank está funcionando!",
    timestamp: new Date().toISOString()
  });
}
