import { Button } from "@/components/ui/button";
import type { Filters } from "@/types/filters";

export default function TaskFilters({
    filters,
    onSearchChange,
    onStatusChange,
    onUserChange,
    onReset
}: {
    filters: Filters;
    onSearchChange: (search: string) => void;
    onStatusChange: (completed: boolean | null) => void;
    onUserChange: (userId: number | null) => void;
    onReset: () => void;
}) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Buscar
                    </label>
                    <input
                        id="search"
                        type="text"
                        value={filters.search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar tareas..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                    </label>
                    <select
                        id="status"
                        value={filters.completed === null ? 'all' : filters.completed ? 'completed' : 'pending'}
                        onChange={(e) => {
                            if (e.target.value === 'all') onStatusChange(null);
                            else onStatusChange(e.target.value === 'completed');
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todos</option>
                        <option value="pending">Pendientes</option>
                        <option value="completed">Completadas</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                        Usuario ID
                    </label>
                    <input
                        id="userId"
                        type="number"
                        value={filters.userId === null ? '' : filters.userId}
                        onChange={(e) => onUserChange(e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Dejar en blanco para todos"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <Button
                onClick={onReset}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 rounded-lg"
            >
                Limpiar Filtros
            </Button>
        </div>
    );
}
