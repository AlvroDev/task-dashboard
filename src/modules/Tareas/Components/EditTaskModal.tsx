import { useUpdateTodo } from "@/hooks/UseTodos";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";

export default function EditTaskModal({
    isOpen,
    onOpenChange,
    task
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task;
}) {
    const { mutate } = useUpdateTodo();

    const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const completed = formData.get('completed') === 'on';

        mutate({ id: task.id, payload: { todo: title, description, completed } });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Tarea</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={task.todo}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            name="description"
                            defaultValue={task.description}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="completed" className="block text-sm font-medium text-gray-700">Completada</label>
                        <input
                            type="checkbox"
                            name="completed"
                            defaultChecked={task.completed}
                            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Actualizar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}