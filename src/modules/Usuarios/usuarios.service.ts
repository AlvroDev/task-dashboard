import { httpClient } from "../../lib/http";
import type { User, UsersResponse } from "../../types";

export const usersService = {
  // Traemos los usuarios para el selector del formulario 
  getAll: async (): Promise<UsersResponse> => {
    const { data } = await httpClient.get("/users?limit=100");
    return data;
  },

  // Por si necesitás los datos de un usuario específico [cite: 119]
  getById: async (id: number): Promise<User> => {
    const { data } = await httpClient.get(`/users/${id}`);
    return data;
  },
};