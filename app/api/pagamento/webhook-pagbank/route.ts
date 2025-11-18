// app/api/pagamento/webhook-pagbank/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface PagBankCharge {
  id: string;
  reference_id: string;
  status: string;
  amount?: {
    value: number;
    currency: string;
  };
  payment_method?: {
    type: string;
  };
  created_at?: string;
  paid_at?: string;
}

interface PagBankWebhookPayload {
  id?: string;
  reference_id?: string;
  status?: string;
  charges?: PagBankCharge[];
  charge?: PagBankCharge;
  created_at?: string;
  updated_at?: string;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let body: PagBankWebhookPayload | null = null;
    let notificationCode: string | null = null;
    let chargeId: string | null = null;
    let referenceId: string | null = null;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      notificationCode = formData.get('notificationCode')?.toString() || null;

      if (notificationCode) {
        const pagbankUrl = process.env.PAGBANK_ENVIRONMENT === 'sandbox'
          ? `https://sandbox.api.pagseguro.com/notifications/${notificationCode}`
          : `https://api.pagseguro.com/notifications/${notificationCode}`;

        const response = await fetch(pagbankUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.PAGBANK_TOKEN}`,
          },
        });

        if (!response.ok) {
          console.error('Erro ao buscar notificação:', response.status);
          return NextResponse.json({ error: 'Erro ao buscar notificação' }, { status: 200 });
        }

        body = await response.json();
      }
    }

    else if (contentType.includes('application/json')) {
      body = await request.json();
    }

    else {
      const text = await request.text();

      // Tentar extrair notificationCode da query string
      const params = new URLSearchParams(text);
      notificationCode = params.get('notificationCode');

      if (notificationCode) {
        const pagbankUrl = process.env.PAGBANK_ENVIRONMENT === 'sandbox'
          ? `https://sandbox.api.pagseguro.com/notifications/${notificationCode}`
          : `https://api.pagseguro.com/notifications/${notificationCode}`;

        const response = await fetch(pagbankUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.PAGBANK_TOKEN}`,
          },
        });

        if (response.ok) {
          body = await response.json();
        }
      } else {
        // Tentar parsear como JSON
        try {
          body = JSON.parse(text);
        } catch (e) {
          console.error('Não foi possível parsear o body');
          return NextResponse.json({ received: true }, { status: 200 });
        }
      }
    }

    if (!body) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    chargeId = body.id || body.charges?.[0]?.id || body.charge?.id || null;
    referenceId = body.reference_id || body.charges?.[0]?.reference_id || body.charge?.reference_id || null;

    if (!referenceId) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const inscricao = await prisma.inscricao.findUnique({
      where: { id: referenceId },
      include: { pagamento: true },
    });

    if (!inscricao) {
      console.error('Inscrição não encontrada:', referenceId);
      return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
    }

    const status = body.status || body.charges?.[0]?.status || body.charge?.status;
    let novoStatusInscricao: "PENDENTE" | "PAGO" | "CANCELADO" = "PENDENTE";
    let novoStatusPagamento: "PENDENTE" | "APROVADO" | "RECUSADO" | "REEMBOLSADO" = "PENDENTE";

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
    }

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
    console.error("Stack trace:", error instanceof Error ? error.stack : 'N/A');

    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 200 } // Retorna 200 para não reenviar
    );
  }
}
