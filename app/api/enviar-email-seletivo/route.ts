import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { enviarEmailAdminGenerico } from "@/lib/email/send-email";
import { NextRequest, NextResponse } from "next/server";

// Função auxiliar para delay entre envios
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticação e role ADMIN
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem enviar emails." },
        { status: 403 }
      );
    }

    // 2. Pegar dados do body
    const body = await request.json();
    const { assunto, mensagem, inscricoesIds } = body;

    if (!assunto || !mensagem) {
      return NextResponse.json(
        { error: "Assunto e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    if (!inscricoesIds || !Array.isArray(inscricoesIds) || inscricoesIds.length === 0) {
      return NextResponse.json(
        { error: "Selecione pelo menos uma inscrição" },
        { status: 400 }
      );
    }

    // 3. Buscar inscrições selecionadas
    const inscricoesSelecionadas = await prisma.inscricao.findMany({
      where: {
        id: {
          in: inscricoesIds,
        },
      },
      include: {
        user: true,
      },
    });

    if (inscricoesSelecionadas.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma inscrição encontrada com os IDs fornecidos" },
        { status: 404 }
      );
    }

    // 4. Enviar emails com delay
    const resultados = {
      total: inscricoesSelecionadas.length,
      enviados: 0,
      falhas: 0,
      erros: [] as string[],
    };

    for (const inscricao of inscricoesSelecionadas) {
      try {
        await enviarEmailAdminGenerico({
          para: inscricao.user.email,
          nomeCompleto: inscricao.nomeCompleto,
          codigo: inscricao.codigo,
          assunto: assunto,
          mensagem: mensagem,
        });

        resultados.enviados++;
        console.log(`✅ Email enviado para: ${inscricao.nomeCompleto} (${inscricao.user.email})`);

        // Delay de 500ms entre cada envio
        await delay(500);

      } catch (error) {
        resultados.falhas++;
        const mensagemErro = `${inscricao.nomeCompleto}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
        resultados.erros.push(mensagemErro);
        console.error(`❌ Erro ao enviar para ${inscricao.nomeCompleto}:`, error);
      }
    }

    // 5. Retornar relatório
    return NextResponse.json({
      success: true,
      message: `Envio concluído: ${resultados.enviados} emails enviados com sucesso`,
      resultados,
    });

  } catch (error) {
    console.error("Erro no envio de emails:", error);
    return NextResponse.json(
      {
        error: "Erro interno ao enviar emails",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// GET para buscar todas as inscrições
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Buscar TODAS as inscrições
    const todasInscricoes = await prisma.inscricao.findMany({
      include: {
        user: true,
        lote: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const inscricoes = todasInscricoes.map(inscricao => ({
      id: inscricao.id,
      codigo: inscricao.codigo,
      nomeCompleto: inscricao.nomeCompleto,
      email: inscricao.user.email,
      cpf: inscricao.cpf,
      categoria: inscricao.categoria,
      status: inscricao.status,
      lote: inscricao.lote.nome,
      tamanhoCamisa: inscricao.tamanhoCamisa,
      createdAt: inscricao.createdAt,
    }));

    return NextResponse.json({
      total: inscricoes.length,
      inscricoes,
    });

  } catch (error) {
    console.error("Erro ao buscar inscrições:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados" },
      { status: 500 }
    );
  }
}
