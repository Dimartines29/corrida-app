'use client'

import { useState, useEffect } from "react"
import { Send, Mail, Users, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SiteHeader } from "@/components/site-header"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface InscricaoPendente {
  id: string
  codigo: number
  nomeCompleto: string
  email: string
  categoria: string
  createdAt: string
}

interface ResponseBuscarInscricoes {
  total: number
  inscricoes: InscricaoPendente[]
}

interface ResponseEnviarEmails {
  success: boolean
  message: string
  resultados: {
    total: number
    enviados: number
    falhas: number
    erros: string[]
  }
}

interface ErrorResponse {
  error: string
  message?: string
}

export default function EnviarEmailPendentes() {
  const [assunto, setAssunto] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [inscricoesPendentes, setInscricoesPendentes] = useState<InscricaoPendente[]>([])
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)

  // Buscar inscrições pendentes ao carregar a página
  useEffect(() => {
    buscarInscricoesPendentes()
  }, [])

  async function buscarInscricoesPendentes() {
    try {
      setLoading(true)
      const response = await fetch("/api/enviar-email-pendentes")

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse
        throw new Error(errorData.error || "Erro ao buscar inscrições pendentes")
      }

      const data = await response.json() as ResponseBuscarInscricoes
      setInscricoesPendentes(data.inscricoes || [])
    } catch (error) {
      console.error("Erro:", error)
      const message = error instanceof Error ? error.message : "Erro ao carregar inscrições pendentes"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleEnviarEmails() {
    if (!assunto.trim() || !mensagem.trim()) {
      toast.error("Preencha o assunto e a mensagem")
      return
    }

    try {
      setEnviando(true)
      
      const response = await fetch("/api/enviar-email-pendentes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assunto,
          mensagem,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse
        throw new Error(errorData.error || "Erro ao enviar emails")
      }

      const data = await response.json() as ResponseEnviarEmails

      // Sucesso
      toast.success(data.message, {
        description: `${data.resultados.enviados} de ${data.resultados.total} emails enviados com sucesso`,
      })

      // Mostrar erros se houver
      if (data.resultados.falhas > 0) {
        toast.warning(`${data.resultados.falhas} emails falharam`, {
          description: "Verifique o console para mais detalhes",
        })
        console.error("Erros:", data.resultados.erros)
      }

      // Limpar formulário e fechar modal
      setAssunto("")
      setMensagem("")
      setModalAberto(false)

      // Atualizar lista (opcional, pois eles ainda estarão pendentes)
      buscarInscricoesPendentes()

    } catch (error) {
      console.error("Erro ao enviar:", error)
      const message = error instanceof Error ? error.message : "Erro ao enviar emails"
      toast.error(message)
    } finally {
      setEnviando(false)
    }
  }

  function abrirModal() {
    if (!assunto.trim() || !mensagem.trim()) {
      toast.error("Preencha o assunto e a mensagem antes de continuar")
      return
    }
    setModalAberto(true)
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <SiteHeader title="Enviar Email para Pendentes" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <SiteHeader title="Enviar Email para Pendentes" />

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        {/* Formulário de Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Compor Email
            </CardTitle>
            <CardDescription>
              Envie um email personalizado para todos os inscritos com pagamento pendente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assunto">Assunto do Email</Label>
              <Input
                id="assunto"
                placeholder="Ex: Lembrete - Complete sua inscrição!"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                disabled={enviando}
                className="text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                placeholder="Digite sua mensagem aqui...&#10;&#10;Você pode escrever várias linhas.&#10;&#10;O nome e código da inscrição serão adicionados automaticamente."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                disabled={enviando}
                rows={12}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                💡 Dica: Cada email será personalizado com o nome e código do inscrito
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Os emails serão enviados individualmente com um intervalo de 500ms entre cada envio
              </AlertDescription>
            </Alert>

            <Button 
              onClick={abrirModal} 
              disabled={enviando || inscricoesPendentes.length === 0}
              className="w-full"
              size="lg"
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar para {inscricoesPendentes.length} pessoa(s)
            </Button>
          </CardContent>
        </Card>

        {/* Preview dos Destinatários */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Destinatários ({inscricoesPendentes.length})
            </CardTitle>
            <CardDescription>
              Inscrições com pagamento pendente
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inscricoesPendentes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma inscrição pendente</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {inscricoesPendentes.map((inscricao) => (
                  <div
                    key={inscricao.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium text-sm truncate">
                      {inscricao.nomeCompleto}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {inscricao.email}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Código: {inscricao.codigo} • {inscricao.categoria}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Confirmação */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Confirmar Envio de Emails</DialogTitle>
            <DialogDescription>
              Você está prestes a enviar este email para {inscricoesPendentes.length} pessoa(s)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div>
                <p className="text-sm font-medium">Assunto:</p>
                <p className="text-sm text-muted-foreground">{assunto}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Mensagem:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{mensagem}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Lista de destinatários:</p>
              <div className="border rounded-lg p-3 max-h-[200px] overflow-y-auto space-y-1">
                {inscricoesPendentes.map((inscricao) => (
                  <div key={inscricao.id} className="text-sm flex justify-between items-center py-1">
                    <span>{inscricao.nomeCompleto}</span>
                    <span className="text-muted-foreground text-xs">#{inscricao.codigo}</span>
                  </div>
                ))}
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Esta ação não pode ser desfeita. Os emails serão enviados imediatamente.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalAberto(false)}
              disabled={enviando}
            >
              Cancelar
            </Button>
            <Button onClick={handleEnviarEmails} disabled={enviando}>
              {enviando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Confirmar Envio
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
