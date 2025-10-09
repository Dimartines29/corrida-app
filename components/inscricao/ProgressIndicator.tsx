// ProgressIndicator.tsx
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ["Dados Pessoais", "Categoria", "Kit", "Ficha Médica", "Revisão"];

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-6 sm:mb-8 md:mb-10">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {const stepNumber = index + 1; const isCompleted = stepNumber < currentStep; const isActive = stepNumber === currentStep;
          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-base font-black shadow-lg transition-all ${isCompleted ? "bg-[#00B8D4] text-white scale-105 sm:scale-110" : ""} ${isActive ? "bg-[#E53935] text-white scale-110 sm:scale-125 animate-pulse" : ""} ${!isCompleted && !isActive ? "bg-gray-200 text-gray-500" : ""}`}>
                  {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : stepNumber}
                </div>

                <span className={`mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm text-center font-semibold px-1 ${isActive ? "text-[#E53935]" : "text-gray-600"} hidden sm:block`}>{stepLabels[index]}</span>

                {/* Label móvel - apenas para step ativo */}
                {isActive && (<span className="mt-2 text-[10px] text-center font-semibold px-1 text-[#E53935] sm:hidden">{stepLabels[index]}</span>)}
              </div>

              {/* Linha conectora - Responsiva */}
              {stepNumber < totalSteps && (<div className={`h-0.5 sm:h-1 flex-1 mx-1 sm:mx-2 rounded transition-all ${stepNumber < currentStep ? "bg-[#00B8D4]" : "bg-gray-200"}`} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
}