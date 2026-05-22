import { useUpdateTodo } from "@/hooks/useTask";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Task, Priority, TaskStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function EditTaskModal({
    isOpen,
    onOpenChange,
    task
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task;
}) {
    const { mutate, isPending } = useUpdateTodo();
    
    const [formData, setFormData] = useState({
        title: task.todo,
        description: task.description,
        priority: task.priority as Priority,
        status: task.status as TaskStatus,
        completed: task.completed,
        userId: task.userId
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type, value, checked } = e.currentTarget as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        mutate({
            id: task.id,
            payload: {
                todo: formData.title,
                description: formData.description,
                priority: formData.priority,
                userId: formData.userId,
                completed: formData.completed,
                createdAt: task.createdAt
            }
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Tarea</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Grid para campos menores */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Prioridad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prioridad
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                            </select>
                        </div>

                        {/* Usuario ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Usuario ID
                            </label>
                            <input
                                type="number"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="pending">Pendiente</option>
                            <option value="in-progress">En Progreso</option>
                            <option value="completed">Completada</option>
                        </select>
                    </div>

                    {/* Checkbox Completada */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="completed"
                            checked={formData.completed}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                            id="completed"
                        />
                        <label htmlFor="completed" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                            Marcar como completada
                        </label>
                    </div>

                    {/* Botones */}
                    <DialogFooter className="flex justify-between pt-4">
                        <Button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                            disabled={isPending}
                        >
                            {isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}