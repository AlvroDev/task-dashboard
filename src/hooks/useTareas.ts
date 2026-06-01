import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/modules/Tareas/tareas.service";
import type { Task, TaskFormValues } from "@/types";
import type { Filters } from "@/types/filters";

export const QUERY_KEY_TAREAS = ["todos"] as const;

// ─── Query: listar y filtrar tareas ──────────────────────────────────────────
export const useTasks = (filters: Filters) => {
  return useQuery({
    queryKey: [...QUERY_KEY_TAREAS, filters],
    queryFn: async () => {
  const response = await tasksService.getAll();
  const prioridades = ["low", "medium", "high"] as const;

  const tareas = response.todos.map((task) => ({
    ...task,
    description: task.description ?? "",
    priority: task.priority ?? prioridades[task.id % 3],
    createdAt: task.createdAt ?? new Date(2026, task.id % 12, task.id % 28 + 1).toISOString(),
    status: (task.completed ? "completed" : "pending") as "pending" | "in-progress" | "completed",
  }));

  return tareas.filter((task) => {
    const coincideBusqueda =
      filters.search === "" ||
      task.todo.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase());

    const coincideEstado =
      filters.completed === null || task.completed === filters.completed;

    const coincideUsuario =
      filters.userId === null || task.userId === filters.userId;

    return coincideBusqueda && coincideEstado && coincideUsuario;
  });
},
    placeholderData: (prev) => prev,
  });
};

// ─── Mutation: crear tarea (optimistic) ──────────────────────────────────────
// DummyJSON no persiste datos reales. El optimistic update agrega la tarea
// a la caché local inmediatamente para que aparezca en la tabla sin recargar.
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nuevaTarea: TaskFormValues) => tasksService.create(nuevaTarea),

    onSuccess: (tareaCreada, nuevaTarea) => {
      const prioridades = ["low", "medium", "high"] as const;
  const tareaCompleta = {
    ...tareaCreada,
    description: nuevaTarea.description ?? "",
    priority: nuevaTarea.priority ?? prioridades[tareaCreada.id % 3],
    createdAt: nuevaTarea.createdAt ?? new Date().toISOString(),
    status: tareaCreada.completed ? "completed" : "pending" as "pending" | "in-progress" | "completed",
  };
      // Inyectar la tarea devuelta por la API en todas las variantes de caché
      // que coincidan con la queryKey base (independientemente de los filtros activos)
      queryClient.setQueriesData<Task[]>(
        { queryKey: QUERY_KEY_TAREAS },
        (tareasActuales) => {
          if (!tareasActuales) return [tareaCompleta];
          // Evitar duplicados si ya existe (doble render en StrictMode)
          const existe = tareasActuales.some((t) => t.id === tareaCompleta.id);
          return existe ? tareasActuales : [tareaCompleta, ...tareasActuales];
        }
      );
    },

    onError: (error: Error) => {
      console.error("Error al crear la tarea:", error.message);
    },
  });
};

// ─── Mutation: actualizar tarea (optimistic) ─────────────────────────────────
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

    // Optimistic update: modificar la caché antes de que responda la API
    onMutate: async ({ id, payload }) => {
      // Cancelar refetches en vuelo para no sobreescribir el optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEY_TAREAS });

      // Guardar snapshot para rollback en caso de error
      const snapshot = queryClient.getQueriesData<Task[]>({ queryKey: QUERY_KEY_TAREAS });

      // Aplicar el cambio localmente en todas las variantes de caché
      queryClient.setQueriesData<Task[]>(
        { queryKey: QUERY_KEY_TAREAS },
        (tareasActuales) =>
          tareasActuales?.map((t) =>
            t.id === id ? { ...t, ...payload, todo: payload.todo ?? t.todo } : t
          )
      );

      return { snapshot };
    },

    // Si la API falla, revertir al snapshot
    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        context.snapshot.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // Siempre sincronizar con la API al terminar (éxito o error)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_TAREAS });
    },
  });
};

// ─── Mutation: eliminar tarea (optimistic) ───────────────────────────────────
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tasksService.remove(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY_TAREAS });

      const snapshot = queryClient.getQueriesData<Task[]>({ queryKey: QUERY_KEY_TAREAS });

      queryClient.setQueriesData<Task[]>(
        { queryKey: QUERY_KEY_TAREAS },
        (tareasActuales) => tareasActuales?.filter((t) => t.id !== id)
      );

      return { snapshot };
    },

    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        context.snapshot.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_TAREAS });
    },
  });
};