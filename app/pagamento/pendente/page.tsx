import { Suspense } from "react";
import PagamentoPendenteContent from "./PagamentoPendenteContent";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FFE66D] flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#FF9800] border-t-transparent mb-4 shadow-lg"></div>
        <p className="text-gray-700 font-bold text-lg sm:text-xl">
          Carregando informações...
        </p>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Por favor, aguarde um momento
        </p>
      </div>
    </div>
  );
}

export default function PagamentoPendentePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PagamentoPendenteContent />
    </Suspense>
  );
}