import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/modules/Tareas/tareas.service";
import type { TaskFormValues, Priority } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CreateTaskForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [userId, setUserId] = useState<number>(1);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: TaskFormValues) => {
            return tasksService.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
            setTitle("");
            setDescription("");
            setPriority("medium");
            setUserId(1);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        mutate({
            todo: title,
            description,
            priority,
            userId,
            createdAt: new Date().toISOString()
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Tarea</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Título
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ingresa el título de la tarea"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ingresa la descripción (opcional)"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                            Prioridad
                        </label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                            Usuario
                        </label>
                        <input
                            id="userId"
                            type="number"
                            value={userId}
                            onChange={(e) => setUserId(parseInt(e.target.value))}
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
                >
                    {isPending ? "Creando..." : "Crear Tarea"}
                </Button>
            </form>
        </div>
    );
}
