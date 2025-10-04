// ProgressIndicator.tsx
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  "Dados Pessoais",
  "Categoria",
  "Kit",
  "Ficha Médica",
  "Revisão"
];

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-black shadow-lg transition-all
                    ${isCompleted ? "bg-[#00B8D4] text-white scale-110" : ""}
                    ${isActive ? "bg-[#E53935] text-white scale-125 animate-pulse" : ""}
                    ${!isCompleted && !isActive ? "bg-gray-200 text-gray-500" : ""}
                  `}
                >
                  {isCompleted ? <Check className="w-6 h-6" /> : stepNumber}
                </div>

                <span
                  className={`
                    mt-3 text-xs text-center font-semibold
                    ${isActive ? "text-[#E53935]" : "text-gray-600"}
                  `}
                >
                  {stepLabels[index]}
                </span>
              </div>

              {/* Linha conectora */}
              {stepNumber < totalSteps && (
                <div className={`h-1 flex-1 mx-2 rounded transition-all ${
                  stepNumber < currentStep ? "bg-[#00B8D4]" : "bg-gray-200"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}