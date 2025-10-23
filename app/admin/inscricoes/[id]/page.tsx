// app/admin/inscricoes/[id]/page.tsx
'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, User, Mail, Phone, MapPin, CreditCard, Calendar, Shirt, Heart, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { InscricaoDetalhada } from "@/types/types"


export default function InscricaoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const [inscricao, setInscricao] = useState<InscricaoDetalhada | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInscricao = async () => {
      try {
        const res = await fetch(`/api/inscricoes/${params.id}`)

        if (!res.ok) {
          if (res.status === 404) {
            setError("Inscrição não encontrada")

          } else {
            setError("Erro ao carregar inscrição")
          }
          return
        }

        const data = await res.json()
        setInscricao(data)

      } catch (err) {
        console.error("Erro ao buscar inscrição:", err)
        setError("Erro ao carregar dados")

      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchInscricao()
    }
  }, [params.id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAGO':
        return <Badge className="bg-green-100 text-green-600 border-green-300">Pago</Badge>

      case 'PENDENTE':
        return <Badge className="bg-yellow-100 text-yellow-600 border-yellow-300">Pendente</Badge>

      case 'CANCELADO':
        return <Badge className="bg-red-100 text-red-600 border-red-300">Cancelado</Badge>

      default:
        return <Badge className="bg-gray-100 text-gray-600 border-gray-300">Desconhecido</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (error || !inscricao) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4 pt-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error || "Erro desconhecido"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Não foi possível carregar os detalhes da inscrição.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-col gap-4 pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {inscricao.nomeCompleto}
            </h1>
            <p className="text-sm text-muted-foreground">
              {inscricao.codigo}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(inscricao.status)}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Pessoais
            </CardTitle>
            <CardDescription>Informações do participante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                <p className="text-sm font-semibold">{inscricao.nomeCompleto}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPF</p>
                <p className="text-sm">{inscricao.cpf}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">RG</p>
                <p className="text-sm">{inscricao.rg}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                <p className="text-sm">{format(new Date(inscricao.dataNascimento), "12/12/2012")}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </p>
              <p className="text-sm">{inscricao.telefone}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </p>
              <p className="text-sm">{inscricao.user.email}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço
              </p>
              <p className="text-sm">{inscricao.endereco}</p>
              <p className="text-sm text-muted-foreground">
                {inscricao.cidade} - {inscricao.estado}, CEP: {inscricao.cep}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dados da Corrida
            </CardTitle>
            <CardDescription>Informações da inscrição</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                <p className="text-sm font-semibold">{inscricao.categoria}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lote</p>
                <p className="text-sm">{inscricao.lote.nome}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shirt className="h-4 w-4" />
                  Tamanho da Camisa
                </p>
                <p className="text-sm">{inscricao.tamanhoCamisa}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Pago</p>
                <p className="text-sm font-semibold text-green-600">
                  R$ {inscricao.valorPago.toFixed(2)}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">Inscrição criada em</p>
              <p className="text-sm">{format(new Date(inscricao.createdAt), "dd/MM/yyyy 'às' HH:mm")}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Última atualização</p>
              <p className="text-sm">{format(new Date(inscricao.updatedAt), " 'às' HH:mm")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Informações de Saúde
            </CardTitle>
            <CardDescription>Dados médicos e emergência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Possui Plano de Saúde?</p>
              <Badge variant={inscricao.possuiPlanoSaude ? "default" : "secondary"}>
                {inscricao.possuiPlanoSaude ? "Sim" : "Não"}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Declaração de Saúde Assinada?</p>
              <Badge variant={inscricao.declaracaoSaude ? "default" : "destructive"}>
                {inscricao.declaracaoSaude ? "Sim" : "Não"}
              </Badge>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground">Contato de Emergência</p>
              <p className="text-sm font-semibold">{inscricao.contatoEmergencia}</p>
              <p className="text-sm text-muted-foreground">{inscricao.telefoneEmergencia}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Informações de Pagamento
            </CardTitle>
            <CardDescription>Detalhes da transação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inscricao.pagamento ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ID da Transação</p>
                    <p className="text-xs font-mono">{inscricao.pagamento.transacaoId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Método</p>
                    <p className="text-sm capitalize">{inscricao.pagamento.metodoPagamento}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor</p>
                    <p className="text-sm font-semibold">R$ {inscricao.pagamento.valor.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    {getStatusBadge(inscricao.pagamento.status)}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data do Pagamento</p>
                  <p className="text-sm">{format(new Date(inscricao.pagamento.createdAt), "dd/MM/yyyy 'às' HH:mm")}</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Nenhum pagamento registrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
