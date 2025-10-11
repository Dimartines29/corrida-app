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
    departments: string[]
    status: ['Pago', 'Pendente', 'Cancelado']
    agents?: string[]
    states?: string[]
    isLoading?: boolean
  }
}

export function CasesFilters({filters, onFiltersChange, metadata}: InscricoesFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.creation && filters.creation !== undefined) count++
    if (filters.lastUpdate && filters.lastUpdate !== undefined) count++
    if (filters.search) count++
    if (filters.department && filters.department !== 'todos') count++
    if (filters.status && filters.status !== 'todos') count++
    if (filters.instructed && filters.instructed !== 'todos') count++
    if (filters.caseCode) count++
    if (filters.negocioCode) count++
    if (filters.negocioSerialNumber) count++
    if (filters.responsible && filters.responsible !== 'todos') count++
    if (filters.uf && filters.uf !== 'todos') count++

    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  const clearAllFilters = () => {
    onFiltersChange({
      ...filters,
      creation: undefined,
      search: '',
      status: 'todos',
      instructed: 'todos',
      department: 'todos',
      lastUpdate: undefined,
      caseCode: '',
      negocioCode: '',
      negocioSerialNumber: '',
      responsible: 'todos',
      uf: 'todos',
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
                placeholder="Buscar em todo texto do Case..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                disabled={metadata.isLoading}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
            <div className="lg:col-span-2">
              <label className="text-sm font-medium mb-2 block">Criação</label>
              <EnhancedDateRangePicker
                value={filters.creation || undefined}
                onChange={(creation) => onFiltersChange({ ...filters, creation })}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                <div>
                  <label className="text-sm md:text-xs block mb-1">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
                  >
                    <SelectTrigger className="h-9 text-sm md:text-xs">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="text-sm md:text-xs" value="todos">Todos</SelectItem>
                      {metadata.status?.map(status => (
                        <SelectItem className="text-sm md:text-xs" key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm md:text-xs block mb-1">Instruído</label>
                  <Select
                    value={filters.instructed}
                    onValueChange={(value) => onFiltersChange({ ...filters, instructed: value })}
                  >
                    <SelectTrigger className="h-9 text-sm md:text-xs">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="text-sm md:text-xs" value="todos">Todos</SelectItem>
                      <SelectItem className="text-sm md:text-xs" value="sim">Sim</SelectItem>
                      <SelectItem className="text-sm md:text-xs" value="nao">Não</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm md:text-xs block mb-1">Fase</label>
                  <Select
                    value={filters.department}
                    onValueChange={(value) => onFiltersChange({ ...filters, department: value })}
                  >
                    <SelectTrigger className="h-9 text-sm md:text-xs">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem className="text-sm md:text-xs" value="todos">Todas</SelectItem>
                      {metadata.departments?.map(dept => (
                        <SelectItem className="text-sm md:text-xs" key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='truncate'>
                  <label className="text-sm md:text-xs block mb-1">Responsável</label>
                  <Select
                    value={filters.responsible}
                    onValueChange={(value) => onFiltersChange({ ...filters, responsible: value })}
                  >
                    <SelectTrigger className="h-9 text-sm md:text-xs">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="text-sm md:text-xs" value="todos">Todos</SelectItem>
                      {metadata.agents?.map(agent => (
                        <SelectItem className="text-sm md:text-xs" key={agent} value={agent}>{agent}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm md:text-xs block mb-1">UF</label>
                  <Select
                    value={filters.uf}
                    onValueChange={(value) => onFiltersChange({ ...filters, uf: value })}
                  >
                    <SelectTrigger className="h-9 text-sm md:text-xs">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="text-sm md:text-xs" value="todos">Todas</SelectItem>
                      {metadata.states?.map(state => (
                        <SelectItem className="text-sm md:text-xs" key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-sm md:text-xs block mb-1">Últ. Atualização</label>
                  <EnhancedDateRangePicker
                    value={filters.lastUpdate || undefined}
                    onChange={(lastUpdate) => onFiltersChange({ ...filters, lastUpdate })}
                    isLoading={metadata.isLoading}
                    numberOfMonths={2}
                  />
                </div>

                <div>
                  <label className="text-sm md:text-xs block mb-1">Número do Case</label>
                  <Input
                    value={filters.caseCode}
                    onChange={(e) => onFiltersChange({ ...filters, caseCode: e.target.value })}
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="text-sm md:text-xs block mb-1">Código do Negócio</label>
                  <Input
                    value={filters.negocioCode}
                    onChange={(e) => onFiltersChange({ ...filters, negocioCode: e.target.value })}
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="text-sm md:text-xs block mb-1">Nº de Série</label>
                  <Input
                    value={filters.negocioSerialNumber}
                    onChange={(e) => onFiltersChange({ ...filters, negocioSerialNumber: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
