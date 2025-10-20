interface EmailInscricaoPendenteProps {
  nomeCompleto: string;
  codigo: string;
  categoria: string;
  valorPago: number;
  dataEvento: string;
  localEvento: string;
  tamanhoCamisa: string;
}

export function emailInscricaoPendente({
  nomeCompleto,
  codigo,
  categoria,
  valorPago,
  dataEvento,
  localEvento,
  tamanhoCamisa,
}: EmailInscricaoPendenteProps): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Inscrição Recebida</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">⏳ Inscrição Recebida!</h1>
      </div>

      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">

        <p style="font-size: 16px; margin-bottom: 20px;">
          Olá, <strong>${nomeCompleto}</strong>! 👋
        </p>

        <p style="font-size: 16px; margin-bottom: 30px;">
          Recebemos sua inscrição com sucesso! Agora falta só uma coisa: <strong>confirmar o pagamento</strong>.
        </p>

        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 30px;">
          <h3 style="color: #f59e0b; margin-top: 0; font-size: 18px;">⚠️ Atenção: Pagamento Pendente</h3>
          <p style="margin: 0; font-size: 14px;">
            Sua inscrição só será confirmada após a aprovação do pagamento. Complete o processo o quanto antes para garantir sua vaga!
          </p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 30px;">
          <h2 style="color: #f59e0b; margin-top: 0; font-size: 20px;">📋 Dados da sua Inscrição</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Código:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right; color: #f59e0b; font-weight: bold; font-size: 18px;">${codigo}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Categoria:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${categoria}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Tamanho Camisa:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${tamanhoCamisa}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Valor:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right; font-size: 20px; font-weight: bold; color: #16a34a;">R$ ${valorPago.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0;"><strong>Data do Evento:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; text-align: right;">${dataEvento}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0;"><strong>Local:</strong></td>
              <td style="padding: 10px 0; text-align: right;">${localEvento}</td>
            </tr>
          </table>
        </div>

        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 30px;">
          <h3 style="color: #3b82f6; margin-top: 0; font-size: 18px;">💳 Próximos Passos</h3>
          <ol style="margin: 0; padding-left: 20px; font-size: 14px;">
            <li style="margin-bottom: 10px;">Complete o pagamento através do link que você receberá em breve</li>
            <li style="margin-bottom: 10px;">Aguarde a confirmação do Mercado Pago (pode levar alguns minutos)</li>
            <li style="margin-bottom: 10px;">Você receberá um email de confirmação quando tudo estiver OK!</li>
          </ol>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 14px; color: #666; margin-bottom: 15px;">
            <strong>Importante:</strong> Guarde o código <span style="color: #f59e0b; font-weight: bold;">${codigo}</span> para consultas futuras
          </p>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
          Dúvidas? Entre em contato: <a href="mailto:contato@corridaapp.com" style="color: #f59e0b;">contato@corridaapp.com</a>
        </p>

      </div>

      <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
        <p>Este é um email automático, por favor não responda.</p>
        <p>© 2025 Corrida App. Todos os direitos reservados.</p>
      </div>

    </body>
    </html>
  `;
}

// ========================================
// TEMPLATE: RECUPERAÇÃO DE SENHA
// ========================================

interface EmailRecuperacaoSenhaProps {
  nomeCompleto: string;
  resetUrl: string;
}

export function emailRecuperacaoSenha({
  nomeCompleto,
  resetUrl,
}: EmailRecuperacaoSenhaProps): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperação de Senha</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

      <div style="background: linear-gradient(135deg, #E53935 0%, #c62828 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Recuperação de Senha</h1>
      </div>

      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">

        <p style="font-size: 16px; margin-bottom: 20px;">
          Olá, <strong>${nomeCompleto}</strong>! 👋
        </p>

        <p style="font-size: 16px; margin-bottom: 30px;">
          Recebemos uma solicitação para redefinir a senha da sua conta. Se foi você quem solicitou, clique no botão abaixo para criar uma nova senha.
        </p>

        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 30px;">
          <h3 style="color: #f59e0b; margin-top: 0; font-size: 18px;">⚠️ Importante</h3>
          <p style="margin: 0; font-size: 14px;">
            Este link é válido por <strong>1 hora</strong>. Após esse período, você precisará solicitar uma nova recuperação de senha.
          </p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #E53935 0%, #c62828 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            🔑 REDEFINIR SENHA
          </a>
        </div>

        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 30px;">
          <h3 style="color: #3b82f6; margin-top: 0; font-size: 18px;">🛡️ Não foi você?</h3>
          <p style="margin: 0; font-size: 14px;">
            Se você não solicitou a recuperação de senha, ignore este email. Sua senha permanecerá a mesma e sua conta está segura.
          </p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-top: 30px;">
          <p style="font-size: 12px; color: #666; margin: 0;">
            <strong>Problemas com o botão?</strong> Copie e cole o link abaixo no seu navegador:
          </p>
          <p style="font-size: 12px; color: #00B8D4; word-break: break-all; margin: 10px 0 0 0;">
            ${resetUrl}
          </p>
        </div>

        <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
          Dúvidas? Entre em contato: <a href="mailto:contato@corridachris.com.br" style="color: #E53935;">contato@corridachris.com.br</a>
        </p>

      </div>

      <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
        <p>Este é um email automático, por favor não responda.</p>
        <p>© 2025 Corrida Chris. Todos os direitos reservados.</p>
      </div>

    </body>
    </html>
  `;
}
