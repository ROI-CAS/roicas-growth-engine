import { useEffect, useRef } from "react";

interface ParticlesBackgroundProps {
  className?: string;
  particleCount?: number;
  speed?: number;
}

export default function ParticlesBackground({
  className = "",
  particleCount = 55,
  speed = 0.45,
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !parent || !context) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * speed * 1.5,
      vy: (Math.random() - 0.5) * speed * 1.5,
      radius: Math.random() * 2.2 + 1.2,
      baseAlpha: Math.random() * 0.45 + 0.35,
      isBrand: Math.random() > 0.4,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.03 + 0.015,
    }));
    const pointer = { x: -1000, y: -1000, radius: 140 };
    let width = 0;
    let height = 0;
    let hasSize = false;
    let visible = false;
    let trackingPointer = false;
    let frame: number | null = null;
    let previousFrameTime: number | null = null;

    const canDraw = () => visible && hasSize && !document.hidden;
    const canAnimate = () => canDraw() && !motionPreference.matches;

    function draw(animate: boolean, timeScale = 1) {
      context.clearRect(0, 0, width, height);
      const count = animate ? particles.length : Math.min(particles.length, 25);
      const maxDistance = 115;
      for (let i = 0; i < count; i++) {
        const particle = particles[i];
        for (let j = i + 1; j < count; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          if (dx * dx + dy * dy >= maxDistance * maxDistance) continue;
          const distance = Math.hypot(dx, dy);
          context.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / maxDistance) * 0.16})`;
          context.lineWidth = 0.9;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }

        if (animate && pointer.x > 0 && pointer.y > 0) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < pointer.radius) {
            const force = 1 - distance / pointer.radius;
            const rgb = particle.isBrand ? "235, 75, 75" : "255, 255, 255";
            context.strokeStyle = `rgba(${rgb}, ${force * 0.45})`;
            context.lineWidth = 1.2;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(pointer.x, pointer.y);
            context.stroke();
            const angle = Math.atan2(dy, dx);
            particle.x += Math.cos(angle) * force * 3 * timeScale;
            particle.y += Math.sin(angle) * force * 3 * timeScale;
          }
        }
      }

      for (let i = 0; i < count; i++) {
        const particle = particles[i];
        if (animate) {
          particle.x += particle.vx * timeScale;
          particle.y += particle.vy * timeScale;
          particle.pulse += particle.pulseSpeed * timeScale;
          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
        }

        const alpha = Math.max(0.2, Math.min(0.9, particle.baseAlpha + Math.sin(particle.pulse) * 0.25));
        const rgb = particle.isBrand ? "225, 55, 55" : "255, 255, 255";
        context.fillStyle = `rgba(${rgb}, ${alpha})`;
        context.shadowColor = `rgba(${rgb}, ${particle.isBrand ? 0.6 : 0.5})`;
        context.shadowBlur = particle.isBrand ? 6 : 5;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      }
    }

    function onFrame(time: number) {
      frame = null;
      if (!canAnimate()) return;
      const timeScale = previousFrameTime === null ? 1 : Math.min(2, (time - previousFrameTime) / (1000 / 60));
      previousFrameTime = time;
      draw(true, timeScale);
      frame = window.requestAnimationFrame(onFrame);
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    }

    function resetPointer() {
      pointer.x = -1000;
      pointer.y = -1000;
    }

    function setPointerTracking(active: boolean) {
      if (active === trackingPointer) return;
      trackingPointer = active;
      if (active) {
        parent.addEventListener("pointermove", onPointerMove, { passive: true });
        parent.addEventListener("pointerleave", resetPointer);
      } else {
        parent.removeEventListener("pointermove", onPointerMove);
        parent.removeEventListener("pointerleave", resetPointer);
        resetPointer();
      }
    }

    function stop() {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      previousFrameTime = null;
      setPointerTracking(false);
    }

    function syncActivity() {
      if (!canAnimate()) {
        stop();
        if (canDraw()) draw(false);
        return;
      }
      setPointerTracking(true);
      if (frame === null) frame = window.requestAnimationFrame(onFrame);
    }

    function resizeCanvas() {
      const nextWidth = parent.clientWidth;
      const nextHeight = parent.clientHeight;
      hasSize = nextWidth > 0 && nextHeight > 0;
      if (!hasSize || (nextWidth === width && nextHeight === height)) return;
      for (const particle of particles) {
        particle.x *= nextWidth / (width || 1);
        particle.y *= nextHeight / (height || 1);
      }
      width = nextWidth;
      height = nextHeight;
      const scale = Math.min(1, 2048 / width, 2048 / height, Math.sqrt(1_500_000 / (width * height)));
      canvas.width = Math.max(1, Math.floor(width * scale));
      canvas.height = Math.max(1, Math.floor(height * scale));
      context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    }

    function checkIntersection() {
      const rect = parent.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
      syncActivity();
    }

    const intersection = typeof IntersectionObserver === "function" ? new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      syncActivity();
    }) : null;

    function onResize() {
      resizeCanvas();
      if (intersection) syncActivity();
      else checkIntersection();
    }

    const resize = typeof ResizeObserver === "function" ? new ResizeObserver(onResize) : null;
    resizeCanvas();
    checkIntersection();
    intersection?.observe(parent);
    resize?.observe(parent);
    if (!intersection) window.addEventListener("scroll", checkIntersection, { capture: true, passive: true });
    if (!intersection || !resize) window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", syncActivity);
    if (typeof motionPreference.addEventListener === "function") motionPreference.addEventListener("change", syncActivity);
    else motionPreference.addListener(syncActivity);

    return () => {
      stop();
      intersection?.disconnect();
      resize?.disconnect();
      window.removeEventListener("scroll", checkIntersection, true);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", syncActivity);
      if (typeof motionPreference.removeEventListener === "function") motionPreference.removeEventListener("change", syncActivity);
      else motionPreference.removeListener(syncActivity);
    };
  }, [particleCount, speed]);

  return <canvas ref={canvasRef} className={`absolute inset-0 z-0 h-full w-full pointer-events-none ${className}`} aria-hidden="true" />;
}

