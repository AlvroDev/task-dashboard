import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/modules/Tareas/tareas.service";
import type { TaskFormValues } from "@/types";

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: number) => tasksService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });
}

export const useUpdateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { id: number, payload: Partial<TaskFormValues & { completed: boolean }> }) => tasksService.update(data.id, data.payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });
}