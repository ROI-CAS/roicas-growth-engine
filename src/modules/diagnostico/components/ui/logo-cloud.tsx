import { InfiniteSlider } from "@/modules/diagnostico/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)} {...props}>
      <InfiniteSlider gap={64} duration={45} durationOnHover={140}>
        {logos.map((logo) => (
          <div
            key={logo.alt}
            className="flex h-28 items-center justify-center px-4 md:h-32 md:px-6"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              width={logo.width ?? 200}
              height={logo.height ?? 80}
              loading="lazy"
              className="h-20 w-auto object-contain opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 md:h-24"
            />
          </div>
        ))}
      </InfiniteSlider>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent md:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent md:w-24"
      />
    </div>
  );
}
