// lib/mercadopago/validate-webhook.ts
import crypto from 'crypto';

interface WebhookHeaders {
  'x-signature': string | null;
  'x-request-id': string | null;
}

interface WebhookBody {
  data?: {
    id?: string | number;
  };
  id?: string | number; // merchant_order também tem ID aqui
  resource?: string;
  topic?: string;
  type?: string;
  action?: string;
}

export function validateMercadoPagoSignature(
  headers: WebhookHeaders,
  body: WebhookBody
): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  
  if (!secret) {
    console.error('❌ MERCADOPAGO_WEBHOOK_SECRET não configurado!');
    return false;
  }

  const signature = headers['x-signature'];
  const requestId = headers['x-request-id'];

  console.log('====== DEBUG VALIDAÇÃO ======');
  console.log('x-signature:', signature);
  console.log('x-request-id:', requestId);
  console.log('Body:', JSON.stringify(body, null, 2));

  if (!signature) {
    console.error('❌ x-signature não encontrado');
    return false;
  }

  try {
    // Extrair partes
    const parts = signature.split(',');
    
    let ts = '';
    let receivedHash = '';
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.startsWith('ts=')) {
        ts = trimmed.substring(3);
      }
      if (trimmed.startsWith('v1=')) {
        receivedHash = trimmed.substring(3);
      }
    }

    if (!ts || !receivedHash) {
      console.error('❌ Formato inválido');
      return false;
    }

    // 🎯 DETERMINAR O ID CORRETO baseado no tipo de notificação
    let dataId = '';
    
    if (body.topic === 'merchant_order' && body.resource) {
      // Para merchant_order, extrair ID da URL do resource
      // Formato: "https://api.mercadolibre.com/merchant_orders/35146656933"
      const matches = body.resource.match(/\/merchant_orders\/(\d+)/);
      dataId = matches ? matches[1] : '';
      console.log('📦 merchant_order ID extraído:', dataId);
      
    } else if (body.type === 'payment' && body.data?.id) {
      // Para payment, usar data.id
      dataId = String(body.data.id);
      console.log('💳 payment ID:', dataId);
      
    } else if (body.id) {
      // Fallback: usar ID direto do body
      dataId = String(body.id);
      console.log('🔢 ID direto do body:', dataId);
    }

    // Construir template
    const template = `id:${dataId};request-id:${requestId};ts:${ts};`;
    
    console.log('📝 Template:', template);

    // Calcular hash
    const calculatedHash = crypto
      .createHmac('sha256', secret)
      .update(template)
      .digest('hex');

    console.log('🔐 Hashes:');
    console.log('  Recebido :', receivedHash);
    console.log('  Calculado:', calculatedHash);
    console.log('  Match?   :', receivedHash === calculatedHash);
    console.log('============================');

    return receivedHash === calculatedHash;

  } catch (error) {
    console.error('❌ Erro na validação:', error);
    return false;
  }
}
