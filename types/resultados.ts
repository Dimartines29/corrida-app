// types/resultados.ts

export interface Resultado {
  id: number;
  categoria: '10km_masculino' | '10km_feminino' | '6km_masculino' | '6km_feminino';
  colocacao: number;
  numero: string;
  atleta: string;
  sexo: 'M' | 'F';
  equipe: string;
  tempo: string; // Formato: "00:42:15"
}

export type Categoria = '10km_masculino' | '10km_feminino' | '6km_masculino' | '6km_feminino';

export interface CategoriaInfo {
  value: Categoria;
  label: string;
  emoji: string;
}