import { useQuery } from "@tanstack/react-query";
import { tasksService } from "@/modules/Tareas/tareas.service";
// Este hook es el que vamos a usar en nuestros componentes para obtener las tareas con paginación.
// Este hook es el que vamos a usar en nuestros componentes para obtener las tareas con paginación.
import type { PaginationParams } from "../types";

export const useTasks = (params: PaginationParams) => {
  return useQuery({
    // El queryKey es como el "DNI" de esta consulta. 
    // Si los params (limit o skip) cambian, React Query lo detecta y recarga.
    queryKey: ["tasks", params], 
    
    // Aquí llamamos al servicio que definimos antes
    queryFn: () => tasksService.getAll(params),
    
    // Esto mantiene los datos viejos en pantalla mientras carga los nuevos (ideal para paginación)
    placeholderData: (previousData) => previousData,
  });
};