import { httpClient } from "@/lib/http";
import type { Task, TaskFormValues, TodosResponse, Priority, TaskStatus } from "@/types";

export const tasksService = {
  getAll: async (): Promise<TodosResponse> => {
    const {data} = await httpClient.get('/todos?limit=250&skip=0');
    return data;
  },

  getById: async (id: number): Promise<Task> => {
    const { data } = await httpClient.get(`/todos/${id}`);
    return data;
  },

  create: async (payload: TaskFormValues): Promise<Task> => {
    const { data } = await httpClient.post("/todos/add", payload);
    return data;
  },

  update: async (
    id: number, 
    payload: Partial<TaskFormValues & { 
      completed: boolean;
      status?: TaskStatus;
      priority?: Priority;
    }>
  ): Promise<Task> => {
    const { data } = await httpClient.put(`/todos/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<Task> => {
    const { data } = await httpClient.delete(`/todos/${id}`);
    return data;
  },
};