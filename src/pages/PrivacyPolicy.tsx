import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import ParticlesBackground from "@/components/ui/ParticlesBackground";
import "./editorial.css";

export default function PrivacyPolicy() {
  return (
    <div className="roicas-editorial">
      <SeoHead
        title="Política de Privacidad | ROICAS"
        description="Política de privacidad y tratamiento de datos personales de ROICAS. Consulta cómo recopilamos, usamos y protegemos tu información personal."
        canonical="https://roicas.com/politica-privacidad"
        noindex={true}
      />
      <Header />
      <main id="contenido-principal" tabIndex={-1}>
        <header className="red-hero red-hero-compact">
          <ParticlesBackground particleCount={20} speed={0.16} />
          <div className="section-container red-hero-content">
            <h1>Política de Privacidad</h1>
            <p>Última actualización: Enero 2025</p>
          </div>
        </header>
        <div className="section-container red-document">
          <div className="red-document-layout">
            <nav className="red-toc" aria-labelledby="privacy-contents">
              <h2 id="privacy-contents">En esta política</h2>
              <ol>
                <li><a href="#privacidad-1">Información General</a></li>
                <li><a href="#privacidad-2">Responsable del Tratamiento</a></li>
                <li><a href="#privacidad-3">Datos que Recopilamos</a></li>
                <li><a href="#privacidad-4">Finalidad del Tratamiento</a></li>
                <li><a href="#privacidad-5">Derechos del Titular (ARCO)</a></li>
                <li><a href="#privacidad-6">Transferencia de Datos</a></li>
                <li><a href="#privacidad-7">Seguridad de la Información</a></li>
                <li><a href="#privacidad-8">Cookies y Tecnologías Similares</a></li>
                <li><a href="#privacidad-9">Retención de Datos</a></li>
                <li><a href="#privacidad-10">Menores de Edad</a></li>
                <li><a href="#privacidad-11">Cambios a esta Política</a></li>
                <li><a href="#privacidad-12">Autoridad de Control</a></li>
                <li><a href="#privacidad-13">Contacto</a></li>
              </ol>
            </nav>
            <div className="red-document-text">
              <section id="privacidad-1">
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Información General</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ROICAS ("nosotros", "nuestro" o "la empresa") se compromete a proteger la privacidad de los 
                  usuarios de nuestro sitio web y servicios. Esta política describe cómo recopilamos, usamos, 
                  almacenamos y protegemos su información personal, en cumplimiento con la legislación colombiana, 
                  particularmente la <strong>Ley 1581 de 2012</strong> (Ley de Protección de Datos Personales) y 
                  el <strong>Decreto 1377 de 2013</strong>.
                </p>
              </section>
              <section id="privacidad-2">
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. Responsable del Tratamiento</h2>
                <p className="text-muted-foreground leading-relaxed">
                  El responsable del tratamiento de sus datos personales es ROICAS, con domicilio en Colombia.
                  Para cualquier consulta relacionada con el tratamiento de sus datos personales, puede 
                  contactarnos a través de nuestro formulario de contacto o correo electrónico oficial.
                </p>
              </section>
              <section id="privacidad-3">
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. Datos que Recopilamos</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Recopilamos los siguientes tipos de información:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Datos de identificación:</strong> Nombre completo, correo electrónico corporativo</li>
                  <li><strong>Datos de contacto:</strong> Número de teléfono, dirección de sitio web</li>
                  <li><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas</li>
                  <li><strong>Datos proporcionados voluntariamente:</strong> Información sobre sus retos comerciales y necesidades de marketing</li>
                </ul>
              </section>
              <section id="privacidad-4">
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Finalidad del Tratamiento</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Sus datos personales serán utilizados para:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Responder a sus solicitudes de información y consultoría</li>
                  <li>Enviar comunicaciones comerciales sobre nuestros servicios (con su consentimiento previo)</li>
                  <li>Mejorar nuestros servicios y experiencia del usuario</li>
                  <li>Cumplir con obligaciones legales y regulatorias</li>
                  <li>Gestionar la relación comercial con nuestros clientes</li>
                </ul>
              </section>
              <section id="privacidad-5">
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Derechos del Titular (ARCO)</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  De acuerdo con la Ley 1581 de 2012, usted tiene derecho a:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Acceso:</strong> Conocer qué datos personales tenemos sobre usted</li>
                  <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos</li>
                  <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos cuando ya no sean necesarios</li>
                  <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos para fines específicos</li>
                  <li><strong>Revocación:</strong> Revocar el consentimiento otorgado para el tratamiento</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Para ejercer estos derechos, puede contactarnos a través de nuestros canales oficiales. 
                  Responderemos a su solicitud dentro de los <strong>15 días hábiles</strong> establecidos por la ley.
                </p>
              </section>
              <section id="privacidad-6">
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Transferencia de Datos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Sus datos personales podrán ser transferidos a terceros proveedores de servicios que nos 
                  asistan en la prestación de nuestros servicios (como plataformas de email marketing o CRM), 
                  siempre garantizando niveles adecuados de protección de datos conforme a la normativa colombiana.
                  No vendemos ni compartimos sus datos con terceros para fines publicitarios sin su consentimiento.
                </p>
              </section>
              <section id="privacidad-7">
                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Seguridad de la Información</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Implementamos medidas técnicas, humanas y administrativas apropiadas para proteger sus datos 
                  personales contra acceso no autorizado, pérdida, alteración o destrucción. Utilizamos 
                  conexiones seguras (SSL/TLS), almacenamiento cifrado y controles de acceso estrictos.
                </p>
              </section>
              <section id="privacidad-8">
                <h2 className="text-2xl font-bold mb-4 text-foreground">8. Cookies y Tecnologías Similares</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos cookies y tecnologías similares para mejorar su experiencia de navegación, 
                  analizar el tráfico del sitio y personalizar el contenido. Puede configurar su navegador 
                  para rechazar cookies, aunque esto puede afectar la funcionalidad del sitio.
                </p>
              </section>
              <section id="privacidad-9">
                <h2 className="text-2xl font-bold mb-4 text-foreground">9. Retención de Datos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Conservamos sus datos personales únicamente durante el tiempo necesario para cumplir con 
                  las finalidades para las cuales fueron recopilados, o según lo exija la legislación aplicable.
                  Los datos de clientes se conservan durante la relación comercial y hasta 5 años después de 
                  su terminación para fines legales y contables.
                </p>
              </section>
              <section id="privacidad-10">
                <h2 className="text-2xl font-bold mb-4 text-foreground">10. Menores de Edad</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nuestros servicios están dirigidos a empresas y profesionales mayores de edad. No recopilamos 
                  intencionalmente datos de menores de 18 años. Si detectamos que hemos recopilado datos de 
                  un menor, procederemos a eliminarlos de inmediato.
                </p>
              </section>
              <section id="privacidad-11">
                <h2 className="text-2xl font-bold mb-4 text-foreground">11. Cambios a esta Política</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Nos reservamos el derecho de modificar esta política de privacidad en cualquier momento. 
                  Los cambios serán publicados en esta página con la fecha de actualización. Le recomendamos 
                  revisar periódicamente esta política.
                </p>
              </section>
              <section id="privacidad-12">
                <h2 className="text-2xl font-bold mb-4 text-foreground">12. Autoridad de Control</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Si considera que el tratamiento de sus datos personales vulnera la normativa vigente, 
                  puede presentar una queja ante la <strong>Superintendencia de Industria y Comercio (SIC)</strong>, 
                  autoridad competente en Colombia para la protección de datos personales.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  <strong>Superintendencia de Industria y Comercio</strong><br />
                  Sitio web: <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.sic.gov.co</a>
                </p>
              </section>
              <section id="privacidad-13">
                <h2 className="text-2xl font-bold mb-4 text-foreground">13. Contacto</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Para cualquier pregunta, solicitud o queja relacionada con esta política de privacidad 
                  o el tratamiento de sus datos personales, puede contactarnos a través de nuestro 
                  formulario de contacto en la sección correspondiente de este sitio web.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
