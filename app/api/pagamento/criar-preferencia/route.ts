// app/api/pagamento/criar-preferencia/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { inscricaoId } = await request.json();

    if (!inscricaoId) {
      return NextResponse.json({ error: 'inscricaoId obrigatório' }, { status: 400 });
    }

    const inscricao = await prisma.inscricao.findUnique({
      where: { id: inscricaoId },
      include: {
        lote: true,
        user: true,
        pagamento: true
      },
    });

    if (!inscricao) {
      return NextResponse.json({ error: 'Inscrição não encontrada' }, { status: 404 });
    }

    if (inscricao.userId !== session.user.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
    }

    if (inscricao.status === 'PAGO') {
      return NextResponse.json({ error: 'Já foi paga' }, { status: 400 });
    }

    const baseUrl = process.env.APP_URL!;
    const deviceId = inscricao.pagamento?.deviceId;

    const preferenceData = {
      items: [{
        id: String(inscricao.codigo),
        title: `Inscrição ${inscricao.categoria} - ${inscricao.codigo}`,
        description: `Corrida ${inscricao.categoria}km - ${inscricao.lote.nome}`,
        category_id: 'sports',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: Number(inscricao.valorPago),
      }],
      payer: {
        name: inscricao.nomeCompleto,
        email: inscricao.user.email,
        identification: {
          type: 'CPF',
          number: inscricao.cpf.replace(/\D/g, ''),
        },
        phone: {
          area_code: inscricao.telefone.substring(0, 2),
          number: inscricao.telefone.substring(2).replace(/\D/g, ''),
        },
        address: {
          zip_code: inscricao.cep.replace(/\D/g, ''),
          street_name: inscricao.endereco,
          street_number: '0',
          city: inscricao.cidade,
          federal_unit: inscricao.estado,
        },
      },
      back_urls: {
        success: `${baseUrl}/pagamento/sucesso?inscricaoId=${inscricao.id}`,
        failure: `${baseUrl}/pagamento/falha?inscricaoId=${inscricao.id}`,
        pending: `${baseUrl}/pagamento/pendente?inscricaoId=${inscricao.id}`,
      },
      external_reference: inscricao.id,
      payment_methods: { installments: 12 },
      statement_descriptor: 'Corrida The Chris',
      notification_url: process.env.MERCADOPAGO_WEBHOOK_URL,
      metadata: {
        inscricao_id: inscricao.id,
        codigo: inscricao.codigo,
        categoria: inscricao.categoria,
        device_id: deviceId || 'not_provided',
      },
    };

    // 👇 BLOCO NOVO - Requisição manual com fetch para incluir o header
    console.log('📤 Enviando preferência para Mercado Pago...');

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        // CRÍTICO: Adiciona o Device ID no header se existir
        ...(deviceId && { 'X-meli-session-id': deviceId }),
      },
      body: JSON.stringify(preferenceData),
    });

    if (!mpResponse.ok) {
      const errorData = await mpResponse.json();
      console.error('❌ Erro do Mercado Pago:', errorData);
      throw new Error('Falha ao criar preferência no Mercado Pago');
    }

    const response = await mpResponse.json();

    // Atualiza o pagamento com o ID da preferência
    await prisma.pagamento.update({
      where: { inscricaoId: inscricao.id },
      data: { transacaoId: response.id! },
    });

    return NextResponse.json({
      success: true,
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    });

  } catch (error) {
    console.error("❌ Erro ao criar preferência:", error);
    return NextResponse.json(
      { error: 'Erro ao criar preferência' },
      { status: 500 }
    );
  }
}
