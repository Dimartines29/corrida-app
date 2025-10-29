// src/components/inscricoes/InscricoesFilters.tsx
import { useState } from 'react'
import { ChevronDown, ChevronUp, X, Search, Filter } from 'lucide-react'

import { EnhancedDateRangePicker } from '@/components/filters/EnhancedDateRangePicker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { InscricaoConsolidatedFilters } from '@/types/types'

interface InscricoesFiltersProps {
  filters: InscricaoConsolidatedFilters
  onFiltersChange: (filters: InscricaoConsolidatedFilters) => void
  metadata: {
    status: ['PAGO', 'PENDENTE', 'CANCELADO']
    category: ['Caminhada - 3km', 'Corrida - 6km', 'Corrida - 10km']
    shirtSize: ['PP', 'P', 'M', 'G', 'GG', 'XG'],
    tier: ['1º Lote', '2º Lote', '3º Lote', '4º Lote', '5º Lote'],
    isLoading?: boolean
  }
}

export function InscricoesFilters({filters, onFiltersChange, metadata}: InscricoesFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.createdAt && filters.createdAt !== undefined) count++
    if (filters.search) count++
    if (filters.category && filters.category !== 'todos') count++
    if (filters.status && filters.status !== 'todos') count++
    if (filters.lunch && filters.lunch !== 'todos') count++
    if (filters.tier && filters.tier !== 'todos') count++
    if (filters.shirtSize && filters.shirtSize !== 'todos') count++
    if (filters.code) count++
    if (filters.fullname) count++
    if (filters.cpf) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  const clearAllFilters = () => {
    onFiltersChange({
      ...filters,
      createdAt: undefined,
      search: '',
      status: 'todos',
      lunch: 'todos',
      category: 'todos',
      tier: 'todos',
      shirtSize: 'todos',
      code: '',
      fullname: '',
      cpf: '',
    })
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Busca Geral</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Busca geral..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                disabled={metadata.isLoading}
                className="pl-10 text-muted-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-2 block">Criação</label>
              <EnhancedDateRangePicker
                value={filters.createdAt || undefined}
                onChange={(createdAt) => onFiltersChange({ ...filters, createdAt })}
                isLoading={metadata.isLoading}
                numberOfMonths={2}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="gap-1 shrink-0">
                    <Filter className="h-3 w-3" />
                    <span className="hidden xs:inline">
                      {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''}
                    </span>
                    <span className="xs:hidden">{activeFiltersCount}</span>
                  </Badge>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="gap-2 shrink-0"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtros específicos</span>
                  <span className="sm:hidden">Filtros</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                {(activeFiltersCount > 0 || filters.search) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <X className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Limpar tudo</span>
                    <span className="sm:hidden">Limpar</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 pt-4 border-t space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Filtros Específicos</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)} className="text-gray-500 hover:text-gray-700 lg:hidden">
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 justify-items-center">
                <div>
                  <label className="text-sm md:text-xs block mb-1">Status</label>
                  <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
                    <SelectTrigger className="h-9 text-sm md:text-xs lg:min-w-30">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem className="text-sm md:text-xs" value="todos">Todos</SelectItem>
                      {metadata.status?.map(sts => (
                        <SelectItem className="text-sm md:text-xs" key={sts} value={sts}>{sts}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm md:text-xs block mb-1">Categoria</label>
                  <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
                    <SelectTrigger className="h-9 text-sm md:text-xs lg:min-w-30">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem className="text-sm md:text-xs" value="todos">Todas</SelectItem>
                      {metadata.category?.map(ctg => (
                        <SelectItem className="text-sm md:text-xs" key={ctg} value={ctg}>{ctg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm md:text-xs block mb-1">Camisa</label>
                  <Select value={filters.shirtSize} onValueChange={(value) => onFiltersChange({ ...filters, shirtSize: value })}>
                    <SelectTrigger className="h-9 text-sm md:text-xs lg:min-w-30">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem className="text-sm md:text-xs" value="todos">Todas</SelectItem>
                      {metadata.shirtSize?.map(ss => (
                        <SelectItem className="text-sm md:text-xs" key={ss} value={ss}>{ss}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm md:text-xs block mb-1">Lote</label>
                  <Select value={filters.tier} onValueChange={(value) => onFiltersChange({ ...filters, tier: value })}>
                    <SelectTrigger className="h-9 text-sm md:text-xs lg:min-w-30">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem className="text-sm md:text-xs" value="todos">Todos</SelectItem>
                      {metadata.tier?.map(tier => (
                        <SelectItem className="text-sm md:text-xs" key={tier} value={tier}>{tier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm md:text-xs block mb-1">Vale almoço</label>
                  <Select value={filters.lunch} onValueChange={(value) => onFiltersChange({ ...filters, lunch: value })}>
                    <SelectTrigger className="h-9 text-sm md:text-xs lg:min-w-30">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem className="text-sm md:text-xs" value="todos">Todos</SelectItem>
                    <SelectItem className="text-sm md:text-xs" value="sim">Sim</SelectItem>
                    <SelectItem className="text-sm md:text-xs" value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
