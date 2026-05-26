// ─── CORRECCIÓN ───────────────────────────────────────────────────────────────
// Antes: importaba useDeleteTodo desde "@/hooks/useTask"
//        → el hook se renombró a useDeleteTask y se movió a @/hooks/useTareas
// ─────────────────────────────────────────────────────────────────────────────

import { useDeleteTask } from "@/hooks/useTareas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface PropsDeleteTaskModal {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  id: number;
}

export default function DeleteTaskModal({ isOpen, onOpenChange, id }: PropsDeleteTaskModal) {
  const { mutate, isPending } = useDeleteTask();

  const handleDelete = () => {
    mutate(id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Eliminar tarea
          </DialogTitle>
          <DialogDescription className="pt-1">
            Esta acción no se puede deshacer. ¿Querés continuar?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}