'use client'
import { useState, useEffect } from "react";

interface Inscricao {
  codigo: string;
  nomeCompleto: string;
  cpf: string;
  categoria: string
  kit: string;
  tamanhoCamisa: string;
  status: string;
}

export default function MinhaPage() {
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inscricoesRes = await fetch("/api/inscricoes");
        const inscricoesData = await inscricoesRes.json();
        setInscricoes(inscricoesData);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {inscricoes.map((inscricao) => (
            <div>
              <p><strong>Nome:</strong> {inscricao.nomeCompleto}</p>
              <p><strong>CPF:</strong> {inscricao.cpf}</p>
            </div>
          ))}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#00B8D4] border-t-transparent mx-auto"></div>
              <p className="text-gray-600 mt-4 font-semibold">Carregando inscrições...</p>
            </div>
          )}
          {!loading && inscricoes.length === 0 && (
            <p className="text-center text-gray-600">Nenhuma inscrição encontrada.</p>
          )}
        </div>
      </div>
    </div>
  )
}
