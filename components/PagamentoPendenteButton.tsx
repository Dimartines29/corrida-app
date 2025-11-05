//components/PagamentoPendenteButton.tsx

"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { CreditCard, Loader2 } from "lucide-react";

interface PagamentoPendenteButtonProps {
  inscricaoId: string;
}

export function PagamentoPendenteButton({ inscricaoId }: PagamentoPendenteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePagamento = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/pagamento/criar-link-pagbank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inscricaoId }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`Erro: ${result.error || 'Não foi possível gerar link de pagamento'}`);
        setIsLoading(false);
        return;
      }

      // Redirecionar para checkout do PagBank
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        alert('Erro: Link de pagamento não foi gerado');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setIsLoading(false);
    }
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
          Gerando link...
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
