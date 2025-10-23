"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Home, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PagamentoPendentePage() {
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

  const handleRefresh = () => {
    setLoading(true);
    window.location.reload();
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
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>

          <CardTitle className="text-3xl text-yellow-700">
            Pagamento Pendente
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-yellow-200 bg-white">
            <AlertDescription className="text-center">
              Estamos aguardando a confirmação do seu pagamento.
              <br />
              Isso pode levar alguns minutos.
            </AlertDescription>
          </Alert>

          {inscricao && (
            <div className="bg-white rounded-lg p-6 space-y-3 border">
              <h3 className="font-semibold text-lg mb-4">Detalhes da Inscrição</h3>

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
                  <p className="font-semibold text-yellow-600">
                    {inscricao.status === "PENDENTE" ? "Aguardando Pagamento" : inscricao.status}
                  </p>
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <h4 className="font-semibold mb-2 text-blue-900">💡 Pagou com PIX?</h4>
            <ul className="space-y-1 text-blue-800">
              <li>• O pagamento pode levar até 2 horas para ser confirmado</li>
              <li>• Você receberá um e-mail assim que for aprovado</li>
              <li>• Pode fechar esta página e voltar mais tarde</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar Status
            </Button>

            <Button asChild className="flex-1">
              <Link href="/minha-area">
                <Home className="w-4 h-4 mr-2" />
                Ir para Minha Área
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>Dúvidas? Entre em contato: <strong>contato@corrida.com.br</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
