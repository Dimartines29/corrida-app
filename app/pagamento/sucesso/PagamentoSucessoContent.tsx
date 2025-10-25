"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Home } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Inscricao } from "@/types/types";

export default function PagamentoSucessoContent() {
  const searchParams = useSearchParams();
  const inscricaoId = searchParams.get("inscricaoId");

  const [inscricao, setInscricao] = useState<Inscricao>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar dados da inscrição
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
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          <CardTitle className="text-3xl text-green-700">
            Pagamento Aprovado!
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-green-200 bg-white">
            <AlertDescription className="text-center">
              Sua inscrição foi confirmada com sucesso!
              <br />
              Em breve você receberá um e-mail de confirmação.
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
                  <p className="font-semibold">{inscricao.categoria}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Participante</p>
                  <p className="font-semibold">{inscricao.nomeCompleto}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Valor Pago</p>
                  <p className="font-semibold text-green-600">
                    R$ {Number(inscricao.valorPago).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/minha-area">
                <Home className="w-4 h-4 mr-2" />
                Ir para Minha Área
              </Link>
            </Button>

            <Button variant="outline" asChild className="flex-1">
              <Link href={`/inscricao/${inscricaoId}/comprovante`}>
                <Download className="w-4 h-4 mr-2" />
                Baixar Comprovante
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>Guarde o código <strong>{inscricao?.codigo || "da sua inscrição"}</strong></p>
            <p>Você precisará dele no dia do evento.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
