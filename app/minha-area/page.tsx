// app/minha-area/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/get-session'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { User, Mail, Shield, LogOut, FileText, Calendar, Trophy, Settings } from 'lucide-react'

export default async function MinhaAreaPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#FFE66D]">
      {/* HEADER */}
      <header className="fixed top-0 w-full bg-gray-100 shadow-md z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex-shrink-0">
              <Link href="/">
                <img
                  src="/logo-chris.png"
                  alt="Todo Mundo Corre com o Chris"
                  className="h-10 sm:h-13 w-auto cursor-pointer"
                />
              </Link>
            </div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-8">
              <Link href="/#inicio">
                <button className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
                  Início
                </button>
              </Link>
              <Link href="/#inscricoes">
                <button className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
                  Inscrições
                </button>
              </Link>
              <Link href="/#informacoes">
                <button className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
                  Informações
                </button>
              </Link>
              <Link href="/#percurso">
                <button className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
                  Percurso
                </button>
              </Link>
            </div>

            {/* Botões Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              {user.role === 'ADMIN' && (
                <Link href="/admin">
                  <button className="text-[#E53935] hover:text-[#c62828] font-bold text-base xl:text-lg">
                    Painel Admin
                  </button>
                </Link>
              )}
              <Link href="/api/auth/signout">
                <button className="bg-[#E53935] text-white px-4 xl:px-6 py-2 xl:py-3 rounded-md font-bold text-base xl:text-lg hover:bg-[#c62828] transition-colors">
                  SAIR
                </button>
              </Link>
            </div>

            {/* Menu Mobile Toggle */}
            <div className="lg:hidden">
              <button className="text-[#E53935] p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* CONTEÚDO */}
      <div className="px-4 py-12 pt-32 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-[#E53935] mb-2">
              BEM-VINDO, {user.name?.toUpperCase() || 'CORREDOR'}!
            </h1>
            <p className="text-gray-700 font-semibold text-lg">
              Sua área pessoal do evento
            </p>
          </div>

          {/* Card de Informações do Usuário */}
          <Card className="bg-white border-none shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-lg">
                  <User className="w-6 h-6 text-[#00B8D4]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">SEUS DADOS</h2>
                  <p className="text-sm text-white/90">
                    Informações da sua conta
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Nome */}
              <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-5 rounded-xl">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#E53935]" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Nome</p>
                    <p className="text-lg font-bold text-gray-800">
                      {user.name || 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#E53935]" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Email</p>
                    <p className="text-lg font-bold text-gray-800">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Tipo de Conta */}
              <div className={`p-5 rounded-xl ${
                user.role === 'ADMIN'
                  ? 'bg-gradient-to-r from-[#E53935] to-[#c62828]'
                  : 'bg-gradient-to-r from-[#00B8D4] to-[#00a0c0]'
              }`}>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-white" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white/80 uppercase mb-1">Tipo de Conta</p>
                    <p className="text-lg font-bold text-white">
                      {user.role === 'ADMIN' ? '⭐ Administrador' : '✓ Usuário'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Próximos Passos */}
          <Card className="bg-white border-none shadow-2xl rounded-2xl">
            <div className="bg-[#E53935] p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-[#E53935]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">PRÓXIMOS PASSOS</h2>
                  <p className="text-sm text-white/90">O que você pode fazer agora</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Fazer Inscrição */}
              <Link href="/inscricao">
                <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-5 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-[#E53935]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-800 text-lg">Fazer sua inscrição na corrida</p>
                      <p className="text-sm text-gray-700 font-semibold">Clique para se inscrever no evento</p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Ver Detalhes do Evento */}
              <Link href="/#informacoes">
                <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-5 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-[#00B8D4]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-800 text-lg">Ver detalhes do evento</p>
                      <p className="text-sm text-gray-700 font-semibold">Informações sobre data, local e percurso</p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Baixar Comprovante */}
              <div className="bg-gray-100 p-5 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-600 text-lg">Baixar comprovante de inscrição</p>
                    <p className="text-sm text-gray-500 font-semibold">Disponível após confirmação do pagamento</p>
                  </div>
                </div>
              </div>

              {/* Painel Admin (se for admin) */}
              {user.role === 'ADMIN' && (
                <Link href="/admin">
                  <div className="bg-gradient-to-r from-[#E53935] to-[#c62828] p-5 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <Settings className="w-6 h-6 text-[#E53935]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-white text-lg">⭐ Acessar painel administrativo</p>
                        <p className="text-sm text-white/90 font-semibold">Gerenciar eventos, usuários e inscrições</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Botão de Sair */}
          <div className="flex justify-center pt-6">
            <Link href="/api/auth/signout" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-2 border-[#E53935] text-[#E53935] hover:bg-[#E53935] hover:text-white font-bold text-base h-12 px-8 rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                <LogOut className="w-5 h-5 mr-2" />
                SAIR DA CONTA
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
