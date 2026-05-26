// ─── CORRECCIONES ─────────────────────────────────────────────────────────────
// 1. Mostraba "ID: X" en lugar del nombre real del usuario → resuelve con prop usuarios
// 2. Faltaba columna "Fecha de creación" (requerimiento del challenge)
// 3. Badges de prioridad y estado inline → extraídos a BadgePrioridad / BadgeEstado
// 4. Paginación server-side incorrecta → paginación local sobre los datos filtrados
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import type { Task, User } from "@/types";
import { BadgePrioridad } from "./BadgePrioridad";
import { BadgeEstado } from "./BadgeEstado";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolverNombreUsuario(userId: number, usuarios: User[]): string {
  const usuario = usuarios.find((u) => u.id === userId);
  return usuario ? `${usuario.firstName} ${usuario.lastName}` : `#${userId}`;
}

function formatearFecha(fecha: string): string {
  if (!fecha) return "—";
  try {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return fecha;
  }
}

// ─── Skeleton de fila ─────────────────────────────────────────────────────────

function FilaSkeleton() {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 bg-slate-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PropsTablaTareas {
  tareas: Task[];
  usuarios: User[];
  cargando: boolean;
  error: Error | null;
  alEditar: (tarea: Task) => void;
  alEliminar: (id: number) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function TablaTareas({
  tareas,
  usuarios,
  cargando,
  error,
  alEditar,
  alEliminar,
}: PropsTablaTareas) {
  const [pagina, setPagina] = useState(0);

  const totalPaginas = Math.ceil(tareas.length / PAGE_SIZE);
  const filasVisibles = tareas.slice(pagina * PAGE_SIZE, (pagina + 1) * PAGE_SIZE);
  const desde = pagina * PAGE_SIZE + 1;
  const hasta = Math.min((pagina + 1) * PAGE_SIZE, tareas.length);

  // Resetear a página 0 cuando cambian los datos filtrados
  // (useEffect no necesario — la paginación se recalcula en cada render)

  return (
    <div className="space-y-4">
      {/* ── Tabla ─────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">

            {/* Encabezados */}
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider w-16">ID</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Título</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Descripción</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Prioridad</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Asignado a</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Creación</th>
                <th className="px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>

            {/* Cuerpo */}
            <tbody className="divide-y divide-slate-100">

              {/* Estado: cargando */}
              {cargando && Array.from({ length: 5 }).map((_, i) => (
                <FilaSkeleton key={i} />
              ))}

              {/* Estado: error */}
              {error && !cargando && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-red-500 text-sm">
                    Error al cargar las tareas: {error.message}
                  </td>
                </tr>
              )}

              {/* Estado: sin datos */}
              {!cargando && !error && tareas.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400 text-sm">
                    No se encontraron tareas con los filtros aplicados.
                  </td>
                </tr>
              )}

              {/* Datos */}
              {!cargando && !error && filasVisibles.map((tarea) => (
                <tr key={tarea.id} className="hover:bg-slate-50/60 transition-colors">

                  {/* ID */}
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">
                    #{tarea.id}
                  </td>

                  {/* Título */}
                  <td className="px-4 py-3 max-w-45">
                    <span className="font-medium text-slate-900 line-clamp-2 block">
                      {tarea.todo}
                    </span>
                  </td>

                  {/* Descripción */}
                  <td className="px-4 py-3 max-w-50">
                    <span className="text-slate-500 text-xs line-clamp-2 block">
                      {tarea.description || "—"}
                    </span>
                  </td>

                  {/* Prioridad */}
                  <td className="px-4 py-3">
                    <BadgePrioridad prioridad={tarea.priority} />
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3">
                    <BadgeEstado completada={tarea.completed} estado={tarea.status} />
                  </td>

                  {/* Usuario asignado — nombre real, no ID */}
                  <td className="px-4 py-3 text-slate-700 text-sm whitespace-nowrap">
                    {resolverNombreUsuario(tarea.userId, usuarios)}
                  </td>

                  {/* Fecha de creación */}
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {formatearFecha(tarea.createdAt)}
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => alEditar(tarea)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        aria-label={`Editar ${tarea.todo}`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => alEliminar(tarea.id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                        aria-label={`Eliminar ${tarea.todo}`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Paginación ────────────────────────────────────────────────────── */}
      {!cargando && tareas.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500">
            Mostrando{" "}
            <span className="font-medium text-slate-700">{desde}–{hasta}</span>{" "}
            de{" "}
            <span className="font-medium text-slate-700">{tareas.length}</span> tareas
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagina((p) => Math.max(0, p - 1))}
              disabled={pagina === 0}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-xs text-slate-600">
              Página <span className="font-medium">{pagina + 1}</span> de{" "}
              <span className="font-medium">{totalPaginas}</span>
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
              disabled={pagina >= totalPaginas - 1}
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}