import { useState } from "react";
import { useCreateTask } from "../../hooks/useCreateTask";
import { useUsers } from "../../hooks/useUsers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CreateTaskForm = () => {
  const { mutate: createTask, isPending } = useCreateTask();
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();

  const [todo, setTodo] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!todo.trim() || !userId) {
      setError("El título y el usuario asignado son obligatorios.");
      return;
    }

    createTask(
      {
        todo,
        description,
        priority,
        userId: Number(userId),
        createdAt: new Date().toISOString().split("T")[0],
      },
      {
        onSuccess: () => {
          setTodo("");
          setDescription("");
          setPriority("medium");
          setUserId("");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-white rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Crear Nueva Tarea</h3>
        <p className="text-sm text-slate-500">Asigna tareas a los miembros de tu equipo de desarrollo.</p>
      </div>
      
      {error && (
        <div className="p-3 text-sm font-medium text-red-800 bg-red-50 border border-red-200 rounded-md">
          ⚠️ {error}
        </div>
      )}

      {/* Input de Título con Shadcn */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Título de la tarea</label>
        <Input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="Ej: Diseñar la arquitectura de la base de datos"
        />
      </div>

      {/* Textarea de Descripción con Shadcn */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Descripción (Opcional)</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalla los entregables de esta tarea..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Selector de Prioridad con Shadcn */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Prioridad</label>
          <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Selector de Usuario con Shadcn */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Asignar a</label>
          <Select value={userId} onValueChange={(value) => setUserId(value)}>
            <SelectTrigger disabled={isLoadingUsers}>
              <SelectValue placeholder={isLoadingUsers ? "Cargando usuarios..." : "Seleccionar miembro"} />
            </SelectTrigger>
            <SelectContent>
              {usersData?.users.map((u) => (
                <SelectItem key={u.id} value={u.id.toString()}>
                  {u.firstName} {u.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botón de Enviar con Shadcn y estado Loading */}
      <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        {isPending ? "Guardando tarea..." : "Crear Tarea"}
      </Button>
    </form>
  );
};