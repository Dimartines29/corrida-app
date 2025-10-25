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
    const body = await request.json();
    const { type, data, action } = body;

    if (type !== "payment") {
      return NextResponse.json({ received: true });
    }

    if (!data?.id) {
      return NextResponse.json({ error: "ID não encontrado" }, { status: 400 });
    }

    const paymentId = data.id;
    let payment;
    let inscricaoId;

    // Tenta buscar o pagamento no Mercado Pago
    try {
      payment = await paymentClient.get({ id: Number(paymentId) });
      inscricaoId = payment.external_reference;

    } catch (error) {

      const inscricao = await prisma.inscricao.findUnique({
        where: { id: paymentId },
      });

      if (!inscricao) {
        return NextResponse.json({ error: "Inscrição não encontrada" }, { status: 404 });
      }

      inscricaoId = inscricao.id;
    }

    if (!inscricaoId) {
      return NextResponse.json({ error: "Inscrição não identificada" }, { status: 400 });
    }

    const inscricao = await prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      include: { pagamento: true },
    });

    if (!inscricao) {
      return NextResponse.json({ error: "Inscrição não encontrada" }, { status: 404 });
    }

    let novoStatusInscricao: "PENDENTE" | "PAGO" | "CANCELADO" = "PENDENTE";
    let novoStatusPagamento: "PENDENTE" | "APROVADO" | "RECUSADO" | "REEMBOLSADO" = "PENDENTE";
    const metodoPagamento = payment?.payment_type_id || "unknown";

    switch (payment?.status) {
      case "approved":
        novoStatusInscricao = "PAGO";
        novoStatusPagamento = "APROVADO";
        break;

      case "pending":
      case "in_process":
        novoStatusInscricao = "PENDENTE";
        novoStatusPagamento = "PENDENTE";
        break;

      case "rejected":
      case "cancelled":
        novoStatusInscricao = "CANCELADO";
        novoStatusPagamento = "RECUSADO";
        break;

      case "refunded":
        novoStatusInscricao = "CANCELADO";
        novoStatusPagamento = "REEMBOLSADO";
        break;

      default:
        novoStatusInscricao = "PENDENTE";
        novoStatusPagamento = "PENDENTE";
    }

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

    return NextResponse.json({
      success: true,
      inscricaoId: inscricaoId,
      status: novoStatusInscricao,
    });

  } catch (error) {
    console.error("ERRO NO WEBHOOK:");
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro ao processar webhook",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 200 }
    );
  }
}
