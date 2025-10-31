"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, RefreshCw, AlertCircle, CreditCard, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Inscricao } from "@/types/types";

export default function PagamentoFalhaContent() {
  const searchParams = useSearchParams();
  const inscricaoId = searchParams.get("inscricaoId");
  const [inscricao, setInscricao] = useState<Inscricao>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (inscricaoId) {
      fetch(`/api/inscricoes/${inscricaoId}`)
        .then(res => res.json())
        .then(data => {
          setInscricao(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erro ao buscar inscrição:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [inscricaoId]);

  const handleTentarNovamente = () => {
    if (inscricaoId) {
      window.location.href = `/checkout/${inscricaoId}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFE66D] flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#E53935] border-t-transparent mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Carregando informações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFE66D] py-8 sm:py-12 px-4">
      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Header com Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <img
            src="/logo-chris.png"
            alt="Todo Mundo Corre com o Chris"
            className="h-16 sm:h-20 w-auto"
          />
        </div>

        <Card className="bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-[#E53935]">
          {/* Header do Card - DIRETAMENTE NO CARD */}
          <div className="bg-[#E53935] -mt-7 p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#E53935]" />
              </div>

              <div className="mt-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                  PAGAMENTO NÃO APROVADO
                </h1>
                <p className="text-sm sm:text-base text-white/90 font-semibold mt-2">
                  Ops! Algo deu errado com o pagamento
                </p>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Alerta Principal */}
            <Alert className="bg-yellow-50 border-2 border-yellow-400 -mt-8">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              <AlertDescription className="text-sm sm:text-base text-yellow-800 font-semibold">
                ⚠️ Não foi possível processar o seu pagamento. Você pode tentar novamente com outra forma de pagamento.
              </AlertDescription>
            </Alert>

            {/* Informações da Inscrição */}
            {inscricao && (
              <Card className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] border-2 border-gray-300 shadow-lg">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#E53935] p-2 sm:p-3 rounded-lg">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#E53935]">
                      DADOS DA SUA INSCRIÇÃO
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Código */}
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> Código
                      </p>
                      <p className="text-lg font-black text-[#E53935]">{inscricao.codigo}</p>
                    </div>

                    {/* Categoria */}
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Categoria
                      </p>
                      <p className="text-lg font-black text-[#00B8D4]">{inscricao.categoria}</p>
                    </div>

                    {/* Status */}
                    <div className="bg-white p-4 rounded-xl border-2 border-red-300">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1">Status</p>
                      <p className="text-lg font-black text-[#E53935]">Pendente de Pagamento</p>
                    </div>

                    {/* Valor */}
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1">Valor</p>
                      <p className="text-lg font-black text-[#00B8D4]">
                        R$ {Number(inscricao.valorPago).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Possíveis Motivos */}
            <Card className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] border-none shadow-lg">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg flex-shrink-0">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#E53935]" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-black text-white mb-3">
                      POSSÍVEIS MOTIVOS DA FALHA
                    </h4>
                    <ul className="space-y-2 text-white text-sm sm:text-base">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFE66D] font-bold flex-shrink-0">✗</span>
                        <span className="font-semibold">Dados do cartão incorretos ou incompletos</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFE66D] font-bold flex-shrink-0">✗</span>
                        <span className="font-semibold">Saldo insuficiente na conta</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFE66D] font-bold flex-shrink-0">✗</span>
                        <span className="font-semibold">Cartão bloqueado ou vencido</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFE66D] font-bold flex-shrink-0">✗</span>
                        <span className="font-semibold">Limite de compras atingido</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFE66D] font-bold flex-shrink-0">✗</span>
                        <span className="font-semibold">Problema temporário com a operadora</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
                variant="outline"
                asChild
                className="flex-1 border-2 border-[#E53935] text-[#E53935] font-bold text-base sm:text-lg py-6 sm:py-7 rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                <Link href="/minha-area">
                  <Home className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  VOLTAR AO INÍCIO
                </Link>
              </Button>
            </div>

            {/* Informações de Contato */}
            <div className="bg-white p-6 rounded-xl border-2 border-[#E53935] text-center space-y-2">
              <p className="text-sm sm:text-base text-gray-700 font-semibold">
                Precisa de ajuda? Entre em contato:
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base">
                <p className="text-[#E53935] font-black">studiobravo0@gmail.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}