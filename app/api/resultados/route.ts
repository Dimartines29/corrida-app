import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoria = searchParams.get('categoria');

    if (!categoria) {
      return NextResponse.json(
        { error: 'Categoria é obrigatória' },
        { status: 400 }
      );
    }

    const resultados = await sql`
      SELECT
        id,
        categoria,
        colocacao,
        numero,
        atleta,
        sexo,
        equipe,
        tempo
      FROM resultados
      WHERE categoria = ${categoria}
      ORDER BY colocacao ASC
    `;

    return NextResponse.json(resultados);
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar resultados' },
      { status: 500 }
    );
  }
}