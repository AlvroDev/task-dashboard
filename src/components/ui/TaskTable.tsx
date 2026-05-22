import { useState } from "react";
import { useTasks } from ../components/hooks/useTask"; // Tu hook en inglés
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"; 

export const TaskTable = () => {
  // Paginación obligatoria del challenge: empezamos en el skip 0 (página 1)
  const [pagination, setPagination] = useState({ limit: 10, skip: 0 });

  // Traemos los datos de la API usando tu hook
  const { data, isLoading, isError } = useTasks(pagination);

  // Requerimiento: Estado de carga (Loading)
  if (isLoading) {
    return (
      <div className="p-10 text-center animate-pulse text-slate-500 font-medium">
        Cargando tareas del equipo...
      </div>
    );
  }

  // Requerimiento: Control de errores
  if (isError) {
    return (
      <div className="p-10 text-center text-red-500 font-medium bg-red-50 rounded-lg border border-red-100">
        Error al conectar con la API de tareas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[20px] font-semibold text-slate-700">ID</TableHead>
              <TableHead className="font-semibold text-slate-700">Tarea / Descripción</TableHead>
              <TableHead className="font-semibold text-slate-700">Prioridad</TableHead>
              <TableHead className="font-semibold text-slate-700">Estado</TableHead>
              <TableHead className="font-semibold text-slate-700">Usuario</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.todos.map((task) => (
              <TableRow key={task.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-mono text-xs text-slate-400">#{task.id}</TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900">{task.todo}</div>
                  <div className="text-xs text-slate-400 max-w-[250px] truncate">
                    {task.description || "Sin descripción adicional"}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide
                    ${task.priority === 'high' ? 'bg-red-50 text-red-700 border border-red-100' : 
                      task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                      'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                    {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center text-xs font-medium ${task.completed ? 'text-emerald-600' : 'text-amber-600'}`}>
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                    {task.completed ? "Completada" : "Pendiente"}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">
                  ID: {task.userId}
                </TableCell>
                <TableCell className="text-right">
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                    Gestionar
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Controles de paginación obligatorios */}
      <div className="flex items-center justify-between px-2 py-2">
        <p className="text-xs text-slate-500 font-medium">
          Mostrando desde el registro {pagination.skip + 1} en adelante
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, skip: Math.max(0, prev.skip - 10) }))}
            disabled={pagination.skip === 0}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition disabled:opacity-50 disabled:hover:bg-white"
          >
            Anterior
          </button>
          <button
            onClick={() => setPagination(prev => ({ ...prev, skip: prev.skip + 10 }))}
            disabled={(data?.todos.length ?? 0) < 10} // Si vienen menos de 10, no hay más páginas
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition disabled:opacity-50"
          >
            Siguiente
          </button>
          </div>
      </div>
    </div>
  );
};