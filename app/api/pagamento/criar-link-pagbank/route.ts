// app/api/pagamento/criar-link-pagbank/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from "@/auth";

// Interfaces do PagBank
interface PagBankLink {
  rel: string;
  href: string;
  method: string;
}

interface PagBankCheckoutResponse {
  id: string;
  reference_id: string;
  expiration_date?: string;
  created_at?: string;
  status?: string;
  links?: PagBankLink[];
  customer?: Record<string, unknown>;
  items?: Record<string, unknown>[];
  payment_methods?: Record<string, unknown>[];
  payment_methods_configs?: Record<string, unknown>[];
  soft_descriptor?: string;
  customer_modifiable?: boolean;
  additional_amount?: number;
  discount_amount?: number;
  origin?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // ⭐ NOVIDADE: Receber metodoPagamento do body
    const { inscricaoId, metodoPagamento } = await request.json();

    if (!inscricaoId) {
      return NextResponse.json({ error: 'inscricaoId obrigatório' }, { status: 400 });
    }

    // ⭐ VALIDAÇÃO: Verificar se o método é válido
    if (!metodoPagamento || !['PIX', 'CARTAO'].includes(metodoPagamento)) {
      return NextResponse.json({
        error: 'Método de pagamento inválido. Use PIX ou CARTAO'
      }, { status: 400 });
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

    let valorFinal = inscricao.valorPago;

    if (metodoPagamento === 'CARTAO') {
      // Aplicar taxa de 4,16% no cartão
      valorFinal = inscricao.valorPago * 1.0416;
    }

    // ⭐ CONFIGURAR MÉTODOS DE PAGAMENTO DO PAGBANK
    const paymentMethods = metodoPagamento === 'PIX'
      ? [{ type: "PIX" }]  // Apenas PIX
      : [
          {
            type: "CREDIT_CARD",
            brands: ["mastercard", "visa", "elo", "amex", "hipercard"]
          },
          {
            type: "DEBIT_CARD",
            brands: ["mastercard", "visa", "elo"]
          },
          {
            type: "BOLETO"
          }
        ];

    // Configuração de parcelamento apenas para cartão
    const paymentMethodsConfigs = metodoPagamento === 'CARTAO'
      ? [{
          type: "CREDIT_CARD",
          config_options: [{
            option: "INSTALLMENTS_LIMIT",
            value: "12"
          }]
        }]
      : [];

    const checkoutPayload = {
      reference_id: inscricao.id,
      customer_modifiable: false,
      expiration_date: new Date(Date.now() + 30 * 60000).toISOString(),
      customer: {
        name: inscricao.nomeCompleto,
        email: inscricao.user.email,
        tax_id: inscricao.cpf.replace(/\D/g, ''),
        phone: {
          country: "55",
          area: inscricao.telefone.substring(0, 2).replace(/\D/g, ''),
          number: inscricao.telefone.substring(2).replace(/\D/g, ''),
          type: "MOBILE"
        }
      },
      items: [{
        reference_id: String(inscricao.codigo),
        name: `Inscricao ${inscricao.categoria} - Corrida`,
        quantity: 1,
        // ⭐ USAR VALOR FINAL (com ou sem taxa)
        unit_amount: Math.round(valorFinal * 100) // Converter para centavos
      }],
      notification_urls: [
        `${process.env.APP_URL}/api/pagamento/webhook-pagbank`
      ],

      payment_methods: paymentMethods,

      payment_methods_configs: paymentMethodsConfigs,
      soft_descriptor: "Corrida The Chris"
    };

    const pagbankUrl = process.env.PAGBANK_ENVIRONMENT === 'sandbox'
      ? 'https://sandbox.api.pagseguro.com/checkouts'
      : 'https://api.pagseguro.com/checkouts';

    const response = await fetch(pagbankUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAGBANK_TOKEN}`,
      },
      body: JSON.stringify(checkoutPayload),
    });

    const responseText = await response.text();

    let responseData: PagBankCheckoutResponse;
    try {
      responseData = responseText ? JSON.parse(responseText) : {} as PagBankCheckoutResponse;
    } catch (parseError) {
      console.error('ERRO AO FAZER PARSE DO JSON:', parseError);
      return NextResponse.json(
        { error: 'Resposta inválida', details: responseText },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('ERRO - PAGBANK RETORNOU:', responseData);
      return NextResponse.json(
        { error: 'Erro ao criar checkout', details: responseData },
        { status: response.status }
      );
    }

    const payLink = responseData.links?.find((link) => link.rel === 'PAY');

    if (!payLink?.href) {
      console.error('ERRO - LINK DE PAGAMENTO NÃO ENCONTRADO');
      console.error('Links disponíveis:', responseData.links);
      return NextResponse.json(
        { error: 'Link não gerado', details: responseData },
        { status: 500 }
      );
    }


    await prisma.pagamento.update({
      where: { inscricaoId: inscricao.id },
      data: {
        transacaoId: responseData.id,
        metodoPagamento: metodoPagamento,
        valor: valorFinal
      },
    });

    return NextResponse.json({
      success: true,
      checkoutId: responseData.id,
      checkoutUrl: payLink.href,
      metodoPagamento: metodoPagamento,
      valorFinal: valorFinal
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao processar', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
