import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  spotlightColor?: string;
  borderColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  contentClassName = "",
  spotlightColor = "rgba(255, 92, 103, 0.12)",
  borderColor = "rgba(255, 255, 255, 0.2)",
  ...props
}: SpotlightCardProps) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(-1000);
    mouseY.set(-1000);
  }, [mouseX, mouseY]);

  const spotlightBg = useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;
  const borderBg = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, ${borderColor}, transparent 80%)`;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Halo de luz que sigue el cursor sobre el borde */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 z-10"
        style={{
          background: borderBg,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Halo de luz interior sobre el cristal */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 z-10"
        style={{
          background: spotlightBg,
          opacity: isHovered ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Contenido de la tarjeta */}
      <div className={`relative z-20 h-full w-full ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
