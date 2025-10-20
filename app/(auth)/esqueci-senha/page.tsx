'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'

export default function EsqueciSenhaPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit() {
    // Validações básicas
    if (!email) {
      setError('Por favor, digite seu email')
      return
    }

    if (!email.includes('@')) {
      setError('Por favor, digite um email válido')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao enviar email')
        setIsLoading(false)
        return
      }

      // Sucesso! Mostrar mensagem
      setSuccess(true)

    } catch (error) {
      setError('Erro ao processar solicitação')
      setIsLoading(false)
    }
  }

  // Se enviou com sucesso, mostra mensagem diferente
  if (success) {
    return (
      <div className="min-h-screen bg-[#FFE66D] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white border-none shadow-2xl rounded-2xl overflow-hidden">
            {/* Header Sucesso */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">EMAIL ENVIADO!</h2>
                  <p className="text-sm text-white/90">
                    Verifique sua caixa de entrada
                  </p>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <CardContent className="p-6 space-y-6">
              <Alert className="bg-green-50 border-2 border-green-400">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  <p className="font-semibold mb-2">
                    Enviamos um email para <strong>{email}</strong>
                  </p>
                  <p className="text-sm">
                    Clique no link que enviamos para redefinir sua senha. 
                    O link é válido por <strong>1 hora</strong>.
                  </p>
                </AlertDescription>
              </Alert>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-800">
                  <strong>💡 Dica:</strong> Não se esqueça de verificar a pasta de spam/lixo eletrônico!
                </p>
              </div>

              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] hover:from-[#00a0c0] hover:to-[#008a9e] text-white font-bold text-base h-12 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                VOLTAR PARA LOGIN
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Formulário normal
  return (
    <div className="min-h-screen bg-[#FFE66D] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="bg-white border-none shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#E53935] to-[#c62828] p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-3 rounded-lg">
                <Mail className="w-6 h-6 text-[#E53935]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">ESQUECI MINHA SENHA</h2>
                <p className="text-sm text-white/90">
                  Recupere o acesso à sua conta
                </p>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <CardContent className="p-6 space-y-6">
            {/* Instruções */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-blue-800">
                Digite seu email cadastrado. Enviaremos um link para você criar uma nova senha.
              </p>
            </div>

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
            <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#E53935] transition-all">
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
                className="border-2 focus:border-[#E53935] transition-all h-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSubmit()
                  }
                }}
              />
            </div>

            {/* Botão Enviar */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#E53935] to-[#c62828] hover:from-[#c62828] hover:to-[#b71c1c] text-white font-black text-lg h-12 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>ENVIANDO...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>ENVIAR LINK DE RECUPERAÇÃO</span>
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

            {/* Link Voltar */}
            <Link href="/login" className="block">
              <Button
                type="button"
                variant="outline"
                className="w-full border-2 border-[#00B8D4] bg-white text-[#00B8D4] hover:bg-[#00B8D4] hover:text-white font-bold text-base h-12 rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                VOLTAR PARA LOGIN
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
