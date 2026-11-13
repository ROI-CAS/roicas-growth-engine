import React, { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Search, MessageSquare, ArrowRight, Zap, CheckCircle2, ShieldCheck, Activity } from "lucide-react";

interface PipelineNode {
  id: string;
  step: string;
  title: string;
  kicker: string;
  icon: React.ElementType;
  metric: string;
  detail: string;
  status: string;
}

const nodes: PipelineNode[] = [
  {
    id: "web",
    step: "01",
    title: "Web & Tiendas",
    kicker: "Plataforma Central",
    icon: Globe,
    metric: "< 1.2s velocidad",
    detail: "Arquitectura optimizada para que el usuario entienda tu valor en 5 segundos.",
    status: "99.98% uptime",
  },
  {
    id: "traffic",
    step: "02",
    title: "Buscadores & Pauta",
    kicker: "Atracción Activa",
    icon: Search,
    metric: "Google Top 3",
    detail: "SEO técnico e indexación para captar intención de compra sin depender solo de anuncios.",
    status: "Search Console Live",
  },
  {
    id: "crm",
    step: "03",
    title: "WhatsApp & CRM",
    kicker: "Cierre Comercial",
    icon: MessageSquare,
    metric: "< 2 min respuesta",
    detail: "Flujo unificado para que ninguna consulta se quede sin respuesta ni seguimiento.",
    status: "Lead Routing Activo",
  },
];

export function ConnectionPipelineHud() {
  const [activeNode, setActiveNode] = useState(nodes[0]);

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-[#121019]/90 backdrop-blur-xl p-5 sm:p-6 shadow-2xl overflow-hidden text-left">
      {/* Luz ambiental sutil */}
      <div 
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[hsl(var(--brand-on-dark)/0.15)] blur-3xl"
        aria-hidden="true" 
      />

      {/* Topbar del HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-xs font-mono font-semibold tracking-wide text-white uppercase">
            Arquitectura 360° en Producción
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] font-mono text-white/70">
          <Activity size={12} className="text-[hsl(var(--brand-on-dark))]" />
          <span>Sincronización Continua</span>
        </div>
      </div>

      {/* Pipeline Interactivo: 3 Nodos Conectados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative mb-5">
        {nodes.map((node) => {
          const Icon = node.icon;
          const isActive = activeNode.id === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveNode(node)}
              className={`group relative text-left rounded-xl p-3.5 transition-all duration-300 border ${
                isActive
                  ? "border-[hsl(var(--brand-on-dark)/0.6)] bg-white/[0.08] shadow-[0_0_20px_hsl(var(--brand-on-dark)/0.2)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
                  isActive ? "text-[hsl(var(--brand-on-dark))]" : "text-white/40"
                }`}>
                  Nodo {node.step}
                </span>
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-white/20"}`} />
              </div>

              <div className="flex items-center gap-2.5 mb-1.5">
                <div className={`p-1.5 rounded-lg border transition-colors ${
                  isActive 
                    ? "border-[hsl(var(--brand-on-dark)/0.4)] bg-[hsl(var(--brand-on-dark)/0.15)] text-[hsl(var(--brand-on-dark))]" 
                    : "border-white/10 bg-white/5 text-white/70 group-hover:text-white"
                }`}>
                  <Icon size={16} />
                </div>
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  {node.title}
                </h4>
              </div>

              <p className="text-[12px] text-white/60 mb-2 leading-relaxed">
                {node.kicker}
              </p>

              <div className="inline-flex items-center gap-1 rounded bg-black/40 border border-white/5 px-2 py-0.5 text-[11px] font-mono text-emerald-400">
                <Zap size={10} />
                <span>{node.metric}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Panel Detalle de Telemetría del Nodo Activo */}
      <motion.div 
        key={activeNode.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl border border-white/10 bg-black/40 p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-white">
              {activeNode.title}: {activeNode.detail}
            </span>
          </div>
          <span className="text-[11px] font-mono text-[hsl(var(--brand-on-dark))] bg-[hsl(var(--brand-on-dark)/0.1)] border border-[hsl(var(--brand-on-dark)/0.25)] px-2 py-0.5 rounded">
            {activeNode.status}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
          <span>Flujo de datos integrado en tiempo real</span>
          <span className="text-white/80 font-mono text-[11px]">Latencia: 42ms · TLS 1.3</span>
        </div>
      </motion.div>
    </div>
  );
}

