'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

// 📝 TIPOS
interface Resultado {
  id: number;
  categoria: string;
  colocacao: number;
  numero: string;
  atleta: string;
  sexo: string;
  equipe: string;
  tempo: string;
}

type CategoriaDisplay = '10km_masculino' | '10km_feminino' | '6km_masculino' | '6km_feminino';

// 🔄 MAPEAMENTO: Valor do Dropdown → Valor no Banco
const CATEGORIA_MAPPING: Record<CategoriaDisplay, string> = {
  '10km_masculino': 'Masculino 10KM',  // ← Ajuste aqui com o valor EXATO do banco
  '10km_feminino': 'Feminino 10KM',    // ← Ajuste aqui com o valor EXATO do banco
  '6km_masculino': 'Masculino 6KM',    // ← Ajuste aqui com o valor EXATO do banco
  '6km_feminino': 'Feminino 6KM',      // ← Ajuste aqui com o valor EXATO do banco
};

const CATEGORIAS: { value: CategoriaDisplay; label: string; emoji: string }[] = [
  { value: '10km_masculino', label: '10KM MASCULINO', emoji: '🏃‍♂️' },
  { value: '10km_feminino', label: '10KM FEMININO', emoji: '🏃‍♀️' },
  { value: '6km_masculino', label: '6KM MASCULINO', emoji: '🏃‍♂️' },
  { value: '6km_feminino', label: '6KM FEMININO', emoji: '🏃‍♀️' },
];

