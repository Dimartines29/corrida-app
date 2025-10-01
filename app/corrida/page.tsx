import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/get-session'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-300 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/api/auth/signout">
            <Button variant="outline">Sair</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo!</CardTitle>
            <CardDescription>Você está logado no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p className="text-lg">{user.name || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tipo de Conta</p>
              <p className="text-lg">{user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>O que você pode fazer agora</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Fazer sua inscrição na corrida</li>
              <li>Ver detalhes do evento</li>
              <li>Baixar comprovante de inscrição</li>
              {user.role === 'ADMIN' && (
                <li className="font-semibold text-blue-600">
                  Acessar painel administrativo
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
