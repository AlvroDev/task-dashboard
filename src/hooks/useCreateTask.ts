import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "../modules/Tareas/tareas.service";
import type { TaskFormValues } from "../types";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // La función que realmente hace el POST a la API
    mutationFn: (newTask: TaskFormValues) => tasksService.create(newTask),
    
    // Qué pasa cuando la API responde que está todo OK
    onSuccess: () => {
      // Esta línea es "magia": invalida la cache de 'tasks'
      // Esto obliga a la tabla a pedirlas de nuevo para mostrar la nueva 
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    
    // Podés agregar lógica si hay error [cite: 94]
    onError: (error) => {
      console.error("Error al crear la tarea:", error.message);
    }
  });
};