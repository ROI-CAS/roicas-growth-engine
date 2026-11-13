import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform",
  {
    variants: {
      variant: {
        // Primary CTA — tinta oscura, vira a primary en hover (sistema Roicas)
        default:
          "bg-ink text-cream shadow-soft hover:-translate-y-0.5 hover:bg-primary hover:shadow-brand",
        // Acción destructiva
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // CTA secundario — outline sobrio
        outline:
          "border border-ink/12 bg-transparent text-ink hover:-translate-y-0.5 hover:border-ink/30 hover:bg-transparent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Brand sólido (para usar dentro de cards highlight)
        brand:
          "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-primary-deep hover:shadow-brand",
        // Inverso — sobre fondos oscuros (FinalCTA card)
        inverse:
          "bg-cream text-ink shadow-soft hover:-translate-y-0.5 hover:bg-cream/90",
        "inverse-outline":
          "border border-cream/30 bg-transparent text-cream hover:-translate-y-0.5 hover:bg-cream/10 hover:text-cream",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
