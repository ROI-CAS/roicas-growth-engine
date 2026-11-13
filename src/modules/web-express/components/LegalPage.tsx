import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";

/** Layout compartido para páginas legales (Privacidad, Términos). */
export function LegalPage({
  title,
  updated,
  children,
  campaign = false,
}: {
  title: string;
  updated: string;
  children: ReactNode;
  campaign?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            to={campaign ? "/web-express/black-november#top" : "/web-express"}
            className="flex items-center gap-2.5 min-w-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
          >
            <div className="size-8 rounded-lg bg-brand text-brand-foreground grid place-items-center shrink-0 shadow-md shadow-brand/20">
              <Zap className="size-4.5 fill-current" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              Web Express <span className="text-brand">24H</span>
            </span>
          </Link>
          <Link
            to={campaign ? "/web-express/black-november#top" : "/web-express"}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />{" "}
            {campaign ? "Volver a Black November" : "Volver al inicio"}
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <header className="mb-10 space-y-2">
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tighter">{title}</h1>
          <p className="text-sm text-muted-foreground">Última actualización: {updated}</p>
        </header>
        <article className="prose-legal space-y-8 text-[15px] leading-relaxed text-muted-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </article>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Web Express 24H · Un producto de Roicas</span>
          <div className="flex gap-5 font-medium">
            <a
              href={campaign ? "/web-express/privacidad?from=black-november" : "/web-express/privacidad"}
              className="hover:text-foreground transition-colors"
            >
              Privacidad
            </a>
            {campaign ? (
              <a
                href="/web-express/black-november#condiciones"
                className="hover:text-foreground transition-colors"
              >
                Condiciones Black November
              </a>
            ) : (
              <Link to="/web-express/terminos" className="hover:text-foreground transition-colors">
                Términos
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
