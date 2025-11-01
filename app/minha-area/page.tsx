// app/minha-area/page.tsx
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/get-session'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { User, Mail, LogOut, FileText, Calendar, Trophy, Settings, AlertCircle, CreditCard, Phone, MapPin, Home, Shirt, Heart } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { PagamentoPendenteButton } from '@/components/PagamentoPendenteButton'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MainHeader } from '@/components/MainHeader';

export default async function MinhaAreaPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const inscricao = await prisma.inscricao.findUnique({
    where: { userId: user.id },
    include: {
      lote: true,
      pagamento: true,
    },
  })

  return (
    <div className="min-h-screen bg-[#FFE66D]">
      <MainHeader isAdmin={false} isAuthenticated={true} />

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

          {inscricao && inscricao.status === 'PENDENTE' && (
            <Card className="relative bg-white border-4 border-[#E53935] shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E53935]/10 via-transparent to-[#FFE66D]/10 animate-pulse"></div>

              <CardContent className="relative p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#E53935] rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-[#E53935] to-[#c62828] p-6 rounded-full shadow-xl">
                      <CreditCard className="w-16 h-16 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <AlertCircle className="w-6 h-6 text-[#E53935]" />
                      <h3 className="text-3xl font-black text-[#E53935]">
                        ATENÇÃO: PAGAMENTO PENDENTE
                      </h3>
                    </div>

                    <p className="text-gray-700 mb-4 font-bold text-lg">
                      Sua inscrição <span className="text-[#E53935]">{inscricao.codigo}</span> está quase pronta!
                      <br />
                      <span className="text-[#00B8D4]">Complete o pagamento agora</span> e garanta sua vaga na corrida! 🏃‍♂️
                    </p>

                    <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] rounded-2xl p-5 mb-5 shadow-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-gray-600 font-bold text-sm mb-1">📋 CATEGORIA</p>
                          <p className="text-[#E53935] font-black text-xl">{inscricao.categoria}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600 font-bold text-sm mb-1">💰 VALOR</p>
                          <p className="text-[#E53935] font-black text-xl">R$ {Number(inscricao.valorPago).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <PagamentoPendenteButton inscricaoId={inscricao.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {inscricao && (
            <Card className="bg-white border-none shadow-2xl rounded-2xl overflow-hidden">
              <div className={`p-6 ${
                inscricao.status === 'PAGO'
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : inscricao.status === 'PENDENTE'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">SUA INSCRIÇÃO</h2>
                    <p className="text-sm text-white/90">
                      Código: {inscricao.codigo}
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Status e Info Básica */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FFE66D] p-4 rounded-xl">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Status</p>
                    <p className="text-lg font-bold text-gray-800">
                      {inscricao.status === 'PAGO' && '✅ Confirmada'}
                      {inscricao.status === 'PENDENTE' && '⏳ Pendente'}
                      {inscricao.status === 'CANCELADO' && '❌ Cancelada'}
                    </p>
                  </div>

                  <div className="bg-[#FFE66D] p-4 rounded-xl">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Categoria</p>
                    <p className="text-lg font-bold text-gray-800">{inscricao.categoria}</p>
                  </div>

                  <div className="bg-[#FFE66D] p-4 rounded-xl">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Lote</p>
                    <p className="text-lg font-bold text-gray-800">{inscricao.lote.nome}</p>
                  </div>

                  <div className="bg-[#FFE66D] p-4 rounded-xl">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Valor</p>
                    <p className="text-lg font-bold text-gray-800">
                      R$ {Number(inscricao.valorPago).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* TODOS OS DADOS DA INSCRIÇÃO */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-xl font-black text-[#E53935] mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    DADOS PESSOAIS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nome Completo */}
                    <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <User className="w-3 h-3" /> Nome Completo
                      </p>
                      <p className="text-base font-bold text-gray-800">{inscricao.nomeCompleto}</p>
                    </div>

                    {/* CPF */}
                    <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> CPF
                      </p>
                      <p className="text-base font-bold text-gray-800">{inscricao.cpf}</p>
                    </div>

                    {/* RG */}
                    {inscricao.rg && (
                      <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                        <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> RG
                        </p>
                        <p className="text-base font-bold text-gray-800">{inscricao.rg}</p>
                      </div>
                    )}

                    {/* Data de Nascimento */}
                    <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Data de Nascimento
                      </p>
                      <p className="text-base font-bold text-gray-800">
                        {format(new Date(inscricao.dataNascimento), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>

                    {/* Telefone */}
                    <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Telefone
                      </p>
                      <p className="text-base font-bold text-gray-800">{inscricao.telefone}</p>
                    </div>

                    {/* Tamanho da Camisa */}
                    <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <Shirt className="w-3 h-3" /> Tamanho da Camisa
                      </p>
                      <p className="text-base font-bold text-gray-800">{inscricao.tamanhoCamisa}</p>
                    </div>
                  </div>
                </div>

                {/* ENDEREÇO */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-xl font-black text-[#E53935] mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    ENDEREÇO
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CEP */}
                    <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> CEP
                      </p>
                      <p className="text-base font-bold text-gray-800">{inscricao.cep}</p>
                    </div>

                    {/* Endereço */}
                    <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <Home className="w-3 h-3" /> Endereço
                      </p>
                      <p className="text-base font-bold text-gray-800">{inscricao.endereco}</p>
                    </div>

                    {/* Cidade */}
                    <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Cidade
                      </p>
                      <p className="text-base font-bold text-gray-800">{inscricao.cidade}</p>
                    </div>

                    {/* Estado */}
                    <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Estado
                      </p>
                      <p className="text-base font-bold text-gray-800">{inscricao.estado}</p>
                    </div>
                  </div>
                </div>

                {/* INFORMAÇÕES MÉDICAS / EMERGÊNCIA */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="text-xl font-black text-[#E53935] mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    INFORMAÇÕES DE EMERGÊNCIA
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contato de Emergência */}
                    {inscricao.contatoEmergencia && (
                      <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                        <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                          <User className="w-3 h-3" /> Contato de Emergência
                        </p>
                        <p className="text-base font-bold text-gray-800">{inscricao.contatoEmergencia}</p>
                      </div>
                    )}

                    {/* Telefone de Emergência */}
                    {inscricao.telefoneEmergencia && (
                      <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                        <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> Telefone de Emergência
                        </p>
                        <p className="text-base font-bold text-gray-800">{inscricao.telefoneEmergencia}</p>
                      </div>
                    )}

                    {/* Possui Plano de Saúde */}
                    <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <Heart className="w-3 h-3" /> Possui Plano de Saúde
                      </p>
                      <p className="text-base font-bold text-gray-800">
                        {inscricao.possuiPlanoSaude ? '✅ Sim' : '❌ Não'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mensagem de Confirmação (se PAGO) */}
                {inscricao.status === 'PAGO' && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                    <p className="text-green-800 font-bold text-center">
                      🎉 Inscrição confirmada! Nos vemos na corrida!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Card de Informações do Usuário */}
          <Card className="bg-white border-none shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-lg">
                  <User className="w-6 h-6 text-[#00B8D4]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">DADOS DA CONTA</h2>
                  <p className="text-sm text-white/90">
                    Informações do seu login
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Nome */}
              <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-5 rounded-xl">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#E53935] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Nome</p>
                    <p className="text-lg font-bold text-gray-800 break-words">
                      {user.name || 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] p-5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#E53935] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Email</p>
                    <p className="text-lg font-bold text-gray-800 break-all">
                      {user.email}
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

            <CardContent className="p-6 space-y-6">
              {/* Fazer Inscrição (só mostra se NÃO tiver inscrição) */}
              {!inscricao && (
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
              )}<br></br>

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
                </div><br></br>
              </Link>

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