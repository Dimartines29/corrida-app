'use client'

import { useState, useEffect, useMemo } from "react"
import { Send, Mail, Users, AlertCircle, Search, CheckSquare, Square } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SiteHeader } from "@/components/site-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface Inscricao {
  id: string
  codigo: number
  nomeCompleto: string
  email: string
  cpf: string
  categoria: string
  status: string
  lote: string
  tamanhoCamisa: string
  createdAt: string
}

interface ResponseBuscarInscricoes {
  total: number
  inscricoes: Inscricao[]
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

export default function EnviarEmailSeletivo() {
  const [assunto, setAssunto] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([])
  const [inscricoesSelecionadas, setInscricoesSelecionadas] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  
  // Filtros
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos")

  useEffect(() => {
    buscarInscricoes()
  }, [])

  async function buscarInscricoes() {
    try {
      setLoading(true)
      const response = await fetch("/api/enviar-email-seletivo")
      
      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse
        throw new Error(errorData.error || "Erro ao buscar inscrições")
      }

      const data = await response.json() as ResponseBuscarInscricoes
      setInscricoes(data.inscricoes || [])
    } catch (error) {
      console.error("Erro:", error)
      const message = error instanceof Error ? error.message : "Erro ao carregar inscrições"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar inscrições
  const inscricoesFiltradas = useMemo(() => {
    return inscricoes.filter(inscricao => {
      // Filtro de busca
      if (busca) {
        const buscaLower = busca.toLowerCase()
        const matchBusca = 
          inscricao.nomeCompleto.toLowerCase().includes(buscaLower) ||
          inscricao.email.toLowerCase().includes(buscaLower) ||
          inscricao.cpf.includes(buscaLower) ||
          inscricao.codigo.toString().includes(buscaLower)
        
        if (!matchBusca) return false
      }

      // Filtro de status
      if (filtroStatus !== "todos" && inscricao.status !== filtroStatus) {
        return false
      }

      // Filtro de categoria
      if (filtroCategoria !== "todos" && inscricao.categoria !== filtroCategoria) {
        return false
      }

      return true
    })
  }, [inscricoes, busca, filtroStatus, filtroCategoria])

  // Categorias únicas para o filtro
  const categorias = useMemo(() => {
    const cats = new Set(inscricoes.map(i => i.categoria))
    return Array.from(cats)
  }, [inscricoes])

  // Toggle seleção individual
  function toggleSelecao(id: string) {
    const novaSelecao = new Set(inscricoesSelecionadas)
    if (novaSelecao.has(id)) {
      novaSelecao.delete(id)
    } else {
      novaSelecao.add(id)
    }
    setInscricoesSelecionadas(novaSelecao)
  }

  // Selecionar/Desmarcar todos (apenas os filtrados)
  function toggleSelecionarTodos() {
    if (inscricoesSelecionadas.size === inscricoesFiltradas.length) {
      // Se todos estão selecionados, desmarcar todos
      setInscricoesSelecionadas(new Set())
    } else {
      // Selecionar todos os filtrados
      const todosIds = new Set(inscricoesFiltradas.map(i => i.id))
      setInscricoesSelecionadas(todosIds)
    }
  }

  // Pegar inscrições selecionadas com detalhes
  const inscricoesParaEnviar = useMemo(() => {
    return inscricoes.filter(i => inscricoesSelecionadas.has(i.id))
  }, [inscricoes, inscricoesSelecionadas])

  async function handleEnviarEmails() {
    if (!assunto.trim() || !mensagem.trim()) {
      toast.error("Preencha o assunto e a mensagem")
      return
    }

    if (inscricoesSelecionadas.size === 0) {
      toast.error("Selecione pelo menos uma inscrição")
      return
    }

    try {
      setEnviando(true)
      
      const response = await fetch("/api/enviar-email-seletivo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assunto,
          mensagem,
          inscricoesIds: Array.from(inscricoesSelecionadas),
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

      // Limpar seleção e formulário
      setAssunto("")
      setMensagem("")
      setInscricoesSelecionadas(new Set())
      setModalAberto(false)

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

    if (inscricoesSelecionadas.size === 0) {
      toast.error("Selecione pelo menos uma inscrição")
      return
    }

    setModalAberto(true)
  }

  const todasSelecionadas = inscricoesFiltradas.length > 0 && 
    inscricoesSelecionadas.size === inscricoesFiltradas.length

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <SiteHeader title="Enviar Email Seletivo" />
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
      <SiteHeader title="Enviar Email Seletivo" />

      <div className="grid gap-6">
        {/* Formulário de Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Compor Email
            </CardTitle>
            <CardDescription>
              Selecione as inscrições e envie um email personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto do Email</Label>
                <Input
                  id="assunto"
                  placeholder="Ex: Atualização importante sobre o evento"
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  disabled={enviando}
                />
              </div>

              <div className="flex items-end">
                <Alert className="w-full">
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{inscricoesSelecionadas.size}</strong> pessoa(s) selecionada(s)
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                placeholder="Digite sua mensagem aqui...&#10;&#10;O nome e código da inscrição serão adicionados automaticamente."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                disabled={enviando}
                rows={8}
                className="resize-none"
              />
            </div>

            <Button 
              onClick={abrirModal} 
              disabled={enviando || inscricoesSelecionadas.size === 0}
              className="w-full"
              size="lg"
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar para {inscricoesSelecionadas.size} pessoa(s)
            </Button>
          </CardContent>
        </Card>

        {/* Filtros e Lista */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Selecionar Destinatários
            </CardTitle>
            <CardDescription>
              {inscricoesFiltradas.length} de {inscricoes.length} inscrições
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="busca">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="busca"
                    placeholder="Nome, email, CPF ou código..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-9 text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filtro-status">Status</Label>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger id="filtro-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="PAGO">Pago</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filtro-categoria">Categoria</Label>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger id="filtro-categoria">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    {categorias.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Botão Selecionar Todos */}
            <div className="flex items-center gap-2 py-2 border-b">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSelecionarTodos}
                disabled={inscricoesFiltradas.length === 0}
              >
                {todasSelecionadas ? (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    Desmarcar Todos
                  </>
                ) : (
                  <>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Selecionar Todos ({inscricoesFiltradas.length})
                  </>
                )}
              </Button>
              
              {inscricoesSelecionadas.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInscricoesSelecionadas(new Set())}
                >
                  Limpar Seleção
                </Button>
              )}
            </div>

            {/* Tabela Desktop */}
            <div className="hidden md:block border rounded-lg overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-muted sticky top-0 z-10">
                    <tr>
                      <th className="w-12 p-3"></th>
                      <th className="text-left p-3 text-sm font-medium">Código</th>
                      <th className="text-left p-3 text-sm font-medium">Nome</th>
                      <th className="text-left p-3 text-sm font-medium">Email</th>
                      <th className="text-left p-3 text-sm font-medium">Categoria</th>
                      <th className="text-left p-3 text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscricoesFiltradas.map((inscricao) => (
                      <tr 
                        key={inscricao.id}
                        className="border-t hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => toggleSelecao(inscricao.id)}
                      >
                        <td className="p-3">
                          <Checkbox
                            checked={inscricoesSelecionadas.has(inscricao.id)}
                            onCheckedChange={() => toggleSelecao(inscricao.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="p-3 text-sm font-medium">#{inscricao.codigo}</td>
                        <td className="p-3 text-sm">{inscricao.nomeCompleto}</td>
                        <td className="p-3 text-sm text-muted-foreground">{inscricao.email}</td>
                        <td className="p-3 text-sm">{inscricao.categoria}</td>
                        <td className="p-3">
                          {inscricao.status === 'PAGO' ? (
                            <Badge className="bg-green-100 text-green-600 border-green-300">Pago</Badge>
                          ) : inscricao.status === 'PENDENTE' ? (
                            <Badge className="bg-yellow-100 text-yellow-600 border-yellow-300">Pendente</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-600 border-red-300">Cancelado</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cards Mobile */}
            <div className="md:hidden space-y-3 max-h-[500px] overflow-y-auto">
              {inscricoesFiltradas.map((inscricao) => (
                <Card 
                  key={inscricao.id}
                  className={`cursor-pointer transition-colors ${
                    inscricoesSelecionadas.has(inscricao.id) ? 'bg-primary/5 border-primary' : ''
                  }`}
                  onClick={() => toggleSelecao(inscricao.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={inscricoesSelecionadas.has(inscricao.id)}
                        onCheckedChange={() => toggleSelecao(inscricao.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{inscricao.nomeCompleto}</p>
                            <p className="text-xs text-muted-foreground">#{inscricao.codigo}</p>
                          </div>
                          {inscricao.status === 'PAGO' ? (
                            <Badge className="bg-green-100 text-green-600 border-green-300 text-xs">Pago</Badge>
                          ) : inscricao.status === 'PENDENTE' ? (
                            <Badge className="bg-yellow-100 text-yellow-600 border-yellow-300 text-xs">Pendente</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-600 border-red-300 text-xs">Cancelado</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{inscricao.email}</p>
                        <p className="text-xs">{inscricao.categoria}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {inscricoesFiltradas.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma inscrição encontrada com os filtros aplicados</p>
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
              Você está prestes a enviar este email para {inscricoesSelecionadas.size} pessoa(s)
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
                {inscricoesParaEnviar.map((inscricao) => (
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
