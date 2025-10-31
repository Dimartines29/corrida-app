"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Home, Trophy, Calendar, User, CreditCard, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Inscricao } from "@/types/types";

export default function PagamentoSucessoContent() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFE66D] flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#00B8D4] border-t-transparent mb-4"></div>
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

        <Card className="bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-green-500">
          {/* Header do Card */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 -mt-8 p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
              </div>

              <div className="mt-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
                  PAGAMENTO APROVADO! 🎉
                </h1>
                <p className="text-sm sm:text-base text-white/90 font-semibold mt-2">
                  Sua inscrição foi confirmada com sucesso!
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Alerta Principal */}
            <Alert className="bg-green-50 border-2 border-green-400 -mt-8">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              <AlertDescription className="text-sm sm:text-base text-green-800 font-semibold">
                ✅ Parabéns! Sua vaga está garantida. Em breve você receberá um e-mail de confirmação com todos os detalhes.
              </AlertDescription>
            </Alert>

            {/* Informações da Inscrição */}
            {inscricao && (
              <Card className="bg-gradient-to-r from-[#FFE66D] to-[#ffd93d] border-2 border-gray-300 shadow-lg">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#00B8D4] p-2 sm:p-3 rounded-lg">
                      <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-[#E53935]">
                      DETALHES DA SUA INSCRIÇÃO
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Código */}
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> Código
                      </p>
                      <p className="text-xl font-black text-[#E53935]">{inscricao.codigo}</p>
                    </div>

                    {/* Categoria */}
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Categoria
                      </p>
                      <p className="text-lg font-black text-[#00B8D4]">{inscricao.categoria}</p>
                    </div>

                    {/* Participante */}
                    <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1 flex items-center gap-1">
                        <User className="w-3 h-3" /> Participante
                      </p>
                      <p className="text-sm font-black text-gray-800">{inscricao.nomeCompleto}</p>
                    </div>

                    {/* Valor Pago */}
                    <div className="bg-white p-4 rounded-xl border-2 border-green-300">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1">Valor Pago</p>
                      <p className="text-xl font-black text-green-600">
                        R$ {Number(inscricao.valorPago).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Próximos Passos */}
            <Card className="bg-gradient-to-r from-[#00B8D4] to-[#00a0c0] border-none shadow-lg">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg flex-shrink-0">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#00B8D4]" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-black text-white mb-3">
                      PRÓXIMOS PASSOS
                    </h4>
                    <ul className="space-y-2 text-white text-sm sm:text-base">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFE66D] font-bold flex-shrink-0">1.</span>
                        <span className="font-semibold">Guarde o código <strong>{inscricao?.codigo}</strong> - você precisará dele no dia do evento</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFE66D] font-bold flex-shrink-0">2.</span>
                        <span className="font-semibold">Aguarde o e-mail de confirmação com todos os detalhes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFE66D] font-bold flex-shrink-0">3.</span>
                        <span className="font-semibold">Fique atento às informações sobre retirada do kit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFE66D] font-bold flex-shrink-0">4.</span>
                        <span className="font-semibold">Prepare-se para o grande dia: 25 de Janeiro de 2026!</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
                asChild
                className="flex-1 bg-[#00B8D4] hover:bg-[#00a0c0] text-white font-bold text-base sm:text-lg py-6 sm:py-7 rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                <Link href="/minha-area">
                  <Home className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  MINHA ÁREA
                </Link>
              </Button>
            </div>

            {/* Informações de Contato */}
            <div className="bg-white p-6 rounded-xl border-2 border-green-400 text-center space-y-2">
              <p className="text-sm sm:text-base text-gray-700 font-semibold">
                Agora é só treinar e se preparar para o grande dia!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base">
                <p className="text-green-600 font-black">✅ Inscrição Confirmada</p>
                <span className="hidden sm:inline text-gray-400">|</span>
                <p className="text-[#00B8D4] font-black">📅 25/01/2026</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
