// app/api/pagamento/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: { timeout: 5000 },
});

const paymentClient = new Payment(mercadoPagoClient);
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, topic, resource, data } = body;

    if (type !== "payment" && topic !== "payment") {
      return NextResponse.json({ received: true });
    }

    let paymentId: string | null = null;

    if (topic === "payment" && resource) {
      paymentId = String(resource);
    } else if (data?.id) {
      paymentId = String(data.id);
    }

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID não encontrado" }, { status: 400 });
    }

    await sleep(1000);

    const searchResult = await paymentClient.search({
      options: { criteria: "desc", limit: 50 }
    });

    if (!searchResult.results || searchResult.results.length === 0) {
      return NextResponse.json({ received: true });
    }

    const payment = searchResult.results.find(p => String(p.id) === paymentId);

    if (!payment || !payment.external_reference) {
      return NextResponse.json({ received: true });
    }

    const inscricao = await prisma.inscricao.findUnique({
      where: { id: payment.external_reference },
      include: { pagamento: true },
    });

    if (!inscricao) {
      return NextResponse.json({ error: "Inscrição não encontrada" }, { status: 404 });
    }

    if (inscricao.status === "PAGO" && inscricao.pagamento?.status === "APROVADO") {
      return NextResponse.json({ success: true, message: "Já processado" });
    }

    let novoStatusInscricao: "PENDENTE" | "PAGO" | "CANCELADO";
    let novoStatusPagamento: "PENDENTE" | "APROVADO" | "RECUSADO" | "REEMBOLSADO";

    switch (payment.status) {
      case "approved":
        novoStatusInscricao = "PAGO";
        novoStatusPagamento = "APROVADO";
        break;
      case "pending":
      case "in_process":
      case "in_mediation":
        novoStatusInscricao = "PENDENTE";
        novoStatusPagamento = "PENDENTE";
        break;
      case "rejected":
      case "cancelled":
        novoStatusInscricao = "CANCELADO";
        novoStatusPagamento = "RECUSADO";
        break;
      case "refunded":
      case "charged_back":
        novoStatusInscricao = "CANCELADO";
        novoStatusPagamento = "REEMBOLSADO";
        break;
      default:
        novoStatusInscricao = "PENDENTE";
        novoStatusPagamento = "PENDENTE";
    }

    await prisma.$transaction(async (tx) => {
      await tx.inscricao.update({
        where: { id: inscricao.id },
        data: { status: novoStatusInscricao },
      });

      await tx.pagamento.update({
        where: { inscricaoId: inscricao.id },
        data: {
          transacaoId: paymentId,
          status: novoStatusPagamento,
          metodoPagamento: payment.payment_type_id || "unknown",
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
    console.error("Erro no webhook:", error);
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 200 });
  }
}
