import React from "react";
import { BriefFormData, PaymentMethod, DeliveryCoverage } from "@/types/brief";
import { SelectionCard } from "./SelectionCard";
import { Input } from "@/components/ui/input";
import { CreditCard, Banknote, Truck, Receipt, CalendarCheck } from "lucide-react";

interface BriefStep3OperationsProps {
  data: BriefFormData;
  onChange: (updates: Partial<BriefFormData>) => void;
  errors: Record<string, string>;
}

export const BriefStep3Operations: React.FC<BriefStep3OperationsProps> = ({
  data,
  onChange,
  errors,
}) => {
  const handleTogglePaymentMethod = (method: PaymentMethod) => {
    const current = data.payment_methods || [];
    const exists = current.includes(method);
    const updated = exists ? current.filter((m) => m !== method) : [...current, method];
    onChange({ payment_methods: updated });
  };

  const handleToggleDeliveryCoverage = (coverage: DeliveryCoverage) => {
    const current = data.delivery_coverage || [];
    const exists = current.includes(coverage);
    const updated = exists ? current.filter((c) => c !== coverage) : [...current, coverage];
    onChange({ delivery_coverage: updated });
  };

  const sellsPhysical = data.product_type?.includes("fisicos");
  const acceptsGateway = data.payment_methods?.includes("tarjetas_pse");
  const hasSubscriptions = data.product_type?.includes("suscripciones");
  const hasServices = data.product_type?.includes("servicios");

  return (
    <div className="space-y-8 animate-fade-up">
      {/* 3.1 Métodos de pago */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Cómo quieres que te paguen? <span className="text-brand">* (Obligatorio - Selecciona al menos 1)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Configuraremos los métodos seleccionados listos para recibir dinero en tu cuenta bancaria.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectionCard
            multiSelect
            selected={data.payment_methods?.includes("tarjetas_pse")}
            onClick={() => handleTogglePaymentMethod("tarjetas_pse")}
            title="Tarjetas y PSE (En línea)"
            description="Tarjetas de crédito/débito, PSE, Nequi y Daviplata automáticos"
            icon={<CreditCard className="w-5 h-5" />}
          />
          <SelectionCard
            multiSelect
            selected={data.payment_methods?.includes("transferencia")}
            onClick={() => handleTogglePaymentMethod("transferencia")}
            title="Transferencia manual / Bancolombia / Nequi"
            description="El cliente sube comprobante o transfiere a tu cuenta"
            icon={<Banknote className="w-5 h-5" />}
          />
          <SelectionCard
            multiSelect
            selected={data.payment_methods?.includes("contraentrega")}
            onClick={() => handleTogglePaymentMethod("contraentrega")}
            title="Pago contraentrega"
            description="Pago en efectivo cuando el paquete llega a la puerta"
            icon={<Truck className="w-5 h-5" />}
          />
          <SelectionCard
            multiSelect
            selected={data.payment_methods?.includes("pago_manual")}
            onClick={() => handleTogglePaymentMethod("pago_manual")}
            title="Acuerdo manual por WhatsApp"
            description="Cerrar el pago por conversación directa con el cliente"
          />
          <SelectionCard
            multiSelect
            selected={data.payment_methods?.includes("necesito_asesoria")}
            onClick={() => handleTogglePaymentMethod("necesito_asesoria")}
            title="Necesito asesoría"
            description="Quiero que me recomienden la combinación más rentable"
          />
        </div>
        {errors.payment_methods && (
          <p className="mt-1.5 text-xs text-destructive font-medium">{errors.payment_methods}</p>
        )}
      </div>

      {/* 3.2 Pasarela de pago activa (Condicional si tarjetas_pse) */}
      {acceptsGateway && (
        <div className="p-4 sm:p-5 rounded-2xl border border-brand/20 bg-brand/5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              ¿Ya tienes una pasarela de pago activa? <span className="text-brand">* (Obligatorio)</span>
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Wompi, Mercado Pago, PayU u otra con cuenta bancaria vinculada.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <SelectionCard
                selected={data.gateway_status === "si"}
                onClick={() => onChange({ gateway_status: "si" })}
                title="Sí, activa y verificada"
                description="Ya tengo credenciales API o cuenta operativa"
              />
              <SelectionCard
                selected={data.gateway_status === "no"}
                onClick={() => onChange({ gateway_status: "no" })}
                title="No, aún no la tengo"
                description="Necesitaré crearla y verificarla con mi RUT"
              />
              <SelectionCard
                selected={data.gateway_status === "no_se"}
                onClick={() => onChange({ gateway_status: "no_se" })}
                title="No lo sé con certeza"
                description="Lo revisaremos durante el proceso"
              />
            </div>
            {errors.gateway_status && (
              <p className="mt-1.5 text-xs text-destructive font-medium">{errors.gateway_status}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              ¿Cuál pasarela usas o prefieres? <span className="text-muted-foreground font-normal">(Opcional)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <SelectionCard
                selected={data.gateway_provider === "wompi"}
                onClick={() => onChange({ gateway_provider: "wompi" })}
                title="Wompi"
                description="Bancolombia"
              />
              <SelectionCard
                selected={data.gateway_provider === "mercado_pago"}
                onClick={() => onChange({ gateway_provider: "mercado_pago" })}
                title="Mercado Pago"
                description="Amplio uso"
              />
              <SelectionCard
                selected={data.gateway_provider === "payu"}
                onClick={() => onChange({ gateway_provider: "payu" })}
                title="PayU"
                description="Latam"
              />
              <SelectionCard
                selected={data.gateway_provider === "otra"}
                onClick={() => onChange({ gateway_provider: "otra" })}
                title="Otra"
                description="Diferente"
              />
              <SelectionCard
                selected={data.gateway_provider === "sin_preferencia"}
                onClick={() => onChange({ gateway_provider: "sin_preferencia" })}
                title="Sin preferencia"
                description="Recomiéndenme"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3.3 Logística de envíos (SOLO SI VENDE PRODUCTOS FÍSICOS) */}
      {sellsPhysical ? (
        <div className="space-y-6 p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base border-b border-border pb-3">
            <Truck className="w-5 h-5 text-brand" />
            <span>Logística y Entregas de Productos Físicos</span>
          </div>

          {/* Cobertura */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              ¿Dónde entregarás los productos físicos?{" "}
              <span className="text-brand">* (Obligatorio - Al menos 1)</span>
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Define las zonas de despacho en la tienda.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <SelectionCard
                multiSelect
                selected={data.delivery_coverage?.includes("misma_ciudad")}
                onClick={() => handleToggleDeliveryCoverage("misma_ciudad")}
                title="Misma ciudad (local)"
                description="Domicilios directos en tu ciudad principal"
              />
              <SelectionCard
                multiSelect
                selected={data.delivery_coverage?.includes("colombia_nacional")}
                onClick={() => handleToggleDeliveryCoverage("colombia_nacional")}
                title="Colombia nacional"
                description="Envíos a todo el país vía transportadora"
              />
              <SelectionCard
                multiSelect
                selected={data.delivery_coverage?.includes("internacional")}
                onClick={() => handleToggleDeliveryCoverage("internacional")}
                title="Internacional"
                description="Envíos con DHL, FedEx u operadores courier"
              />
              <SelectionCard
                multiSelect
                selected={data.delivery_coverage?.includes("recoger_en_tienda")}
                onClick={() => handleToggleDeliveryCoverage("recoger_en_tienda")}
                title="Punto físico / Tienda"
                description="El cliente puede recoger su pedido gratis"
              />
              <SelectionCard
                multiSelect
                selected={data.delivery_coverage?.includes("por_definir")}
                onClick={() => handleToggleDeliveryCoverage("por_definir")}
                title="Por definir"
                description="Aún estructurando la cobertura"
              />
            </div>
            {errors.delivery_coverage && (
              <p className="mt-1.5 text-xs text-destructive font-medium">{errors.delivery_coverage}</p>
            )}
          </div>

          {/* Cálculo del valor de envío */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              ¿Cómo se calculará el valor del envío? <span className="text-brand">* (Obligatorio)</span>
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Regla de cobro que verá el comprador al hacer checkout.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <SelectionCard
                selected={data.shipping_pricing === "tarifa_fija"}
                onClick={() => onChange({ shipping_pricing: "tarifa_fija" })}
                title="Tarifa plana o fija"
                description="Ej: $12.000 a cualquier parte de la ciudad o país"
              />
              <SelectionCard
                selected={data.shipping_pricing === "por_ciudad_zona"}
                onClick={() => onChange({ shipping_pricing: "por_ciudad_zona" })}
                title="Por ciudad o departamento"
                description="Costos diferenciados según la tabla de destinos"
              />
              <SelectionCard
                selected={data.shipping_pricing === "por_peso"}
                onClick={() => onChange({ shipping_pricing: "por_peso" })}
                title="Por peso y volumen"
                description="Tarifas escalonadas según gramos o kilos"
              />
              <SelectionCard
                selected={data.shipping_pricing === "transportadora_automatica"}
                onClick={() => onChange({ shipping_pricing: "transportadora_automatica" })}
                title="Cotización automática (API)"
                description="Conexión en tiempo real con transportadora"
              />
              <SelectionCard
                selected={data.shipping_pricing === "gratis"}
                onClick={() => onChange({ shipping_pricing: "gratis" })}
                title="Envío gratis"
                description="Incluido en el precio o a partir de monto mínimo"
              />
              <SelectionCard
                selected={data.shipping_pricing === "por_definir"}
                onClick={() => onChange({ shipping_pricing: "por_definir" })}
                title="Por definir todavía"
                description="Lo acordaremos en la asesoría"
              />
            </div>
            {errors.shipping_pricing && (
              <p className="mt-1.5 text-xs text-destructive font-medium">{errors.shipping_pricing}</p>
            )}
          </div>

          {/* Conexión con transportadora */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              ¿Quieres conectar una transportadora para cotizar o generar guías automáticas?{" "}
              <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <SelectionCard
                selected={data.carrier_integration === "si"}
                onClick={() => onChange({ carrier_integration: "si" })}
                title="Sí, integración automática"
                description="Ej: Coordinadora, Servientrega, Envíame, Interrapidísimo"
              />
              <SelectionCard
                selected={data.carrier_integration === "no"}
                onClick={() => onChange({ carrier_integration: "no" })}
                title="No por ahora"
                description="Generaré y pegaré las guías de forma manual"
              />
              <SelectionCard
                selected={data.carrier_integration === "necesito_asesoria"}
                onClick={() => onChange({ carrier_integration: "necesito_asesoria" })}
                title="Necesito asesoría"
                description="Quiero saber costos y requisitos de conexión"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground flex items-center gap-2">
          <span>✓ Preguntas de transporte omitidas porque no seleccionaste productos físicos en el Paso 1.</span>
        </div>
      )}

      {/* Condicional para Suscripciones */}
      {hasSubscriptions && (
        <div className="p-4 rounded-xl border border-brand/20 bg-card space-y-2">
          <label htmlFor="subscription_details" className="block text-xs font-semibold text-foreground">
            Detalle de suscripciones y cobros recurrentes (Opcional)
          </label>
          <p className="text-xs text-muted-foreground">
            ¿Con qué periodicidad cobrarás? (Ej: mensual, trimestral, anual, con período de prueba).
          </p>
          <Input
            id="subscription_details"
            placeholder="Ej: Cobro mensual de $50.000 con débito automático..."
            value={data.subscription_details}
            onChange={(e) => onChange({ subscription_details: e.target.value })}
            className="h-10 text-sm"
          />
        </div>
      )}

      {/* Condicional para Servicios */}
      {hasServices && (
        <div className="p-4 rounded-xl border border-brand/20 bg-card space-y-2">
          <label className="block text-xs font-semibold text-foreground">
            ¿Requieres sistema de agendamiento/reservas en línea para tus servicios? (Opcional)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <SelectionCard
              selected={data.booking_needed === "si"}
              onClick={() => onChange({ booking_needed: "si" })}
              title="Sí, calendario"
              description="Elegir fecha y hora"
            />
            <SelectionCard
              selected={data.booking_needed === "no"}
              onClick={() => onChange({ booking_needed: "no" })}
              title="No, solo pago"
              description="Pago simple del paquete"
            />
            <SelectionCard
              selected={data.booking_needed === "no_se"}
              onClick={() => onChange({ booking_needed: "no_se" })}
              title="Por definir"
              description="Evaluar necesidad"
            />
          </div>
        </div>
      )}

      {/* 3.4 Facturación electrónica */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          ¿Necesitas integración con facturación electrónica o sistema contable?{" "}
          <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Generación y reporte automático de factura DIAN con cada pedido.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectionCard
            selected={data.billing_integration === "si"}
            onClick={() => onChange({ billing_integration: "si" })}
            title="Sí, facturación automática"
            description="Emitir factura electrónica DIAN al confirmar la compra"
            icon={<Receipt className="w-5 h-5" />}
          />
          <SelectionCard
            selected={data.billing_integration === "no"}
            onClick={() => onChange({ billing_integration: "no" })}
            title="No por ahora"
            description="Facturaré manualmente o no requiero integración inicial"
          />
          <SelectionCard
            selected={data.billing_integration === "no_se"}
            onClick={() => onChange({ billing_integration: "no_se" })}
            title="No lo sé aún"
            description="Revisaremos si mi volumen o régimen lo amerita"
          />
        </div>

        {data.billing_integration === "si" && (
          <div className="mt-3 p-4 rounded-xl border border-brand/20 bg-card space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="billing_system" className="text-xs font-semibold text-foreground">
                ¿Cuál sistema o software utilizas? <span className="text-brand">* (Obligatorio)</span>
              </label>
              <button
                type="button"
                onClick={() => onChange({ billing_system: "Aún por definir" })}
                className="text-xs text-brand hover:underline font-medium cursor-pointer"
              >
                Aún por definir
              </button>
            </div>
            <Input
              id="billing_system"
              placeholder="Ej: Siigo, Alegra, Factus, World Office, Loggro o 'Aún por definir'..."
              value={data.billing_system}
              onChange={(e) => onChange({ billing_system: e.target.value })}
              className={`h-11 ${errors.billing_system ? "border-destructive" : ""}`}
            />
            {errors.billing_system && (
              <p className="text-xs text-destructive font-medium">{errors.billing_system}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BriefStep3Operations;
