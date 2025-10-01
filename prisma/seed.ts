import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes (apenas em desenvolvimento!)
  await prisma.pagamento.deleteMany()
  await prisma.inscricao.deleteMany()
  await prisma.lote.deleteMany()
  await prisma.categoria.deleteMany()
  await prisma.configuracaoSite.deleteMany()
  await prisma.user.deleteMany()

  console.log('Dados antigos removidos')

  // ========================================
  // 1. CRIAR CATEGORIAS
  // ========================================
  const categoria5km = await prisma.categoria.create({
    data: {
      nome: '5km',
      descricao: 'Corrida de 5 quilômetros - Ideal para iniciantes',
      distancia: 5.0,
    },
  })

  const categoria10km = await prisma.categoria.create({
    data: {
      nome: '10km',
      descricao: 'Corrida de 10 quilômetros - Nível intermediário',
      distancia: 10.0,
    },
  })

  const categoria21km = await prisma.categoria.create({
    data: {
      nome: '21km (Meia Maratona)',
      descricao: 'Meia Maratona - Para corredores experientes',
      distancia: 21.0,
    },
  })

  console.log('Categorias criadas:', {
    categoria5km: categoria5km.nome,
    categoria10km: categoria10km.nome,
    categoria21km: categoria21km.nome,
  })

  // ========================================
  // 2. CRIAR LOTES
  // ========================================
  const lote1 = await prisma.lote.create({
    data: {
      nome: '1º Lote',
      preco: 50.0,
      dataInicio: new Date('2025-10-01'),
      dataFim: new Date('2025-10-15'),
      ativo: true,
    },
  })

  const lote2 = await prisma.lote.create({
    data: {
      nome: '2º Lote',
      preco: 70.0,
      dataInicio: new Date('2025-10-16'),
      dataFim: new Date('2025-10-31'),
      ativo: true,
    },
  })

  const lote3 = await prisma.lote.create({
    data: {
      nome: '3º Lote',
      preco: 90.0,
      dataInicio: new Date('2025-11-01'),
      dataFim: new Date('2025-11-15'),
      ativo: true,
    },
  })

  console.log('Lotes criados:', {
    lote1: `${lote1.nome} - R$ ${lote1.preco}`,
    lote2: `${lote2.nome} - R$ ${lote2.preco}`,
    lote3: `${lote3.nome} - R$ ${lote3.preco}`,
  })

  // ========================================
  // 3. CRIAR CONFIGURAÇÃO DO SITE
  // ========================================
  const config = await prisma.configuracaoSite.create({
    data: {
      nomeEvento: 'Corrida Challenge 2025',
      dataEvento: new Date('2025-12-15T08:00:00'),
      localEvento: 'Parque Municipal, Belo Horizonte - MG',
      descricao: `
        A Corrida Challenge 2025 é um evento esportivo que reúne corredores de todos os níveis.
        Venha fazer parte desta experiência incrível e desafie seus limites!

        Categorias disponíveis: 5km, 10km e 21km (Meia Maratona)
      `.trim(),
      regulamento: `
        REGULAMENTO GERAL

        1. INSCRIÇÕES
        - As inscrições são individuais e intransferíveis
        - Menores de 18 anos precisam de autorização dos responsáveis
        - O participante deve estar em boas condições de saúde

        2. RETIRADA DE KITS
        - Local: A confirmar
        - Data: 13 e 14 de dezembro de 2025
        - Horário: 10h às 18h
        - Necessário apresentar documento com foto

        3. PERCURSO
        - Largada e chegada no Parque Municipal
        - Percurso será divulgado com antecedência
        - Hidratação disponível a cada 2,5km

        4. PREMIAÇÃO
        - Troféus para os 3 primeiros de cada categoria
        - Medalhas para todos os participantes que concluírem a prova

        5. CANCELAMENTO
        - Não haverá reembolso em caso de desistência
        - Em caso de condições climáticas adversas, a organização pode cancelar ou adiar
      `.trim(),
      inscricoesAbertas: true,
    },
  })

  console.log('Configuração do site criada:', config.nomeEvento)

  // ========================================
  // 4. CRIAR USUÁRIO ADMIN
  // ========================================
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@corridachallenge.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Usuário admin criado:', {
    email: admin.email,
    senha: 'admin123',
    role: admin.role,
  })

  console.log('\n🎉 Seed concluído com sucesso!\n')
  console.log('📝 Dados criados:')
  console.log('   - 3 Categorias (5km, 10km, 21km)')
  console.log('   - 3 Lotes de preços')
  console.log('   - 1 Configuração do site')
  console.log('   - 1 Usuário admin')
  console.log('\n🔐 Login Admin:')
  console.log('   Email: admin@corridachallenge.com')
  console.log('   Senha: admin123')
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
