"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation';
import { CreditCard, QrCode, Clock, CheckCircle, Loader2, Zap } from 'lucide-react';
import { MainHeader } from '@/components/MainHeader';

interface Inscricao {
  id: string;
  codigo: number;
  nomeCompleto: string;
  categoria: string;
  valorPago: number;
  valeAlmoco: boolean;
  cupomId: string | null;
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

  // ⭐ CALCULAR VALORES
  const valorBase = inscricao?.valorPago || 0;
  const valorComTaxa = valorBase * 1.0416; // 4,16% de taxa
  const valorTaxa = valorComTaxa - valorBase;

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

  // ⭐ FUNÇÃO UNIFICADA DE PAGAMENTO
  const handlePagamento = async (metodoPagamento: 'PIX' | 'CARTAO') => {
    if (!inscricao) return;

    // Definir qual loading ativar
    if (metodoPagamento === 'PIX') {
      setIsLoadingPix(true);
    } else {
      setIsLoadingCartao(true);
    }

    try {
      const response = await fetch('/api/pagamento/criar-link-pagbank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          inscricaoId: inscricao.id,
          metodoPagamento: metodoPagamento
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Erro: ${result.error || 'Não foi possível gerar pagamento'}`);
        setIsLoadingPix(false);
        setIsLoadingCartao(false);
        return;
      }

      const checkoutUrl = result.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert('Erro: Link de pagamento não gerado');
        setIsLoadingPix(false);
        setIsLoadingCartao(false);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setIsLoadingPix(false);
      setIsLoadingCartao(false);
    }
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
                  <p className="text-xs text-white/80 uppercase font-bold mb-1">Valor Base</p>
                  <p className="text-2xl font-black">R$ {valorBase.toFixed(2)}</p>
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
              <div className="relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                    <Zap className="w-3 h-3" />
                    RECOMENDADO
                  </div>
                </div>

                <button
                  onClick={() => handlePagamento('PIX')}
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

                      {/* Valor do PIX */}
                      <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-green-800">Valor a pagar:</span>
                          <span className="text-3xl font-black text-green-700">
                            R$ {valorBase.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-green-700">Economia:</span>
                          <span className="text-lg font-bold text-green-600">
                            - R$ {valorTaxa.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Benefícios */}
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
                            <strong>SEM TAXAS ADICIONAIS</strong>
                          </span>
                        </div>
                      </div>

                      {/* Botão */}
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

              <button
                onClick={() => handlePagamento('CARTAO')}
                disabled={isLoadingCartao}
                className="w-full border-2 border-gray-300 rounded-xl p-6 hover:bg-gray-50 hover:border-[#00B8D4] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#00B8D4] p-3 rounded-lg flex-shrink-0">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-black text-[#00B8D4] mb-2">
                      💳 CARTÃO OU BOLETO
                    </h3>

                    {/* Valor do Cartão */}
                    <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-orange-800">Valor a pagar:</span>
                        <span className="text-3xl font-black text-orange-700">
                          R$ {valorComTaxa.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-orange-700">Taxa de 4,16%:</span>
                        <span className="text-lg font-bold text-orange-600">
                          + R$ {valorTaxa.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Opções Disponíveis */}
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 mb-4">
                      <p className="text-xs font-bold text-blue-800 mb-2">
                        📋 FORMAS DE PAGAMENTO DISPONÍVEIS:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-lg p-2 text-center border border-blue-200">
                          <p className="text-xs font-black text-blue-700">💳 CRÉDITO</p>
                          <p className="text-[10px] text-blue-600">Até 12x</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 text-center border border-blue-200">
                          <p className="text-xs font-black text-blue-700">📄 BOLETO</p>
                          <p className="text-[10px] text-blue-600">À vista</p>
                        </div>
                      </div>
                    </div>

                    {/* Detalhes */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#00B8D4] flex-shrink-0" />
                        <span className="font-semibold text-gray-700">
                          <strong>Crédito:</strong> Parcelamento em até <strong>12x</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-[#00B8D4] flex-shrink-0" />
                        <span className="font-semibold text-gray-700">
                          <strong>Boleto:</strong> Vencimento em 3 dias
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="font-semibold text-gray-700">
                          Confirmação em até <strong>24 horas</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="font-semibold text-gray-700">
                          <strong>+ Taxa de 4,16%</strong>
                        </span>
                      </div>
                    </div>

                    {/* Botão */}
                    {isLoadingCartao ? (
                      <div className="bg-[#00B8D4] text-white px-6 py-3 rounded-lg font-black text-center flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirecionando...
                      </div>
                    ) : (
                      <div className="bg-[#00B8D4] text-white px-6 py-3 rounded-lg font-black text-center hover:bg-[#00a0c0] transition-colors">
                        ESCOLHER ESTA OPÇÃO →
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
                    <strong>PIX:</strong> Aprovação imediata e você já pode ver sua inscrição confirmada. <strong>SEM TAXAS!</strong>
                    <br />
                    <strong>Boleto:</strong> Vencimento em 3 dias úteis. Confirmação após compensação bancária. <strong>Taxa de 4,16%.</strong>
                  </p>
                </div>
              </div>
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
