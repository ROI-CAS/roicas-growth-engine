import { ArrowRight, ArrowUpRight, Check, FileText, ShieldCheck, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/modules/web-express/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/modules/web-express/components/ui/tabs";
import { useLandingOffer } from "@/modules/web-express/lib/landing-offer";
import { BLACK_NOVEMBER, formatCOP } from "@/modules/web-express/lib/campaign";
import { getWhatsAppUrl } from "@/modules/web-express/lib/site";
import { WhatsAppIcon } from "@/modules/web-express/components/WhatsAppIcon";

type Plan = "one_page" | "business";
export function CampaignPlanDetails({
  plan,
  contentHelp = false,
}: {
  plan: Plan;
  contentHelp?: boolean;
}) {
  const offer = useLandingOffer();
  const onePage = plan === "one_page";
  const title = onePage ? "One Page" : "Web empresarial";
  const price = onePage ? offer.totalLabel : formatCOP(BLACK_NOVEMBER.businessCOP);
  const href = onePage
    ? offer.whatsappUrl("pricing")
    : getWhatsAppUrl(
        "general",
        `Hola Roicas, quiero conocer el alcance de la Web empresarial de Black November por ${price}: 4 páginas en total, Inicio + 3 internas.`,
      );
  const inclusions = onePage
    ? [
        "Hasta 5 secciones en una sola página, con diseño adaptable a computador y móvil.",
        "Dominio .com sujeto a disponibilidad, hosting y certificado SSL durante el primer año.",
        "Botón directo a WhatsApp, Google Maps y formulario de contacto.",
        "Configuración básica de SEO y Analytics para empezar a medir visitas.",
        "Textos e imágenes de apoyo y una ronda de ajustes antes de publicar.",
      ]
    : [
        "4 páginas en total: Inicio y 3 páginas internas, cada una con su propia dirección.",
        "Una estructura para presentar tu empresa y separar los temas o servicios que necesitas explicar.",
        "Menú de navegación adaptable a computador y móvil.",
        "Ejemplo de estructura: Inicio, Nosotros, Servicios y Contacto. La definimos contigo.",
      ];
  return (
    <Dialog>
      <DialogTrigger asChild>
        {contentHelp ? (
          <button
            type="button"
            className="premium-hero-help"
            aria-label="Ver cómo ayudamos con textos y fotos"
          >
            <Sparkles aria-hidden="true" />
            <span>
              <strong>¿No tienes textos ni fotos?</strong> Nosotros te ayudamos.
            </span>
            <ArrowRight aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            className="premium-details-trigger"
            aria-label={`Ver qué incluye ${title}`}
          >
            <FileText aria-hidden="true" />
            Ver qué incluye
            <ArrowRight aria-hidden="true" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="premium-plan-dialog">
        <header>
          <p className="premium-dialog-eyebrow">ELIGE CON CLARIDAD</p>
          <DialogTitle>
            {title} <span>{price}</span>
          </DialogTitle>
          <DialogDescription>
            Conoce el alcance, el contenido y el proceso antes de empezar.
          </DialogDescription>
        </header>
        <Tabs defaultValue={contentHelp ? "content" : "includes"} className="premium-detail-tabs">
          <TabsList className="premium-detail-tabs-list" aria-label={`Información de ${title}`}>
            <TabsTrigger value="includes">Incluye</TabsTrigger>
            <TabsTrigger value="content">Textos y fotos</TabsTrigger>
            <TabsTrigger value="process">Proceso y pago</TabsTrigger>
          </TabsList>
          <TabsContent value="includes" className="premium-detail-panel">
            <h3>
              {onePage
                ? "Todo lo esencial, en una página."
                : "Más espacio para contar lo que haces."}
            </h3>
            <ul>
              {inclusions.map((t) => (
                <li key={t}>
                  <Check aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            {!onePage && (
              <p className="premium-detail-note">
                Antes de contratar, confirmamos por escrito el contenido, dominio, hosting, plazo,
                pagos y funciones incluidas. Las funciones especiales se cotizan por separado.
              </p>
            )}
          </TabsContent>
          <TabsContent value="content" className="premium-detail-panel">
            <h3>
              {onePage
                ? "No necesitas llegar con todo preparado."
                : "Primero, definimos qué contar."}
            </h3>
            <p>
              {onePage
                ? "Cuéntanos qué hace tu negocio, qué servicios ofreces y cómo te contactan. Con esa información redactamos los textos comerciales de apoyo y seleccionamos imágenes acordes a tu sector."
                : "Organizamos contigo la información que corresponde a cada página. Si necesitas redacción o selección de imágenes, lo dejamos definido en el alcance antes de contratar."}
            </p>
            <div className="premium-detail-callout">
              <FileText aria-hidden="true" />
              <div>
                <h4>Tu negocio aporta lo que lo hace único</h4>
                <p>
                  Comparte tu logo, servicios, datos de contacto y fotos propias si las tienes.
                  Revisas que la información sea correcta antes de publicarla.
                </p>
              </div>
            </div>
            <p className="premium-detail-note">
              Las imágenes de apoyo no equivalen a una sesión fotográfica de tu negocio.
            </p>
          </TabsContent>
          <TabsContent value="process" className="premium-detail-panel">
            <h3>Sabes qué sucede en cada paso.</h3>
            <ol>
              <li>Nos compartes la información y acordamos el alcance.</li>
              <li>
                {onePage
                  ? "Acordamos el plazo de la propuesta según el alcance y tu información antes de iniciar."
                  : "Acordamos el plazo según el contenido y las funciones de las cuatro páginas."}
              </li>
              <li>
                {onePage
                  ? "Revisas la propuesta y hacemos una ronda de ajustes."
                  : "Revisamos contigo la propuesta según las condiciones acordadas."}
              </li>
              <li>Publicamos tras tu aprobación y el pago correspondiente.</li>
            </ol>
            <div className="premium-detail-callout">
              <ShieldCheck aria-hidden="true" />
              <div>
                <h4>
                  {onePage
                    ? "El saldo, después de tu aprobación"
                    : "Condiciones claras antes de pagar"}
                </h4>
                <p>
                  {onePage
                    ? `Empieza con ${offer.depositLabel}. Los ${offer.depositLabel} restantes se pagan al aprobar, antes de publicar. Puedes solicitar el enlace de pago con Wompi.`
                    : "Confirmamos la forma de pago y los conceptos incluidos antes de iniciar tu proyecto."}
                </p>
              </div>
            </div>
            {onePage && (
              <p className="premium-detail-note">
                El primer año de dominio y hosting cuenta desde su activación; se renuevan desde el
                segundo año al costo vigente del proveedor.
              </p>
            )}
          </TabsContent>
        </Tabs>
        <footer>
          <a
            className="premium-button premium-whatsapp"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            Quiero empezar con este plan
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a
            href="#condiciones"
            className="premium-dialog-conditions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar condiciones del servicio
          </a>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

export function CampaignPlanComparison() {
  const offer = useLandingOffer();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="premium-compare-trigger">
          ¿Qué formato me conviene?
          <ArrowRight aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className="premium-plan-dialog premium-comparison-dialog">
        <header>
          <p className="premium-dialog-eyebrow">ELIGE POR LO QUE NECESITAS CONTAR</p>
          <DialogTitle>Dos formatos. Una elección clara.</DialogTitle>
          <DialogDescription>
            La diferencia está en cómo organizas la información de tu negocio.
          </DialogDescription>
        </header>
        <div className="premium-comparison-scroll">
          <table>
            <caption className="sr-only">Comparación de los planes Black November</caption>
            <thead>
              <tr>
                <th>Tu web</th>
                <th>One Page</th>
                <th>Web empresarial</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Precio</th>
                <td>{offer.totalLabel}</td>
                <td>{formatCOP(BLACK_NOVEMBER.businessCOP)}</td>
              </tr>
              <tr>
                <th>Estructura</th>
                <td>1 página, hasta 5 secciones</td>
                <td>4 páginas: Inicio + 3 internas</td>
              </tr>
              <tr>
                <th>Te conviene si…</th>
                <td>Quieres reunir lo esencial y facilitar el contacto.</td>
                <td>Necesitas explicar tu empresa o tus servicios por separado.</td>
              </tr>
              <tr>
                <th>Dominio y hosting</th>
                <td>Primer año incluido</td>
                <td>Se confirma en el alcance</td>
              </tr>
              <tr>
                <th>Propuesta</th>
                <td>Según el plazo acordado en tu cotización y con el brief completo</td>
                <td>Plazo acordado según el proyecto</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="premium-detail-note">
          ¿Aún tienes dudas? Cuéntanos qué hace tu negocio y te orientamos antes de elegir.
        </p>
        <a
          className="premium-button premium-whatsapp"
          href={offer.whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon />
          Ayúdame a elegir mi web
          <ArrowUpRight aria-hidden="true" />
        </a>
      </DialogContent>
    </Dialog>
  );
}
