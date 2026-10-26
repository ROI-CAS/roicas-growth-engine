import { BriefFormData, ProductType } from "@/types/brief";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

type Props = { step: number; data: BriefFormData; onChange: (update: Partial<BriefFormData>) => void; errors: Record<string, string>; onEdit: () => void };
const selectClass = "h-12 w-full rounded-xl border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
export function SimpleBriefSteps({ step, data, onChange, errors, onEdit }: Props) {
  const error = (id: string) => errors[id] ? <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">{errors[id]}</p> : null;
  const fieldProps = (id: string) => ({ id, "aria-invalid": !!errors[id], "aria-describedby": errors[id] ? `${id}-error` : undefined });
  return <div className="space-y-7">
    {step === 1 && <>
      <div>
        <label htmlFor="business_name" className="block font-semibold mb-2">¿Cómo se llama tu negocio?</label>
        <Input {...fieldProps("business_name")} autoComplete="organization" maxLength={150} placeholder="El nombre de tu marca o proyecto" value={data.business_name} onChange={e => onChange({ business_name: e.target.value })} className="h-12 text-base" />
        <button type="button" className="mt-2 text-sm text-brand underline underline-offset-4" onClick={() => onChange({ business_name: "Aún no tengo nombre" })}>Aún no tengo nombre</button>
        {error("business_name")}
      </div>
      <fieldset id="project_stage" tabIndex={-1} aria-describedby={errors.project_stage ? "project_stage-error" : undefined}>
        <legend className="font-semibold mb-3">¿En qué punto estás?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[["nuevo", "Estoy empezando"], ["ya_vendo_sin_tienda", "Ya vendo por redes o en un local"], ["ya_tengo_tienda_y_quiero_renovar", "Quiero mejorar mi tienda actual"]].map(([value, label]) => <label key={value} className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer ${data.project_stage === value ? "border-brand bg-brand/5" : "border-border hover:bg-muted/40"}`}>
            <input type="radio" name="project_stage" value={value} checked={data.project_stage === value} onChange={() => onChange({ project_stage: value as BriefFormData["project_stage"] })} className="h-4 w-4 accent-red-700" />
            <span className="text-sm font-medium">{label}</span>
          </label>)}
        </div>{error("project_stage")}
      </fieldset>
      <fieldset id="product_type" tabIndex={-1} aria-describedby={errors.product_type ? "product_type-error" : undefined}>
        <legend className="font-semibold mb-1">¿Qué quieres vender?</legend><p className="text-sm text-muted-foreground mb-3">Puedes elegir varias opciones.</p>
        <div className="grid gap-3 sm:grid-cols-2">{[["fisicos", "Productos físicos", "Ropa, alimentos, accesorios…"], ["digitales", "Productos digitales", "Cursos, libros, archivos…"], ["servicios", "Servicios", "Asesorías, citas, reservas…"], ["suscripciones", "Suscripciones", "Membresías o cobros periódicos"]].map(([value, title, hint]) => <label key={value} className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer ${data.product_type.includes(value as ProductType) ? "border-brand bg-brand/5" : "border-border hover:bg-muted/40"}`}>
          <input type="checkbox" checked={data.product_type.includes(value as ProductType)} onChange={e => onChange({ product_type: e.target.checked ? [...data.product_type, value as ProductType] : data.product_type.filter(v => v !== value) })} className="mt-1 h-4 w-4 accent-red-700" />
          <span><span className="block text-sm font-semibold">{title}</span><span className="block mt-1 text-sm text-muted-foreground">{hint}</span></span>
        </label>)}</div>{error("product_type")}
      </fieldset>
    </>}
    {step === 2 && <>
      <p className="text-sm text-muted-foreground">Estas respuestas son opcionales. Si algo no está claro, lo definimos contigo.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div><label htmlFor="catalog_size" className="block font-semibold mb-2">¿Cuántos productos o servicios ofrecerás?</label><select id="catalog_size" className={selectClass} value={data.catalog_size} onChange={e => onChange({ catalog_size: e.target.value as BriefFormData["catalog_size"] })}>{[["sin_definir", "Todavía no lo sé"], ["1_10", "Hasta 10"], ["11_30", "Entre 11 y 30"], ["31_100", "Entre 31 y 100"], ["101_500", "Entre 101 y 500"], ["mas_500", "Más de 500"]].map(([v,t]) => <option key={v} value={v}>{t}</option>)}</select></div>
        <div><label htmlFor="sales_regions" className="block font-semibold mb-2">¿Dónde quieres vender?</label><select id="sales_regions" className={selectClass} value={data.sales_regions} onChange={e => onChange({ sales_regions: e.target.value as BriefFormData["sales_regions"] })}>{[["por_definir", "Todavía no lo sé"], ["solo_colombia", "Colombia"], ["colombia_y_otros_paises", "Colombia y otros países"], ["solo_otros_paises", "Otros países"]].map(([v,t]) => <option key={v} value={v}>{t}</option>)}</select></div>
      </div>
      <div><label htmlFor="launch_target" className="block font-semibold mb-2">¿Cuándo te gustaría empezar?</label><select id="launch_target" className={selectClass} value={data.launch_target} onChange={e => onChange({ launch_target: e.target.value as BriefFormData["launch_target"] })}>{[["sin_fecha", "No tengo una fecha definida"], ["menos_1_mes", "Lo antes posible"], ["1_2_meses", "En 1 o 2 meses"], ["3_meses_o_mas", "En 3 meses o más"]].map(([v,t]) => <option key={v} value={v}>{t}</option>)}</select></div>
      <div><label htmlFor="special_requirements" className="block font-semibold mb-2">¿Qué te gustaría lograr con tu tienda?</label><p className="text-sm text-muted-foreground mb-3">Cuéntanos tu idea con tus palabras. También puedes pegar el enlace de tu tienda actual.</p><textarea {...fieldProps("special_requirements")} maxLength={3000} rows={4} value={data.special_requirements} onChange={e => onChange({ special_requirements: e.target.value })} placeholder="Por ejemplo: vendo ropa por Instagram y quiero que mis clientes puedan comprar y pagar sin escribirme." className="w-full rounded-xl border border-input bg-background p-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand" />{error("special_requirements")}</div>
      <p className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">La cotización se prepara después de revisar tu idea. El valor depende de lo que necesite tu negocio.</p>
    </>}
    {step === 3 && <>
      <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-wider text-muted-foreground">Tu solicitud</p><p className="font-semibold mt-1">{data.business_name}</p></div><button type="button" onClick={onEdit} className="text-sm text-brand underline underline-offset-4">Revisar respuestas</button></div>
      <div><label htmlFor="contact_name" className="block font-semibold mb-2">Tu nombre</label><Input {...fieldProps("contact_name")} autoComplete="name" maxLength={100} placeholder="Nombre y apellido" value={data.contact_name} onChange={e => onChange({ contact_name: e.target.value })} className="h-12 text-base" />{error("contact_name")}</div>
      <div><label htmlFor="contact_email" className="block font-semibold mb-2">Tu correo electrónico</label><Input {...fieldProps("contact_email")} type="email" autoComplete="email" maxLength={254} placeholder="tu@correo.com" value={data.contact_email} onChange={e => onChange({ contact_email: e.target.value })} className="h-12 text-base" /><p className="text-sm text-muted-foreground mt-2">Aquí recibirás la confirmación y la propuesta.</p>{error("contact_email")}</div>
      <div><label htmlFor="contact_whatsapp" className="block font-semibold mb-2">Tu WhatsApp</label><div className="flex gap-2"><select aria-label="Indicativo de país" className={`${selectClass} !w-28 shrink-0`} value={data.contact_phone_prefix} onChange={e => onChange({ contact_phone_prefix: e.target.value })}>{[["+57","CO +57"],["+1","US +1"],["+52","MX +52"],["+34","ES +34"],["+54","AR +54"],["+56","CL +56"],["+51","PE +51"],["+593","EC +593"],["+507","PA +507"]].map(([v,t]) => <option key={v} value={v}>{t}</option>)}</select><Input {...fieldProps("contact_whatsapp")} type="tel" inputMode="tel" autoComplete="tel-national" maxLength={20} placeholder="311 456 5403" value={data.contact_whatsapp} onChange={e => onChange({ contact_whatsapp: e.target.value })} className="h-12 text-base min-w-0" /></div>{error("contact_whatsapp")}</div>
      <div><div className="flex gap-3 items-start"><Checkbox id="privacy_consent" checked={data.privacy_consent} onCheckedChange={checked => onChange({ privacy_consent: checked === true })} aria-invalid={!!errors.privacy_consent} aria-describedby={errors.privacy_consent ? "privacy_consent-error" : undefined} className="mt-1" /><label htmlFor="privacy_consent" className="text-sm leading-relaxed">Autorizo a ROICAS a usar mis datos para responder esta solicitud, según la <Link to="/politica-privacidad" target="_blank" rel="noopener noreferrer" className="text-brand underline">Política de Privacidad</Link>.</label></div>{error("privacy_consent")}</div>
      <div className="hidden" aria-hidden="true"><input aria-label="Dejar vacío" tabIndex={-1} autoComplete="off" value={data.website_source_hp || ""} onChange={e => onChange({ website_source_hp: e.target.value })} /></div>
    </>}
  </div>;
}
