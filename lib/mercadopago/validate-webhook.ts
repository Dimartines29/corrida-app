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
  type?: string;
  action?: string;
}

/**
 * Valida a assinatura do webhook do Mercado Pago
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export function validateMercadoPagoSignature(
  headers: WebhookHeaders,
  body: WebhookBody
): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  if (!secret) {
    console.warn('MERCADOPAGO_WEBHOOK_SECRET não configurado');
    // Em produção, você pode querer retornar false aqui
    return process.env.NODE_ENV === 'development';
  }

  const signature = headers['x-signature'];
  const requestId = headers['x-request-id'];

  if (!signature) {
    console.error('Header x-signature não encontrado');
    return false;
  }

  try {
    // Extrair partes da assinatura
    // Formato: ts=123456789,v1=hash_calculado
    const parts = signature.split(',');
    const tsPart = parts.find(p => p.startsWith('ts='));
    const v1Part = parts.find(p => p.startsWith('v1='));

    if (!tsPart || !v1Part) {
      console.error('Formato de assinatura inválido');
      return false;
    }

    const ts = tsPart.split('=')[1];
    const receivedHash = v1Part.split('=')[1];

    // Criar string para validação
    // Formato: id:request-id:timestamp
    const dataId = body?.data?.id || '';
    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;

    // Calcular hash HMAC SHA256
    const calculatedHash = crypto
      .createHmac('sha256', secret)
      .update(manifest)
      .digest('hex');

    // Comparar hashes
    const isValid = calculatedHash === receivedHash;

    if (!isValid) {
      console.error('Assinatura inválida!', {
        received: receivedHash,
        calculated: calculatedHash,
      });
    }

    return isValid;

  } catch (error) {
    console.error('Erro ao validar assinatura:', error);
    return false;
  }
}
