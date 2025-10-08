import { resend } from './resend';
import { emailInscricaoPendente } from './templates';

interface EnviarEmailInscricaoPendenteProps {
  para: string;
  nomeCompleto: string;
  codigo: string;
  categoria: string;
  valorPago: number;
  dataEvento: string;
  localEvento: string;
  tamanhoCamisa: string;
}

export async function enviarEmailInscricaoPendente({
  para,
  nomeCompleto,
  codigo,
  categoria,
  valorPago,
  dataEvento,
  localEvento,
  tamanhoCamisa,
}: EnviarEmailInscricaoPendenteProps) {
  try {
    const htmlContent = emailInscricaoPendente({
      nomeCompleto,
      codigo,
      categoria,
      valorPago,
      dataEvento,
      localEvento,
      tamanhoCamisa,
    });

    const { data, error } = await resend.emails.send({
      from: 'Corrida App <onboarding@resend.dev>',
      to: para,
      subject: `⏳ Inscrição Recebida - Pagamento Pendente (${codigo})`,
      html: htmlContent,
    });

    if (error) {
      console.error('Erro ao enviar email de inscrição pendente:', error);
      throw new Error(`Falha no envio: ${error.message}`);
    }

    console.log('Email de inscrição pendente enviado:', data);
    return { success: true, data };

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}
