import { useTodos } from "@/hooks/UseTodos";
import { useUpdateTodo } from "@/hooks/UseTodos";
import type { Filters } from "@/types/filters";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";
import EditTaskModal from "@/modules/Tareas/Components/EditTaskModal";
import DeleteTaskModal from "@/modules/Tareas/Components/DeleteTaskModal";
import { useState } from "react";

export default function TaskList({ filters }: { filters: Filters }) {
    const { data: tasks, isLoading, error } = useTodos(filters);
    const { mutate: updateTodo } = useUpdateTodo();
    
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);

    const handleToggleComplete = (task: Task) => {
        updateTodo({
            id: task.id,
            payload: { 
                todo: task.todo,
                description: task.description,
                priority: task.priority,
                userId: task.userId,
                completed: !task.completed,
                createdAt: task.createdAt
            }
        });
    };

    const handleStatusChange = (task: Task, newStatus: 'pending' | 'in-progress' | 'completed') => {
        updateTodo({
            id: task.id,
            payload: {
                todo: task.todo,
                description: task.description,
                priority: task.priority,
                userId: task.userId,
                completed: newStatus === 'completed',
                createdAt: task.createdAt
            }
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string, completed: boolean) => {
        if (completed) return 'bg-blue-100 text-blue-800';
        switch (status) {
            case 'pending':
                return 'bg-red-100 text-red-800';
            case 'in-progress':
                return 'bg-orange-100 text-orange-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'Alta';
            case 'medium':
                return 'Media';
            case 'low':
                return 'Baja';
            default:
                return priority;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Pendiente';
            case 'in-progress':
                return 'En Progreso';
            case 'completed':
                return 'Completada';
            default:
                return status;
        }
    };

    if (isLoading) {
        return <div className="text-center py-8 text-gray-500">Cargando tareas...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error al cargar las tareas</div>;
    }

    if (!tasks || tasks.length === 0) {
        return <div className="text-center py-8 text-gray-500">No hay tareas disponibles</div>;
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Completada
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Título
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Descripción
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Prioridad
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                    Usuario ID
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleToggleComplete(task)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <span className={task.completed ? 'line-through text-gray-500' : ''}>
                                            {task.todo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="truncate block max-w-xs">
                                            {task.description || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                            {getPriorityLabel(task.priority)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            <select
                                                value={task.status}
                                                onChange={(e) => handleStatusChange(task, e.target.value as any)}
                                                className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(task.status, task.completed)}`}
                                            >
                                                <option value="pending">Pendiente</option>
                                                <option value="in-progress">En Progreso</option>
                                                <option value="completed">Completada</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {task.userId}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                onClick={() => setEditingTask(task)}
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 hover:bg-blue-50 border border-blue-200"
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                onClick={() => setDeletingTaskId(task.id)}
                                                variant="destructive"
                                                size="sm"
                                                className="text-red-600 hover:bg-red-50"
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingTask && (
                <EditTaskModal
                    isOpen={!!editingTask}
                    onOpenChange={(open) => !open && setEditingTask(null)}
                    task={editingTask}
                />
            )}

            {deletingTaskId !== null && (
                <DeleteTaskModal
                    isOpen={true}
                    onOpenChange={(open) => !open && setDeletingTaskId(null)}
                    id={deletingTaskId}
                />
            )}
        </>
    );
}
