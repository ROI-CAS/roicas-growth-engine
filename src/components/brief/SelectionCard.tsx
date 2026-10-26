import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectionCardProps {
  id?: string;
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  multiSelect?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  id,
  selected,
  onClick,
  title,
  description,
  badge,
  icon,
  multiSelect = false,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      id={id}
      type="button"
      role={multiSelect ? "checkbox" : "radio"}
      aria-checked={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        selected
          ? "border-brand bg-brand/5 shadow-sm ring-1 ring-brand/30"
          : "border-border bg-card hover:border-brand/40 hover:bg-muted/40",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {/* Check / Radio indicator */}
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center transition-colors mt-0.5",
          multiSelect ? "rounded-md border" : "rounded-full border",
          selected
            ? "border-brand bg-brand text-brand-foreground"
            : "border-muted-foreground/40 bg-background group-hover:border-brand/60"
        )}
        aria-hidden="true"
      >
        {selected ? (
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        ) : !multiSelect ? (
          <span className="h-1.5 w-1.5 rounded-full bg-transparent" />
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-sm font-semibold leading-tight",
              selected ? "text-foreground" : "text-foreground/90"
            )}
          >
            {title}
          </span>
          {badge && (
            <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {icon && (
        <div
          className={cn(
            "shrink-0 text-muted-foreground/70 transition-colors group-hover:text-foreground",
            selected && "text-brand"
          )}
        >
          {icon}
        </div>
      )}
    </button>
  );
};

export default SelectionCard;
