import { Suspense } from "react";
import PagamentoPendenteContent from "./PagamentoPendenteContent";

function LoadingFallback() {
  return (
    <div className="container mx-auto py-16 px-4 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando...</p>
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
