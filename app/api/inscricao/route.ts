import { enviarEmailInscricaoPendente } from "@/lib/email/send-email";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inscricaoCompletaSchema } from "@/lib/validations/inscricao";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

// Função para gerar código único de inscrição
function gerarCodigoInscricao(): string {
  const ano = new Date().getFullYear();
  const numero = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `COR${ano}-${numero}`;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verifica autenticação
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // 2. Busca o usuário no banco
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // 3. Parse e validação dos dados
    const body = await request.json();
    const validationResult = inscricaoCompletaSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 4. Verifica se usuário já tem inscrição
    const inscricaoExistente = await prisma.inscricao.findUnique({
      where: { userId: user.id },
    });

    if (inscricaoExistente) {
      return NextResponse.json(
        { error: "Você já possui uma inscrição neste evento" },
        { status: 400 }
      );
    }

    // 5. Verifica se CPF já está cadastrado
    const cpfExistente = await prisma.inscricao.findUnique({
      where: { cpf: data.cpf },
    });

    if (cpfExistente) {
      return NextResponse.json(
        { error: "CPF já cadastrado em outra inscrição" },
        { status: 400 }
      );
    }

    // 7. Valida se lote existe, está ativo e no período válido
    const agora = new Date();
    const lote = await prisma.lote.findFirst({
      where: {
        id: data.loteId,
        ativo: true,
        dataInicio: { lte: agora },
        dataFim: { gte: agora },
      },
    });

    if (!lote) {
      return NextResponse.json(
        {
          error:
            "Lote não disponível. Pode estar inativo ou fora do período de inscrição.",
        },
        { status: 400 }
      );
    }

    // 8. Gera código único (tenta até 5 vezes se houver duplicação)
    let codigoInscricao = "";
    let tentativas = 0;
    let codigoUnico = false;

    while (!codigoUnico && tentativas < 5) {
      codigoInscricao = gerarCodigoInscricao();
      const codigoExiste = await prisma.inscricao.findUnique({
        where: { codigo: codigoInscricao },
      });
      if (!codigoExiste) {
        codigoUnico = true;
      }
      tentativas++;
    }

    if (!codigoUnico) {
      return NextResponse.json(
        { error: "Erro ao gerar código de inscrição. Tente novamente." },
        { status: 500 }
      );
    }

    // 9. Cria a inscrição no banco (transação para garantir consistência)
    const inscricao = await prisma.$transaction(async (tx) => {
      // Cria a inscrição
      const novaInscricao = await tx.inscricao.create({
        data: {
          codigo: codigoInscricao,
          userId: user.id,
          loteId: data.loteId,
          nomeCompleto: data.nomeCompleto,
          categoria: data.categoria,
          cpf: data.cpf,
          rg: data.rg,
          dataNascimento: new Date(data.dataNascimento),
          telefone: data.telefone,
          endereco: data.endereco,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
          tamanhoCamisa: data.tamanhoCamisa,
          possuiPlanoSaude: data.possuiPlanoSaude,
          contatoEmergencia: data.contatoEmergencia,
          telefoneEmergencia: data.telefoneEmergencia,
          declaracaoSaude: data.declaracaoSaude,
          valorPago: lote.preco,
          status: "PENDENTE",
        },
        include: {
          lote: true,
        },
      });

      // Cria o registro de pagamento
      await tx.pagamento.create({
        data: {
          inscricaoId: novaInscricao.id,
          transacaoId: `PENDING-${codigoInscricao}`, // Será atualizado pelo gateway
          valor: lote.preco,
          status: "PENDENTE",
          metodoPagamento: "pending", // Será definido no checkout
        },
      });

      return novaInscricao;
    });

    // 10. Buscar configurações do evento
    const configuracao = await prisma.configuracaoSite.findFirst();

    // 11. Enviar email de inscrição pendente
    try {
      await enviarEmailInscricaoPendente({
        para: user.email,
        nomeCompleto: inscricao.nomeCompleto,
        codigo: inscricao.codigo,
        categoria: inscricao.categoria,
        valorPago: inscricao.valorPago,
        dataEvento: configuracao?.dataEvento
          ? new Date(configuracao.dataEvento).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })
          : 'A definir',
        localEvento: configuracao?.localEvento || 'A definir',
        tamanhoCamisa: inscricao.tamanhoCamisa,
      });

    } catch (emailError) {

      console.error('⚠️ Erro ao enviar email (inscrição foi criada normalmente):', emailError);
    }

    // 12. Retorna sucesso com dados da inscrição
    return NextResponse.json(
      {
        success: true,
        message: "Inscrição criada com sucesso",
        inscricao: {
          id: inscricao.id,
          codigo: inscricao.codigo,
          nomeCompleto: inscricao.nomeCompleto,
          categoria: inscricao.categoria,
          valor: inscricao.valorPago,
          status: inscricao.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar inscrição:", error);

    return NextResponse.json(
      {
        error: "Erro interno ao processar inscrição",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
