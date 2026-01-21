import { enviarEmailInscricaoPendente } from "@/lib/email/send-email";
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

  const proximoCodigo = Number(ultimaInscricao.codigo) + 1;

  return proximoCodigo;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verifica autenticação
    const session = await auth();

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

    // 6. Valida se lote existe, está ativo e no período válido
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

    // 7. Validar e processar cupom (se fornecido)
    let cupomAplicado = null;
    let valorDesconto = 0;

    if (data.cupomCodigo) {
      const cupom = await prisma.cupom.findUnique({
        where: { codigo: data.cupomCodigo },
        include: {
          _count: {
            select: { inscricoes: true }
          }
        }
      });

      if (!cupom || !cupom.ativo) {
        return NextResponse.json(
          { error: "Cupom inválido ou inativo" },
          { status: 400 }
        );
      }

      // Verificar validade
      const dataInicio = new Date(cupom.dataInicio);
      const dataValidade = new Date(cupom.dataValidade);

      if (agora < dataInicio || agora > dataValidade) {
        return NextResponse.json(
          { error: "Cupom fora do período de validade" },
          { status: 400 }
        );
      }

      // Verificar uso máximo
      if (cupom.usoMaximo && cupom._count.inscricoes >= cupom.usoMaximo) {
        return NextResponse.json(
          { error: "Cupom atingiu o limite de usos" },
          { status: 400 }
        );
      }

      // Verificar uso por usuário
      if (cupom.usoPorUsuario) {
        const usosDoUsuario = await prisma.inscricao.count({
          where: {
            userId: user.id,
            cupomId: cupom.id
          }
        });

        if (usosDoUsuario >= cupom.usoPorUsuario) {
          return NextResponse.json(
            { error: "Você já utilizou este cupom o número máximo de vezes" },
            { status: 400 }
          );
        }
      }

      // Verificar valor mínimo (apenas do lote)
      if (cupom.valorMinimo && lote.preco < cupom.valorMinimo) {
        return NextResponse.json(
          { error: `Cupom válido apenas para inscrições acima de R$ ${cupom.valorMinimo.toFixed(2)}` },
          { status: 400 }
        );
      }

      // Calcular desconto (APENAS no valor do lote)
      if (cupom.tipoDesconto === "PERCENTUAL") {
        valorDesconto = (lote.preco * cupom.desconto) / 100;
      } else {
        valorDesconto = cupom.desconto;
      }

      // Não permitir desconto maior que o valor do lote
      if (valorDesconto > lote.preco) {
        valorDesconto = lote.preco;
      }

      cupomAplicado = cupom;
    }

    // 8. Gera código único
    const codigoInscricao = await gerarCodigoInscricao();

    // 9. Calcula valor final
    const valorLoteComDesconto = lote.preco - valorDesconto;
    const taxaInscricao = 4.00;
    const valorAlmoco = data.valeAlmoco ? 35.90 : 0;
    const valorFinal = valorLoteComDesconto + taxaInscricao + valorAlmoco;

    // 10. Cria a inscrição no banco (transação para garantir consistência)
    const inscricao = await prisma.$transaction(async (tx) => {
      // Cria a inscrição
      const novaInscricao = await tx.inscricao.create({
        data: {
          codigo: codigoInscricao,
          userId: user.id,
          loteId: data.loteId,
          cupomId: cupomAplicado?.id || null,
          valorDesconto: valorDesconto,
          nomeCompleto: data.nomeCompleto,
          categoria: data.categoria,
          cpf: data.cpf,
          sexo: data.sexo,
          rg: data.rg,
          dataNascimento: new Date(data.dataNascimento),
          telefone: data.telefone,
          endereco: data.endereco,
          cidade: data.cidade,
          bairro: data.bairro,
          estado: data.estado,
          cep: data.cep,
          tamanhoCamisa: data.tamanhoCamisa || "N/A", // ✅ FIX: Garante que sempre terá valor
          retiradaKit: data.retiradaKit,
          possuiPlanoSaude: data.possuiPlanoSaude,
          contatoEmergencia: data.contatoEmergencia,
          telefoneEmergencia: data.telefoneEmergencia,
          declaracaoSaude: data.declaracaoSaude,
          valorPago: valorFinal,
          status: "PENDENTE",
          valeAlmoco: data.valeAlmoco || false,
        },
        include: {
          lote: true,
        },
      });

      // Cria o registro de pagamento
      await tx.pagamento.create({
        data: {
          inscricaoId: novaInscricao.id,
          transacaoId: `PENDING-${codigoInscricao}`,
          valor: valorFinal,
          status: "PENDENTE",
          metodoPagamento: "pending",
          deviceId: body.deviceId || null,
        },
      });

      return novaInscricao;
    });

    // 11. Buscar configurações do evento
    const configuracao = await prisma.configuracaoSite.findFirst();

    // 12. Enviar email de inscrição pendente
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
        tamanhoCamisa: inscricao.tamanhoCamisa, // ✅ Agora sempre terá valor (ou "N/A")
      });

    } catch (emailError) {
      console.error('⚠️ Erro ao enviar email (inscrição foi criada normalmente):', emailError);
    }

    // 13. Retorna sucesso com dados da inscrição
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
          cupomAplicado: cupomAplicado ? {
            codigo: cupomAplicado.codigo,
            desconto: valorDesconto
          } : null
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