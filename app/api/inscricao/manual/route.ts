import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inscricaoCompletaSchema } from "@/lib/validations/inscricao";
import { auth } from "@/auth";

// Função para gerar código numérico sequencial de inscrição
async function gerarCodigoInscricao(): Promise<number> {
  const ultimaInscricao = await prisma.inscricao.findFirst({
    orderBy: {
      codigo: 'desc'
    },
    select: {
      codigo: true
    }
  });

  if (!ultimaInscricao) {
    return 1001;
  }

  return Number(ultimaInscricao.codigo) + 1;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verifica autenticação e permissão de ADMIN
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    // Busca o usuário e verifica se é ADMIN
    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem criar inscrições manuais." },
        { status: 403 }
      );
    }

    // 2. Parse dos dados
    const body = await request.json();

    // Limpa o CPF antes de validar
    const cpfLimpo = body.cpf.replace(/\D/g, '');

    // Verifica se CPF já está cadastrado
    const cpfExistente = await prisma.inscricao.findUnique({
      where: { cpf: cpfLimpo },
    });

    if (cpfExistente) {
      return NextResponse.json(
        { error: "CPF já cadastrado em outra inscrição" },
        { status: 400 }
      );
    }

    // 3. Validação dos dados da inscrição usando seu schema
    const validationResult = inscricaoCompletaSchema.safeParse({
      ...body,
      cpf: cpfLimpo,
    });

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

    // 4. Valida se lote existe e está ativo
    const lote = await prisma.lote.findFirst({
      where: {
        id: data.loteId,
        ativo: true,
      },
    });

    if (!lote) {
      return NextResponse.json(
        { error: "Lote não encontrado ou inativo" },
        { status: 400 }
      );
    }

    // 5. Validações dos campos extras (status, método, valor)
    const statusInscricao = body.statusInscricao || "PENDENTE";
    const metodoPagamento = body.metodoPagamento || "manual";
    const valorPago = body.valorPago ? parseFloat(body.valorPago) : lote.preco + 4.00;
    const statusPagamento = body.statusPagamento || "PENDENTE";

    // Valida status da inscrição
    if (!["PENDENTE", "PAGO", "CANCELADO"].includes(statusInscricao)) {
      return NextResponse.json(
        { error: "Status de inscrição inválido" },
        { status: 400 }
      );
    }

    // Valida status do pagamento
    if (!["PENDENTE", "APROVADO", "RECUSADO", "REEMBOLSADO"].includes(statusPagamento)) {
      return NextResponse.json(
        { error: "Status de pagamento inválido" },
        { status: 400 }
      );
    }

    // 6. Gera código único
    const codigoInscricao = await gerarCodigoInscricao();

    // 7. Cria usuário e inscrição em uma transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Cria o usuário com um email genérico
      const novoUser = await tx.user.create({
        data: {
          email: `inscricao-${codigoInscricao}@manual.local`,
          name: data.nomeCompleto,
          role: "USER",
          emailVerified: new Date(), // Marca como verificado para inscrições manuais
        },
      });

      // Cria a inscrição
      const novaInscricao = await tx.inscricao.create({
        data: {
          codigo: codigoInscricao,
          userId: novoUser.id,
          loteId: data.loteId,
          nomeCompleto: data.nomeCompleto,
          categoria: data.categoria,
          cpf: cpfLimpo,
          rg: data.rg,
          dataNascimento: new Date(data.dataNascimento),
          telefone: data.telefone,
          endereco: data.endereco,
          bairro: data.bairro || "",
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
          tamanhoCamisa: data.tamanhoCamisa,
          possuiPlanoSaude: data.possuiPlanoSaude,
          contatoEmergencia: data.contatoEmergencia,
          telefoneEmergencia: data.telefoneEmergencia,
          declaracaoSaude: data.declaracaoSaude,
          valorPago: valorPago,
          status: statusInscricao,
        },
        include: {
          lote: true,
        },
      });

      // Cria o registro de pagamento
      await tx.pagamento.create({
        data: {
          inscricaoId: novaInscricao.id,
          transacaoId: `MANUAL-${codigoInscricao}`,
          valor: valorPago,
          status: statusPagamento,
          metodoPagamento: metodoPagamento,
        },
      });

      return { novaInscricao, novoUser };
    });

    // 9. Retorna sucesso
    return NextResponse.json(
      {
        success: true,
        message: "Inscrição manual criada com sucesso",
        inscricao: {
          id: resultado.novaInscricao.id,
          codigo: resultado.novaInscricao.codigo,
          nomeCompleto: resultado.novaInscricao.nomeCompleto,
          categoria: resultado.novaInscricao.categoria,
          valor: resultado.novaInscricao.valorPago,
          status: resultado.novaInscricao.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar inscrição manual:", error);

    return NextResponse.json(
      {
        error: "Erro interno ao processar inscrição manual",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
