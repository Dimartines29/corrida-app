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
  console.log('Secret (primeiros 10 chars):', secret.substring(0, 10) + '...');
  console.log('x-signature completo:', signature);
  console.log('x-request-id:', requestId);
  console.log('Body completo:', JSON.stringify(body, null, 2));
  console.log('============================');

  if (!signature) {
    console.error('❌ x-signature não encontrado');
    return false;
  }

  try {
    // Extrair partes
    const parts = signature.split(',');
    
    let ts = '';
    let receivedHash = '';
    
    console.log('📦 Parts da signature:', parts);
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.startsWith('ts=')) {
        ts = trimmed.substring(3);
      }
      if (trimmed.startsWith('v1=')) {
        receivedHash = trimmed.substring(3);
      }
    }

    console.log('🔢 Valores extraídos:');
    console.log('  ts:', ts);
    console.log('  receivedHash:', receivedHash);

    if (!ts || !receivedHash) {
      console.error('❌ Formato inválido - ts ou v1 não encontrados');
      return false;
    }

    // Construir template EXATAMENTE como a documentação
    const dataId = body?.data?.id ? String(body.data.id) : '';
    
    // IMPORTANTE: Sem espaços, com ponto-e-vírgula no final
    const template = `id:${dataId};request-id:${requestId};ts:${ts};`;
    
    console.log('📝 Template construído:');
    console.log('  Template:', JSON.stringify(template));
    console.log('  Template length:', template.length);
    console.log('  Template bytes:', Buffer.from(template).toString('hex'));

    // Calcular hash
    const calculatedHash = crypto
      .createHmac('sha256', secret)
      .update(template)
      .digest('hex');

    console.log('🔐 Comparação de hashes:');
    console.log('  Recebido  :', receivedHash);
    console.log('  Calculado :', calculatedHash);
    console.log('  Match?    :', receivedHash === calculatedHash);
    console.log('============================');

    return receivedHash === calculatedHash;

  } catch (error) {
    console.error('❌ Erro na validação:', error);
    return false;
  }
}
