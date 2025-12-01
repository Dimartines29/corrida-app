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

// Mapeia status do PagBank para nossos status
function mapearStatusPagBank(status: string): {
  statusInscricao: "PENDENTE" | "PAGO" | "CANCELADO";
  statusPagamento: "PENDENTE" | "APROVADO" | "RECUSADO" | "REEMBOLSADO";
} {
  switch (status?.toUpperCase()) {
    case "PAID":
    case "AUTHORIZED":
      return {
        statusInscricao: "PAGO",
        statusPagamento: "APROVADO"
      };

    case "WAITING":
    case "IN_ANALYSIS":
      return {
        statusInscricao: "PENDENTE",
        statusPagamento: "PENDENTE"
      };

    case "DECLINED":
    case "CANCELED":
    case "CANCELLED":
      return {
        statusInscricao: "CANCELADO",
        statusPagamento: "RECUSADO"
      };

    default:
      console.log(`[Webhook] Status não mapeado: ${status}`);
      return {
        statusInscricao: "PENDENTE",
        statusPagamento: "PENDENTE"
      };
  }
}

// Busca detalhes da notificação no PagBank
async function buscarNotificacaoPagBank(notificationCode: string): Promise<PagBankWebhookPayload | null> {
  const ambiente = process.env.PAGBANK_ENVIRONMENT || 'sandbox';
  const baseUrl = ambiente === 'sandbox'
    ? 'https://sandbox.api.pagseguro.com'
    : 'https://api.pagseguro.com';

  const url = `${baseUrl}/notifications/${notificationCode}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PAGBANK_TOKEN}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      console.error(`[Webhook] Erro ao buscar notificação: ${response.status} - ${notificationCode}`);
      return null;
    }

    return await response.json();

  } catch (error) {
    console.error(`[Webhook] Exceção ao buscar notificação ${notificationCode}:`, error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const requestId = Date.now().toString(36);

  try {
    const contentType = request.headers.get('content-type') || '';
    let body: PagBankWebhookPayload | null = null;
    let notificationCode: string | null = null;

    // Processar diferentes formatos de requisição
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      notificationCode = formData.get('notificationCode')?.toString() || null;

      if (notificationCode) {
        body = await buscarNotificacaoPagBank(notificationCode);
      }
    }
    else if (contentType.includes('application/json')) {
      body = await request.json();
    }
    else {
      const text = await request.text();
      const params = new URLSearchParams(text);
      notificationCode = params.get('notificationCode');

      if (notificationCode) {
        body = await buscarNotificacaoPagBank(notificationCode);
      } else {
        try {
          body = JSON.parse(text);
        } catch (e) {
          console.log(`[Webhook] Body não parseável - ignorando`);
        }
      }
    }

    if (!body) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Extrair informações do webhook
    const chargeId = body.id || body.charges?.[0]?.id || body.charge?.id || null;
    const referenceId = body.reference_id || body.charges?.[0]?.reference_id || body.charge?.reference_id || null;
    const status = body.status || body.charges?.[0]?.status || body.charge?.status;

    if (!referenceId) {
      console.log(`[Webhook] Sem referenceId - ignorando`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Buscar inscrição
    const inscricao = await prisma.inscricao.findUnique({
      where: { id: referenceId },
      include: { pagamento: true },
    });

    if (!inscricao) {
      console.error(`[Webhook] Inscrição não encontrada: ${referenceId}`);
      return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
    }

    // Mapear status
    const { statusInscricao, statusPagamento } = mapearStatusPagBank(status || '');

    // PROTEÇÃO: Não atualizar se já está PAGO
    if (inscricao.status === 'PAGO') {
      console.log(`[Webhook] Bloqueado - Inscrição já PAGA: ${inscricao.id} (tentou ${statusInscricao})`);
      return NextResponse.json({
        success: true,
        message: 'Inscrição já está paga - não atualizado',
        inscricaoId: inscricao.id,
        statusAtual: 'PAGO',
        statusRecebido: statusInscricao
      });
    }

    // Atualizar no banco
    await prisma.$transaction(async (tx) => {
      await tx.inscricao.update({
        where: { id: inscricao.id },
        data: { status: statusInscricao },
      });

      await tx.pagamento.upsert({
        where: { inscricaoId: inscricao.id },
        update: {
          status: statusPagamento,
          transacaoId: chargeId || inscricao.pagamento?.transacaoId || 'unknown',
        },
        create: {
          inscricaoId: inscricao.id,
          status: statusPagamento,
          transacaoId: chargeId || 'unknown',
          valor: inscricao.valorPago,
          metodoPagamento: 'pagbank'
        }
      });
    });

    console.log(`[Webhook] ✓ Processado: ${inscricao.id} | ${inscricao.status} -> ${statusInscricao}`);

    return NextResponse.json({
      success: true,
      inscricaoId: inscricao.id,
      statusInscricao,
      statusPagamento
    });

  } catch (error) {
    console.error(`[Webhook] ERRO:`, error);

    // Retornar 500 para PagBank reenviar
    return NextResponse.json(
      {
        error: "Erro ao processar webhook",
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
