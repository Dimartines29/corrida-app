// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogIn, Mail, Lock, AlertCircle, User } from 'lucide-react'
import { MainHeader } from '@/components/MainHeader';

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit() {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou senha inválidos')
        setIsLoading(false)
        return
      }

      router.push('/minha-area')
      router.refresh()
    } catch (error) {
      setError('Erro ao fazer login')
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
                  <User className="w-6 h-6 text-[#00B8D4]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">LOGIN</h2>
                  <p className="text-sm text-white/90">
                    Acesse sua conta
                  </p>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <CardContent className="p-6 space-y-6">
              {/* Mensagem de Erro */}
              {error && (
                <Alert className="bg-red-50 border-2 border-red-400">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-800 font-semibold">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
                <Label
                  htmlFor="email"
                  className="text-[#E53935] font-bold flex items-center gap-2 mb-2"
                >
                  <Mail className="w-4 h-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="border-2 focus:border-[#00B8D4] transition-all h-12"
                />
              </div>

              {/* Senha */}
              <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#E53935] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Label
                    htmlFor="password"
                    className="text-[#E53935] font-bold flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Senha *
                  </Label>
                  <Link
                    href="/esqueci-senha"
                    className="text-xs text-[#00B8D4] hover:text-[#008a9e] font-semibold hover:underline transition-colors"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="border-2 focus:border-[#E53935] transition-all h-12"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleSubmit()
                    }
                  }}
                />
              </div>

              {/* Botão de Login */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#E53935] to-[#c62828] hover:from-[#c62828] hover:to-[#b71c1c] text-white font-black text-lg h-12 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span>ENTRANDO...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    <span>ENTRAR</span>
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-600 font-semibold">
                    OU
                  </span>
                </div>
              </div>

              {/* Link para Registro */}
              <div className="text-center space-y-4">
                <p className="text-gray-700 font-semibold">
                  Não tem uma conta ainda?
                </p>
                <Link href="/register" className="block">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-2 border-[#00B8D4] bg-white text-[#00B8D4] hover:bg-gradient-to-r hover:from-[#FFE66D] hover:to-[#ffd93d] hover:border-[#FFE66D] hover:text-gray-800 font-bold text-base h-12 rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-xl"
                  >
                    CRIAR NOVA CONTA
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Dúvidas? Entre em contato:{' '}
              <strong className="text-[#E53935]">studiobravo0@gmail.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}