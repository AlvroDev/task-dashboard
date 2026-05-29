import { useState } from "react";
import { useUpdateTask } from "@/hooks/useTareas";
import { useUsers } from "@/hooks/useUsers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Task, Priority, TaskStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PropsEditTaskModal {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export default function EditTaskModal({ isOpen, onOpenChange, task }: PropsEditTaskModal) {
  const { mutate, isPending } = useUpdateTask();
  const { data: respuestaUsuarios, isLoading: cargandoUsuarios } = useUsers();

  const [formData, setFormData] = useState({
    title:       task.todo,
    description: task.description,
    priority:    task.priority as Priority,
    status:      task.status as TaskStatus,
    userId:      String(task.userId),
  });

  // ── Actualizar campo de texto / textarea ──────────────────────────────────
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Actualizar campo Select (shadcn) ──────────────────────────────────────
  const handleSelectChange = (campo: keyof typeof formData, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        id: task.id,
        payload: {
          todo:        formData.title.trim(),
          description: formData.description.trim(),
          priority:    formData.priority,
          userId:      Number(formData.userId),
          completed:   formData.status === "completed",
          createdAt:   task.createdAt,
        },
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  const CLASE_LABEL = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar tarea</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">

          {/* Título */}
          <div>
            <label className={CLASE_LABEL}>Título</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isPending}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className={CLASE_LABEL}>Descripción</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              disabled={isPending}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Prioridad */}
            <div>
              <label className={CLASE_LABEL}>Prioridad</label>
              <Select
                value={formData.priority}
                onValueChange={(v) => handleSelectChange("priority", v)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div>
              <label className={CLASE_LABEL}>Estado</label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleSelectChange("status", v)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in-progress">En progreso</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Usuario asignado */}
          <div>
            <label className={CLASE_LABEL}>Asignado a</label>
            <Select
              value={formData.userId}
              onValueChange={(v) => handleSelectChange("userId", v)}
              disabled={isPending || cargandoUsuarios}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={cargandoUsuarios ? "Cargando..." : "Seleccioná un usuario"}
                />
              </SelectTrigger>
              <SelectContent>
                {respuestaUsuarios?.users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.firstName} {u.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}