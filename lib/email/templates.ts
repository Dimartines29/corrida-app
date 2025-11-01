interface EmailInscricaoPendenteProps {
  nomeCompleto: string;
  codigo: number;
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
      <title>Inscrição Recebida - Todo Mundo Corre com o Chris</title>
    </head>
    <body style="font-family: 'Arial', 'Helvetica', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f5f5f5;">

      <!-- HEADER COM LOGO E CORES DO CHRIS -->
      <div style="background: linear-gradient(135deg, #FFE66D 0%, #ffd93d 100%); padding: 40px 20px; text-align: center; border-radius: 0;">
        <div style="background: white; display: inline-block; padding: 15px 25px; border-radius: 50px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;">
          <h1 style="color: #E53935; margin: 0; font-size: 24px; font-weight: 900;">🏃‍♂️ TODO MUNDO CORRE</h1>
          <p style="color: #00B8D4; margin: 5px 0 0 0; font-size: 14px; font-weight: bold;">COM O CHRIS</p>
        </div>
        <h2 style="color: #E53935; margin: 0; font-size: 32px; font-weight: 900; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">⏳ INSCRIÇÃO RECEBIDA!</h2>
      </div>

      <!-- CORPO DO EMAIL -->
      <div style="background: white; padding: 40px 30px; margin: 0;">

        <p style="font-size: 18px; margin-bottom: 15px; color: #333;">
          E aí, <strong style="color: #E53935;">${nomeCompleto}</strong>! 👋
        </p>

        <p style="font-size: 16px; margin-bottom: 30px; line-height: 1.8; color: #555;">
          Sua inscrição foi recebida com sucesso! 🎉 Agora falta só uma coisinha: <strong style="color: #E53935;">confirmar o pagamento</strong> para garantir sua vaga na corrida mais top da quebrada!
        </p>

        <!-- ALERTA PAGAMENTO PENDENTE -->
        <div style="background: linear-gradient(135deg, #FFE66D 0%, #ffd93d 100%); padding: 25px; border-radius: 12px; border: 3px solid #E53935; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="color: #E53935; margin: 0 0 15px 0; font-size: 20px; font-weight: 900;">⚠️ ATENÇÃO: PAGAMENTO PENDENTE</h3>
          <p style="margin: 0; font-size: 15px; color: #333; font-weight: 600; line-height: 1.6;">
            Sua inscrição só será confirmada após a aprovação do pagamento. Complete o processo o quanto antes para garantir sua vaga e não ficar de fora dessa! 🏃‍♀️💨
          </p>
        </div>

        <!-- DADOS DA INSCRIÇÃO -->
        <div style="background: linear-gradient(135deg, #00B8D4 0%, #00a0c0 100%); padding: 30px; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 6px 20px rgba(0,184,212,0.2);">
          <h2 style="color: white; margin: 0 0 25px 0; font-size: 24px; font-weight: 900; text-align: center;">📋 SEUS DADOS</h2>

          <div style="background: white; border-radius: 10px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 2px solid #f0f0f0;"><strong style="color: #666; font-size: 14px;">🎫 Código:</strong></td>
                <td style="padding: 12px 0; border-bottom: 2px solid #f0f0f0; text-align: right;">
                  <span style="color: #E53935; font-weight: 900; font-size: 24px;">#${codigo}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 2px solid #f0f0f0;"><strong style="color: #666; font-size: 14px;">🏃 Categoria:</strong></td>
                <td style="padding: 12px 0; border-bottom: 2px solid #f0f0f0; text-align: right; font-weight: bold; color: #333;">${categoria}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 2px solid #f0f0f0;"><strong style="color: #666; font-size: 14px;">👕 Tamanho Camisa:</strong></td>
                <td style="padding: 12px 0; border-bottom: 2px solid #f0f0f0; text-align: right; font-weight: bold; color: #333;">${tamanhoCamisa}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 2px solid #f0f0f0;"><strong style="color: #666; font-size: 14px;">💰 Valor:</strong></td>
                <td style="padding: 12px 0; border-bottom: 2px solid #f0f0f0; text-align: right;">
                  <span style="font-size: 26px; font-weight: 900; color: #00B8D4;">R$ ${valorPago.toFixed(2)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 2px solid #f0f0f0;"><strong style="color: #666; font-size: 14px;">📅 Data do Evento:</strong></td>
                <td style="padding: 12px 0; border-bottom: 2px solid #f0f0f0; text-align: right; font-weight: bold; color: #333;">${dataEvento}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0;"><strong style="color: #666; font-size: 14px;">📍 Local:</strong></td>
                <td style="padding: 12px 0; text-align: right; font-weight: bold; color: #333;">${localEvento}</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- PRÓXIMOS PASSOS -->
        <div style="background: #f9f9f9; padding: 25px; border-radius: 12px; border-left: 6px solid #FFE66D; margin-bottom: 30px;">
          <h3 style="color: #E53935; margin: 0 0 20px 0; font-size: 20px; font-weight: 900;">💳 PRÓXIMOS PASSOS</h3>
          <ol style="margin: 0; padding-left: 25px; font-size: 15px; line-height: 2; color: #555;">
            <li style="margin-bottom: 12px;"><strong>Complete o pagamento</strong> através do link que você receberá em breve</li>
            <li style="margin-bottom: 12px;"><strong>Aguarde a confirmação</strong> do Mercado Pago (geralmente em poucos minutos)</li>
            <li style="margin-bottom: 12px;"><strong>Receba seu email de confirmação</strong> com todos os detalhes do evento!</li>
          </ol>
        </div>

        <!-- DESTAQUE CÓDIGO -->
        <div style="background: linear-gradient(135deg, #E53935 0%, #c62828 100%); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(229,57,53,0.3);">
          <p style="font-size: 14px; color: white; margin: 0 0 10px 0; font-weight: 600;">
            <strong>IMPORTANTE:</strong> Guarde seu código de inscrição:
          </p>
          <p style="font-size: 36px; color: #FFE66D; font-weight: 900; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
            #${codigo}
          </p>
        </div>

        <!-- RODAPÉ -->
        <div style="text-align: center; padding-top: 20px; border-top: 2px solid #f0f0f0;">
          <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">
            Dúvidas? Fala com a gente!
          </p>
          <p style="margin: 0;">
            <a href="mailto:contato@corridachris.com.br" style="color: #00B8D4; text-decoration: none; font-weight: bold; font-size: 15px;">
              📧 contato@corridachris.com.br
            </a>
          </p>
        </div>

      </div>

      <!-- FOOTER -->
      <div style="background: #333; text-align: center; padding: 30px 20px; color: white;">
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #999;">
          Este é um email automático, por favor não responda.
        </p>
        <p style="margin: 0; font-size: 13px; color: #999;">
          © 2025 Todo Mundo Corre com o Chris. Todos os direitos reservados.
        </p>
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
      <title>Recuperação de Senha - Todo Mundo Corre com o Chris</title>
    </head>
    <body style="font-family: 'Arial', 'Helvetica', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f5f5f5;">

      <!-- HEADER COM LOGO E CORES DO CHRIS -->
      <div style="background: linear-gradient(135deg, #E53935 0%, #c62828 100%); padding: 40px 20px; text-align: center; border-radius: 0;">
        <div style="background: white; display: inline-block; padding: 15px 25px; border-radius: 50px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); margin-bottom: 20px;">
          <h1 style="color: #E53935; margin: 0; font-size: 24px; font-weight: 900;">🏃‍♂️ TODO MUNDO CORRE</h1>
          <p style="color: #00B8D4; margin: 5px 0 0 0; font-size: 14px; font-weight: bold;">COM O CHRIS</p>
        </div>
        <h2 style="color: white; margin: 0; font-size: 32px; font-weight: 900; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">🔐 RECUPERAÇÃO DE SENHA</h2>
      </div>

      <!-- CORPO DO EMAIL -->
      <div style="background: white; padding: 40px 30px; margin: 0;">

        <p style="font-size: 18px; margin-bottom: 15px; color: #333;">
          E aí, <strong style="color: #E53935;">${nomeCompleto}</strong>! 👋
        </p>

        <p style="font-size: 16px; margin-bottom: 30px; line-height: 1.8; color: #555;">
          Recebemos uma solicitação para redefinir a senha da sua conta. Se foi você mesmo, clique no botão abaixo para criar uma nova senha e voltar pra ação! 💪
        </p>

        <!-- ALERTA IMPORTANTE -->
        <div style="background: linear-gradient(135deg, #FFE66D 0%, #ffd93d 100%); padding: 25px; border-radius: 12px; border: 3px solid #E53935; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h3 style="color: #E53935; margin: 0 0 15px 0; font-size: 20px; font-weight: 900;">⚠️ ATENÇÃO</h3>
          <p style="margin: 0; font-size: 15px; color: #333; font-weight: 600; line-height: 1.6;">
            Este link é válido por <strong style="color: #E53935;">1 HORA</strong>. Depois desse tempo, você vai precisar solicitar uma nova recuperação de senha.
          </p>
        </div>

        <!-- BOTÃO DE AÇÃO -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #00B8D4 0%, #00a0c0 100%); color: white; padding: 18px 50px; text-decoration: none; border-radius: 50px; font-weight: 900; font-size: 18px; box-shadow: 0 6px 20px rgba(0,184,212,0.4); text-transform: uppercase; letter-spacing: 1px;">
            🔑 REDEFINIR SENHA
          </a>
        </div>

        <!-- NÃO FOI VOCÊ? -->
        <div style="background: #f9f9f9; padding: 25px; border-radius: 12px; border-left: 6px solid #00B8D4; margin-bottom: 30px;">
          <h3 style="color: #00B8D4; margin: 0 0 15px 0; font-size: 20px; font-weight: 900;">🛡️ NÃO FOI VOCÊ?</h3>
          <p style="margin: 0; font-size: 15px; color: #555; line-height: 1.8;">
            Se você não solicitou a recuperação de senha, <strong>relaxa!</strong> Ignore este email. Sua senha permanecerá a mesma e sua conta está segura. 🔒
          </p>
        </div>

        <!-- LINK ALTERNATIVO -->
        <div style="background: white; padding: 20px; border-radius: 8px; border: 2px dashed #e0e0e0; margin-bottom: 30px;">
          <p style="font-size: 13px; color: #666; margin: 0 0 10px 0; font-weight: bold;">
            🔧 Problemas com o botão? Copie e cole o link abaixo no seu navegador:
          </p>
          <p style="font-size: 12px; color: #00B8D4; word-break: break-all; margin: 0; background: #f9f9f9; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>
        </div>

        <!-- RODAPÉ -->
        <div style="text-align: center; padding-top: 20px; border-top: 2px solid #f0f0f0;">
          <p style="font-size: 14px; color: #666; margin: 0 0 10px 0;">
            Dúvidas? Fala com a gente!
          </p>
          <p style="margin: 0;">
            <a href="mailto:studiobravo0@gmail.com" style="color: #00B8D4; text-decoration: none; font-weight: bold; font-size: 15px;">
              📧 studiobravo0@gmail.com
            </a>
          </p>
        </div>

      </div>

      <!-- FOOTER -->
      <div style="background: #333; text-align: center; padding: 30px 20px; color: white;">
        <p style="margin: 0 0 10px 0; font-size: 13px; color: #999;">
          Este é um email automático, por favor não responda.
        </p>
        <p style="margin: 0; font-size: 13px; color: #999;">
          © 2025 Todo Mundo Corre com o Chris. Todos os direitos reservados.
        </p>
      </div>

    </body>
    </html>
  `;
}
