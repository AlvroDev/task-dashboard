import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Config visual de prioridades ─────────────────────────────────────────────
const CONFIG_PRIORIDAD = {
  high:   { label: "Alta",  clase: "bg-red-500/20 text-red-400 border border-red-500/30" },
  medium: { label: "Media", clase: "bg-orange-500/20 text-orange-400 border border-orange-500/30" },
  low:    { label: "Baja",  clase: "bg-teal-500/20 text-teal-400 border border-teal-500/30" },
} as const;

function formatearFecha(fecha?: string): string {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-AR", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface PropsTablaTareas {
  tareas: Task[];
  mapaUsuarios: Map<number, string>;
  onEditar: (tarea: Task) => void;
  onEliminar: (tarea: Task) => void;
  onToggleEstado: (tarea: Task) => void;
  pagina: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
  actualizando: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────
export function TablaTareas({
  tareas,
  mapaUsuarios,
  onEditar,
  onEliminar,
  onToggleEstado,
  pagina,
  totalPaginas,
  onCambiarPagina,
  actualizando,
}: PropsTablaTareas) {

  if (tareas.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card p-8 text-center">
        <p className="text-muted-foreground text-sm">
          No se encontraron tareas con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">

            <thead className="bg-muted/50 border-b border-border/50">
              <tr>
                {["ID", "Título", "Descripción", "Prioridad", "Estado", "Asignado a", "Creación", ""].map((h, i) => (
                  <th
                    key={i}
                    className={cn(
                      "px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                      h === "Descripción" && "hidden md:table-cell",
                      h === "Asignado a"  && "hidden lg:table-cell",
                      h === "Creación"    && "hidden xl:table-cell",
                      h === ""            && "w-14",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border/30">
              {tareas.map((tarea) => (
                <tr key={tarea.id} className="group hover:bg-muted/30 transition-colors">

                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    #{tarea.id}
                  </td>

                  <td className="px-4 py-3 max-w-45">
                    <span className={cn(
                      "font-medium line-clamp-1 block",
                      tarea.completed && "line-through text-muted-foreground"
                    )}>
                      {tarea.todo}
                    </span>
                  </td>

                  <td className="hidden md:table-cell px-4 py-3 max-w-50">
                    <span className="text-xs text-muted-foreground line-clamp-2 block">
                      {tarea.description || "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {tarea.priority && (
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                        CONFIG_PRIORIDAD[tarea.priority].clase
                      )}>
                        {CONFIG_PRIORIDAD[tarea.priority].label}
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => onToggleEstado(tarea)}
                      disabled={actualizando}
                      className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary disabled:opacity-50 cursor-pointer"
                    >
                      {tarea.completed ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-teal-400" />
                          <span className="text-teal-400">Hecho</span>
                        </>
                      ) : (
                        <>
                          <Circle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Pendiente</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="hidden lg:table-cell px-4 py-3 text-sm whitespace-nowrap">
                    {mapaUsuarios.get(tarea.userId) || `#${tarea.userId}`}
                  </td>

                  <td className="hidden xl:table-cell px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {formatearFecha(tarea.createdAt)}
                  </td>

                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem onClick={() => onEditar(tarea)} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEliminar(tarea)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {pagina + 1} de {totalPaginas}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCambiarPagina(pagina - 1)}
              disabled={pagina === 0}
              className="cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCambiarPagina(pagina + 1)}
              disabled={pagina >= totalPaginas - 1}
              className="cursor-pointer"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}