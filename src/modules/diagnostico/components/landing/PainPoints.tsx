import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Globe, MousePointerClick, TrendingDown } from "lucide-react";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
import slide1 from "@/modules/diagnostico/assets/painpoints-shop.webp";
import slide1_480 from "@/modules/diagnostico/assets/painpoints-shop-480.webp";
import slide1_720 from "@/modules/diagnostico/assets/painpoints-shop-720.webp";
import slide2 from "@/modules/diagnostico/assets/pain-visitas.webp";
import slide2_480 from "@/modules/diagnostico/assets/pain-visitas-480.webp";
import slide2_720 from "@/modules/diagnostico/assets/pain-visitas-720.webp";
import slide3 from "@/modules/diagnostico/assets/pain-medicion.webp";
import slide3_480 from "@/modules/diagnostico/assets/pain-medicion-480.webp";
import slide3_720 from "@/modules/diagnostico/assets/pain-medicion-720.webp";
import slide4 from "@/modules/diagnostico/assets/pain-google.webp";
import slide4_480 from "@/modules/diagnostico/assets/pain-google-480.webp";
import slide4_720 from "@/modules/diagnostico/assets/pain-google-720.webp";

const items = [
  { icon: Globe, text: "Tienes un negocio serio pero no tienes presencia en internet." },
  { icon: MousePointerClick, text: "Tienes web pero no te genera ningún cliente." },
  { icon: TrendingDown, text: "Inviertes en redes sociales pero no ves resultados reales." },
];

const ss = (a: string, b: string, c: string) => `${a} 480w, ${b} 720w, ${c} 1024w`;

const slides = [
  { img: slide1, srcSet: ss(slide1_480, slide1_720, slide1), caption: "Tu negocio ya tiene historia. Démosle alcance." },
  { img: slide2, srcSet: ss(slide2_480, slide2_720, slide2), caption: "Más visitas no es lo mismo que más clientes." },
  { img: slide3, srcSet: ss(slide3_480, slide3_720, slide3), caption: "Lo que no se mide, no crece." },
  { img: slide4, srcSet: ss(slide4_480, slide4_720, slide4), caption: "Tu competencia ya está en Google. ¿Y tú?" },
];

export function PainPoints() {
  const reduced = prefersReducedMotion();
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    reduced ? [] : [autoplay.current]
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              ¿Te identificas?
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink md:text-5xl text-balance">
              Si tu negocio está en alguno de estos puntos…
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] shadow-card">
              <div ref={emblaRef} className="overflow-hidden">
                <div className="flex">
                  {slides.map((s, i) => (
                    <div key={i} className="relative min-w-0 flex-[0_0_100%]">
                      <div className="relative aspect-[4/5]">
                        <SmartImage
                          src={s.img}
                          srcSet={s.srcSet}
                          alt={s.caption}
                          wrapperClassName="absolute inset-0"
                          className="h-full w-full object-cover"
                          eager={i === 0}
                          width={1024}
                          height={1280}
                          sizes="(max-width: 1024px) 100vw, 45vw"
                        />
                        <div className="absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-ink/85 via-ink/30 to-transparent p-6 pb-10">
                          <p className="font-display text-xl font-bold text-cream md:text-2xl text-balance">
                            {s.caption}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots */}
              <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    aria-label={`Ir al slide ${i + 1}`}
                    className={`h-2 cursor-pointer rounded-full transition-all ${
                      selected === i ? "w-6 bg-cream" : "w-2 bg-cream/50 hover:bg-cream/80"
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5">
            {items.map((it, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft hover-lift">
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <it.icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <span className="font-display text-2xl font-extrabold text-cream-deep">
                        0{i + 1}
                      </span>
                      <p className="mt-1 text-lg font-medium leading-snug text-ink">{it.text}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={240}>
          <p className="mt-12 text-center text-lg text-ink-soft">
            Si respondiste sí a cualquiera de estas,{" "}
            <span className="font-semibold text-ink">podemos ayudarte.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
