import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY não está definida no .env.local');
}

// Cria instância do cliente Resend
export const resend = new Resend(process.env.RESEND_API_KEY);
