//types/types.ts

export interface DateRange {
  from: Date
  to: Date
}

export interface Lote {
    nome: string;
    preco: number;
}


export interface Inscricao {
  codigo: string;
  createdAt: string;
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  categoria: string
  lote: Lote;
  valorPago: number;
  tamanhoCamisa: string;
  status: string;
}

export interface InscricaoConsolidatedFilters {
    createdAt?: DateRange;
    code?: string;
    search?: string;
    fullname: string;
    cpf: string;
    rg: string;
    city: string;
    cep: string;
    shirtSize: string;
    healthPlan: string;
    status: string;
    category: string;
    tier: string;
}

export interface DateRangePickerProps {
  value: DateRange | undefined
  onChange: (dateRange: DateRange) => void
  isLoading?: boolean
  placeholder?: string
  showPresets?: boolean
  numberOfMonths?: 1 | 2
}