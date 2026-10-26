import { BriefFormData } from "@/types/brief";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { BriefReviewSummary } from "./BriefReviewSummary";

type Props = { step: number; data: BriefFormData; onChange: (update: Partial<BriefFormData>) => void; errors: Record<string, string>; onEdit: (step: number) => void };
type Option = [string, string];
const control = "w-full min-h-12 rounded-xl border border-input bg-background px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

export function DetailedBriefSteps({ step, data, onChange, errors, onEdit }: Props) {
  const props = (id: string) => ({ id, "aria-invalid": !!errors[id], "aria-describedby": errors[id] ? id+"-error" : undefined });
  const error = (id: string) => errors[id] && <p id={id+"-error"} role="alert" className="mt-2 text-sm text-destructive">{errors[id]}</p>;
  const set = (key: string, value: unknown) => onChange({ [key]: value });
  const select = (id: keyof BriefFormData, title: string, options: Option[], hint?: string, required = false) => <div>
    <label htmlFor={id} className="block text-sm font-semibold mb-2">{title}{required && <span className="text-brand"> *</span>}</label>
    {hint && <p className="mb-3 text-sm text-muted-foreground">{hint}</p>}
    <select {...props(id)} className={control} value={String(data[id] || "")} onChange={e => set(id, e.target.value)}><option value="">Elige una opción</option>{options.map(([v,t]) => <option key={v} value={v}>{t}</option>)}</select>{error(id)}
  </div>;
  const input = (id: keyof BriefFormData, title: string, placeholder: string, options: { type?: string; max?: number; autoComplete?: string } = {}) => <div>
    <label htmlFor={id} className="block text-sm font-semibold mb-2">{title}</label><Input {...props(id)} type={options.type || "text"} autoComplete={options.autoComplete} maxLength={options.max || 200} value={String(data[id] || "")} placeholder={placeholder} onChange={e => set(id,e.target.value)} className="min-h-12 text-base" />{error(id)}
  </div>;
  const multi = (id: "product_type" | "payment_methods" | "delivery_coverage" | "requested_features", title: string, options: Option[], exclusive?: string) => <fieldset {...props(id)} tabIndex={-1}>
    <legend className="text-sm font-semibold mb-1">{title}</legend><p className="text-sm text-muted-foreground mb-3">Puedes marcar varias opciones.</p>
    <div className="grid sm:grid-cols-2 gap-2">{options.map(([value,label]) => <label key={value} className={"flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer "+(data[id].includes(value as never) ? "border-brand bg-brand/5" : "border-border")}>
      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-red-700" checked={data[id].includes(value as never)} onChange={e => {
        const current = data[id] as string[];
        set(id, e.target.checked ? value === exclusive ? [value] : [...current.filter(v => v !== exclusive), value] : current.filter(v => v !== value));
      }} /><span className="text-sm">{label}</span>
    </label>)}</div>{error(id)}
  </fieldset>;
  const textarea = (id: "integration_details" | "special_requirements", title: string, placeholder: string, max: number) => <div><label htmlFor={id} className="block text-sm font-semibold mb-2">{title}</label><textarea {...props(id)} rows={4} maxLength={max} className={control} value={data[id]} placeholder={placeholder} onChange={e => set(id,e.target.value)} />{error(id)}</div>;
  const notes = (id: string, title: string, placeholder: string) => <div className="rounded-xl border border-brand/15 bg-brand/[0.025] p-4">
    <label htmlFor={"notes_"+id} className="block text-sm font-semibold mb-2">{title} <span className="font-normal text-muted-foreground">(opcional)</span></label>
    <textarea id={"notes_"+id} rows={4} maxLength={2000} className={control+" resize-y"} value={data.additional_answers?.[id] || ""} placeholder={placeholder} onChange={e => onChange({ additional_answers: { ...data.additional_answers, [id]: e.target.value } })} />
  </div>;
  const yesNo: Option[] = [["si","Sí"],["no","No"],["no_se","No lo sé, necesito orientación"]];
  return <div className="space-y-7">
    {step === 1 && <>
      {input("business_name", "¿Cómo se llama tu negocio? *", "Nombre de tu marca o proyecto", {max:100,autoComplete:"organization"})}
      <button type="button" className="text-sm text-brand underline underline-offset-4" onClick={() => onChange({ business_name: "Aún no tengo nombre" })}>Aún no tengo nombre</button>
      {select("project_stage", "¿En qué etapa estás?", [["nuevo","Estoy empezando desde cero"],["ya_vendo_sin_tienda","Ya vendo por redes, WhatsApp o en un local"],["ya_tengo_tienda_y_quiero_renovar","Tengo una tienda online y quiero mejorarla"],["quiero_migrar","Quiero cambiar mi tienda a otro sistema"]],undefined,true)}
      {(data.project_stage === "ya_tengo_tienda_y_quiero_renovar" || data.project_stage === "quiero_migrar") && <div className="space-y-3">{!data.no_store_url_now && input("current_store_url","¿Cuál es el enlace de tu tienda actual?","mitienda.com")}
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={data.no_store_url_now} onChange={e => onChange({ no_store_url_now:e.target.checked })} />No tengo el enlace a mano</label></div>}
      {multi("product_type","¿Qué vas a vender? *",[["fisicos","Productos físicos: ropa, alimentos, accesorios…"],["digitales","Productos digitales: cursos, libros, archivos…"],["servicios","Servicios: asesorías, citas o reservas"],["suscripciones","Suscripciones o membresías"]])}
      {select("sales_regions","¿Dónde quieres vender?",[["solo_colombia","Colombia"],["colombia_y_otros_paises","Colombia y otros países"],["solo_otros_paises","Otros países"],["por_definir","Aún por definir"]],undefined,true)}
      {(data.sales_regions === "colombia_y_otros_paises" || data.sales_regions === "solo_otros_paises") && input("target_countries","¿A qué países o regiones? (opcional)","Ej.: México, Estados Unidos, Latinoamérica")}
      {select("platform_preference","¿Tienes alguna plataforma en mente?",[["necesito_recomendacion","No tengo preferencia, recomiéndenme"],["woocommerce","WooCommerce / WordPress"],["shopify","Shopify"],["otra","Otra"]],"No necesitas elegir una tecnología para solicitar la cotización.")}
      {data.platform_preference === "otra" && input("other_platform_name","¿Cuál plataforma?","Nombre o enlace de la plataforma")}
      {notes("business","Cuéntanos sobre tu negocio y tus objetivos","¿Qué vendes, quiénes son tus clientes y qué te gustaría mejorar? Si ya vendes, ¿cómo recibes hoy tus pedidos?")}
    </>}
    {step === 2 && <>
      {select("catalog_size","¿Cuántos productos o servicios tendrá la tienda?",[["1_10","Hasta 10"],["11_30","Entre 11 y 30"],["31_100","Entre 31 y 100"],["101_500","Entre 101 y 500"],["mas_500","Más de 500"],["sin_definir","Todavía no lo sé"]],"Una cantidad aproximada es suficiente.",true)}
      {select("initial_upload","¿Cuántos productos necesitas que publiquemos al inicio?",[["ninguno_yo_los_cargo","Yo los publicaré, solo necesito capacitación"],["1_10","Hasta 10"],["11_30","Entre 11 y 30"],["31_100","Entre 31 y 100"],["mas_100","Más de 100"],["sin_definir","Necesito que me orienten"]],"Así incluimos el trabajo de cargar productos en la propuesta.",true)}
      {select("has_variations","¿Tus productos tienen tallas, colores u otras versiones?",yesNo,undefined,true)}
      {select("content_readiness","¿Tienes fotos, descripciones y precios?",[["todo_listo","Sí, tengo todo listo"],["parcial","Tengo una parte, falta organizar o completar"],["necesito_ayuda","Necesito ayuda con las fotos o los textos"]],undefined,true)}
      {select("existing_catalog_format","¿Dónde tienes la información de tus productos?",[["excel_csv","En Excel o una hoja de cálculo"],["otra_plataforma","En mi tienda actual o en otro programa"],["no","Aún no la he organizado"],["no_se","No lo sé / prefiero explicarlo abajo"]])}
      {select("stock_management","¿Necesitas controlar las unidades disponibles?",[["si","Sí, que se descuenten con cada venta"],["no","No lo necesito"],["por_definir","Necesito orientación"]])}
      {notes("catalog","Amplía tu respuesta sobre los productos y contenidos","Puedes contar qué productos tienen tallas o colores, si necesitas fotos o redacción, compartir un enlace al catálogo o explicar cómo actualizas los precios.")}
    </>}
    {step === 3 && <>
      {multi("payment_methods","¿Cómo quieres que te paguen? *",[["tarjetas_pse","Tarjetas y PSE en la tienda"],["transferencia","Transferencia, Nequi o Daviplata"],["contraentrega","Al recibir el pedido"],["pago_manual","Acordar el pago por WhatsApp"],["necesito_asesoria","Necesito que me recomienden"]],"necesito_asesoria")}
      {data.payment_methods.includes("tarjetas_pse") && <>
        {select("gateway_status","¿Ya tienes una cuenta para recibir pagos por internet?",yesNo,"Por ejemplo, Wompi, Mercado Pago o PayU.",true)}
        {select("gateway_provider","¿Con qué empresa recibes o quieres recibir esos pagos?",[["sin_preferencia","No tengo preferencia"],["wompi","Wompi"],["mercado_pago","Mercado Pago"],["payu","PayU"],["otra","Otra (cuéntanos abajo)"]])}
      </>}
      {data.product_type.includes("fisicos") && <>
        <h3 className="font-bold text-lg border-t pt-6">Entrega de tus productos</h3>
        {multi("delivery_coverage","¿Dónde entregarás los pedidos? *",[["misma_ciudad","En mi ciudad"],["colombia_nacional","En toda Colombia"],["internacional","En otros países"],["recoger_en_tienda","El cliente recoge en mi local"],["por_definir","Todavía no lo sé"]],"por_definir")}
        {select("shipping_pricing","¿Cómo quieres cobrar el envío?",[["tarifa_fija","Un valor fijo"],["por_ciudad_zona","Según la ciudad o zona"],["por_peso","Según peso o tamaño"],["transportadora_automatica","Que la transportadora calcule el valor"],["gratis","Envío gratis"],["por_definir","Necesito orientación"]],undefined,true)}
        {select("carrier_integration","¿Quieres conectar la tienda con una transportadora?",[["si","Sí, para calcular envíos o crear guías"],["no","No, lo gestionaré por mi cuenta"],["necesito_asesoria","Necesito orientación"]])}
      </>}
      {select("billing_integration","¿Necesitas conectar tu facturación electrónica?",yesNo,"Para que las ventas pasen a tu sistema de facturación.")}
      {data.billing_integration === "si" && input("billing_system","¿Qué sistema usas? *","Ej.: Siigo, Alegra o Aún por definir",{max:150})}
      {data.product_type.includes("suscripciones") && input("subscription_details","¿Cómo serían los cobros de la suscripción? (opcional)","Ej.: mensual, anual, con período de prueba")}
      {data.product_type.includes("servicios") && select("booking_needed","¿Tus clientes deben elegir fecha y hora?",yesNo)}
      {notes("operations","Describe tus reglas de venta, pagos y entregas","¿Qué transportadora usas? ¿Hay pedidos mínimos, zonas sin cobertura, pagos especiales o programas que debamos conectar? Cuéntanos lo que no encaje en las opciones.")}
    </>}
    {step === 4 && <>
      {select("brand_assets","¿Tienes imagen corporativa: logo, colores y estilo de marca?",[["si_completo","Sí: logo, colores y manual o guía de marca"],["parcial","Tengo logo o algunos materiales, pero falta completar"],["no","No tengo imagen corporativa y necesito ayuda"]],undefined,true)}
      <div><label htmlFor="brand_assets_url" className="block text-sm font-semibold mb-2">Enlace a tu logo o materiales de marca (opcional)</label><Input id="brand_assets_url" maxLength={500} value={data.additional_answers?.brand_assets_url || ""} onChange={e => onChange({ additional_answers: { ...data.additional_answers, brand_assets_url:e.target.value } })} placeholder="Enlace a Drive, Dropbox o tu página actual" className="min-h-12 text-base" /><p className="mt-2 text-xs text-muted-foreground">Comparte un enlace que permita ver los archivos. No pedimos contraseñas ni acceso de edición.</p></div>
      {notes("brand","Describe tu identidad y el estilo que buscas","¿Qué colores, estilo o personalidad debe transmitir la marca? ¿Qué materiales tienes y cuáles necesitas que creemos o mejoremos?")}
      {select("design_goal","¿Cómo te gustaría que se viera tu tienda?",[["practico_y_funcional","Sencilla, clara y enfocada en vender"],["diferenciado_premium","Con un diseño más personalizado y diferente"],["necesito_orientacion","Quiero que me ayuden a definirlo"]],undefined,true)}
      <fieldset><legend className="text-sm font-semibold mb-2">¿Qué páginas o tiendas te gustan? (opcional)</legend><p className="text-sm text-muted-foreground mb-3">Comparte hasta tres enlaces. Puedes explicar qué te gusta de cada una al final.</p><div className="space-y-3">{[0,1,2].map(i => <div key={i}><Input {...props("reference_urls_"+i)} aria-label={"Página de referencia "+(i+1)} maxLength={500} placeholder={"Enlace de referencia "+(i+1)} value={data.reference_urls[i] || ""} onChange={e => { const urls=[...data.reference_urls]; urls[i]=e.target.value; onChange({reference_urls:urls}); }} className="min-h-12 text-base" />{error("reference_urls_"+i)}</div>)}</div></fieldset>
      {multi("requested_features","¿Qué más necesitas que haga tu tienda?",[["whatsapp","Atender consultas por WhatsApp"],["cupones_promociones","Cupones y promociones"],["resenas","Opiniones de los compradores"],["filtros_avanzados","Filtros para encontrar productos"],["venta_mayorista","Precios para mayoristas"],["multiidioma_moneda","Vender en otros idiomas o monedas"],["email_automatizado","Correos automáticos después de comprar"],["recuperar_carritos","Recordatorios de compras sin finalizar"],["integracion_erp_pos","Conectar inventario, caja u otro programa"],["reservas","Agendar citas o reservas"],["otra","Otra función (descríbela abajo)"],["no_se","Quiero que me orienten"]],"no_se")}
      {(data.requested_features.includes("integracion_erp_pos") || data.requested_features.includes("otra")) && textarea("integration_details","¿Qué programa o función necesitas conectar? *","Describe lo que necesitas o escribe Aún no conozco el sistema.",500)}
      {textarea("special_requirements","¿Qué más deberíamos saber para cotizar? (opcional)","Explica tus referencias, algo que no encontraste en las preguntas, lo que no te gusta de tu tienda actual o cualquier requisito importante.",1000)}
    </>}
    {step === 5 && <>
      {input("contact_name","Tu nombre *","Nombre y apellido",{max:100,autoComplete:"name"})}
      {input("contact_email","Correo para enviarte la propuesta *","tu@correo.com",{type:"email",max:254,autoComplete:"email"})}
      <div><label htmlFor="contact_whatsapp" className="block text-sm font-semibold mb-2">Tu WhatsApp *</label><div className="flex gap-2"><select aria-label="Indicativo de país" className={control+" !w-28 shrink-0"} value={data.contact_phone_prefix} onChange={e => onChange({contact_phone_prefix:e.target.value})}>{[["+57","CO +57"],["+1","US +1"],["+52","MX +52"],["+34","ES +34"],["+54","AR +54"],["+56","CL +56"],["+51","PE +51"],["+593","EC +593"],["+507","PA +507"]].map(([v,t]) => <option key={v} value={v}>{t}</option>)}</select><Input {...props("contact_whatsapp")} className="min-h-12 min-w-0 text-base" type="tel" autoComplete="tel-national" maxLength={20} placeholder="311 456 5403" value={data.contact_whatsapp} onChange={e => onChange({contact_whatsapp:e.target.value})} /></div>{error("contact_whatsapp")}</div>
      {select("launch_target","¿Cuándo te gustaría lanzar la tienda?",[["menos_1_mes","Lo antes posible (menos de un mes)"],["1_2_meses","En uno o dos meses"],["3_meses_o_mas","En tres meses o más"],["sin_fecha","Sin fecha definida"]],undefined,true)}
      {notes("contact","¿Cómo prefieres que avancemos?","¿Prefieres recibir la cotización por correo, conversar por WhatsApp o tener una reunión? Indica horarios, quién decide y cualquier detalle para contactarte.")}
      <BriefReviewSummary data={data} onEditStep={onEdit} />
      <details className="rounded-xl border p-4"><summary className="cursor-pointer text-sm font-semibold">Revisar mis respuestas personalizadas</summary><div className="mt-4 space-y-4">{Object.entries(data.additional_answers || {}).filter(([,v])=>v.trim()).map(([key,value]) => <p key={key} className="text-sm whitespace-pre-wrap break-words"><strong>{({business:"Negocio",catalog:"Productos",operations:"Operación",brand:"Imagen corporativa",brand_assets_url:"Materiales de marca",contact:"Contacto"} as Record<string,string>)[key]}:</strong><br />{value}</p>)}</div></details>
      <div><div className="flex items-start gap-3"><Checkbox id="privacy_consent" checked={data.privacy_consent} onCheckedChange={checked=>onChange({privacy_consent:checked===true})} className="mt-1" aria-invalid={!!errors.privacy_consent} aria-describedby={errors.privacy_consent?"privacy_consent-error":undefined} /><label htmlFor="privacy_consent" className="text-sm leading-relaxed">Autorizo a ROICAS a usar mis datos para responder esta solicitud, según la <Link to="/politica-privacidad" target="_blank" rel="noopener noreferrer" className="text-brand underline">Política de Privacidad</Link>. *</label></div>{error("privacy_consent")}</div>
      <div className="hidden" aria-hidden="true"><input aria-label="Dejar vacío" tabIndex={-1} autoComplete="off" value={data.website_source_hp || ""} onChange={e=>onChange({website_source_hp:e.target.value})} /></div>
    </>}
  </div>;
}
