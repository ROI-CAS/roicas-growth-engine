import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BriefProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  stepTitles: string[];
  onStepClick?: (step: number) => void;
  furthestStepReached: number;
}

export const BriefProgressBar: React.FC<BriefProgressBarProps> = ({
  currentStep,
  totalSteps = 5,
  stepTitles,
  onStepClick,
  furthestStepReached,
}) => {
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
  const currentTitle = stepTitles[currentStep - 1] || "";

  return (
    <div className="w-full mb-8" aria-label="Progreso del formulario">
      {/* Top Text Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm font-semibold text-foreground tracking-wide">
          Paso {currentStep} de {totalSteps} ·{" "}
          <span className="text-brand font-bold">{currentTitle}</span>
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {progressPercent}% completado
        </span>
      </div>

      {/* Progress Line */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary/80">
        <div
          className="h-full bg-gradient-to-r from-brand to-rose-500 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Step Dots (Clickable for already visited steps) */}
      <nav aria-label="Pasos del brief" className="mt-3 flex items-center justify-between">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = stepNumber <= furthestStepReached;

          return (
            <button
              key={title}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick?.(stepNumber)}
              className={cn(
                "group flex items-center gap-1.5 text-xs transition-colors",
                isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-40",
                isCurrent ? "font-bold text-brand" : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Paso ${stepNumber}: ${title}`}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all",
                  isCompleted && "bg-brand text-brand-foreground",
                  isCurrent && "border-2 border-brand bg-background text-brand ring-2 ring-brand/20",
                  !isCompleted && !isCurrent && "border border-border bg-muted/60 text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : stepNumber}
              </span>
              <span className="hidden md:inline text-xs font-medium truncate max-w-[110px]">
                {title}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BriefProgressBar;
