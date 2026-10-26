// Schema & Type definitions for ROICAS E-commerce Brief

export type ProjectStage =
  | "nuevo"
  | "ya_vendo_sin_tienda"
  | "ya_tengo_tienda_y_quiero_renovar"
  | "quiero_migrar";

export type ProductType = "fisicos" | "digitales" | "servicios" | "suscripciones";

export type SalesRegion =
  | "solo_colombia"
  | "colombia_y_otros_paises"
  | "solo_otros_paises"
  | "por_definir";

export type PlatformPreference =
  | "necesito_recomendacion"
  | "woocommerce"
  | "shopify"
  | "otra";

export type CatalogSize =
  | "1_10"
  | "11_30"
  | "31_100"
  | "101_500"
  | "mas_500"
  | "sin_definir";

export type InitialUpload =
  | "ninguno_yo_los_cargo"
  | "1_10"
  | "11_30"
  | "31_100"
  | "mas_100"
  | "sin_definir";

export type HasVariations = "si" | "no" | "no_se";

export type ContentReadiness = "todo_listo" | "parcial" | "necesito_ayuda";

export type StockManagement = "si" | "no" | "por_definir";

export type ExistingCatalogFormat = "excel_csv" | "otra_plataforma" | "no" | "no_se";

export type PaymentMethod =
  | "tarjetas_pse"
  | "transferencia"
  | "contraentrega"
  | "pago_manual"
  | "necesito_asesoria";

export type GatewayStatus = "si" | "no" | "no_se";

export type GatewayProvider =
  | "wompi"
  | "mercado_pago"
  | "payu"
  | "otra"
  | "sin_preferencia";

export type DeliveryCoverage =
  | "misma_ciudad"
  | "colombia_nacional"
  | "internacional"
  | "recoger_en_tienda"
  | "por_definir";

export type ShippingPricing =
  | "tarifa_fija"
  | "por_ciudad_zona"
  | "por_peso"
  | "transportadora_automatica"
  | "gratis"
  | "por_definir";

export type CarrierIntegration = "si" | "no" | "necesito_asesoria";

export type BillingIntegration = "si" | "no" | "no_se";

export type BrandAssets = "si_completo" | "parcial" | "no";

export type DesignGoal =
  | "practico_y_funcional"
  | "diferenciado_premium"
  | "necesito_orientacion";

export type RequestedFeature =
  | "cupones_promociones"
  | "whatsapp"
  | "resenas"
  | "filtros_avanzados"
  | "venta_mayorista"
  | "multiidioma_moneda"
  | "email_automatizado"
  | "recuperar_carritos"
  | "integracion_erp_pos"
  | "reservas"
  | "otra"
  | "no_se";

export type LaunchTarget =
  | "menos_1_mes"
  | "1_2_meses"
  | "3_meses_o_mas"
  | "sin_fecha";

export type BudgetRange =
  | "menos_2m_cop"
  | "2_a_4m_cop"
  | "4_a_7m_cop"
  | "mas_7m_cop"
  | "prefiero_no_indicar";

export type ComplexityHint = "basica" | "intermedia" | "alta" | "requiere_revision";

export type NotificationStatus = "sent" | "notification_pending" | "failed";

// Form State across the 5 steps
export interface BriefFormData {
  additional_answers?: Record<string, string>;
  // Step 1: Tu negocio
  business_name: string;
  project_stage: ProjectStage | "";
  current_store_url: string;
  no_store_url_now: boolean;
  product_type: ProductType[];
  sales_regions: SalesRegion | "";
  target_countries: string;
  platform_preference: PlatformPreference;
  other_platform_name: string;

  // Step 2: Productos y contenidos
  catalog_size: CatalogSize | "";
  initial_upload: InitialUpload | "";
  has_variations: HasVariations | "";
  content_readiness: ContentReadiness | "";
  stock_management: StockManagement | "";
  existing_catalog_format: ExistingCatalogFormat | "";

  // Step 3: Pagos y entregas
  payment_methods: PaymentMethod[];
  gateway_status: GatewayStatus | "";
  gateway_provider: GatewayProvider | "";
  delivery_coverage: DeliveryCoverage[];
  shipping_pricing: ShippingPricing | "";
  carrier_integration: CarrierIntegration | "";
  billing_integration: BillingIntegration | "";
  billing_system: string;
  subscription_details: string;
  booking_needed: "si" | "no" | "no_se" | "";

  // Step 4: Diseño y funciones especiales
  brand_assets: BrandAssets | "";
  design_goal: DesignGoal | "";
  reference_urls: string[];
  requested_features: RequestedFeature[];
  integration_details: string;
  special_requirements: string;

  // Step 5: Contacto y envío
  contact_name: string;
  contact_email: string;
  contact_phone_prefix: string;
  contact_whatsapp: string;
  launch_target: LaunchTarget | "";
  budget_range: BudgetRange | "";
  privacy_consent: boolean;

  // Antispam (honeypot)
  website_source_hp?: string;
  client_rendered_at?: number;
}

// Complete Structured Lead Record (matches Section 8 of PRD)
export interface BriefLeadRecord {
  additional_answers?: Record<string, string>;
  questionnaire?: { title: string; answers: { question: string; answer: string }[] }[];
  lead_id: string;
  created_at: string;
  source: string;
  schema_version: string;
  business: {
    business_name: string;
    project_stage: ProjectStage;
    current_store_url: string | null;
    product_type: ProductType[];
    sales_regions: SalesRegion;
    target_countries?: string | null;
    platform_preference: PlatformPreference;
    other_platform_name?: string | null;
  };
  catalog: {
    catalog_size: CatalogSize;
    initial_upload: InitialUpload;
    has_variations: HasVariations;
    content_readiness: ContentReadiness;
    stock_management: StockManagement;
    existing_catalog_format: ExistingCatalogFormat;
  };
  operations: {
    payment_methods: PaymentMethod[];
    gateway_status: GatewayStatus | null;
    gateway_provider: GatewayProvider | null;
    delivery_coverage: DeliveryCoverage[] | null;
    shipping_pricing: ShippingPricing | null;
    carrier_integration: CarrierIntegration | null;
    billing_integration: BillingIntegration;
    billing_system: string | null;
    subscription_details?: string | null;
    booking_needed?: "si" | "no" | "no_se" | null;
  };
  design: {
    brand_assets: BrandAssets;
    design_goal: DesignGoal;
    reference_urls: string[];
    requested_features: RequestedFeature[];
    integration_details: string | null;
    special_requirements: string;
  };
  contact: {
    contact_name: string;
    contact_email: string;
    contact_phone_prefix: string;
    contact_whatsapp: string;
    full_whatsapp: string;
    launch_target: LaunchTarget;
    budget_range: BudgetRange;
  };
  consent: {
    accepted: boolean;
    accepted_at: string;
    privacy_policy_version: string;
  };
  internal: {
    complexity_hint: ComplexityHint;
    effort_flags: string[];
    pending_points: string[];
    notification_status: NotificationStatus;
    notification_attempts: number;
    last_notification_attempt_at: string | null;
    notification_channel?: string;
    recipient_email: string;
    sender_email: string;
  };
  summary_text?: string;
}
