// app/inscricao/layout.tsx
import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

/**
 * Layout com proteção Server-Side para a rota /inscricao
 * 
 * COMO FUNCIONA:
 * 1. Este é um Server Component (roda no servidor antes de qualquer renderização)
 * 2. Usa auth() do NextAuth para verificar a sessão NO SERVIDOR
 * 3. Se não houver sessão, redireciona para /login ANTES da página carregar
 * 4. Se houver sessão, permite que o conteúdo (children) seja renderizado
 * 
 * VANTAGENS:
 * - Mais seguro: verificação no servidor não pode ser burlada
 * - Melhor UX: usuário não vê flash de conteúdo não autorizado
 * - SEO protegido: bots não indexam conteúdo protegido
 * - Performance: não envia código de autenticação para o cliente
 */
export default async function InscricaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Busca a sessão do usuário no servidor
  const session = await auth()

  // Se não houver sessão, redireciona para login
  // Isso acontece NO SERVIDOR, antes da página ser enviada ao navegador
  if (!session) {
    redirect('/login')
  }

  // Se chegou aqui, o usuário está autenticado
  // Renderiza o conteúdo da página (children = page.tsx)
  return <>{children}</>
}