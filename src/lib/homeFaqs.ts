export interface HomeFaq {
  question: string;
  answer: string;
  category: "todos" | "alcance" | "propiedad" | "tiempos" | "consultoria";
  badge: string;
}

export const homeFaqs: HomeFaq[] = [
  {
    category: "alcance",
    badge: "Servicios & Alcance",
    question: "¿Puedo contratar un solo servicio o debe ser toda la estrategia conectada?",
    answer: "Puedes contratar diseño web, una tienda online, SEO, pauta en Google Ads o automatización de WhatsApp y CRM por separado. Si más adelante quieres conectar otros canales, revisamos la compatibilidad y los ajustes necesarios."
  },
  {
    category: "propiedad",
    badge: "Propiedad & Control",
    question: "¿Quién es el dueño del sitio web, el dominio y los accesos?",
    answer: "Tu empresa conserva el control de su sitio y los accesos acordados. La propuesta especifica la titularidad del dominio, el hosting, los archivos y las cuentas, además de las licencias de terceros que apliquen. Trabajamos sin cláusulas de permanencia."
  },
  {
    category: "propiedad",
    badge: "Claridad Comercial",
    question: "¿Qué pasa si en mi empresa no sabemos de programación ni de código técnico?",
    answer: "Te explicamos las decisiones en español claro y nos encargamos de la implementación acordada. Si el proyecto usa WordPress, tu equipo puede actualizar el contenido del sitio sin conocimientos avanzados de programación."
  },
  {
    category: "tiempos",
    badge: "Cronograma",
    question: "¿Cuánto tiempo toma tener mi sitio web o tienda en línea?",
    answer: "Acordamos el plazo antes de empezar, según el número de páginas, las integraciones y la disponibilidad de materiales. Web Express tiene sus propias condiciones. Para sitios empresariales y tiendas, la propuesta incluye las fechas de diseño, revisión y publicación."
  },
  {
    category: "consultoria",
    badge: "Primera Sesión",
    question: "¿Qué ocurre durante la consultoría gratuita de 20 minutos?",
    answer: "Es una sesión estratégica de diagnóstico comercial, 100% gratuita y sin compromiso. Analizamos qué presencia digital tienes hoy, cómo buscan tus clientes en Google y cómo llegan tus consultas por WhatsApp. Al finalizar, si decidimos trabajar juntos, te entregamos una propuesta con entregables, cronograma y precio fijo cerrado."
  }
];
