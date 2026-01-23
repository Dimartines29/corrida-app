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
  id: string;
  codigo: number;
  createdAt: string;
  nomeCompleto: string;
  cpf: string;
  sexo: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  categoria: string;
  retiradaKit: string;
  lote: Lote;
  valorPago: number;
  tamanhoCamisa: string;
  status: string;
  valeAlmoco: boolean;
  kitretirado: boolean;
  rg: string;
  equipe: string;
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
    lunch: string;
    category: string;
    tier: string;
    sex: string;
    kit: string;
    team: string;
}

export interface DateRangePickerProps {
  value: DateRange | undefined
  onChange: (dateRange: DateRange) => void
  isLoading?: boolean
  placeholder?: string
  showPresets?: boolean
  numberOfMonths?: 1 | 2
}

export interface InscricaoDetalhada {
  id: string
  codigo: number
  nomeCompleto: string
  cpf: string
  sexo: string
  rg: string
  dataNascimento: string
  telefone: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  categoria: string
  retiradaKit: string
  tamanhoCamisa: string
  possuiPlanoSaude: boolean
  contatoEmergencia: string
  telefoneEmergencia: string
  declaracaoSaude: boolean
  valorPago: number
  status: string
  valeAlmoco: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    role: string
    createdAt: string
  }
  lote: {
    id: string
    nome: string
    preco: number
    dataInicio: string
    dataFim: string
    ativo: boolean
  }
  pagamento: {
    id: string
    transacaoId: string
    valor: number
    status: string
    metodoPagamento: string
    createdAt: string
    updatedAt: string
  } | null
}

export interface Cupom {
  id: string
  codigo: string
  desconto: number
  tipoDesconto: "PERCENTUAL" | "FIXO"
  origem: string
  ativo: boolean
  dataInicio: Date | string
  dataValidade: Date | string
  usoMaximo: number | null
  usoPorUsuario: number | null
  valorMinimo: number | null
  totalUsos: number
  expirado: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface CupomDetalhado extends Cupom {
  inscricoes: {
    id: string
    codigo: number
    nomeCompleto: string
    valorPago: number
    status: string
    createdAt: string
  }[]
  _count: {
    inscricoes: number
  }
}

export interface CupomFilters {
  search: string
  status: "todos" | "ativos" | "inativos" | "expirados"
  origem: string
  tipoDesconto: "todos" | "PERCENTUAL" | "FIXO"
}
