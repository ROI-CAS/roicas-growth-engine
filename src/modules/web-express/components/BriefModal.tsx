import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/modules/web-express/components/ui/dialog";
import { Button } from "@/modules/web-express/components/ui/button";
import { Input } from "@/modules/web-express/components/ui/input";
import { Textarea } from "@/modules/web-express/components/ui/textarea";
import { Label } from "@/modules/web-express/components/ui/label";
import { ArrowRight, CheckCircle2, MessageCircle, Zap } from "lucide-react";
import { toast } from "sonner";

interface BriefModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BriefModal({ open, onOpenChange }: BriefModalProps) {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !whatsapp.trim() || !empresa.trim()) {
      toast.error("Por favor completa los campos requeridos (*)");
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);

    toast.success("Mensaje preparado", {
      description: "Revisa el mensaje en WhatsApp y envíalo para completar tu solicitud.",
    });

    const text = encodeURIComponent(
      `Hola Web Express 24H, solicito mi página web profesional.\n\n` +
      `👤 Nombre: ${nombre}\n` +
      `🏢 Negocio: ${empresa}\n` +
      `📱 WhatsApp: ${whatsapp}` +
      (descripcion ? `\n📝 Notas: ${descripcion}` : "")
    );

    window.open(`https://wa.me/573114565403?text=${text}`, "_blank");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      setNombre("");
      setWhatsapp("");
      setEmpresa("");
      setDescripcion("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-6 sm:p-8 rounded-3xl gap-0 overflow-hidden">
        <DialogHeader className="pb-4 space-y-2">
          <div className="flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-wider">
            <Zap className="size-4 fill-current" />
            Solicitud Web Express
          </div>
          <DialogTitle className="text-2xl font-display font-bold tracking-tight">
            Pide tu Página Web
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">Prepara tu mensaje con estos datos. Se abrirá WhatsApp para que lo revises y envíes.</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="size-14 rounded-full bg-brand/10 text-brand grid place-items-center mx-auto">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-xl font-bold">¡Solicitud Lista!</h3>
            <p className="text-xs text-muted-foreground">
              Revisa y envía el mensaje en WhatsApp. Prepararlo aquí no confirma que ROICAS lo haya recibido.
            </p>
            <Button
              onClick={handleClose}
              className="w-full h-11 rounded-full bg-brand text-brand-foreground font-semibold"
            >
              Entendido
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="modal-nombre" className="text-xs font-semibold text-muted-foreground uppercase">
                Tu Nombre *
              </Label>
              <Input
                id="modal-nombre"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juan Pérez"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-whatsapp" className="text-xs font-semibold text-muted-foreground uppercase">
                WhatsApp *
              </Label>
              <Input
                id="modal-whatsapp"
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+57 311 456 5403"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-empresa" className="text-xs font-semibold text-muted-foreground uppercase">
                Nombre de tu Negocio *
              </Label>
              <Input
                id="modal-empresa"
                required
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Mi Negocio S.A."
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-descripcion" className="text-xs font-semibold text-muted-foreground uppercase">
                ¿Qué vende tu negocio? (Opcional)
              </Label>
              <Textarea
                id="modal-descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Breve descripción o link de referencia..."
                className="min-h-20 resize-none rounded-xl text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-xl bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-sm shadow-lg shadow-brand/20 gap-2 mt-2"
            >
              {submitting ? "Enviando..." : <>Solicitar en 24H <ArrowRight className="size-4" /></>}
            </Button>

            <button
              type="button"
              onClick={() => {
                const text = encodeURIComponent("Hola Web Express 24H, me interesa una página web profesional en 24h.");
                window.open(`https://wa.me/573114565403?text=${text}`, "_blank");
              }}
              className="w-full text-center text-xs text-muted-foreground hover:text-brand flex items-center justify-center gap-1.5 pt-1 cursor-pointer"
            >
              <MessageCircle className="size-3.5 text-emerald-500 fill-current" />
              O consultar directamente por WhatsApp
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
