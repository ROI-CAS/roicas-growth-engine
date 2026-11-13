import { cn } from "@/lib/utils";

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const isHorizontal = direction === "horizontal";
  const animName = isHorizontal
    ? reverse ? "logo-scroll-x-rev" : "logo-scroll-x"
    : reverse ? "logo-scroll-y-rev" : "logo-scroll-y";

  return (
    <div
      className={cn("overflow-hidden slider-container", className)}
      style={{
        "--diagnostico-slider-duration": `${duration}s`,
        "--diagnostico-slider-hover-dur": `${durationOnHover ?? duration}s`,
      } as React.CSSProperties}
    >
      <div
        className="flex w-max slider-track"
        style={{
          gap: `${gap}px`,
          flexDirection: isHorizontal ? "row" : "column",
          animationName: animName,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
