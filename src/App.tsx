import "./index.css";

import { useState, useMemo } from "react";
import { useFilters } from "@/hooks/filters";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/useTareas";
import { useUsers } from "@/hooks/useUsers";
import { FiltrosTareas } from "@/components/FiltrosTareas";
import { TablaTareas } from "@/modules/Tareas/Components/TablaTareas";
import { FormularioTareaDialog } from "@/modules/Tareas/Components/FormularioTareaDialog";
import { EliminarTareaDialog } from "@/modules/Tareas/Components/EliminarTareaDialog";
import { Button } from "@/components/ui/button";
import type { Task, Priority } from "@/types";
import { Plus, ListTodo, Loader2 } from "lucide-react";

const ITEMS_POR_PAGINA = 10;

export default function App() {
  const [pagina, setPagina] = useState(0);
  const [crearAbierto, setCrearAbierto] = useState(false);
  const [tareaAEditar, setTareaAEditar] = useState<Task | null>(null);
  const [tareaAEliminar, setTareaAEliminar] = useState<Task | null>(null);

  const { filters, setSearch, setCompleted, setUserId, resetFilters } = useFilters();
  const { data: tareas = [], isLoading: cargando, isError } = useTasks(filters);
  const { data: respuestaUsuarios, isLoading: cargandoUsuarios } = useUsers();

  const crearTarea   = useCreateTask();
  const editarTarea  = useUpdateTask();
  const borrarTarea  = useDeleteTask();

  // usuarios estabilizado para que useMemo no cambie en cada render
  const usuarios = useMemo(
    () => respuestaUsuarios?.users ?? [],
    [respuestaUsuarios]
  );

  // Mapa id → nombre completo para la tabla
  const mapaUsuarios = useMemo(() => {
    const map = new Map<number, string>();
    usuarios.forEach((u) => map.set(u.id, `${u.firstName} ${u.lastName}`));
    return map;
  }, [usuarios]);

  // Paginación local
  const tareasPaginadas = useMemo(() => {
    const inicio = pagina * ITEMS_POR_PAGINA;
    return tareas.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [tareas, pagina]);

  const totalPaginas = Math.max(1, Math.ceil(tareas.length / ITEMS_POR_PAGINA));

  // Stats
  const totalCompletadas = tareas.filter((t) => t.completed).length;
  const totalPendientes  = tareas.filter((t) => !t.completed).length;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleCrear = async (data: { todo: string; description: string; priority: Priority; userId: number }) => {
    await crearTarea.mutateAsync({
      ...data,
      createdAt: new Date().toISOString().split("T")[0],
    });
    setCrearAbierto(false);
  };

  const handleEditar = async (data: { todo: string; description: string; priority: Priority; userId: number }) => {
    if (!tareaAEditar) return;
    await editarTarea.mutateAsync({
      id: tareaAEditar.id,
      payload: {
        todo:        data.todo,
        description: data.description,
        priority:    data.priority,
        userId:      data.userId,
        completed:   tareaAEditar.completed,
        createdAt:   tareaAEditar.createdAt,
      },
    });
    setTareaAEditar(null);
  };

  const handleEliminar = async () => {
    if (!tareaAEliminar) return;
    await borrarTarea.mutateAsync(tareaAEliminar.id);
    setTareaAEliminar(null);
  };

  const handleToggleEstado = async (tarea: Task) => {
    await editarTarea.mutateAsync({
      id: tarea.id,
      payload: { completed: !tarea.completed },
    });
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-destructive text-lg font-medium">Error al cargar las tareas</p>
        <p className="text-muted-foreground">Intentá de nuevo más tarde</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-teal-500 to-teal-600">
              <ListTodo className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Task Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Gestioná las tareas de tu equipo de forma eficiente
              </p>
            </div>
          </div>
          <Button
            onClick={() => setCrearAbierto(true)}
            className="gap-2 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>

        {/* ── Filtros ─────────────────────────────────────────────────────── */}
        <FiltrosTareas
          filters={filters}
          onSearchChange={(v) => { setSearch(v); setPagina(0); }}
          onStatusChange={(v) => { setCompleted(v); setPagina(0); }}
          onUserChange={(v) => { setUserId(v); setPagina(0); }}
          onReset={() => { resetFilters(); setPagina(0); }}
          usuarios={usuarios}
          cargandoUsuarios={cargandoUsuarios}
        />

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border/50 bg-card p-4">
            <p className="text-sm text-muted-foreground">Total tareas</p>
            <p className="text-2xl font-bold">{tareas.length}</p>
          </div>
          <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
            <p className="text-sm text-teal-400">Completadas</p>
            <p className="text-2xl font-bold text-teal-400">{totalCompletadas}</p>
          </div>
          <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
            <p className="text-sm text-orange-400">Pendientes</p>
            <p className="text-2xl font-bold text-orange-400">{totalPendientes}</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-4">
            <p className="text-sm text-muted-foreground">Filtradas</p>
            <p className="text-2xl font-bold">{tareas.length}</p>
          </div>
        </div>

        {/* ── Tabla ───────────────────────────────────────────────────────── */}
        {cargando ? (
          <div className="flex items-center justify-center min-h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <TablaTareas
            tareas={tareasPaginadas}
            mapaUsuarios={mapaUsuarios}
            onEditar={setTareaAEditar}
            onEliminar={setTareaAEliminar}
            onToggleEstado={handleToggleEstado}
            pagina={pagina}
            totalPaginas={totalPaginas}
            onCambiarPagina={setPagina}
            actualizando={editarTarea.isPending}
          />
        )}

        {/* ── Dialogs ─────────────────────────────────────────────────────── */}
        <FormularioTareaDialog
          abierto={crearAbierto}
          onAbiertoCambio={setCrearAbierto}
          onSubmit={handleCrear}
          usuarios={usuarios}
          cargando={crearTarea.isPending}
          titulo="Crear nueva tarea"
        />

        <FormularioTareaDialog
          abierto={!!tareaAEditar}
          onAbiertoCambio={(open) => !open && setTareaAEditar(null)}
          onSubmit={handleEditar}
          usuarios={usuarios}
          cargando={editarTarea.isPending}
          titulo="Editar tarea"
          valoresPorDefecto={
            tareaAEditar
              ? {
                  todo:        tareaAEditar.todo,
                  description: tareaAEditar.description || "",
                  priority:    tareaAEditar.priority || "medium",
                  userId:      tareaAEditar.userId,
                }
              : undefined
          }
        />

        <EliminarTareaDialog
          abierto={!!tareaAEliminar}
          onAbiertoCambio={(open) => !open && setTareaAEliminar(null)}
          onConfirmar={handleEliminar}
          tituloTarea={tareaAEliminar?.todo || ""}
          cargando={borrarTarea.isPending}
        />
      </div>
    </div>
  );
}