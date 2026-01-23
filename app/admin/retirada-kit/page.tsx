// app/admin/page.tsx
'use client'
import { useState, useCallback, useMemo, useEffect } from "react"
import type { Inscricao, InscricaoConsolidatedFilters } from "@/types/types"
import { Check, User, X } from "lucide-react"
import Link from "next/link"

import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from '@/components/ui/card'
import Paginator from "@/components/pagination/Paginator"
import { InscricoesFilters } from "@/components/inscricoes/InscricoesFilters"
import { SiteHeader } from "@/components/site-header"
import { toast } from "sonner"

function createDefaultInscricaoFilters(): InscricaoConsolidatedFilters {
  return {
    code: "",
    search: "",
    createdAt: undefined,
    fullname: "",
    cpf: "",
    rg: "",
    city: "",
    cep: "",
    shirtSize: "",
    healthPlan: "",
    status: "",
    lunch: "",
    category: "",
    tier: "",
    sex: "",
    kit: "",
  }
}

type SortField = "createdAt"
type SortDirection = "asc" | "desc"

export default function Inscricoes() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [registrations, setRegistrations] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<InscricaoConsolidatedFilters>(createDefaultInscricaoFilters())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [activeCardFilter, setActiveCardFilter] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<Inscricao>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const registrationsRes = await fetch("/api/retirada-kit-lista");
        const registrationsData = await registrationsRes.json();
        setRegistrations(registrationsData);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFiltersChange = useCallback((newFilters: InscricaoConsolidatedFilters) => {
    setFilters(newFilters)
  }, [])

  const fetchInscricoes = async () => {
    try {
      const response = await fetch("/api/retirada-kit-lista")
      if (!response.ok) throw new Error("Erro ao buscar inscrições")

      const data = await response.json()
      setRegistrations(data)
    } catch (error) {
      console.error("Erro ao buscar inscrições:", error)
      toast.error("Erro ao carregar inscrições")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAtivo = async (id: string, kitretirado: boolean) => {
    try {
      const response = await fetch(`/api/retirada-kit-lista/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kitretirado: !kitretirado })
      })

      if (!response.ok) throw new Error("Erro ao atualizar status")

      toast.success(`Kit ${!kitretirado ? 'retirado' : 'devolvido'} com sucesso!`)
      fetchInscricoes()
    } catch (error) {
      console.error("Erro:", error)
      toast.error("Erro ao alterar status")
    }
  }

  //Filtered registrations
  const filteredRegistrations = useMemo(() => {
    if (!registrations) return []

    let data = registrations

    if (activeCardFilter) {
      switch (activeCardFilter) {
        case 'categoria':
          if (selectedCategory) {
            data = registrations.filter(registration =>
              registration.categoria === selectedCategory
            )
          }
          break
        case 'status':
          if (selectedStatus) {
            data = data.filter(register =>
              register.status === selectedStatus
            )
          }
          break
      }
    }

    return data.filter((registration) => {
      const vale = registration.valeAlmoco ? 'sim' : 'nao';

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        const searchableText = [
          registration.codigo || "",
          registration.nomeCompleto || "",
          registration.cpf || "",
          registration.telefone || "",
          registration.endereco || "",
          registration.cidade || "",
          registration.estado || "",
        ].join(" ").toLowerCase()

        if (!searchableText.includes(searchTerm)) return false
      }

      if (filters.status && filters.status !== "todos") {
        if (registration.status !== filters.status) return false
      }

      if (filters.lunch && filters.lunch !== "todos") {
        if (vale !== filters.lunch) return false
      }

      if (filters.category && filters.category !== "todos") {
        if (registration.categoria !== filters.category) return false
      }

      if (filters.tier && filters.tier !== "todos") {
        if (registration.lote.nome !== filters.tier) return false
      }

      if (filters.shirtSize && filters.shirtSize !== "todos") {
        if (registration.tamanhoCamisa !== filters.shirtSize) return false
      }

      if (filters.sex && filters.sex !== "todos") {
        if (registration.sexo !== filters.sex) return false
      }

      if (filters.kit && filters.kit !== "todos") {
        if (registration.retiradaKit !== filters.kit) return false
      }

      if (filters.code) {
        const codeStr = registration.codigo.toString()
        if (!codeStr.includes(filters.code)) return false
      }

      if (filters.createdAt && filters.createdAt.from && filters.createdAt.to) {
        if (registration.createdAt) {
          const casecreatedAtDate = new Date(registration.createdAt)
          const fromDate = new Date(filters.createdAt.from)
          const toDate = new Date(filters.createdAt.to)

          fromDate.setHours(0, 0, 0, 0)
          toDate.setHours(23, 59, 59, 999)

          if (casecreatedAtDate < fromDate || casecreatedAtDate > toDate) {
            return false
          }
        }
      }
      return true
    })
  }, [
    registrations,
    activeCardFilter,
    filters.search,
    filters.createdAt,
    filters.code,
    filters.category,
    filters.tier,
    filters.shirtSize,
    filters.status,
    filters.lunch,
    filters.sex,
    filters.kit,
    selectedCategory,
  ])

  const sortedRegistrations = useMemo(() => {
    return [...filteredRegistrations].sort((a, b) => {
      let aValue: Date | string | number
      let bValue: Date | string | number

      switch (sortField) {
        case "createdAt":
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredRegistrations, sortField, sortDirection])

  const { paginatedRegistrations, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginated = sortedRegistrations.slice(startIndex, endIndex)

    return {
      paginatedRegistrations: paginated,
      totalPages: Math.ceil(sortedRegistrations.length / itemsPerPage),
    }
  }, [sortedRegistrations, currentPage, itemsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <SiteHeader title="Retirada de Kit" />

      <InscricoesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        metadata={{
          status: ['PAGO', 'PENDENTE', 'CANCELADO'],
          category: ['Caminhada - 3km', 'Corrida - 6km', 'Corrida - 10km'],
          shirtSize: ['PP', 'P', 'M', 'G', 'GG', 'XG'],
          tier: ['1º Lote', '2º Lote', '3º Lote'],
          sexo: ['Masculino', 'Feminino', 'Outro'],
          retiradaKit: ['The Chris - Shopping do avião', 'The Chris - Monte Carmo Shopping'],
        }}
      />
      <div>
        <h1 className="text-muted-foreground p-3">Exibindo {filteredRegistrations.length} de {registrations.length} Inscrições</h1>
        
        {/* Tabela - Oculta em mobile, visível em iPad e desktop */}
        <Card className="border-border/50 shadow-sm hidden sm:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/50">
                  <tr>
                    <th className="text-left p-3 lg:p-4 w-58 text-xs lg:text-sm font-medium text-muted-foreground">
                      <div>
                        <div>Nome</div>
                        <div>Código</div>
                      </div>
                    </th>

                    <th className="text-left p-3 lg:p-4 text-xs lg:text-sm font-medium text-muted-foreground">
                      Categoria
                    </th>

                    <th className="hidden md:table-cell text-left p-3 lg:p-4 text-xs lg:text-sm font-medium text-muted-foreground">
                      Lote
                    </th>

                    <th className="hidden lg:table-cell text-left p-3 lg:p-4 text-xs lg:text-sm font-medium text-muted-foreground">
                      Camisa
                    </th>

                    <th className="hidden md:table-cell text-left p-3 lg:p-4 text-xs lg:text-sm font-medium text-muted-foreground">
                      Almoço
                    </th>

                    <th className="text-left p-1 w-54 text-xs lg:text-sm font-medium text-muted-foreground">
                      Kit retirado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRegistrations.map((registration, index) => (
                    <tr key={registration.cpf} className="border-b border-border/30 hover:bg-muted/20 transition-colors duration-150 group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <td className="p-1 lg:p-2">
                        <Link href={`/admin/inscricoes/${registration.id}`} className="flex items-center gap-1 hover:bg-muted/50 rounded p-2 transition-colors group">
                          <User className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <div>
                            <span className="text-xs lg:text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {registration.nomeCompleto}
                            </span>
                            <span className="text-xs text-muted-foreground">{registration.codigo}</span>
                          </div>
                        </Link>
                      </td>

                      <td className="p-1 lg:p-2 text-xs lg:text-sm">
                        {registration.categoria}
                      </td>

                      <td className="hidden md:table-cell p-1 lg:p-2 text-xs lg:text-sm">
                        {registration.lote.nome}
                      </td>

                      <td className="hidden lg:table-cell p-1 lg:p-2 text-xs lg:text-sm">
                        {registration.tamanhoCamisa}
                      </td>

                      <td className="hidden md:table-cell p-1 lg:p-2 text-xs lg:text-sm">
                        {registration.valeAlmoco ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                      </td>

                      <td className="pr-6">
                        <Switch
                          checked={editingId === registration.id ? editValues.kitretirado : registration.kitretirado}
                          onCheckedChange={(checked) => {
                            if (editingId === registration.id) {
                              setEditValues({...editValues, kitretirado: checked})

                            } else {
                              handleToggleAtivo(registration.id, registration.kitretirado)
                            }
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards Mobile - Visível apenas em mobile */}
      <div className="sm:hidden space-y-3">
        {paginatedRegistrations.map((registration, index) => (
          <Card key={registration.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors duration-150 group animate-fade-in" style={{animationDelay: `${index * 50}ms`}}>
            <CardContent className="p-2">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Link  href={`/admin/inscricoes/${registration.id}`} className="flex items-center gap-1 hover:bg-muted/50 rounded p-2 transition-colors group">
                    <h3 className="font-medium text-sm text-foreground line-clamp-1 hover:text-primary transition-colors">
                      {registration.nomeCompleto}
                    </h3>
                  </Link>
                </div>

                <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                  <div className="font-medium text-foreground mb-1">
                    <p>Código</p>
                    {registration.codigo}
                  </div>
                  <div className="font-medium text-foreground mb-1">
                    <p>Camisa</p>
                    {registration.tamanhoCamisa}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                  <div className="font-medium text-foreground mb-1">
                    <p>CPF</p>
                    {registration.cpf}
                  </div>
                  <div className="font-medium text-foreground mb-1">
                    <p>RG</p>
                    {registration.rg}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium truncate max-w-[120px]">Lote: {registration.lote.nome}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium truncate max-w-[120px]">{registration.categoria}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium truncate max-w-[120px]">Vale almoço</span>
                      {registration.valeAlmoco ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{registration.retiradaKit}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3>Kit Retirado</h3> <br />
                    <Switch
                      checked={editingId === registration.id ? editValues.kitretirado : registration.kitretirado}
                      onCheckedChange={(checked) => {
                        if (editingId === registration.id) {
                          setEditValues({...editValues, kitretirado: checked})

                        } else {
                          handleToggleAtivo(registration.id, registration.kitretirado)
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Paginator setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
