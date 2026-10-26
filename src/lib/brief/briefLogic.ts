import {
  BriefFormData,
  BriefLeadRecord,
  ComplexityHint,
  ProductType,
  RequestedFeature,
} from "@/types/brief";

// ── Human-readable labels dictionary ─────────────────────────────────────────

export const LABELS: Record<string, Record<string, string>> = {
  project_stage: {
    nuevo: "Idea o proyecto nuevo (desde cero)",
    ya_vendo_sin_tienda: "Ya vende en redes o WhatsApp (sin tienda web)",
    ya_tengo_tienda_y_quiero_renovar: "Ya tiene tienda y desea renovarla",
    quiero_migrar: "Desea migrar de plataforma actual",
  },
  product_type: {
    fisicos: "Productos físicos (con envío)",
    digitales: "Productos digitales (descargas)",
    servicios: "Servicios (citas/consultorías)",
    suscripciones: "Suscripciones o membresías",
  },
  sales_regions: {
    solo_colombia: "Solo en Colombia",
    colombia_y_otros_paises: "Colombia y otros países",
    solo_otros_paises: "Solo fuera de Colombia",
    por_definir: "Por definir todavía",
  },
  platform_preference: {
    necesito_recomendacion: "Necesita recomendación (WooCommerce o Shopify)",
    woocommerce: "WooCommerce (WordPress, control total)",
    shopify: "Shopify (rápido de operar)",
    otra: "Otra plataforma",
  },
  catalog_size: {
    "1_10": "1 a 10 productos",
    "11_30": "11 a 30 productos",
    "31_100": "31 a 100 productos",
    "101_500": "101 a 500 productos",
    mas_500: "Más de 500 productos",
    sin_definir: "Aún sin definir",
  },
  initial_upload: {
    ninguno_yo_los_cargo: "Ninguno, el cliente los cargará",
    "1_10": "1 a 10 productos de muestra",
    "11_30": "11 a 30 productos iniciales",
    "31_100": "31 a 100 productos iniciales",
    mas_100: "Más de 100 productos iniciales (alta carga)",
    sin_definir: "Por definir",
  },
  has_variations: {
    si: "Sí (tallas, colores, pesos, atributos)",
    no: "No (productos únicos y simples)",
    no_se: "No está seguro / algunas cosas sí",
  },
  content_readiness: {
    todo_listo: "Todo listo (fotos, textos y precios)",
    parcial: "Parcial (fotos o lista, falta organizar)",
    necesito_ayuda: "Necesita ayuda para crearlos o redactarlos",
  },
  stock_management: {
    si: "Sí, control de inventario en tiempo real",
    no: "No requiere control de stock",
    por_definir: "Por definir",
  },
  existing_catalog_format: {
    excel_csv: "En Excel o CSV estructurado",
    otra_plataforma: "En otra plataforma o software",
    no: "No tiene catálogo previo (desde cero)",
    no_se: "No está seguro",
  },
  payment_methods: {
    tarjetas_pse: "Tarjetas y PSE (en línea)",
    transferencia: "Transferencia bancaria / Nequi / Daviplata",
    contraentrega: "Pago contraentrega",
    pago_manual: "Acuerdo manual / WhatsApp",
    necesito_asesoria: "Necesita asesoría para elegir",
  },
  gateway_status: {
    si: "Sí, cuenta activa y verificada",
    no: "No, aún no la tiene",
    no_se: "No lo sabe con certeza",
  },
  gateway_provider: {
    wompi: "Wompi (Bancolombia)",
    mercado_pago: "Mercado Pago",
    payu: "PayU Latam",
    otra: "Otra pasarela",
    sin_preferencia: "Sin preferencia / La recomendada",
  },
  delivery_coverage: {
    misma_ciudad: "Misma ciudad (local)",
    colombia_nacional: "Toda Colombia (nacional)",
    internacional: "Envíos internacionales",
    recoger_en_tienda: "Recoger en punto físico / tienda",
    por_definir: "Por definir",
  },
  shipping_pricing: {
    tarifa_fija: "Tarifa fija o plana",
    por_ciudad_zona: "Por ciudad o departamento",
    por_peso: "Por peso y volumen",
    transportadora_automatica: "Cotización automática con transportadora",
    gratis: "Envío gratis incluido",
    por_definir: "Por definir",
  },
  carrier_integration: {
    si: "Sí, conectar transportadora (API/guías)",
    no: "No, gestión externa de guías",
    necesito_asesoria: "Necesita asesoría",
  },
  billing_integration: {
    si: "Sí, facturación electrónica integrada",
    no: "No por ahora",
    no_se: "No lo sabe aún",
  },
  brand_assets: {
    si_completo: "Manual de marca, logo HD y colores listos",
    parcial: "Logo básico o referencias",
    no: "No tiene, requiere creación de identidad",
  },
  design_goal: {
    practico_y_funcional: "Práctico y funcional (optimizado para ventas)",
    diferenciado_premium: "Diferenciado y premium (diseño exclusivo)",
    necesito_orientacion: "Requiere orientación de diseño",
  },
  requested_features: {
    cupones_promociones: "Cupones y promociones",
    whatsapp: "Chat WhatsApp de ventas",
    resenas: "Reseñas y valoraciones",
    filtros_avanzados: "Filtros avanzados por atributo",
    venta_mayorista: "Precios mayoristas / B2B",
    multiidioma_moneda: "Multiidioma y multimoneda",
    email_automatizado: "Emails automáticos post-venta",
    recuperar_carritos: "Recuperación de carritos abandonados",
    integracion_erp_pos: "Integración con ERP / POS",
    reservas: "Módulo de citas / reservas",
    otra: "Otra función especial",
    no_se: "Aún no lo sabe / Asesoría",
  },
  launch_target: {
    menos_1_mes: "Urgente (menos de 1 mes)",
    "1_2_meses": "En 1 a 2 meses (estándar)",
    "3_meses_o_mas": "En 3 meses o más (planificado)",
    sin_fecha: "Sin fecha definida / Por cotización",
  },
  budget_range: {
    menos_2m_cop: "Menos de $2.000.000 COP",
    "2_a_4m_cop": "$2.000.000 a $4.000.000 COP",
    "4_a_7m_cop": "$4.000.000 a $7.000.000 COP",
    mas_7m_cop: "Más de $7.000.000 COP",
    prefiero_no_indicar: "Prefiere no indicar / Espera propuesta",
  },
};

