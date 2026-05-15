export type Priority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  id: number;
  todo: string;
  description: string;
  priority: Priority;
  completed: boolean;
  status: TaskStatus;
  userId: number;
  createdAt: string;
}

export interface TaskFormValues {
  todo: string;
  description: string;
  priority: Priority;
  userId: number;
  createdAt: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
 
}

export interface TodosResponse {
  todos: Task[];
  total: number;
  skip: number;
  limit: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface TaskFilters {
  status: TaskStatus | "all";
  priority: Priority | "all";
  userId: number | "all";
  search: string;
}

export interface PaginationParams {
  limit: number;
  skip: number;
}