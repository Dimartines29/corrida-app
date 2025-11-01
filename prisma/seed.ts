import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. CRIAR LOTES
  await prisma.lote.create({
    data: {
      nome: '1º Lote',
      preco: 100.0,
      dataInicio: new Date('2025-10-25'),
      dataFim: new Date('2025-11-30'),
      ativo: true,
    },
  })

  await prisma.lote.create({
    data: {
      nome: '2º Lote',
      preco: 110.0,
      dataInicio: new Date('2025-12-01'),
      dataFim: new Date('2025-12-31'),
      ativo: false,
    },
  })

  await prisma.lote.create({
    data: {
      nome: '3º Lote',
      preco: 120.0,
      dataInicio: new Date('2026-01-01'),
      dataFim: new Date('2026-01-18'),
      ativo: false,
    },
  })

  // 2. CRIAR CONFIGURAÇÃO DO SITE
  const config = await prisma.configuracaoSite.create({
    data: {
      nomeEvento: 'Todo mundo Corre com o Chris',
      dataEvento: new Date('2026-01-25T06:30:00'),
      localEvento: 'Arena The Chris (Rua de Minas no Shopping Monte Carmo em frente ao The Chris Gastrobar)',
      descricao: `
        Descrição do Evento
      `.trim(),
      regulamento: `
        REGULAMENTO AQUI
      `.trim(),
      inscricoesAbertas: true,
    },
  })
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