export function getLabel(category: string, key: string | null | undefined): string {
  if (!key) return "No especificado";
  return LABELS[category]?.[key] ?? key;
}

// ── Step Validation ──────────────────────────────────────────────────────────

export function isValidUrl(stringUrl: string): boolean {
  if (!stringUrl) return false;
  try {
    const withProtocol = stringUrl.startsWith("http://") || stringUrl.startsWith("https://")
      ? stringUrl
      : `https://${stringUrl}`;
    const url = new URL(withProtocol);
    return !!url.hostname && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateStep1(data: BriefFormData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const name = data.business_name.trim();
  if (!name) {
    errors.business_name = "Indica el nombre de tu marca o selecciona 'Aún no tengo nombre'.";
  } else if (name.length < 2) {
    errors.business_name = "El nombre debe tener al menos 2 caracteres.";
  } else if (name.length > 100) {
    errors.business_name = "El nombre no puede exceder 100 caracteres.";
  }

  if (!data.project_stage) {
    errors.project_stage = "Selecciona la etapa en la que se encuentra tu negocio.";
  }

  const needsCurrentUrl =
    data.project_stage === "ya_tengo_tienda_y_quiero_renovar" || data.project_stage === "quiero_migrar";
  if (needsCurrentUrl && !data.no_store_url_now) {
    const url = data.current_store_url.trim();
    if (!url) {
      errors.current_store_url = "Ingresa el enlace de tu tienda o marca 'No tengo el enlace ahora'.";
    } else if (!isValidUrl(url)) {
      errors.current_store_url = "Ingresa una dirección web válida (ej. mitienda.com).";
    }
  }

  if (!data.product_type || data.product_type.length === 0) {
    errors.product_type = "Selecciona al menos un tipo de producto que vas a vender.";
  }

  if (!data.sales_regions) {
    errors.sales_regions = "Selecciona dónde deseas vender.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep2(data: BriefFormData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.catalog_size) {
    errors.catalog_size = "Selecciona el tamaño aproximado de tu catálogo.";
  }

  if (!data.initial_upload) {
    errors.initial_upload = "Indica cuántos productos necesitas que publiquemos inicialmente.";
  }

  if (!data.has_variations) {
    errors.has_variations = "Indica si tus productos tienen variaciones (tallas, colores, etc.).";
  }

  if (!data.content_readiness) {
    errors.content_readiness = "Indica el estado de tus fotos, descripciones y precios.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep3(data: BriefFormData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.payment_methods || data.payment_methods.length === 0) {
    errors.payment_methods = "Selecciona al menos una forma de pago que desees recibir.";
  }

  if (data.payment_methods?.includes("tarjetas_pse") && !data.gateway_status) {
    errors.gateway_status = "Indica si ya tienes una pasarela de pago activa.";
  }

  const sellsPhysical = data.product_type?.includes("fisicos");
  if (sellsPhysical) {
    if (!data.delivery_coverage || data.delivery_coverage.length === 0) {
      errors.delivery_coverage = "Selecciona al menos una zona de cobertura de entregas.";
    }
    if (!data.shipping_pricing) {
      errors.shipping_pricing = "Selecciona cómo se calculará el valor de los envíos.";
    }
  }

  if (data.billing_integration === "si") {
    const sys = data.billing_system?.trim();
    if (!sys) {
      errors.billing_system = "Indica qué sistema contable o de facturación usas (o escribe 'Aún por definir').";
    } else if (sys.length > 150) {
      errors.billing_system = "El texto no puede exceder 150 caracteres.";
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep4(data: BriefFormData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.brand_assets) {
    errors.brand_assets = "Indica el estado de la identidad de tu marca (logo, colores).";
  }

  if (!data.design_goal) {
    errors.design_goal = "Selecciona el nivel o estilo de diseño que buscas.";
  }

  const needsIntegrationDetail =
    data.requested_features?.includes("integracion_erp_pos") || data.requested_features?.includes("otra");
  if (needsIntegrationDetail) {
    const detail = data.integration_details?.trim();
    if (!detail) {
      errors.integration_details =
        "Especifica el sistema a conectar o indica 'Aún no conozco el sistema'.";
    } else if (detail.length < 3) {
      errors.integration_details = "Por favor añade un poco más de contexto (mínimo 3 caracteres).";
    } else if (detail.length > 500) {
      errors.integration_details = "El detalle de integración no puede superar 500 caracteres.";
    }
  }

  if (data.special_requirements && data.special_requirements.length > 1000) {
    errors.special_requirements = "Los requerimientos especiales no pueden exceder 1000 caracteres.";
  }

  // Validate reference urls if filled
  if (data.reference_urls && data.reference_urls.length > 0) {
    data.reference_urls.forEach((url, index) => {
      const trimmed = url?.trim();
      if (trimmed && !isValidUrl(trimmed)) {
        errors[`reference_urls_${index}`] = `El enlace #${index + 1} no tiene un formato web válido.`;
      }
    });
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function validateStep5(data: BriefFormData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const name = data.contact_name?.trim();
  if (!name) {
    errors.contact_name = "Indica tu nombre de contacto.";
  } else if (name.length < 2) {
    errors.contact_name = "Tu nombre debe tener al menos 2 caracteres.";
  } else if (name.length > 100) {
    errors.contact_name = "Tu nombre no puede exceder 100 caracteres.";
  }

  const email = data.contact_email?.trim();
  if (!email) {
    errors.contact_email = "Indica tu correo electrónico para enviarte la propuesta.";
  } else if (!isValidEmail(email)) {
    errors.contact_email = "Ingresa un correo electrónico válido (ej. tu@empresa.com).";
  }

  const phone = data.contact_whatsapp?.trim();
  if (!phone) {
    errors.contact_whatsapp = "Indica tu número de WhatsApp para contacto rápido.";
  } else if (phone.replace(/\D/g, "").length < 7) {
    errors.contact_whatsapp = "Ingresa un número telefónico válido (mínimo 7 dígitos).";
  }

  if (!data.launch_target) {
    errors.launch_target = "Selecciona cuándo te gustaría tener la tienda funcionando.";
  }

  if (!data.privacy_consent) {
    errors.privacy_consent = "Debes autorizar el tratamiento de datos para procesar tu solicitud.";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// ── Multi-select Mutual Exclusion Helper ─────────────────────────────────────

export function toggleRequestedFeature(
  current: RequestedFeature[],
  clicked: RequestedFeature
): RequestedFeature[] {
  if (clicked === "no_se") {
    return current.includes("no_se") ? [] : ["no_se"];
  }
  const filtered = current.filter((f) => f !== "no_se");
  if (filtered.includes(clicked)) {
    return filtered.filter((f) => f !== clicked);
  }
  return [...filtered, clicked];
}

// ── Complexity Calculation (Orientation signal, never pricing) ───────────────

export function calculateComplexityHint(data: BriefFormData): {
  complexity_hint: ComplexityHint;
  effort_flags: string[];
  pending_points: string[];
} {
  const effort_flags: string[] = [];
  const pending_points: string[] = [];

  // Critical indicators for ALTA
  const isMigration = data.project_stage === "quiero_migrar";
  const hasErpPos = data.requested_features?.includes("integracion_erp_pos");
  const hasWholesale = data.requested_features?.includes("venta_mayorista");
  const hasMultiCurrency = data.requested_features?.includes("multiidioma_moneda");
  const hasHighUpload = data.initial_upload === "mas_100";
  const hasAutoCarrier = data.shipping_pricing === "transportadora_automatica";
  const hasBilling = data.billing_integration === "si";
  const hasSubscriptions = data.product_type?.includes("suscripciones");

  if (isMigration) effort_flags.push("migracion_plataforma");
  if (hasErpPos) effort_flags.push("integracion_erp_pos");
  if (hasWholesale) effort_flags.push("venta_mayorista_b2b");
  if (hasMultiCurrency) effort_flags.push("multiidioma_multimoneda");
  if (hasHighUpload) effort_flags.push("mas_100_productos_carga");
  if (hasAutoCarrier) effort_flags.push("transportadora_automatica_api");
  if (hasBilling) effort_flags.push("facturacion_electronica");
  if (hasSubscriptions) effort_flags.push("modelo_suscripciones");
  if (data.sales_regions === "colombia_y_otros_paises" || data.sales_regions === "solo_otros_paises") {
    effort_flags.push("ventas_internacionales");
  }
  if (data.has_variations === "si") effort_flags.push("variaciones_producto");
  if (data.content_readiness === "necesito_ayuda") effort_flags.push("creacion_contenido_desde_cero");

  // Pending points detection
  if (data.business_name.toLowerCase().includes("aún no") || data.business_name.toLowerCase().includes("no tengo")) {
    pending_points.push("Nombre de marca pendiente de definición");
  }
  if (data.platform_preference === "necesito_recomendacion") {
    pending_points.push("Plataforma por recomendar (WooCommerce vs Shopify)");
  }
  if (data.catalog_size === "sin_definir") {
    pending_points.push("Tamaño de catálogo total sin definir");
  }
  if (data.initial_upload === "sin_definir") {
    pending_points.push("Cantidad de carga inicial de productos sin definir");
  }
  if (data.has_variations === "no_se") {
    pending_points.push("Estructura de variaciones por confirmar");
  }
  if (data.content_readiness === "parcial") {
    pending_points.push("Contenido parcial (faltan fotos/textos finales)");
  }
  if (data.stock_management === "por_definir") {
    pending_points.push("Control de inventario por definir");
  }
  if (data.payment_methods?.includes("necesito_asesoria")) {
    pending_points.push("Métodos de pago requieren asesoría");
  }
  if (data.gateway_status === "no" || data.gateway_status === "no_se") {
    pending_points.push("Pasarela de pagos en línea sin activar");
  }
  if (data.product_type?.includes("fisicos")) {
    if (data.delivery_coverage?.includes("por_definir")) {
      pending_points.push("Cobertura de entregas por definir");
    }
    if (data.shipping_pricing === "por_definir") {
      pending_points.push("Cálculo de costos de envío por definir");
    }
    if (data.carrier_integration === "necesito_asesoria") {
      pending_points.push("Conexión con transportadoras requiere asesoría");
    }
  }
  if (data.billing_integration === "no_se") {
    pending_points.push("Integración de facturación electrónica por aclarar");
  }
  if (data.brand_assets === "no" || data.brand_assets === "parcial") {
    pending_points.push("Activos de diseño o branding parciales/faltantes");
  }
  if (data.design_goal === "necesito_orientacion") {
    pending_points.push("Nivel de diseño pendiente de orientación comercial");
  }
  if (data.requested_features?.includes("no_se")) {
    pending_points.push("Funcionalidades especiales por auditar");
  }
  if (data.launch_target === "sin_fecha") {
    pending_points.push("Fecha límite de lanzamiento sin definir");
  }

  // Complexity evaluation
  let complexity_hint: ComplexityHint = "basica";

  const isHigh =
    (isMigration && (hasErpPos || hasBilling || hasHighUpload)) ||
    hasHighUpload ||
    hasErpPos ||
    (hasAutoCarrier && data.sales_regions === "colombia_y_otros_paises") ||
    hasWholesale ||
    hasMultiCurrency;

  const isMedium =
    data.initial_upload === "31_100" ||
    (data.has_variations === "si" && data.requested_features?.includes("cupones_promociones")) ||
    data.sales_regions === "colombia_y_otros_paises" ||
    data.catalog_size === "101_500" ||
    data.catalog_size === "mas_500" ||
    hasSubscriptions ||
    (data.payment_methods?.includes("tarjetas_pse") && data.gateway_status === "no");

  const hasTooManyUnknowns = pending_points.length >= 5;

  if (hasTooManyUnknowns) {
    complexity_hint = "requiere_revision";
  } else if (isHigh) {
    complexity_hint = "alta";
  } else if (isMedium) {
    complexity_hint = "intermedia";
  } else {
    complexity_hint = "basica";
  }

  return { complexity_hint, effort_flags, pending_points };
}

// ── Lead Sanitizer: cleans conditional values before saving ───────────────────

export function sanitizeFormData(data: BriefFormData): BriefFormData {
  const clean = { ...data };

  // If stage does not require url, clean it
  const isRenovationOrMigration =
    clean.project_stage === "ya_tengo_tienda_y_quiero_renovar" || clean.project_stage === "quiero_migrar";
  if (!isRenovationOrMigration) {
    clean.current_store_url = "";
    clean.no_store_url_now = false;
  }

  // If regions don't include international, clean target countries
  if (clean.sales_regions === "solo_colombia" || clean.sales_regions === "por_definir") {
    clean.target_countries = "";
  }

  // If platform is not "otra", clean other name
  if (clean.platform_preference !== "otra") {
    clean.other_platform_name = "";
  }

  // If payment methods don't include PSE/cards, clean gateway fields
  if (!clean.payment_methods?.includes("tarjetas_pse")) {
    clean.gateway_status = "";
    clean.gateway_provider = "";
  }

  // If does not sell physical products, clean physical logistics
  if (!clean.product_type?.includes("fisicos")) {
    clean.delivery_coverage = [];
    clean.shipping_pricing = "";
    clean.carrier_integration = "";
  }

  // If does not have subscriptions, clean details
  if (!clean.product_type?.includes("suscripciones")) {
    clean.subscription_details = "";
  }

  // If does not have services, clean booking
  if (!clean.product_type?.includes("servicios")) {
    clean.booking_needed = "";
  }

  // If billing integration is not yes, clean billing system
  if (clean.billing_integration !== "si") {
    clean.billing_system = "";
  }

  // If no erp/pos or 'otra' in requested features, clean integration details
  const hasIntegration =
    clean.requested_features?.includes("integracion_erp_pos") || clean.requested_features?.includes("otra");
  if (!hasIntegration) {
    clean.integration_details = "";
  }

  return clean;
}

// ── Lead Record Builder (matches Section 8 schema) ───────────────────────────

export function buildLeadRecord(data: BriefFormData, leadId?: string): BriefLeadRecord {
  const sanitized = sanitizeFormData(data);
  const now = new Date().toISOString();
  const id = leadId || `ROI-EC-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString(36).toUpperCase()}`;

  const { complexity_hint, effort_flags, pending_points } = calculateComplexityHint(sanitized);

  const cleanPrefix = sanitized.contact_phone_prefix || "+57";
  const cleanPhone = sanitized.contact_whatsapp.trim();
  const fullWhatsapp = `${cleanPrefix} ${cleanPhone}`.trim();

  const record: BriefLeadRecord = {
    lead_id: id,
    created_at: now,
    source: "brief_tienda_online",
    schema_version: "1.0",
    business: {
      business_name: sanitized.business_name.trim(),
      project_stage: sanitized.project_stage as BriefLeadRecord["business"]["project_stage"],
      current_store_url: sanitized.no_store_url_now
        ? "No disponible al momento"
        : sanitized.current_store_url.trim() || null,
      product_type: sanitized.product_type,
      sales_regions: sanitized.sales_regions as BriefLeadRecord["business"]["sales_regions"],
      target_countries: sanitized.target_countries?.trim() || null,
      platform_preference: sanitized.platform_preference,
      other_platform_name: sanitized.other_platform_name?.trim() || null,
    },
    catalog: {
      catalog_size: sanitized.catalog_size as BriefLeadRecord["catalog"]["catalog_size"],
      initial_upload: sanitized.initial_upload as BriefLeadRecord["catalog"]["initial_upload"],
      has_variations: sanitized.has_variations as BriefLeadRecord["catalog"]["has_variations"],
      content_readiness: sanitized.content_readiness as BriefLeadRecord["catalog"]["content_readiness"],
      stock_management: sanitized.stock_management as BriefLeadRecord["catalog"]["stock_management"],
      existing_catalog_format: sanitized.existing_catalog_format as BriefLeadRecord["catalog"]["existing_catalog_format"],
    },
    operations: {
      payment_methods: sanitized.payment_methods,
      gateway_status: (sanitized.gateway_status as BriefLeadRecord["operations"]["gateway_status"]) || null,
      gateway_provider: (sanitized.gateway_provider as BriefLeadRecord["operations"]["gateway_provider"]) || null,
      delivery_coverage: sanitized.delivery_coverage?.length ? sanitized.delivery_coverage : null,
      shipping_pricing: (sanitized.shipping_pricing as BriefLeadRecord["operations"]["shipping_pricing"]) || null,
      carrier_integration: (sanitized.carrier_integration as BriefLeadRecord["operations"]["carrier_integration"]) || null,
      billing_integration: (sanitized.billing_integration as BriefLeadRecord["operations"]["billing_integration"]) || "no",
      billing_system: sanitized.billing_system?.trim() || null,
      subscription_details: sanitized.subscription_details?.trim() || null,
      booking_needed: (sanitized.booking_needed as BriefLeadRecord["operations"]["booking_needed"]) || null,
    },
    design: {
      brand_assets: sanitized.brand_assets as BriefLeadRecord["design"]["brand_assets"],
      design_goal: sanitized.design_goal as BriefLeadRecord["design"]["design_goal"],
      reference_urls: (sanitized.reference_urls || []).filter((u) => u?.trim()),
      requested_features: sanitized.requested_features || [],
      integration_details: sanitized.integration_details?.trim() || null,
      special_requirements: sanitized.special_requirements?.trim() || "",
    },
    contact: {
      contact_name: sanitized.contact_name.trim(),
      contact_email: sanitized.contact_email.trim().toLowerCase(),
      contact_phone_prefix: cleanPrefix,
      contact_whatsapp: cleanPhone,
      full_whatsapp: fullWhatsapp,
      launch_target: sanitized.launch_target as BriefLeadRecord["contact"]["launch_target"],
      budget_range: (sanitized.budget_range as BriefLeadRecord["contact"]["budget_range"]) || "prefiero_no_indicar",
    },
    consent: {
      accepted: sanitized.privacy_consent,
      accepted_at: now,
      privacy_policy_version: "2025.1",
    },
    internal: {
      complexity_hint,
      effort_flags,
      pending_points,
      notification_status: "notification_pending",
      notification_attempts: 0,
      last_notification_attempt_at: null,
      recipient_email: "herebus_cas@hotmail.com",
      sender_email: "ventas@roicas.com",
    },
  };

  record.summary_text = buildInternalTextSummary(record);
  return record;
}

// ── Plain Text Summary for Internal Review & CRM Notes ───────────────────────

export function buildInternalTextSummary(lead: BriefLeadRecord): string {
  const b = lead.business;
  const c = lead.catalog;
  const o = lead.operations;
  const d = lead.design;
  const ct = lead.contact;
  const i = lead.internal;

  return `
============================================================
ROICAS - BRIEF DE COTIZACIÓN DE TIENDA ONLINE
ID: ${lead.lead_id} | Fecha: ${new Date(lead.created_at).toLocaleString("es-CO")}
Complejidad estimada: [${i.complexity_hint.toUpperCase()}]
============================================================

1. CONTACTO Y LEAD
------------------------------------------------------------
Nombre: ${ct.contact_name}
Email: ${ct.contact_email}
WhatsApp: ${ct.full_whatsapp} (Chat directo: https://wa.me/${ct.full_whatsapp.replace(/\D/g, "")})
Plazo deseado: ${getLabel("launch_target", ct.launch_target)}
Rango presupuesto: ${getLabel("budget_range", ct.budget_range)}

2. NEGOCIO Y ALCANCE
------------------------------------------------------------
Marca / Negocio: ${b.business_name}
Etapa: ${getLabel("project_stage", b.project_stage)}
Tienda actual: ${b.current_store_url || "N/A"}
Tipos de producto: ${b.product_type.map((p) => getLabel("product_type", p)).join(", ")}
Región de venta: ${getLabel("sales_regions", b.sales_regions)}${b.target_countries ? ` (${b.target_countries})` : ""}
Plataforma sugerida por cliente: ${getLabel("platform_preference", b.platform_preference)}${b.other_platform_name ? ` (${b.other_platform_name})` : ""}

3. CATÁLOGO Y CARGA
------------------------------------------------------------
Catálogo total estimado: ${getLabel("catalog_size", c.catalog_size)}
Carga inicial requerida a ROICAS: ${getLabel("initial_upload", c.initial_upload)}
Variaciones (tallas/colores): ${getLabel("has_variations", c.has_variations)}
Estado de fotos y descripciones: ${getLabel("content_readiness", c.content_readiness)}
Control de inventario en tienda: ${getLabel("stock_management", c.stock_management)}
Formato previo existente: ${getLabel("existing_catalog_format", c.existing_catalog_format)}

4. PAGOS, LOGÍSTICA Y FACTURACIÓN
------------------------------------------------------------
Métodos de cobro: ${o.payment_methods.map((p) => getLabel("payment_methods", p)).join(", ")}
Pasarela activa: ${getLabel("gateway_status", o.gateway_status)}
Pasarela preferida: ${getLabel("gateway_provider", o.gateway_provider)}
Cobertura envíos físicos: ${o.delivery_coverage ? o.delivery_coverage.map((dc) => getLabel("delivery_coverage", dc)).join(", ") : "N/A (no físicos)"}
Cálculo de envío: ${getLabel("shipping_pricing", o.shipping_pricing)}
Conexión transportadora: ${getLabel("carrier_integration", o.carrier_integration)}
Facturación electrónica: ${getLabel("billing_integration", o.billing_integration)}${o.billing_system ? ` - Sistema: ${o.billing_system}` : ""}
${o.subscription_details ? `Detalle suscripciones: ${o.subscription_details}\n` : ""}${o.booking_needed ? `Sistema de reservas: ${o.booking_needed}\n` : ""}

5. DISEÑO, FUNCIONALIDADES E INTEGRACIONES
------------------------------------------------------------
Identidad de marca: ${getLabel("brand_assets", d.brand_assets)}
Nivel de diseño: ${getLabel("design_goal", d.design_goal)}
Tiendas de referencia: ${d.reference_urls.length > 0 ? d.reference_urls.join(", ") : "Ninguna indicada"}
Funciones solicitadas: ${d.requested_features.map((f) => getLabel("requested_features", f)).join(", ")}
${d.integration_details ? `Detalle integración ERP/POS/Otro: ${d.integration_details}\n` : ""}Requerimientos especiales: ${d.special_requirements || "Ninguno indicado"}

6. ALERTAS DE ESFUERZO COMERCIAL
------------------------------------------------------------
${i.effort_flags.length > 0 ? i.effort_flags.map((f) => `• [ALERTA] ${f}`).join("\n") : "• Ningún factor de alta complejidad detectado"}

7. PUNTOS POR CONFIRMAR EN DESCUBRIMIENTO
------------------------------------------------------------
${i.pending_points.length > 0 ? i.pending_points.map((p) => `? ${p}`).join("\n") : "✓ El cliente definió todos los parámetros clave"}
============================================================
`.trim();
}

// ── Rich HTML Email Body for Internal Dispatch ───────────────────────────────

export function buildEmailHtmlBody(lead: BriefLeadRecord): string {
  const b = lead.business;
  const c = lead.catalog;
  const o = lead.operations;
  const d = lead.design;
  const ct = lead.contact;
  const i = lead.internal;

  const phoneDigits = ct.full_whatsapp.replace(/\D/g, "");
  const waUrl = `https://wa.me/${phoneDigits}?text=Hola%20${encodeURIComponent(ct.contact_name)},%20te%20escribimos%20de%20ROICAS%20sobre%20tu%20solicitud%20para%20${encodeURIComponent(b.business_name)}.`;

  const complexityColor =
    i.complexity_hint === "alta"
      ? "#DC2626"
      : i.complexity_hint === "intermedia"
      ? "#D97706"
      : i.complexity_hint === "requiere_revision"
      ? "#7C3AED"
      : "#059669";

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Nuevo Brief de Cotización E-commerce</title>
</head>
<body style="margin: 0; padding: 24px; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #F8F7F4; color: #1E232A;">
  <div style="max-width: 680px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E5E4E0; overflow: hidden; box-shadow: 0 4px 18px rgba(0,0,0,0.06);">
    
    <!-- Header -->
    <div style="background-color: #1A1A1A; padding: 28px 32px; color: #FFFFFF;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: #D32F2F; font-weight: 700;">ROICAS · Growth Engine</span>
        <span style="background-color: ${complexityColor}; color: #FFFFFF; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
          Complejidad: ${i.complexity_hint}
        </span>
      </div>
      <h1 style="margin: 0 0 6px 0; font-size: 24px; font-weight: 700; color: #FFFFFF;">
        Nueva Cotización: ${b.business_name}
      </h1>
      <p style="margin: 0; font-size: 14px; color: #A0A0A0;">
        Ref: <strong>${lead.lead_id}</strong> · Recibido el ${new Date(lead.created_at).toLocaleString("es-CO")}
      </p>
    </div>

    <!-- Quick Action Contact Card -->
    <div style="padding: 24px 32px; background: #FFF9F9; border-bottom: 1px solid #F0DCDC;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #B91C1C;">Datos de Contacto Rápido</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; width: 140px; color: #666;">Nombre:</td>
          <td style="padding: 6px 0; font-weight: 600;">${ct.contact_name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666;">WhatsApp:</td>
          <td style="padding: 6px 0;">
            <a href="${waUrl}" style="background-color: #25D366; color: #FFFFFF; text-decoration: none; padding: 6px 14px; border-radius: 6px; font-weight: 600; display: inline-block;">
              Abrir Chat WhatsApp (${ct.full_whatsapp})
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666;">Email:</td>
          <td style="padding: 6px 0;">
            <a href="mailto:${ct.contact_email}" style="color: #B91C1C; text-decoration: underline; font-weight: 600;">
              ${ct.contact_email}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666;">Plazo de lanzamiento:</td>
          <td style="padding: 6px 0; font-weight: 600;">${getLabel("launch_target", ct.launch_target)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666;">Presupuesto estimado:</td>
          <td style="padding: 6px 0; font-weight: 600;">${getLabel("budget_range", ct.budget_range)}</td>
        </tr>
      </table>
    </div>

    <!-- Content Sections -->
    <div style="padding: 28px 32px;">
      
      <!-- Section 1 -->
      <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #111; border-bottom: 2px solid #E5E4E0; padding-bottom: 4px;">
          1. Negocio y Alcance
        </h4>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Etapa:</strong> ${getLabel("project_stage", b.project_stage)}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Tienda actual:</strong> ${b.current_store_url ? `<a href="${b.current_store_url}" target="_blank">${b.current_store_url}</a>` : "N/A"}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Productos:</strong> ${b.product_type.map((p) => getLabel("product_type", p)).join(", ")}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Regiones de venta:</strong> ${getLabel("sales_regions", b.sales_regions)}${b.target_countries ? ` (${b.target_countries})` : ""}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Plataforma preferida:</strong> ${getLabel("platform_preference", b.platform_preference)}${b.other_platform_name ? ` (${b.other_platform_name})` : ""}</p>
      </div>

      <!-- Section 2 -->
      <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #111; border-bottom: 2px solid #E5E4E0; padding-bottom: 4px;">
          2. Catálogo y Carga Inicial
        </h4>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Catálogo total:</strong> ${getLabel("catalog_size", c.catalog_size)}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #B91C1C;"><strong>Carga inicial requerida a ROICAS:</strong> <strong>${getLabel("initial_upload", c.initial_upload)}</strong></p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Tiene variaciones:</strong> ${getLabel("has_variations", c.has_variations)}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Fotos y descripciones:</strong> ${getLabel("content_readiness", c.content_readiness)}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Control de stock:</strong> ${getLabel("stock_management", c.stock_management)}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Catálogo existente:</strong> ${getLabel("existing_catalog_format", c.existing_catalog_format)}</p>
      </div>

      <!-- Section 3 -->
      <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #111; border-bottom: 2px solid #E5E4E0; padding-bottom: 4px;">
          3. Pagos, Envíos y Facturación
        </h4>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Métodos de cobro:</strong> ${o.payment_methods.map((p) => getLabel("payment_methods", p)).join(", ")}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Pasarela activa:</strong> ${getLabel("gateway_status", o.gateway_status)} (Proveedor: ${getLabel("gateway_provider", o.gateway_provider)})</p>
        ${o.delivery_coverage ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Cobertura entregas:</strong> ${o.delivery_coverage.map((dc) => getLabel("delivery_coverage", dc)).join(", ")}</p>` : ""}
        ${o.shipping_pricing ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Cálculo de envío:</strong> ${getLabel("shipping_pricing", o.shipping_pricing)}</p>` : ""}
        ${o.carrier_integration ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Integración transportadora:</strong> ${getLabel("carrier_integration", o.carrier_integration)}</p>` : ""}
        <p style="margin: 4px 0; font-size: 13px;"><strong>Facturación electrónica:</strong> ${getLabel("billing_integration", o.billing_integration)}${o.billing_system ? ` (${o.billing_system})` : ""}</p>
        ${o.subscription_details ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Suscripciones:</strong> ${o.subscription_details}</p>` : ""}
        ${o.booking_needed ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Reservas/Citas:</strong> ${o.booking_needed}</p>` : ""}
      </div>

      <!-- Section 4 -->
      <div style="margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #111; border-bottom: 2px solid #E5E4E0; padding-bottom: 4px;">
          4. Diseño y Funcionalidades
        </h4>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Identidad de marca:</strong> ${getLabel("brand_assets", d.brand_assets)}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Nivel de diseño:</strong> ${getLabel("design_goal", d.design_goal)}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Referencias:</strong> ${d.reference_urls.length > 0 ? d.reference_urls.join(", ") : "Ninguna"}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Funciones requeridas:</strong> ${d.requested_features.map((f) => getLabel("requested_features", f)).join(", ")}</p>
        ${d.integration_details ? `<p style="margin: 4px 0; font-size: 13px; color: #B91C1C;"><strong>Integración externa:</strong> ${d.integration_details}</p>` : ""}
        ${d.special_requirements ? `<p style="margin: 4px 0; font-size: 13px; background: #F4F4F4; padding: 8px 12px; border-radius: 6px;"><strong>Notas especiales:</strong> ${d.special_requirements}</p>` : ""}
      </div>

      <!-- Flags & Pending Alerts -->
      <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 14px 18px; border-radius: 4px; margin-bottom: 18px;">
        <h5 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #92400E; text-transform: uppercase;">
          Alertas de Esfuerzo (${i.effort_flags.length})
        </h5>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #78350F;">
          ${i.effort_flags.length > 0 ? i.effort_flags.map((f) => `<li>${f}</li>`).join("") : "<li>Estándar, sin factores atípicos.</li>"}
        </ul>
      </div>

      <div style="background-color: #EDE9FE; border-left: 4px solid #7C3AED; padding: 14px 18px; border-radius: 4px;">
        <h5 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #5B21B6; text-transform: uppercase;">
          Puntos por Confirmar en Llamada / Propuesta (${i.pending_points.length})
        </h5>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #4C1D95;">
          ${i.pending_points.length > 0 ? i.pending_points.map((p) => `<li>${p}</li>`).join("") : "<li>Todos los puntos esenciales quedaron respondidos.</li>"}
        </ul>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #F8F7F4; border-top: 1px solid #E5E4E0; padding: 18px 32px; font-size: 12px; color: #888; text-align: center;">
      Este correo fue generado automáticamente por el motor de briefs de <strong>ROICAS</strong>.<br>
      Enviado desde ventas@roicas.com para herebus_cas@hotmail.com.
    </div>

  </div>
</body>
</html>
`.trim();
}
