// ─── CORRECCIÓN: import con mayúscula exacta para que no falle en Linux ───────
import "./App.css";

import { useState } from "react";
import { useFilters } from "@/hooks/filters";
import { useTasks } from "@/hooks/useTareas";
import { useUsers } from "@/hooks/useUsers";
import TaskFilters from "@/components/TaskFilters";
import { TablaTareas } from "@/modules/Tareas/Components/TablaTareas";
import { FormularioCrearTarea } from "@/modules/Tareas/Components/FormularioCrearTarea";
import EditTaskModal from "@/modules/Tareas/Components/EditTaskModal";
import DeleteTaskModal from "@/modules/Tareas/Components/DeleteTaskModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types";
import { Plus, LayoutDashboard } from "lucide-react";

// ─── Tipo del estado de modales ───────────────────────────────────────────────
// Un único objeto evita múltiples useState dispersos y hace el estado legible.

interface EstadoModales {
  crearAbierto: boolean;
  tareaAEditar: Task | null;
  idAEliminar: number | null;
}

const ESTADO_INICIAL: EstadoModales = {
  crearAbierto: false,
  tareaAEditar: null,
  idAEliminar: null,
};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [modales, setModales] = useState<EstadoModales>(ESTADO_INICIAL);

  // Filtros reactivos
  const { filters, setSearch, setCompleted, setUserId, resetFilters } = useFilters();

  // Datos — useTasks es el único hook de tareas (unificado)
  const { data: tareas = [], isLoading: cargando, error } = useTasks(filters);
  const { data: respuestaUsuarios } = useUsers();
  const usuarios = respuestaUsuarios?.users ?? [];

  // ── Handlers de modal ──────────────────────────────────────────────────────
  const abrirCrear    = () => setModales(p => ({ ...p, crearAbierto: true }));
  const cerrarCrear   = () => setModales(p => ({ ...p, crearAbierto: false }));
  const abrirEditar   = (t: Task) => setModales(p => ({ ...p, tareaAEditar: t }));
  const cerrarEditar  = () => setModales(p => ({ ...p, tareaAEditar: null }));
  const abrirEliminar = (id: number) => setModales(p => ({ ...p, idAEliminar: id }));
  const cerrarEliminar = () => setModales(p => ({ ...p, idAEliminar: null }));

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* ── Header fijo ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="h-5 w-5 text-indigo-600" />
            <div>
              <h1 className="text-base font-semibold text-slate-900 leading-tight">
                Gestor de Tareas
              </h1>
              <p className="text-xs text-slate-400 leading-tight hidden sm:block">
                Challenge Frontend — Dashboard de administración
              </p>
            </div>
          </div>
          <Button onClick={abrirCrear} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nueva tarea
          </Button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Filtros */}
        <TaskFilters
          filters={filters}
          onSearchChange={setSearch}
          onStatusChange={setCompleted}
          onUserChange={setUserId}
          onReset={resetFilters}
        />

        {/* Tabla */}
        <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">Listado de tareas</h2>
            <p className="text-xs text-slate-400">
              Visualizá, paginá y gestioná el estado de cada tarea.
            </p>
          </div>
          <TablaTareas
            tareas={tareas}
            usuarios={usuarios}
            cargando={cargando}
            error={error}
            alEditar={abrirEditar}
            alEliminar={abrirEliminar}
          />
        </section>
      </main>

      {/* ── Modal: Crear tarea ─────────────────────────────────────────────── */}
      <Dialog open={modales.crearAbierto} onOpenChange={cerrarCrear}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crear nueva tarea</DialogTitle>
          </DialogHeader>
          <FormularioCrearTarea alCrear={cerrarCrear} />
        </DialogContent>
      </Dialog>

      {/* ── Modal: Editar tarea ────────────────────────────────────────────── */}
      {modales.tareaAEditar && (
        <EditTaskModal
          isOpen
          onOpenChange={cerrarEditar}
          task={modales.tareaAEditar}
        />
      )}

      {/* ── Modal: Eliminar tarea ──────────────────────────────────────────── */}
      {modales.idAEliminar !== null && (
        <DeleteTaskModal
          isOpen
          onOpenChange={cerrarEliminar}
          id={modales.idAEliminar}
        />
      )}
    </div>
  );
}