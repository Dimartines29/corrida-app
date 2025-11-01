// app/(auth)/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserPlus, Mail, Lock, AlertCircle, User } from 'lucide-react'
import { MainHeader } from '@/components/MainHeader';

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit() {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta')
        setIsLoading(false)
        return
      }

      // Redirecionar para inscrição na corrida após sucesso
      router.push('/inscricao')
    } catch (error) {
      setError('Erro ao criar conta')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFE66D]">
      <MainHeader isAdmin={false} isAuthenticated={false} />

      {/* CONTEÚDO */}
      <div className="flex items-center justify-center px-4 py-12 pt-32 min-h-screen">
        <div className="w-full max-w-md">

          {/* Card Principal */}
          <Card className="bg-white border-none shadow-2xl rounded-2xl overflow-hidden">

            {/* Header do Card */}
            <div className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-lg">
                  <UserPlus className="w-6 h-6 text-[#00B8D4]" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white">CRIAR CONTA</h2>

                  <p className="text-sm text-white/90">Preencha os dados abaixo</p>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <CardContent className="p-6 space-y-6">

              {/* Mensagem de Erro */}
              {error && (
                <Alert className="bg-red-50 border-2 border-red-400">
                  <AlertCircle className="h-5 w-5 text-red-600" />

                  <AlertDescription className="text-red-800 font-semibold">{error}</AlertDescription>
                </Alert>
              )}

              {/* Nome */}
              <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
                <Label htmlFor="name" className="text-[#E53935] font-bold flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />Nome Completo *
                </Label>

                <Input id="name" type="text" placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} className="border-2 focus:border-[#00B8D4] transition-all h-12"/>
              </div>

              {/* Email */}
              <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
                <Label htmlFor="email" className="text-[#E53935] font-bold flex items-center gap-2 mb-2"> <Mail className="w-4 h-4" /> Email * </Label>

                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="border-2 focus:border-[#00B8D4] transition-all h-12"/>
              </div>

              {/* Senha */}
              <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#E53935] transition-all">
                <Label htmlFor="password"className="text-[#E53935] font-bold flex items-center gap-2 mb-2"><Lock className="w-4 h-4" /> Senha *</Label>

                <Input id="password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} minLength={6} className="border-2 focus:border-[#E53935] transition-all h-12" onKeyDown={(e) => {if (e.key === 'Enter' && !isLoading) {handleSubmit()}}}/>

                <p className="text-xs text-gray-600 mt-2">A senha deve ter no mínimo 6 caracteres</p>
              </div>

              {/* Botão de Criar Conta */}
              <Button onClick={handleSubmit} disabled={isLoading} className="w-full bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] hover:from-[#00a0c0] hover:to-[#008c9e] text-white font-black text-lg h-12 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />

                    <span>CRIANDO CONTA...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />

                    <span>CRIAR CONTA</span>
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200" />
                </div>

                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-600 font-semibold">OU</span>
                </div>
              </div>

              {/* Link para Login */}
              <div className="text-center space-y-4">
                <p className="text-gray-700 font-semibold">Já tem uma conta?</p>
                <Link href="/login" className="block">
                  <Button type="button" variant="outline" className="w-full border-2 border-[#E53935] bg-white text-[#E53935] hover:bg-gradient-to-r hover:from-[#FFE66D] hover:to-[#ffd93d] hover:border-[#FFE66D] hover:text-gray-800 font-bold text-base h-12 rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-xl">FAZER LOGIN</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">Dúvidas? Entre em contato:{' '}<strong className="text-[#E53935]">studiobravo0@gmail.com</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}