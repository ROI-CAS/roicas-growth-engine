import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className = "",
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const [displayValue, setDisplayValue] = useState<string>(
    (direction === "down" ? value : 0).toFixed(decimalPlaces)
  );

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(
        Intl.NumberFormat("es-CO", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(latest.toFixed(decimalPlaces)))
      );
    });
  }, [springValue, decimalPlaces]);

  return (
    <span ref={ref} className={`inline-block tabular-nums tracking-normal ${className}`}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

