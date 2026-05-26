import type { TaskStatus } from "@/types";

// ─── Derivar estado cuando la API no devuelve `status` ────────────────────────
function derivarEstado(completada: boolean, estado?: TaskStatus): TaskStatus {
  if (estado && estado !== "pending") return estado;
  return completada ? "completed" : "pending";
}

const ESTILOS: Record<TaskStatus, string> = {
  "pending":     "bg-slate-100 text-slate-600 border border-slate-200",
  "in-progress": "bg-blue-50 text-blue-700 border border-blue-200",
  "completed":   "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const ETIQUETAS: Record<TaskStatus, string> = {
  "pending":     "Pendiente",
  "in-progress": "En progreso",
  "completed":   "Completada",
};

interface PropsBadgeEstado {
  completada: boolean;
  estado?: TaskStatus;
}

export function BadgeEstado({ completada, estado }: PropsBadgeEstado) {
  const estadoFinal = derivarEstado(completada, estado);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${ESTILOS[estadoFinal]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ETIQUETAS[estadoFinal]}
    </span>
  );
}