import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    // 1. Validar dados
    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // 2. Validar tamanho mínimo da senha
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }

    // 3. Buscar usuário pelo token
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    })

    // 4. Verificar se o token existe
    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    // 5. Verificar se o token ainda é válido (não expirou)
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Token expirado. Solicite uma nova recuperação' },
        { status: 400 }
      )
    }

    // 6. Criptografar a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 7. Atualizar a senha e limpar o token (para não ser usado novamente)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Senha redefinida com sucesso!',
    })

  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    return NextResponse.json(
      { error: 'Erro ao redefinir senha' },
      { status: 500 }
    )
  }
}
