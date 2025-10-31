// app/api/pagamento/criar-preferencia/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { prisma } from '@/lib/prisma';
import { auth } from "@/auth"

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: { timeout: 5000 },
});

const preference = new Preference(mercadoPagoClient);

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
      include: { lote: true, user: true, pagamento: true },
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

    const preferenceData = {
      body: {
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
        },
      },
    };

    const response = await preference.create(preferenceData);

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
    console.error("Erro ao criar preferência:", error);
    return NextResponse.json(
      { error: 'Erro ao criar preferência' },
      { status: 500 }
    );
  }
}
