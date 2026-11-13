import { useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Wrapper className (controls aspect ratio / sizing) */
  wrapperClassName?: string;
  /** Image className (object-fit, etc.) */
  className?: string;
  eager?: boolean;
  srcSet?: string;
}

/**
 * Image with a soft skeleton placeholder + fade-in on load.
 * Avoids showing the alt text / broken-image state during lazy load.
 */
export function SmartImage({
  src,
  alt,
  wrapperClassName,
  className,
  eager = false,
  width,
  height,
  ...rest
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-cream-deep/40",
        !loaded && "animate-pulse",
        wrapperClassName,
      )}
    >
      <img
        src={src}
        alt={loaded ? alt : ""}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-opacity duration-500 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        {...rest}
      />
    </div>
  );
}
