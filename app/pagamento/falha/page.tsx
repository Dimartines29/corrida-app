"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PagamentoFalhaPage() {
  const searchParams = useSearchParams();
  const inscricaoId = searchParams.get("inscricaoId");
  const [inscricao, setInscricao] = useState<any>(null);
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
      <div className="container mx-auto py-16 px-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl">
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          <CardTitle className="text-3xl text-red-700">
            Pagamento Não Aprovado
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-red-200 bg-white">
            <AlertDescription className="text-center">
              Não foi possível processar o seu pagamento.
              <br />
              Você pode tentar novamente com outra forma de pagamento.
            </AlertDescription>
          </Alert>

          {inscricao && (
            <div className="bg-white rounded-lg p-6 space-y-3 border">
              <h3 className="font-semibold text-lg mb-4">Sua Inscrição</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Código</p>
                  <p className="font-semibold">{inscricao.codigo}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Categoria</p>
                  <p className="font-semibold">{inscricao.categoria?.nome}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-semibold text-red-600">Pendente de Pagamento</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Valor</p>
                  <p className="font-semibold">
                    R$ {Number(inscricao.valorPago).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm">
            <h4 className="font-semibold mb-2 text-orange-900">⚠️ Possíveis Motivos</h4>
            <ul className="space-y-1 text-orange-800">
              <li>• Dados do cartão incorretos</li>
              <li>• Saldo insuficiente</li>
              <li>• Cartão bloqueado ou vencido</li>
              <li>• Limite de compras atingido</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleTentarNovamente}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>

            <Button variant="outline" asChild className="flex-1">
              <Link href="/minha-area">
                <Home className="w-4 h-4 mr-2" />
                Voltar para Início
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>Precisa de ajuda? Entre em contato:</p>
            <p><strong>contato@corrida.com.br</strong> | <strong>(31) 99999-9999</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
