import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/modules/Tareas/tareas.service";
import type { TaskFormValues } from "@/types";
import {useQuery} from "@tanstack/react-query";
import type { Filters }  from "@/types/filters";

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: number) => tasksService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });
}

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { id: number, payload: Partial<TaskFormValues & { completed: boolean }> }) => tasksService.update(data.id, data.payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });
}

export const useTasks = (filters: Filters) => {
    return useQuery({
        queryKey: ['todos', filters],
        queryFn: async () => {
            const response = await tasksService.getAll();
            return response.todos.filter(task => {
                const matchesSearch = filters.search === '' || 
                    task.todo.toLowerCase().includes(filters.search.toLowerCase());

                const matchesStatus = filters.completed === null || 
                    task.completed === filters.completed;

                const matchesUser = filters.userId === null || 
                    task.userId === filters.userId;

                return matchesSearch && matchesStatus && matchesUser;
            });
        }
    });
}
