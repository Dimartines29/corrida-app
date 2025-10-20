import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { enviarEmailRecuperacaoSenha } from '@/lib/email/send-email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // 1. Validar se o email foi enviado
    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // 2. Buscar o usuário no banco
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // 3. Por segurança, sempre retornamos sucesso (mesmo se o email não existir)
    // Isso evita que alguém descubra quais emails estão cadastrados
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Se o email existir, você receberá as instruções',
      })
    }

    // 4. Gerar um token único e aleatório
    const resetToken = crypto.randomBytes(32).toString('hex')

    // 5. Definir validade do token (1 hora a partir de agora)
    const resetTokenExpiry = new Date()
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1)

    // 6. Salvar o token no banco
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // 7. Criar o link de recuperação
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha?token=${resetToken}`

    // 8. Enviar o email
    await enviarEmailRecuperacaoSenha({
      para: user.email,
      nomeCompleto: user.name || 'Usuário',
      resetUrl,
    })

    return NextResponse.json({
      success: true,
      message: 'Email de recuperação enviado com sucesso',
    })

  } catch (error) {
    console.error('Erro ao processar recuperação de senha:', error)

    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}
