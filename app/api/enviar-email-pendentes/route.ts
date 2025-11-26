import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { enviarEmailAdminParaPendentes } from "@/lib/email/send-email";
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
    const { assunto, mensagem } = body;

    if (!assunto || !mensagem) {
      return NextResponse.json(
        { error: "Assunto e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    // 3. Buscar todas inscrições PENDENTES
    const inscricoesPendentes = await prisma.inscricao.findMany({
      where: {
        status: "PENDENTE",
      },
      include: {
        user: true,
      },
    });

    if (inscricoesPendentes.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma inscrição pendente encontrada" },
        { status: 404 }
      );
    }

    // 4. Enviar emails com delay
    const resultados = {
      total: inscricoesPendentes.length,
      enviados: 0,
      falhas: 0,
      erros: [] as string[],
    };

    for (const inscricao of inscricoesPendentes) {
      try {
        await enviarEmailAdminParaPendentes({
          para: inscricao.user.email,
          nomeCompleto: inscricao.nomeCompleto,
          codigo: inscricao.codigo,
          assunto: assunto,
          mensagem: mensagem,
        });

        resultados.enviados++;

        // Delay de 500ms entre cada envio para não sobrecarregar
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

// GET para buscar preview das inscrições pendentes
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

    // Buscar inscrições pendentes
    const inscricoesPendentes = await prisma.inscricao.findMany({
      where: {
        status: "PENDENTE",
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const preview = inscricoesPendentes.map(inscricao => ({
      id: inscricao.id,
      codigo: inscricao.codigo,
      nomeCompleto: inscricao.nomeCompleto,
      email: inscricao.user.email,
      categoria: inscricao.categoria,
      createdAt: inscricao.createdAt,
    }));

    return NextResponse.json({
      total: inscricoesPendentes.length,
      inscricoes: preview,
    });

  } catch (error) {
    console.error("Erro ao buscar inscrições pendentes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados" },
      { status: 500 }
    );
  }
}
