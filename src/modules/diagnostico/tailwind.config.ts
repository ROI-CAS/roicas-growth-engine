import tailwindAnimate from "tailwindcss-animate";
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/modules/diagnostico/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1320px" },
    },
    extend: {
      fontFamily: {
        display: ['"Archivo"', '"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--diagnostico-border))",
        input: "hsl(var(--diagnostico-input))",
        ring: "hsl(var(--diagnostico-ring))",
        background: "hsl(var(--diagnostico-background))",
        foreground: "hsl(var(--diagnostico-foreground))",
        ink: {
          DEFAULT: "hsl(var(--diagnostico-ink))",
          soft: "hsl(var(--diagnostico-ink-soft))",
        },
        cream: {
          DEFAULT: "hsl(var(--diagnostico-cream))",
          deep: "hsl(var(--diagnostico-cream-deep))",
        },
        primary: {
          DEFAULT: "hsl(var(--diagnostico-primary))",
          foreground: "hsl(var(--diagnostico-primary-foreground))",
          glow: "hsl(var(--diagnostico-primary-glow))",
          deep: "hsl(var(--diagnostico-primary-deep))",
        },
        secondary: {
          DEFAULT: "hsl(var(--diagnostico-secondary))",
          foreground: "hsl(var(--diagnostico-secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--diagnostico-destructive))",
          foreground: "hsl(var(--diagnostico-destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--diagnostico-muted))",
          foreground: "hsl(var(--diagnostico-muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--diagnostico-accent))",
          foreground: "hsl(var(--diagnostico-accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--diagnostico-popover))",
          foreground: "hsl(var(--diagnostico-popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--diagnostico-card))",
          foreground: "hsl(var(--diagnostico-card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--diagnostico-sidebar-background))",
          foreground: "hsl(var(--diagnostico-sidebar-foreground))",
          primary: "hsl(var(--diagnostico-sidebar-primary))",
          "primary-foreground": "hsl(var(--diagnostico-sidebar-primary-foreground))",
          accent: "hsl(var(--diagnostico-sidebar-accent))",
          "accent-foreground": "hsl(var(--diagnostico-sidebar-accent-foreground))",
          border: "hsl(var(--diagnostico-sidebar-border))",
          ring: "hsl(var(--diagnostico-sidebar-ring))",
        },
      },
      backgroundImage: {
        "gradient-primary": "var(--diagnostico-gradient-primary)",
        "gradient-warm": "var(--diagnostico-gradient-warm)",
        "gradient-cream": "var(--diagnostico-gradient-cream)",
      },
      boxShadow: {
        soft: "var(--diagnostico-shadow-soft)",
        card: "var(--diagnostico-shadow-card)",
        brand: "var(--diagnostico-shadow-brand)",
      },
      borderRadius: {
        lg: "var(--diagnostico-radius)",
        md: "calc(var(--diagnostico-radius) - 4px)",
        sm: "calc(var(--diagnostico-radius) - 8px)",
        xl: "calc(var(--diagnostico-radius) + 8px)",
        "2xl": "calc(var(--diagnostico-radius) + 16px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--diagnostico-radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--diagnostico-radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.04)", opacity: "0.92" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "blob": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(20px,-20px) scale(1.05)" },
          "66%": { transform: "translate(-15px,10px) scale(0.97)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "fade-in": "fade-in 0.6s ease-out both",
        "scale-in": "scale-in 0.4s ease-out both",
        "slide-in-right": "slide-in-right 0.4s ease-out both",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        "marquee": "marquee 30s linear infinite",
        "blob": "blob 14s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindAnimate],
} satisfies Config;
