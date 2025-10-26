import { resend } from './resend';
import { emailInscricaoPendente, emailRecuperacaoSenha } from './templates';

interface EnviarEmailInscricaoPendenteProps {
  para: string;
  nomeCompleto: string;
  codigo: number;
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
      from: 'Corrida The Chris <contato@corridathechris.com.br>',
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

interface EnviarEmailRecuperacaoSenhaProps {
  para: string;
  nomeCompleto: string;
  resetUrl: string;
}

export async function enviarEmailRecuperacaoSenha({
  para,
  nomeCompleto,
  resetUrl,
}: EnviarEmailRecuperacaoSenhaProps) {
  try {
    const htmlContent = emailRecuperacaoSenha({
      nomeCompleto,
      resetUrl,
    });

    const { data, error } = await resend.emails.send({
      from: 'Corrida The Chris <contato@corridathechris.com.br>',
      to: para,
      subject: '🔐 Recuperação de Senha - Corrida Chris',
      html: htmlContent,
    });

    if (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      throw new Error(`Falha no envio: ${error.message}`);
    }

    return { success: true, data };

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}
