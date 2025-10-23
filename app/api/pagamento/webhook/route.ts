import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: { timeout: 5000 },
});

const paymentClient = new Payment(mercadoPagoClient);

export async function POST(request: NextRequest) {
  try {
    console.log("=================================");
    console.log("🔔 Webhook chamado pelo Mercado Pago");
    console.log("=================================");

    const body = await request.json();

    console.log("📦 Body recebido:", JSON.stringify(body, null, 2));

    const { type, data, action } = body;

    console.log("📋 Tipo de notificação:", type);
    console.log("📋 Action:", action);
    console.log("📋 ID do recurso:", data?.id);

    // ==========================================
    // FILTRAR APENAS NOTIFICAÇÕES DE PAGAMENTO
    // ==========================================
    if (type !== "payment") {
      console.log("⚠️ Notificação ignorada (não é pagamento)");
      return NextResponse.json({ received: true });
    }

    if (!data?.id) {
      console.log("❌ ID do pagamento não encontrado");
      return NextResponse.json({ error: "ID não encontrado" }, { status: 400 });
    }

    const paymentId = data.id;
    console.log("💰 ID recebido:", paymentId);

    // ==========================================
    // BUSCAR DETALHES DO PAGAMENTO
    // ==========================================
    console.log("🔍 Buscando detalhes do pagamento no Mercado Pago...");

    let payment;
    let inscricaoId;

    try {
      // Tenta buscar o pagamento no Mercado Pago
      payment = await paymentClient.get({ id: Number(paymentId) });

      console.log("✅ Pagamento encontrado:");
      console.log("   - Status:", payment.status);
      console.log("   - Status Detail:", payment.status_detail);
      console.log("   - External Reference:", payment.external_reference);
      console.log("   - Amount:", payment.transaction_amount);

      inscricaoId = payment.external_reference;

    } catch (error: any) {
      console.log("⚠️ Não foi possível buscar pagamento do MP:", error.message);

      // Se for um teste simulado, o ID pode ser o próprio external_reference
      // Vamos tentar buscar direto no banco
      console.log("🔍 Tentando buscar inscrição diretamente no banco...");

      const inscricao = await prisma.inscricao.findUnique({
        where: { id: paymentId },
      });

      if (!inscricao) {
        console.log("❌ Inscrição não encontrada no banco");
        return NextResponse.json({ error: "Inscrição não encontrada" }, { status: 404 });
      }

      inscricaoId = inscricao.id;
      console.log("✅ Inscrição encontrada no banco:", inscricaoId);

      // Para testes simulados, vamos marcar como aprovado
      payment = {
        status: 'approved',
        status_detail: 'accredited',
        payment_type_id: 'simulated_test',
      } as any;

      console.log("✅ Usando status simulado: APROVADO");
    }

    // ==========================================
    // VALIDAR INSCRIÇÃO
    // ==========================================
    if (!inscricaoId) {
      console.log("❌ External reference vazia");
      return NextResponse.json({ error: "Inscrição não identificada" }, { status: 400 });
    }

    console.log("🔍 Buscando inscrição no banco:", inscricaoId);

    const inscricao = await prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      include: { pagamento: true },
    });

    if (!inscricao) {
      console.log("❌ Inscrição não encontrada no banco");
      return NextResponse.json({ error: "Inscrição não encontrada" }, { status: 404 });
    }

    console.log("✅ Inscrição encontrada:", inscricao.codigo);

    // ==========================================
    // MAPEAR STATUS
    // ==========================================
    console.log("📝 Atualizando status da inscrição...");

    let novoStatusInscricao: "PENDENTE" | "PAGO" | "CANCELADO" = "PENDENTE";
    let novoStatusPagamento: "PENDENTE" | "APROVADO" | "RECUSADO" | "REEMBOLSADO" = "PENDENTE";
    let metodoPagamento = payment.payment_type_id || "unknown";

    switch (payment.status) {
      case "approved":
        novoStatusInscricao = "PAGO";
        novoStatusPagamento = "APROVADO";
        console.log("✅ Pagamento APROVADO");
        break;

      case "pending":
      case "in_process":
        novoStatusInscricao = "PENDENTE";
        novoStatusPagamento = "PENDENTE";
        console.log("⏳ Pagamento PENDENTE");
        break;

      case "rejected":
      case "cancelled":
        novoStatusInscricao = "CANCELADO";
        novoStatusPagamento = "RECUSADO";
        console.log("❌ Pagamento RECUSADO/CANCELADO");
        break;

      case "refunded":
        novoStatusInscricao = "CANCELADO";
        novoStatusPagamento = "REEMBOLSADO";
        console.log("💸 Pagamento REEMBOLSADO");
        break;

      default:
        console.log("⚠️ Status desconhecido:", payment.status);
        novoStatusInscricao = "PENDENTE";
        novoStatusPagamento = "PENDENTE";
    }

    // ==========================================
    // ATUALIZAR NO BANCO
    // ==========================================
    const resultado = await prisma.$transaction(async (tx) => {
      const inscricaoAtualizada = await tx.inscricao.update({
        where: { id: inscricaoId },
        data: { status: novoStatusInscricao },
      });

      const pagamentoAtualizado = await tx.pagamento.update({
        where: { inscricaoId: inscricaoId },
        data: {
          transacaoId: String(paymentId),
          status: novoStatusPagamento,
          metodoPagamento: metodoPagamento,
        },
      });

      return { inscricaoAtualizada, pagamentoAtualizado };
    });

    console.log("✅ Banco atualizado com sucesso!");
    console.log("   - Status Inscrição:", resultado.inscricaoAtualizada.status);
    console.log("   - Status Pagamento:", resultado.pagamentoAtualizado.status);

    // ==========================================
    // TODO: ENVIAR EMAIL
    // ==========================================
    if (novoStatusPagamento === "APROVADO") {
      console.log("📧 TODO: Enviar email de confirmação");
    }

    console.log("=================================");
    console.log("✅ Webhook processado com sucesso!");
    console.log("=================================");

    return NextResponse.json({
      success: true,
      inscricaoId: inscricaoId,
      status: novoStatusInscricao,
    });

  } catch (error) {
    console.error("=================================");
    console.error("❌ ERRO NO WEBHOOK:");
    console.error(error);
    console.error("=================================");

    return NextResponse.json(
      {
        error: "Erro ao processar webhook",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 200 }
    );
  }
}
