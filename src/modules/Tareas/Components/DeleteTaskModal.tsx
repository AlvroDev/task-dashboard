import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTodo } from "@/hooks/UseTodos";

export default function DeleteTaskModal({
  isOpen,
  onOpenChange,
  id
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  id: number;
}) {
  const { mutate } = useDeleteTodo();

  const handleDelete = () => {
    mutate(id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}> 
        <DialogContent>
            <DialogHeader>
                <DialogTitle>¿Estás seguro de que quieres eliminar esta tarea?</DialogTitle>
                <DialogDescription>
                    Esta acción no se puede deshacer.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose>Cancelar</DialogClose>
                <Button onClick={handleDelete}>Eliminar</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}