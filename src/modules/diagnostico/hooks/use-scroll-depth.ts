import { useEffect, useRef } from "react";
import { trackScrollDepth } from "@/modules/diagnostico/lib/pixel";

const MILESTONES = [25, 50, 75, 90];

export function useScrollDepth() {
  const fired = useRef(new Set<number>());

  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);
      for (const m of MILESTONES) {
        if (pct >= m && !fired.current.has(m)) {
          fired.current.add(m);
          trackScrollDepth(m);
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}
