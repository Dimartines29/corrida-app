"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { CreditCard, Loader2 } from "lucide-react";

interface PagamentoPendenteButtonProps {
  inscricaoId: string;
}

export function PagamentoPendenteButton({ inscricaoId }: PagamentoPendenteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePagamento = () => {
    setIsLoading(true);
    window.location.href = `/pagamento/escolher-metodo?inscricaoId=${inscricaoId}`;
  };

  return (
    <Button
      onClick={handlePagamento}
      disabled={isLoading}
      className="w-full bg-white text-orange-600 hover:bg-orange-50 font-black text-lg h-14 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
          Redirecionando...
        </>
      ) : (
        <>
          <CreditCard className="w-6 h-6 mr-2" />
          FINALIZAR PAGAMENTO AGORA
        </>
      )}
    </Button>
  );
}
