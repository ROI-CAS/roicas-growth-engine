import { escapeHtml as e } from "./http";

// Consistent outline icons; decorative alongside visible labels.
const paths = {
  timer: '<circle cx="12" cy="14" r="8"/><path d="M9 2h6M12 6v-4M12 10v4l3 2"/>',
  pulse: '<path d="M2 12h5l3-8 4 16 3-8h5"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  cart: '<path d="M2 3h3l3 13h11l3-9H6M9 21h.01M18 21h.01"/>',
  link: '<path d="m10 14 4-4M8 16l-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(2 0) scale(.85 1)"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  speed: '<path d="M4 19a10 10 0 1 1 16 0M12 4v2M4 12h2M18 12h2M12 16l5-8"/>',
  code: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 8h18M8 12l-3 3 3 3M16 12l3 3-3 3M13 11l-2 8"/>',
  shield:
    '<path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Z"/><path d="m8 12 3 3 5-6"/>',
  form: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 8h18M7 12h7M7 16h4"/>',
  wrench:
    '<path d="M14 6a5 5 0 0 0-6 6L3 17a3 3 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-3 3-4-4Z"/>',
  chart: '<path d="M4 20V10h4v10M10 20V6h4v14M16 20V2h4v18"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/>',
  monitor: '<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4M8 8h8M8 12h4"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  plug: '<path d="M8 3v5M16 3v5M6 8h12v3a6 6 0 0 1-12 0ZM12 17v4"/>',
};
export function icon(name: keyof typeof paths): string {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
const illustrations = {
  "hero-laptop": {
    width: 1536,
    height: 1024,
    widths: [768, 1280],
    sizes: "(min-width: 1000px) 700px, (min-width: 760px) 50vw, 100vw",
  },
  "servicio-velocidad": {
    width: 1254,
    height: 1254,
    widths: [320, 640],
    sizes: "(min-width: 760px) 180px, 130px",
  },
  "servicio-errores": {
    width: 1254,
    height: 1254,
    widths: [320, 640],
    sizes: "(min-width: 760px) 180px, 130px",
  },
  "servicio-seguridad": {
    width: 1254,
    height: 1254,
    widths: [320, 640],
    sizes: "(min-width: 760px) 180px, 130px",
  },
  "servicio-formularios": {
    width: 1254,
    height: 1254,
    widths: [320, 640],
    sizes: "(min-width: 760px) 180px, 130px",
  },
  "diagnostico-informe": {
    width: 1254,
    height: 1254,
    widths: [640, 960],
    sizes: "(min-width: 1000px) 530px, (min-width: 760px) 45vw, 90vw",
  },
};
export function illustration(name: keyof typeof illustrations): string {
  const meta = illustrations[name];
  const hero = name === "hero-laptop";
  const revision = hero ? "?v=20261017-2" : "";
  return `<picture><source type="image/webp" srcset="${meta.widths.map((w) => `/assets/illustrations/${name}-${w}.webp${revision} ${w}w`).join(", ")}" sizes="${meta.sizes}"><img src="/assets/illustrations/${name}.png${revision}" width="${meta.width}" height="${meta.height}" alt="" decoding="async" ${hero ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'}></picture>`;
}
export function serviceCards(): string {
  const cards = [
    {
      title: "Carga lenta",
      icon: "timer" as const,
      image: "servicio-velocidad" as const,
      text: "Revisión de rendimiento en móvil y PC y oportunidades de optimización.",
      details: "",
    },
    {
      title: "Errores y caídas",
      icon: "pulse" as const,
      image: "servicio-errores" as const,
      text: "Revisión de fallas, plugins y actualizaciones. La causa interna puede requerir acceso autorizado.",
      details:
        '<details class="technical-details"><summary>Errores que revisamos</summary><ul><li>Pantalla blanca de la muerte (WSOD)</li><li>Error al establecer conexión con la base de datos</li><li>Error fatal tras actualizar temas o plugins</li><li>Error 500 Internal Server Error</li></ul></details>',
    },
    {
      title: "Seguridad",
      icon: "lock" as const,
      image: "servicio-seguridad" as const,
      text: "Inspección específica según el problema detectado. La revisión inicial no confirma malware ni vulnerabilidades internas.",
      details: "",
    },
    {
      title: "Enlaces rotos y errores 404",
      icon: "search" as const,
      image: "servicio-formularios" as const,
      text: "Revisamos las páginas examinadas para identificar enlaces que no abren, errores 404 y recursos que no cargan.",
      details: "",
    },
  ];
  return cards
    .map(
      (c) =>
        `<article class="problem service-card">${illustration(c.image)}<div>${icon(c.icon)}<h3>${e(c.title)}</h3><p>${e(c.text)}</p>${c.details}</div></article>`,
    )
    .join("");
}
