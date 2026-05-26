

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/modules/Tareas/tareas.service";
import type { TaskFormValues } from "@/types";
import type { Filters } from "@/types/filters";

// ─── Clave base de caché ──────────────────────────────────────────────────────
// Centralizar la key evita typos dispersos en los invalidateQueries.
export const QUERY_KEY_TAREAS = ["todos"] as const;

// ─── Query: obtener y filtrar tareas ─────────────────────────────────────────
export const useTasks = (filters: Filters) => {
  return useQuery({
    queryKey: [...QUERY_KEY_TAREAS, filters],
    queryFn: async () => {
      const response = await tasksService.getAll();
      return response.todos.filter((task) => {
        const coincideBusqueda =
          filters.search === "" ||
          task.todo.toLowerCase().includes(filters.search.toLowerCase()) ||
          (task.description ?? "").toLowerCase().includes(filters.search.toLowerCase());

        const coincideEstado =
          filters.completed === null || task.completed === filters.completed;

        const coincideUsuario =
          filters.userId === null || task.userId === filters.userId;

        return coincideBusqueda && coincideEstado && coincideUsuario;
      });
    },
    // Mantiene datos anteriores visibles mientras recarga (ideal para paginación/filtros)
    placeholderData: (datosAnteriores) => datosAnteriores,
  });
};

// ─── Mutation: crear tarea ────────────────────────────────────────────────────
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nuevaTarea: TaskFormValues) => tasksService.create(nuevaTarea),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_TAREAS });
    },
    onError: (error: Error) => {
      console.error("Error al crear la tarea:", error.message);
    },
  });
};

// ─── Mutation: actualizar tarea ───────────────────────────────────────────────
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<TaskFormValues & { completed: boolean }>;
    }) => tasksService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_TAREAS });
    },
  });
};

// ─── Mutation: eliminar tarea ─────────────────────────────────────────────────
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tasksService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_TAREAS });
    },
  });
};