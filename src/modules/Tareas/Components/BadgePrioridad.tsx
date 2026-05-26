import type { Priority } from "@/types";

// ─── Fuente única de verdad para estilos y etiquetas ─────────────────────────

const ESTILOS: Record<Priority, string> = {
  low:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border border-amber-200",
  high:   "bg-red-50 text-red-700 border border-red-200",
};

const ETIQUETAS: Record<Priority, string> = {
  low:    "Baja",
  medium: "Media",
  high:   "Alta",
};

interface PropsBadgePrioridad {
  prioridad: Priority;
}

export function BadgePrioridad({ prioridad }: PropsBadgePrioridad) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${ESTILOS[prioridad] ?? ESTILOS.medium}`}
    >
      {ETIQUETAS[prioridad] ?? prioridad}
    </span>
  );
}