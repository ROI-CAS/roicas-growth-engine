import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Retardo en ms para escalonar entradas en secuencia. */
  delay?: number;
  /** Etiqueta a renderizar (div por defecto). */
  as?: ElementType;
  className?: string;
}

/**
 * Envuelve contenido para que entre suavemente (fade + subida) cuando aparece
 * en el viewport. Se anima una sola vez. Respeta prefers-reduced-motion vía CSS
 * (ver [data-reveal] en styles.css).
 */
export function Reveal({ children, delay = 0, as, className }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: el.closest(".premium-campaign") ? 0 : 0.12,
        rootMargin: el.closest(".premium-campaign") ? "0px 0px 90px 0px" : "0px 0px -8% 0px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={`${visible ? "is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? ({ "--web-express-reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
