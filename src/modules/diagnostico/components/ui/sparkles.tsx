import { useEffect, useId, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

type SparklesProps = {
  className?: string;
  size?: number;
  minSize?: number | null;
  density?: number;
  speed?: number;
  minSpeed?: number | null;
  opacity?: number;
  opacitySpeed?: number;
  minOpacity?: number | null;
  /** Acepta cualquier color CSS válido. Para usar tokens HSL:
   *  color={`hsl(var(--diagnostico-primary))`} resuelto antes de pasar — ver Hero. */
  color?: string;
  background?: string;
  options?: Record<string, unknown>;
};

export function Sparkles({
  className,
  size = 1.2,
  minSize = null,
  density = 400,
  speed = 1,
  minSpeed = null,
  opacity = 1,
  opacitySpeed = 3,
  minOpacity = null,
  color = "#FFFFFF",
  background = "transparent",
  options = {},
}: SparklesProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setIsReady(true));
  }, []);

  const id = useId();

  const defaultOptions = {
    background: { color: { value: background } },
    fullScreen: { enable: false, zIndex: 1 },
    fpsLimit: 30,
    particles: {
      color: { value: color },
      move: {
        enable: true,
        direction: "none" as const,
        speed: { min: minSpeed ?? speed / 10, max: speed },
        straight: false,
      },
      number: { value: density },
      opacity: {
        value: { min: minOpacity ?? opacity / 10, max: opacity },
        animation: { enable: true, sync: false, speed: opacitySpeed },
      },
      size: { value: { min: minSize ?? size / 2.5, max: size } },
    },
    detectRetina: true,
  };

  if (!isReady) return null;

  return (
    <Particles
      id={id.replace(/:/g, "")}
      options={{ ...defaultOptions, ...options }}
      className={className}
    />
  );
}