export default function TabelaResultados() {
  const [categoriaAtual, setCategoriaAtual] = useState<CategoriaDisplay>('10km_masculino');
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ITENS_POR_PAGINA = 10;

  // 🔥 BUSCA OS DADOS DO BANCO NEON VIA API
  useEffect(() => {
    const buscarResultados = async () => {
      setLoading(true);
      try {
        // 🔄 Converte o valor do dropdown para o valor do banco
        const categoriaReal = CATEGORIA_MAPPING[categoriaAtual];
        
        // ✅ BUSCA REAL DA API com o valor correto
        const response = await fetch(`/api/resultados?categoria=${encodeURIComponent(categoriaReal)}`);
        
        if (!response.ok) {
          throw new Error('Erro ao buscar resultados');
        }
        
        const data = await response.json();
        setResultados(data);
        
      } catch (error) {
        console.error('Erro ao buscar resultados:', error);
        setResultados([]); // Define vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    buscarResultados();
    setPaginaAtual(1); // Reset página ao trocar categoria
  }, [categoriaAtual]);

  // 🔍 FILTRO DE BUSCA
  const resultadosFiltrados = resultados.filter((resultado) => {
    const termoBusca = busca.toLowerCase();
    return (
      resultado.atleta.toLowerCase().includes(termoBusca) ||
      resultado.numero.toString().toLowerCase().includes(termoBusca) ||
      resultado.equipe.toLowerCase().includes(termoBusca) ||
      resultado.colocacao.toString().includes(termoBusca) ||
      resultado.sexo.toLowerCase().includes(termoBusca) ||
      resultado.tempo.includes(termoBusca)
    );
  });

  // 📄 PAGINAÇÃO
  const totalPaginas = Math.ceil(resultadosFiltrados.length / ITENS_POR_PAGINA);
  const indiceInicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const indiceFim = indiceInicio + ITENS_POR_PAGINA;
  const resultadosPaginados = resultadosFiltrados.slice(indiceInicio, indiceFim);

  // 🏅 MEDALHAS PARA TOP 3
  const getMedalha = (colocacao: number) => {
    if (colocacao === 1) return '🥇';
    if (colocacao === 2) return '🥈';
    if (colocacao === 3) return '🥉';
    return null;
  };

  const getCorTop3 = (colocacao: number) => {
    if (colocacao === 1) return 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-4 border-yellow-500';
    if (colocacao === 2) return 'bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-gray-400';
    if (colocacao === 3) return 'bg-gradient-to-r from-orange-100 to-orange-50 border-l-4 border-orange-400';
    return 'hover:bg-gray-50';
  };

  return (
    <section id="resultados" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* 🏆 TÍTULO */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center text-[#00B8D4] mb-8 sm:mb-12">
          🏆 RESULTADOS DA CORRIDA
        </h2>

        {/* 🎛️ CONTROLES: SELECT + BUSCA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          
          {/* SELECT CATEGORIA */}
          <div className="relative">
            <select
              value={categoriaAtual}
              onChange={(e) => setCategoriaAtual(e.target.value as CategoriaDisplay)}
              className="w-full px-6 py-4 text-lg font-bold bg-[#FFE66D] text-[#E53935] rounded-xl border-4 border-[#E53935] focus:outline-none focus:ring-4 focus:ring-[#E53935]/30 cursor-pointer shadow-lg appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23E53935\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'3\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* BUSCA */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00B8D4] w-6 h-6" />
            <input
              type="text"
              placeholder="Buscar atleta, equipe, número..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1); // Reset página ao buscar
              }}
              className="w-full pl-14 pr-6 py-4 text-lg text-black border-4 border-[#00B8D4] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00B8D4]/30 shadow-lg font-semibold placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* ⏳ LOADING */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-8 border-[#FFE66D] border-t-[#E53935] rounded-full animate-spin"></div>
            <p className="mt-4 text-xl font-bold text-gray-600">Carregando resultados...</p>
          </div>
        ) : (
          <>
            {/* 📊 TABELA DESKTOP */}
            <div className="hidden lg:block overflow-x-auto rounded-2xl shadow-2xl border-4 border-[#00B8D4]">
              <table className="w-full">
                
                {/* HEADER */}
                <thead className="bg-gradient-to-r from-[#E53935] to-[#c62828] text-white">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Colocação</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Número</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Atleta</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Sexo</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Equipe</th>
                    <th className="px-6 py-5 text-left text-sm font-black uppercase tracking-wider">Tempo</th>
                  </tr>
                </thead>

                {/* BODY */}
                <tbody className="bg-white divide-y-2 divide-gray-100">
                  {resultadosPaginados.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-lg">
                        😔 Nenhum resultado encontrado
                      </td>
                    </tr>
                  ) : (
                    resultadosPaginados.map((resultado) => (
                      <tr
                        key={resultado.id}
                        className={`transition-all ${getCorTop3(resultado.colocacao)}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getMedalha(resultado.colocacao)}</span>
                            <span className="text-lg font-black text-[#E53935]">{resultado.colocacao}º</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-700">
                          {resultado.numero}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-900">
                          {resultado.atleta}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-gray-700">
                          {resultado.sexo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-600">
                          {resultado.equipe}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-black bg-[#00B8D4] text-white">
                            ⏱️ {resultado.tempo}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 📱 CARDS MOBILE */}
            <div className="lg:hidden space-y-4">
              {resultadosPaginados.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-lg">
                  😔 Nenhum resultado encontrado
                </div>
              ) : (
                resultadosPaginados.map((resultado) => (
                  <div
                    key={resultado.id}
                    className={`rounded-2xl shadow-lg p-6 transition-transform hover:scale-[1.02] ${
                      resultado.colocacao <= 3
                        ? 'border-4 ' + (resultado.colocacao === 1 ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-white' : resultado.colocacao === 2 ? 'border-gray-400 bg-gradient-to-br from-gray-50 to-white' : 'border-orange-400 bg-gradient-to-br from-orange-50 to-white')
                        : 'border-2 border-gray-200 bg-white'
                    }`}
                  >
                    {/* COLOCAÇÃO */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{getMedalha(resultado.colocacao) || '🏃'}</span>
                        <span className="text-3xl font-black text-[#E53935]">{resultado.colocacao}º LUGAR</span>
                      </div>
                      <span className="text-xl font-bold text-gray-600">{resultado.numero}</span>
                    </div>

                    {/* INFO */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Atleta</p>
                        <p className="text-xl font-black text-gray-900">{resultado.atleta}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Sexo</p>
                          <p className="text-lg font-bold text-gray-700">{resultado.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Equipe</p>
                          <p className="text-lg font-bold text-gray-700">{resultado.equipe}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t-2 border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-500 uppercase">Tempo</span>
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-black bg-[#00B8D4] text-white">
                            ⏱️ {resultado.tempo}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 📄 PAGINAÇÃO */}
            {totalPaginas > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                
                {/* ANTERIOR */}
                <button
                  onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                  disabled={paginaAtual === 1}
                  className="px-4 py-2 rounded-lg font-bold bg-[#FFE66D] text-[#E53935] hover:bg-[#ffd93d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  ← Anterior
                </button>

                {/* NÚMEROS */}
                {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                  let numeroPagina;
                  if (totalPaginas <= 5) {
                    numeroPagina = i + 1;
                  } else if (paginaAtual <= 3) {
                    numeroPagina = i + 1;
                  } else if (paginaAtual >= totalPaginas - 2) {
                    numeroPagina = totalPaginas - 4 + i;
                  } else {
                    numeroPagina = paginaAtual - 2 + i;
                  }
                  
                  return (
                    <button
                      key={numeroPagina}
                      onClick={() => setPaginaAtual(numeroPagina)}
                      className={`w-10 h-10 rounded-lg font-bold transition-all shadow-md ${
                        paginaAtual === numeroPagina
                          ? 'bg-[#E53935] text-white scale-110'
                          : 'bg-white text-[#E53935] border-2 border-[#E53935] hover:bg-[#FFE66D]'
                      }`}
                    >
                      {numeroPagina}
                    </button>
                  );
                })}

                {/* PRÓXIMA */}
                <button
                  onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="px-4 py-2 rounded-lg font-bold bg-[#FFE66D] text-[#E53935] hover:bg-[#ffd93d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  Próxima →
                </button>
              </div>
            )}

            {/* INFO PAGINAÇÃO */}
            <p className="text-center mt-4 text-sm font-semibold text-gray-600">
              Mostrando {indiceInicio + 1} - {Math.min(indiceFim, resultadosFiltrados.length)} de {resultadosFiltrados.length} resultados
            </p>
          </>
        )}
      </div>
    </section>
  );
}