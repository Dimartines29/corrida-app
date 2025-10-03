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
    <div className="w-full mb-8 pl-16">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    ${isCompleted ? "bg-green-500 text-white" : ""}
                    ${isActive ? "bg-blue-500 text-white" : ""}
                    ${!isCompleted && !isActive ? "bg-gray-200 text-gray-500" : ""}
                  `}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>

                <span
                  className={`
                    mt-2 text-xs text-center
                    ${isActive ? "font-semibold text-blue-500" : "text-gray-500"}
                  `}
                >
                  {stepLabels[index]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
