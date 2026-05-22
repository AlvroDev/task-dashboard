import { useQuery } from "@tanstack/react-query";
import { usersService } from "../modules/Usuarios/usuarios.service";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    
    queryFn: () => usersService.getAll(),
    
    staleTime: 300000, 
  });
};