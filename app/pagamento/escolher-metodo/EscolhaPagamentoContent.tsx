"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, QrCode, Clock, CheckCircle, Loader2, Zap } from 'lucide-react';
import { MainHeader } from '@/components/MainHeader';

interface Inscricao {
  id: string;
  codigo: number;
  nomeCompleto: string;
  categoria: string;
  valorPago: number;
  valeAlmoco: boolean;
}

export default function EscolhaPagamentoContent() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const isAuthenticated = !!session?.user
  const searchParams = useSearchParams();
  const inscricaoId = searchParams.get("inscricaoId");

  const [inscricao, setInscricao] = useState<Inscricao | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingPix, setIsLoadingPix] = useState(false);
  const [isLoadingCartao, setIsLoadingCartao] = useState(false);

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

  const handlePagarPix = async () => {
    if (!inscricao) return;

    setIsLoadingPix(true);

    try {
      const response = await fetch('/api/pagamento/criar-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inscricaoId: inscricao.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Erro: ${result.error || 'Não foi possível gerar pagamento'}`);
        setIsLoadingPix(false);
        return;
      }

      let checkoutUrl = result.initPoint || result.sandboxInitPoint;

      process.env.MERCADOPAGO_ENVIRONMENT === 'production' ? checkoutUrl = result.initPoint : checkoutUrl = result.sandboxInitPoint;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert('Erro: Link de pagamento não gerado');
        setIsLoadingPix(false);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setIsLoadingPix(false);
    }
  };

  const handlePagarCartao = () => {
    if (!inscricao) return;

    setIsLoadingCartao(true);

    // ⭐ CONFIGURE AQUI OS LINKS DO PAGBANK
    const linkSemAlmoco =  "https://pag.ae/81cmfibxL";
    const linkComAlmoco =  "https://pag.ae/81cmgk3Ep";

    const linkPagamento = inscricao.valeAlmoco ? linkComAlmoco : linkSemAlmoco;

    window.location.href = linkPagamento;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFE66D] to-[#ffd93d] flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#00B8D4] border-t-transparent mb-4"></div>
          <p className="text-gray-700 font-bold text-lg">Carregando informações...</p>
        </div>
      </div>
    );
  }

  if (!inscricao) {
    return (
      <div className="min-h-screen bg-[#FFE66D] flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <p className="text-gray-700 font-bold text-lg">Inscrição não encontrada</p>
          <a href="/minha-area" className="text-[#E53935] font-bold hover:underline mt-4 inline-block">
            ← Voltar para Minha Área
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <MainHeader isAdmin={isAdmin} isAuthenticated={isAuthenticated} />
      <div className="min-h-screen bg-gradient-to-br from-[#FFE66D] to-[#ffd93d] py-8 px-4">
        <div className="container mx-auto max-w-4xl mt-18">
          {/* Card Principal */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header do Card */}
            <div className="bg-gradient-to-r from-[#E53935] to-[#c62828] p-6 text-white">
              <h1 className="text-2xl font-black text-center">
                💳 FINALIZAR PAGAMENTO
              </h1>
              <p className="text-center text-white/90 mt-2 text-sm">
                Escolha a forma de pagamento preferida
              </p>
            </div>

            {/* Informações da Inscrição */}
            <div className="p-6 bg-gradient-to-r from-[#00B8D4] to-[#00a0c0]">
              <div className="grid grid-cols-2 gap-4 text-white">
                <div>
                  <p className="text-xs text-white/80 uppercase font-bold mb-1">Código</p>
                  <p className="text-2xl font-black">#{inscricao.codigo}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/80 uppercase font-bold mb-1">Valor Total</p>
                  <p className="text-2xl font-black">R$ {inscricao.valorPago.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-white/80 uppercase font-bold mb-1">Participante</p>
                  <p className="text-lg font-bold">{inscricao.nomeCompleto}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-white/80 uppercase font-bold mb-1">Categoria</p>
                  <p className="font-bold">{inscricao.categoria}</p>
                </div>
              </div>
            </div>

            {/* Métodos de Pagamento */}
            <div className="p-6 space-y-4">
              {/* PIX - RECOMENDADO */}
              <div className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                    <Zap className="w-3 h-3" />
                    RECOMENDADO
                  </div>
                </div>

                <button
                  onClick={handlePagarPix}
                  disabled={isLoadingPix}
                  className="w-full border-4 border-green-500 rounded-xl p-6 hover:bg-green-50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500 p-3 rounded-lg flex-shrink-0">
                      <QrCode className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-black text-green-700 mb-2">
                        🟢 PIX
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-700">
                            Aprovação <strong>imediata</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-700">
                            Confirmação <strong>automática</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="font-semibold text-gray-700">
                            Disponível <strong>24/7</strong>
                          </span>
                        </div>
                      </div>

                      {isLoadingPix ? (
                        <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-black text-center flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Gerando QR Code...
                        </div>
                      ) : (
                        <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-black text-center hover:bg-green-700 transition-colors">
                          PAGAR COM PIX →
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              {/* Separador */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 border-t-2 border-gray-300"></div>
                <span className="text-gray-500 font-bold text-sm">OU</span>
                <div className="flex-1 border-t-2 border-gray-300"></div>
              </div>

              {/* CARTÃO */}
              <button
                onClick={handlePagarCartao}
                disabled={isLoadingCartao}
                className="w-full border-2 border-gray-300 rounded-xl p-6 hover:bg-gray-50 hover:border-[#00B8D4] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#00B8D4] p-3 rounded-lg flex-shrink-0">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-black text-[#00B8D4] mb-2">
                      💳 CARTÃO DE CRÉDITO
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#00B8D4] flex-shrink-0" />
                        <span className="font-semibold text-gray-700">
                          Parcelamento em até <strong>12x</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="font-semibold text-gray-700">
                          Confirmação em até <strong>24 horas</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#00B8D4] flex-shrink-0" />
                        <span className="font-semibold text-gray-700">
                          Todas as bandeiras aceitas
                        </span>
                      </div>
                    </div>

                    {isLoadingCartao ? (
                      <div className="bg-[#00B8D4] text-white px-6 py-3 rounded-lg font-black text-center flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirecionando...
                      </div>
                    ) : (
                      <div className="bg-[#00B8D4] text-white px-6 py-3 rounded-lg font-black text-center hover:bg-[#00a0c0] transition-colors">
                        PAGAR COM CARTÃO →
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Footer com Aviso */}
            <div className="bg-yellow-50 border-t-4 border-yellow-400 p-6">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-400 p-2 rounded-lg flex-shrink-0">
                  <Clock className="w-5 h-5 text-yellow-900" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-yellow-900 mb-1">
                    ⚠️ IMPORTANTE
                  </p>
                  <p className="text-sm text-yellow-800 font-semibold">
                    <strong>PIX:</strong> Aprovação imediata e você já pode ver sua inscrição confirmada.
                    <br />
                    <strong>Cartão:</strong> Após o pagamento, aguarde até 24h para confirmação.
                  </p>
                </div>
              </div>
            </div>

            {/* Voltar */}
            <div className="p-6 text-center border-t">
              <Link href="/minha-area">
                  ← Voltar para Minha Área
              </Link>
                href="/minha-area"
                className="text-[#E53935] font-bold hover:underline"
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Dúvidas? <strong className="text-[#E53935]">studiobravo0@gmail.com</strong>
            </p>
          </div>
        </div>
      </div>
    </>

  );
}
