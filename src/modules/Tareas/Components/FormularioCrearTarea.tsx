// ─── CORRECCIÓN ───────────────────────────────────────────────────────────────
// Antes: components/ui/CreateTaskForm.tsx (ubicación incorrecta — carpeta ui/ es solo
//        para primitivos de shadcn, no para formularios de negocio)
//        + useCreateTask invalidaba ["tasks"] → la tabla (que usa ["todos"]) nunca se refrescaba.
//
// Ahora: módulo correcto + importa useCreateTask desde @/hooks/useTareas (queryKey unificada).
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useCreateTask } from "@/hooks/useTareas";
import { useUsers } from "@/hooks/useUsers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import type { Priority } from "@/types";

// ─── Valores iniciales del formulario ────────────────────────────────────────
const VALORES_INICIALES = {
  todo: "",
  description: "",
  priority: "medium" as Priority,
  userId: "",
  createdAt: new Date().toISOString().split("T")[0],
};

interface PropsFormularioCrearTarea {
  alCrear?: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function FormularioCrearTarea({ alCrear }: PropsFormularioCrearTarea) {
  const { mutate: crearTarea, isPending } = useCreateTask();
  const { data: respuestaUsuarios, isLoading: cargandoUsuarios } = useUsers();

  const [campos, setCampos] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState<Partial<Record<keyof typeof VALORES_INICIALES, string>>>({});
  const [errorGeneral, setErrorGeneral] = useState("");

  // ── Actualizar campo individual ───────────────────────────────────────────
  const actualizarCampo = <K extends keyof typeof VALORES_INICIALES>(
    campo: K,
    valor: (typeof VALORES_INICIALES)[K]
  ) => {
    setCampos((prev) => ({ ...prev, [campo]: valor }));
    // Limpiar error del campo al escribir
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
  };

  // ── Validación ────────────────────────────────────────────────────────────
  const validar = (): boolean => {
    const nuevosErrores: typeof errores = {};

    if (!campos.todo.trim()) {
      nuevosErrores.todo = "El título es obligatorio";
    } else if (campos.todo.trim().length < 3) {
      nuevosErrores.todo = "El título debe tener al menos 3 caracteres";
    }

    if (!campos.description.trim()) {
      nuevosErrores.description = "La descripción es obligatoria";
    } else if (campos.description.trim().length < 10) {
      nuevosErrores.description = "La descripción debe tener al menos 10 caracteres";
    }

    if (!campos.userId) {
      nuevosErrores.userId = "Debés seleccionar un usuario";
    }

    if (!campos.createdAt) {
      nuevosErrores.createdAt = "La fecha es obligatoria";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ── Reset completo ────────────────────────────────────────────────────────
  const resetear = () => {
    setCampos(VALORES_INICIALES);
    setErrores({});
    setErrorGeneral("");
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral("");

    if (!validar()) return;

    crearTarea(
      {
        todo: campos.todo.trim(),
        description: campos.description.trim(),
        priority: campos.priority,
        userId: Number(campos.userId),
        createdAt: campos.createdAt,
      },
      {
        onSuccess: () => {
          resetear();
          alCrear?.();
        },
        onError: () => {
          setErrorGeneral("No se pudo crear la tarea. Intentá de nuevo.");
        },
      }
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>

      {/* Error general */}
      {errorGeneral && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorGeneral}
        </div>
      )}

      {/* Título */}
      <div className="space-y-1.5">
        <label htmlFor="todo" className="text-sm font-medium text-slate-700">
          Título <span className="text-red-500">*</span>
        </label>
        <Input
          id="todo"
          type="text"
          value={campos.todo}
          onChange={(e) => actualizarCampo("todo", e.target.value)}
          placeholder="Ej: Revisar pull requests del sprint"
          disabled={isPending}
          aria-invalid={!!errores.todo}
        />
        {errores.todo && (
          <p role="alert" className="text-xs text-red-500">{errores.todo}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">
          Descripción <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="description"
          value={campos.description}
          onChange={(e) => actualizarCampo("description", e.target.value)}
          placeholder="Describí brevemente los entregables..."
          rows={3}
          disabled={isPending}
          aria-invalid={!!errores.description}
        />
        {errores.description && (
          <p role="alert" className="text-xs text-red-500">{errores.description}</p>
        )}
      </div>

      {/* Prioridad + Fecha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="priority" className="text-sm font-medium text-slate-700">
            Prioridad <span className="text-red-500">*</span>
          </label>
          <Select
            value={campos.priority}
            onValueChange={(v) => actualizarCampo("priority", v as Priority)}
            disabled={isPending}
          >
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baja</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="createdAt" className="text-sm font-medium text-slate-700">
            Fecha <span className="text-red-500">*</span>
          </label>
          <Input
            id="createdAt"
            type="date"
            value={campos.createdAt}
            onChange={(e) => actualizarCampo("createdAt", e.target.value)}
            disabled={isPending}
            aria-invalid={!!errores.createdAt}
          />
          {errores.createdAt && (
            <p role="alert" className="text-xs text-red-500">{errores.createdAt}</p>
          )}
        </div>
      </div>

      {/* Usuario asignado */}
      <div className="space-y-1.5">
        <label htmlFor="userId" className="text-sm font-medium text-slate-700">
          Asignado a <span className="text-red-500">*</span>
        </label>
        <Select
          value={campos.userId}
          onValueChange={(v) => actualizarCampo("userId", v)}
          disabled={isPending || cargandoUsuarios}
        >
          <SelectTrigger id="userId" aria-invalid={!!errores.userId}>
            <SelectValue
              placeholder={
                cargandoUsuarios ? "Cargando usuarios..." : "Seleccioná un miembro"
              }
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
        {errores.userId && (
          <p role="alert" className="text-xs text-red-500">{errores.userId}</p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={resetear}
          disabled={isPending}
        >
          Limpiar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando...
            </>
          ) : (
            "Crear tarea"
          )}
        </Button>
      </div>
    </form>
  );
}