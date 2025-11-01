// app/admin/page.tsx
'use client'
import { useState, useCallback, useMemo, useEffect } from "react"
import { format } from "date-fns"
import type { Inscricao, InscricaoConsolidatedFilters } from "@/types/types"
import { ArrowDown, ArrowUp, ArrowUpDown, BadgeAlert, CircleDollarSign, Check, Tags, User, X } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import IndicatorCard from "@/components/inscricoes/IndicatorCard"
import MobileButton from "@/components/mobile/MobileButton"
import Paginator from "@/components/pagination/Paginator"
import { InscricoesFilters } from "@/components/inscricoes/InscricoesFilters"

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
  const [showCardsOnMobile, setShowCardsOnMobile] = useState(false)
  const [showFiltersOnMobile, setShowFiltersOnMobile] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const registrationsRes = await fetch("/api/inscricoes");
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


  const handleCardFilter = useCallback((filterType: string) => {
    if (activeCardFilter === filterType) {
      setActiveCardFilter(null)

    } else {
      setShowCardsOnMobile(false)
      setShowFiltersOnMobile(false)
      setSelectedCategory(null)
      setActiveCardFilter(filterType)
      setFilters(createDefaultInscricaoFilters())
      setCurrentPage(1)
    }
  }, [activeCardFilter])

  const handleStatusFilter = useCallback((StatusName: string) => {
    if (activeCardFilter === 'status') {
      setActiveCardFilter(null)
      setSelectedStatus(null)

    } else {
      setShowCardsOnMobile(false)
      setShowFiltersOnMobile(false)
      setActiveCardFilter('status')
      setSelectedCategory(null)
      setSelectedStatus(StatusName)
      setFilters(createDefaultInscricaoFilters())
      setCurrentPage(1)
    }
  }, [activeCardFilter, selectedStatus])

  const handleCategoryFilter = useCallback((category: string) => {
    if (activeCardFilter === 'categoria') {
      setActiveCardFilter(null)
      setSelectedCategory(null)

    } else {
      setShowCardsOnMobile(false)
      setShowFiltersOnMobile(false)
      setActiveCardFilter('categoria')
      setSelectedStatus(null)
      setSelectedCategory(category)
      setFilters(createDefaultInscricaoFilters())
      setCurrentPage(1)
    }
  }, [activeCardFilter, selectedCategory])

  const handleFiltersChange = useCallback((newFilters: InscricaoConsolidatedFilters) => {
    setFilters(newFilters)
  }, [])

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")

      } else {
        setSortField(field)
        setSortDirection("desc")
      }
    },
    [sortField, sortDirection],
  )

  //Statistics for cards
  const statistics = useMemo(() => {
    if (!registrations) return null

    const income = registrations.filter((registration) => {
      return registration.valorPago && registration.status === 'PAGO' || 0
    })

    const totalIncome = income.reduce((sum, registration) => sum + (registration.valorPago || 0), 0)

    const categoryCount = registrations.reduce(
      (acc, inscricao) => {
        if (inscricao.categoria) {
          acc[inscricao.categoria] = (acc[inscricao.categoria] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const categories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    // Count registrations by status
    const statusCount = registrations.reduce(
      (acc, registration) => {
        if (registration.status) {
          acc[registration.status] = (acc[registration.status] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const statusMethods = Object.entries(statusCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    return {
      total: registrations.length,
      income: Math.ceil(totalIncome),
      categories,
      statusMethods,
    }
  }, [registrations])


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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />
    return sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid grid-cols-2 gap-4 md:hidden pt-4">
        <MobileButton onButtonClick={setShowCardsOnMobile} show={showCardsOnMobile} title="Indicadores" />
        <MobileButton onButtonClick={setShowFiltersOnMobile} show={showFiltersOnMobile} title="Filtros" />
      </div>

      <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:block ${showCardsOnMobile ? 'block' : 'hidden md:grid'} pt-8`}>
        <IndicatorCard title="Inscritos" description="Total de inscrições no evento" value={statistics?.total ?? 0} activeCardFilter={activeCardFilter || ''} filter='total-inscritos' handleCardFilter={handleCardFilter} />

        <Card className={`border hover:shadow-md transition-all duration-200 cursor-pointer ${activeCardFilter === 'renda' ? 'bg-primary/10 border-primary/20 shadow-md' : 'bg-muted/50 hover:bg-muted/70'}`} onClick={() => handleCardFilter('renda')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm md:text-lg font-medium text-muted-foreground">Renda</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl md:text-4xl font-bold text-foreground">R${statistics?.income ?? 0}</div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    Renda total do evento
                </div>
            </CardFooter>
        </Card>

        {/* Status */}
        <Card className={`border hover:shadow-md transition-all duration-200 ${activeCardFilter === 'status' ? 'bg-primary/10 border-primary/20 shadow-md' : 'bg-muted/50'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-lg font-medium text-muted-foreground">Status</CardTitle>
            <BadgeAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div>
              {statistics?.statusMethods.map((status) => (
                <div key={status.name} className="flex justify-between items-center hover:bg-muted/30 rounded cursor-pointer transition-colors duration-200" onClick={() => handleStatusFilter(status.name)}>
                  <span className={`text-sm md:text-lg py-2 md:py-1 truncate transition-colors duration-200 ${selectedStatus === status.name ? 'text-green-600 font-semibold' : 'text-foreground hover:text-primary'}`}>
                    {status.name}
                  </span>
                  <Badge variant="secondary" className={`text-sm md:text-lg py-1 md:py-0 cursor-pointer transition-colors duration-200 ${selectedStatus === status.name ? 'bg-green-100 text-green-600 border-green-300' : ''}`} onClick={(e) => {e.stopPropagation(); handleStatusFilter(status.name)}}>
                    {status.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className={`border hover:shadow-md transition-all duration-200 ${activeCardFilter === 'categoria' ? 'bg-primary/10 border-primary/20 shadow-md' : 'bg-muted/50'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-lg font-medium text-muted-foreground">Categorias</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div>
              {statistics?.categories.map((category) => (
                <div key={category.name} className="flex justify-between items-center hover:bg-muted/30 rounded cursor-pointer transition-colors duration-200" onClick={() => handleCategoryFilter(category.name)}>
                  <span className={`text-sm md:text-lg py-2 md:py-1 truncate transition-colors duration-200 ${selectedCategory === category.name ? 'text-green-600 font-semibold' : 'text-foreground hover:text-primary'}`}>
                    {category.name}
                  </span>
                  <Badge variant="secondary" className={`text-sm md:text-lg py-1 md:py-0 cursor-pointer transition-colors duration-200 ${selectedCategory === category.name ? 'bg-green-100 text-green-600 border-green-300' : ''}`} onClick={(e) => {e.stopPropagation(); handleCategoryFilter(category.name)}}>
                    {category.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={`${showFiltersOnMobile ? 'block' : 'hidden md:grid'}`}>
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
      </div>

      <div>
        <h1 className="text-muted-foreground p-3">Exibindo {filteredRegistrations.length} de {registrations.length} Inscrições</h1>
        <Card className="border-border/50 shadow-sm hidden md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/50">
                  <tr>
                    <th className="text-left p-3 md:p-4 w-58 text-xs md:text-sm font-medium text-muted-foreground">
                      <div>
                        <div>Nome</div>
                        <div>Código</div>
                      </div>
                    </th>

                    <th className="text-left p-3 md:p-4 text-xs md:text-sm font-medium text-muted-foreground">
                      Categoria
                    </th>

                    <th className="text-left p-3 md:p-4 text-xs md:text-sm font-medium text-muted-foreground">
                      CPF
                    </th>

                    <th className="text-left p-3 md:p-4 text-xs md:text-sm font-medium text-muted-foreground">
                      <button
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center gap-2 hover:text-foreground transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-1">Criação{getSortIcon("createdAt")}</div>
                        </div>
                      </button>
                    </th>

                    <th className="hidden md:table-cell text-left p-3 md:p-4 text-xs md:text-sm font-medium text-muted-foreground">
                      Lote
                    </th>

                    <th className="hidden md:table-cell text-left p-3 md:p-4 text-xs md:text-sm font-medium text-muted-foreground">
                      Camisa
                    </th>

                    <th className="text-left p-3 md:p-4 text-xs md:text-sm font-medium text-muted-foreground">
                      Almoço
                    </th>

                    <th className="text-left p-1 w-8 text-xs md:text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRegistrations.map((registration, index) => (
                    <tr key={registration.cpf} className="border-b border-border/30 hover:bg-muted/20 transition-colors duration-150 group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <td className="p-1 md:p-2">
                        <Link href={`/admin/inscricoes/${registration.id}`} className="flex items-center gap-1 hover:bg-muted/50 rounded p-2 transition-colors group">
                          <User className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <div>
                            <span className="text-xs md:text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {registration.nomeCompleto}
                            </span>
                            <span className="text-muted-foreground">{registration.codigo}</span>
                          </div>
                        </Link>
                      </td>

                      <td className="hidden md:table-cell p-1 md:p-2">
                        {registration.categoria}
                      </td>

                      <td className="hidden md:table-cell p-1 md:p-2">
                        {registration.cpf}
                      </td>

                      <td className="p-1 md:p-2">
                        <div className="space-y-2">
                          <div className="hidden md:block text-muted-foreground">
                            {format(registration.createdAt, "dd/MM/yyyy")}
                          </div>
                        </div>
                      </td>

                      <td className="hidden md:table-cell p-1 md:p-2 text-md">
                        {registration.lote.nome}
                      </td>

                      <td className="hidden md:table-cell p-1 md:p-2 text-md">
                        {registration.tamanhoCamisa}
                      </td>

                      <td className="hidden md:table-cell p-1 md:p-2 text-md">
                        {registration.valeAlmoco ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                      </td>

                      <td className="pr-4">
                        {registration.status === 'PAGO' ? (
                          <Badge className="bg-green-100 text-green-600 border-green-300 px-2 py-1 w-22 text-xs md:text-sm">Pago</Badge>
                        ) : registration.status === 'PENDENTE' ? (
                          <Badge className="bg-yellow-100 text-yellow-600 border-yellow-300 px-2 py-1 w-22 text-xs md:text-sm">Pendente</Badge>
                        ) : registration.status === 'CANCELADO' ? (
                          <Badge className="bg-red-100 text-red-600 border-red-300 px-2 py-1 w-22 text-xs md:text-sm">Cancelado</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 border-gray-300 px-2 py-1 text-xs md:text-sm">Desconhecido</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:hidden space-y-3">
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

                  {registration.status === 'PAGO' ? (
                    <Badge className="bg-green-100 text-green-600 border-green-300 px-2 py-1 w-22 text-xs md:text-sm">Pago</Badge>
                  ) : registration.status === 'PENDENTE' ? (
                    <Badge className="bg-yellow-100 text-yellow-600 border-yellow-300 px-2 py-1 w-22 text-xs md:text-sm">Pendente</Badge>
                  ) : registration.status === 'CANCELADO' ? (
                    <Badge className="bg-red-100 text-red-600 border-red-300 px-2 py-1 w-22 text-xs md:text-sm">Cancelado</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-600 border-gray-300 px-2 py-1 text-xs md:text-sm">Desconhecido</Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground grid grid-cols-3 gap-2">
                  <div className="font-medium text-foreground mb-1">
                    <p>Código</p>
                    {registration.codigo}
                  </div>
                  <div className="font-medium text-foreground mb-1">
                    <p>CPF</p>
                    {registration.cpf}
                  </div>
                  <div className="font-medium text-foreground mb-1">
                    <p>Tam. camisa</p>
                    {registration.tamanhoCamisa}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
                  <div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="font-medium truncate max-w-[120px]">{registration.categoria}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium truncate max-w-[120px]">Vale almoço</span>
                      {registration.valeAlmoco ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>Data da inscrição</div>
                    <div className="font-medium text-foreground">
                      {format(registration.createdAt, "dd/MM/yyyy")}
                    </div>
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
