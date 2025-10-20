'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'

function RedefinirSenhaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Verificar se tem token na URL
  useEffect(() => {
    if (!token) {
      setError('Token inválido ou ausente')
    }
  }, [token])

  async function handleSubmit() {
    setError('')

    // Validações
    if (!newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          newPassword 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao redefinir senha')
        setIsLoading(false)
        return
      }

      // Sucesso!
      setSuccess(true)

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } catch (error) {
      setError('Erro ao processar solicitação')
      setIsLoading(false)
    }
  }

  // Tela de sucesso
  if (success) {
    return (
      <div className="min-h-screen bg-[#FFE66D] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-white border-none shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-white p-3 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">SENHA REDEFINIDA!</h2>
                  <p className="text-sm text-white/90">
                    Sucesso total! 🎉
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              <Alert className="bg-green-50 border-2 border-green-400">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  <p className="font-semibold mb-2">
                    Sua senha foi alterada com sucesso!
                  </p>
                  <p className="text-sm">
                    Você será redirecionado para a página de login em instantes...
                  </p>
                </AlertDescription>
              </Alert>

              <Link href="/login" className="block">
                <Button className="w-full bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] hover:from-[#00a0c0] hover:to-[#008a9e] text-white font-bold text-base h-12 rounded-xl">
                  IR PARA LOGIN AGORA
                </Button>
              </Link>
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
                <Lock className="w-6 h-6 text-[#E53935]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">NOVA SENHA</h2>
                <p className="text-sm text-white/90">
                  Crie uma senha segura
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

            {/* Nova Senha */}
            <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#E53935] transition-all">
              <Label
                htmlFor="newPassword"
                className="text-[#E53935] font-bold flex items-center gap-2 mb-2"
              >
                <Lock className="w-4 h-4" />
                Nova Senha *
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  className="border-2 focus:border-[#E53935] transition-all h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E53935]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div className="bg-white p-5 rounded-xl border-2 border-gray-300 hover:border-[#00B8D4] transition-all">
              <Label
                htmlFor="confirmPassword"
                className="text-[#00B8D4] font-bold flex items-center gap-2 mb-2"
              >
                <Lock className="w-4 h-4" />
                Confirmar Senha *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="border-2 focus:border-[#00B8D4] transition-all h-12 pr-12"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleSubmit()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00B8D4]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Dicas de Senha */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-blue-800 font-semibold mb-2">
                💡 Dicas para uma senha segura:
              </p>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>Use no mínimo 6 caracteres</li>
                <li>Combine letras, números e símbolos</li>
                <li>Evite informações pessoais óbvias</li>
              </ul>
            </div>

            {/* Botão Salvar */}
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !token}
              className="w-full bg-gradient-to-r from-[#E53935] to-[#c62828] hover:from-[#c62828] hover:to-[#b71c1c] text-white font-black text-lg h-12 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>SALVANDO...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>SALVAR NOVA SENHA</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFE66D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-semibold">Carregando...</p>
        </div>
      </div>
    }>
      <RedefinirSenhaContent />
    </Suspense>
  )
}
