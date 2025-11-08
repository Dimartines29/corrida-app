// app/pagamento/escolher-metodo/page.tsx
import { Suspense } from "react";
import EscolhaPagamentoContent from "./EscolhaPagamentoContent";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FFE66D] flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#00B8D4] border-t-transparent mb-4"></div>
        <p className="text-gray-700 font-bold text-lg">Carregando...</p>
      </div>
    </div>
  );
}

export default function EscolhaMetodoPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EscolhaPagamentoContent />
    </Suspense>
  );
}
