// ─── CORRECCIÓN ───────────────────────────────────────────────────────────────
// Antes: importaba useUpdateTodo desde "@/hooks/useTask"
//        → el hook se renombró a useUpdateTask y se movió a @/hooks/useTareas
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useUpdateTask } from "@/hooks/useTareas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

  const [formData, setFormData] = useState({
    title: task.todo,
    description: task.description,
    priority: task.priority as Priority,
    status: task.status as TaskStatus,
    completed: task.completed,
    userId: task.userId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.currentTarget as HTMLInputElement;
    const { name, type, value } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      {
        id: task.id,
        payload: {
          todo: formData.title,
          description: formData.description,
          priority: formData.priority,
          userId: Number(formData.userId),
          completed: formData.status === "completed" || formData.completed,
          createdAt: task.createdAt,
        },
      },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  const CLASE_CAMPO =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:opacity-50 transition-colors";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar tarea</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isPending}
              className={CLASE_CAMPO}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              disabled={isPending}
              className={`${CLASE_CAMPO} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isPending}
                className={CLASE_CAMPO}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isPending}
                className={CLASE_CAMPO}
              >
                <option value="pending">Pendiente</option>
                <option value="in-progress">En progreso</option>
                <option value="completed">Completada</option>
              </select>
            </div>
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