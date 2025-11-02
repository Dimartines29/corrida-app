// app/admin/cupons/page.tsx
'use client'

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Plus, Pencil, Trash2, Check, X, TrendingUp, Calendar, Tag, Percent, DollarSign } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import type { Cupom } from "@/types/types"

export default function CuponsPage() {
  const router = useRouter()
  const [cupons, setCupons] = useState<Cupom[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<Cupom>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"todos" | "ativos" | "inativos" | "expirados">("todos")
  const [statsDialogOpen, setStatsDialogOpen] = useState(false)
  const [selectedCupom, setSelectedCupom] = useState<Cupom | null>(null)

  useEffect(() => {
    fetchCupons()
  }, [])

  const fetchCupons = async () => {
    try {
      const response = await fetch("/api/cupons")
      if (!response.ok) throw new Error("Erro ao buscar cupons")

      const data = await response.json()
      setCupons(data)
    } catch (error) {
      console.error("Erro ao buscar cupons:", error)
      toast.error("Erro ao carregar cupons")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (cupom: Cupom) => {
    setEditingId(cupom.id)
    setEditValues({
      desconto: cupom.desconto,
      ativo: cupom.ativo,
      dataValidade: cupom.dataValidade,
    })
  }

  const handleSave = async (id: string) => {
    try {
      const response = await fetch(`/api/cupons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues)
      })

      if (!response.ok) throw new Error("Erro ao atualizar cupom")

      toast.success("Cupom atualizado com sucesso!")
      setEditingId(null)
      fetchCupons()
    } catch (error) {
      console.error("Erro ao atualizar:", error)
      toast.error("Erro ao atualizar cupom")
    }
  }

  const handleDelete = async (id: string, codigo: string) => {
    if (!confirm(`Deseja desativar o cupom "${codigo}"?`)) return

    try {
      const response = await fetch(`/api/cupons/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Erro ao deletar cupom")

      toast.success("Cupom desativado com sucesso!")
      fetchCupons()
    } catch (error) {
      console.error("Erro ao deletar:", error)
      toast.error("Erro ao desativar cupom")
    }
  }

  const handleToggleAtivo = async (id: string, ativo: boolean) => {
    try {
      const response = await fetch(`/api/cupons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !ativo })
      })

      if (!response.ok) throw new Error("Erro ao atualizar status")

      toast.success(`Cupom ${!ativo ? 'ativado' : 'desativado'} com sucesso!`)
      fetchCupons()
    } catch (error) {
      console.error("Erro:", error)
      toast.error("Erro ao alterar status")
    }
  }

  const showStats = (cupom: Cupom) => {
    setSelectedCupom(cupom)
    setStatsDialogOpen(true)
  }

  // Estatísticas gerais
  const stats = useMemo(() => {
    const ativos = cupons.filter(c => c.ativo && !c.expirado).length
    const inativos = cupons.filter(c => !c.ativo).length
    const expirados = cupons.filter(c => c.expirado).length
    const totalUsos = cupons.reduce((sum, c) => sum + c.totalUsos, 0)

    return { ativos, inativos, expirados, totalUsos, total: cupons.length }
  }, [cupons])

  // Filtros
  const filteredCupons = useMemo(() => {
    return cupons.filter(cupom => {
      const matchSearch = cupom.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || cupom.origem.toLowerCase().includes(searchTerm.toLowerCase())

      const matchStatus =
        filterStatus === "todos" ? true :
        filterStatus === "ativos" ? (cupom.ativo && !cupom.expirado) :
        filterStatus === "inativos" ? !cupom.ativo :
        filterStatus === "expirados" ? cupom.expirado : true

      return matchSearch && matchStatus
    })
  }, [cupons, searchTerm, filterStatus])

  const getStatusBadge = (cupom: Cupom) => {
    if (cupom.expirado) {
      return <Badge className="bg-gray-100 text-gray-600 border-gray-300">Expirado</Badge>
    }
    if (cupom.ativo) {
      return <Badge className="bg-green-100 text-green-600 border-green-300">Ativo</Badge>
    }
    return <Badge className="bg-red-100 text-red-600 border-red-300">Inativo</Badge>
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cupons de Desconto</h1>
          <p className="text-muted-foreground">Gerencie os cupons promocionais</p>
        </div>
        <Link href="/admin/cupons/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Cupom
          </Button>
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setFilterStatus("ativos")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setFilterStatus("inativos")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inativos}</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setFilterStatus("expirados")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expirados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.expirados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usos Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label className="mb-2" htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Código ou origem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
              <Button variant={filterStatus === "todos" ? "default" : "outline"} onClick={() => setFilterStatus("todos")}>
                Todos
              </Button>

              <Button variant={filterStatus === "ativos" ? "default" : "outline"} onClick={() => setFilterStatus("ativos")}>
                Ativos
              </Button>

              <Button variant={filterStatus === "inativos" ? "default" : "outline"} onClick={() => setFilterStatus("inativos")}>
                Inativos
              </Button>

              <Button variant={filterStatus === "expirados" ? "default" : "outline"} onClick={() => setFilterStatus("expirados")}>
                Expirados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Código</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Desconto</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Origem</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Validade</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Usos</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ativo</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCupons.map((cupom) => (
                  <tr key={cupom.id} className="border-b hover:bg-muted/20">
                    <td className="p-4">
                      <div className="font-mono font-semibold">{cupom.codigo}</div>
                    </td>

                    <td className="p-4">
                      {editingId === cupom.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          className="w-24"
                          value={editValues.desconto}
                          onChange={(e) => setEditValues({...editValues, desconto: parseFloat(e.target.value)})}
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          {cupom.tipoDesconto === "PERCENTUAL" ? (
                            <>
                              {cupom.desconto}%
                            </>
                          ) : (
                            <>
                              R$ {cupom.desconto.toFixed(2)}
                            </>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        {cupom.origem}
                      </div>
                    </td>

                    <td className="p-4">
                      {editingId === cupom.id ? (
                        <Input
                          type="date"
                          className="w-40"
                          value={editValues.dataValidade ? format(new Date(editValues.dataValidade), "yyyy-MM-dd") : ""}
                          onChange={(e) => setEditValues({...editValues, dataValidade: new Date(e.target.value)})}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {format(new Date(cupom.dataValidade), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => showStats(cupom)}
                        className="flex items-center gap-1"
                      >
                        <TrendingUp className="h-4 w-4" />
                        {cupom.totalUsos}
                        {cupom.usoMaximo && ` / ${cupom.usoMaximo}`}
                      </Button>
                    </td>

                    <td className="p-4">
                      {getStatusBadge(cupom)}
                    </td>

                    <td className="p-4">
                      <Switch
                        checked={editingId === cupom.id ? editValues.ativo : cupom.ativo}
                        onCheckedChange={(checked) => {
                          if (editingId === cupom.id) {
                            setEditValues({...editValues, ativo: checked})
                          } else {
                            handleToggleAtivo(cupom.id, cupom.ativo)
                          }
                        }}
                      />
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {editingId === cupom.id ? (
                          <>
                            <Button size="sm" onClick={() => handleSave(cupom.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(cupom)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(cupom.id, cupom.codigo)}
                              disabled={cupom.totalUsos > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Estatísticas */}
      <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Estatísticas do Cupom</DialogTitle>
            <DialogDescription>
              {selectedCupom?.codigo}
            </DialogDescription>
          </DialogHeader>

          {selectedCupom && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Usos Totais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedCupom.totalUsos}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Limite Máximo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedCupom.usoMaximo || "Ilimitado"}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Label>Informações</Label>
                <div className="text-sm text-muted-foreground space-y-1 mt-2">
                  <p>• Origem: {selectedCupom.origem}</p>
                  <p>• Uso por usuário: {selectedCupom.usoPorUsuario || "Ilimitado"}</p>
                  <p>• Valor mínimo: {selectedCupom.valorMinimo ? `R$ ${selectedCupom.valorMinimo.toFixed(2)}` : "Sem mínimo"}</p>
                  <p>• Criado em: {format(new Date(selectedCupom.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
