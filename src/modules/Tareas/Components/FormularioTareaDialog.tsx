import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import type { User, Priority } from "@/types";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ValoresFormulario {
  todo: string;
  description: string;
  priority: Priority;
  userId: number;
}

interface PropsFormularioTareaDialog {
  abierto: boolean;
  onAbiertoCambio: (abierto: boolean) => void;
  onSubmit: (data: ValoresFormulario) => Promise<void>;
  usuarios: User[];
  cargando: boolean;
  titulo: string;
  valoresPorDefecto?: ValoresFormulario;
}

// ─── Formulario interno ───────────────────────────────────────────────────────
// Componente separado para que al cambiar la `key` del Dialog se monte desde
// cero con el estado limpio — patrón recomendado por React para evitar
// useEffect con setState (https://react.dev/learn/you-might-not-need-an-effect)

interface PropsCuerpoFormulario {
  onAbiertoCambio: (abierto: boolean) => void;
  onSubmit: (data: ValoresFormulario) => Promise<void>;
  usuarios: User[];
  cargando: boolean;
  valoresPorDefecto?: ValoresFormulario;
}

function CuerpoFormulario({
  onAbiertoCambio,
  onSubmit,
  usuarios,
  cargando,
  valoresPorDefecto,
}: PropsCuerpoFormulario) {
  // Estado inicial derivado directamente de las props — sin useEffect
  const [campos, setCampos] = useState<ValoresFormulario>(
    valoresPorDefecto ?? {
      todo: "",
      description: "",
      priority: "medium",
      userId: usuarios[0]?.id ?? 0,
    }
  );
  const [errores, setErrores] = useState<Partial<Record<keyof ValoresFormulario, string>>>({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const actualizar = <K extends keyof ValoresFormulario>(campo: K, valor: ValoresFormulario[K]) => {
    setCampos((p) => ({ ...p, [campo]: valor }));
    setErrores((p) => ({ ...p, [campo]: undefined }));
  };

  const validar = (): boolean => {
    const e: typeof errores = {};
    if (!campos.todo.trim())                        e.todo = "El título es obligatorio";
    else if (campos.todo.trim().length < 3)         e.todo = "Mínimo 3 caracteres";
    if (!campos.description.trim())                 e.description = "La descripción es obligatoria";
    else if (campos.description.trim().length < 10) e.description = "Mínimo 10 caracteres";
    if (!campos.userId)                             e.userId = "Seleccioná un usuario";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorGeneral("");
    if (!validar()) return;
    try {
      await onSubmit(campos);
    } catch {
      setErrorGeneral("No se pudo guardar la tarea. Intentá de nuevo.");
    }
  };

  const LABEL = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2" noValidate>

      {errorGeneral && (
        <div role="alert" className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorGeneral}
        </div>
      )}

      <div>
        <label className={LABEL}>Título <span className="text-destructive">*</span></label>
        <Input
          value={campos.todo}
          onChange={(e) => actualizar("todo", e.target.value)}
          placeholder="Ej: Revisar pull requests..."
          disabled={cargando}
          className="bg-input border-border"
        />
        {errores.todo && <p role="alert" className="text-xs text-destructive mt-1">{errores.todo}</p>}
      </div>

      <div>
        <label className={LABEL}>Descripción <span className="text-destructive">*</span></label>
        <Textarea
          value={campos.description}
          onChange={(e) => actualizar("description", e.target.value)}
          placeholder="Describí los entregables..."
          rows={3}
          disabled={cargando}
          className="resize-none bg-input border-border"
        />
        {errores.description && <p role="alert" className="text-xs text-destructive mt-1">{errores.description}</p>}
      </div>

      <div>
        <label className={LABEL}>Prioridad <span className="text-destructive">*</span></label>
        <Select
          value={campos.priority}
          onValueChange={(v) => actualizar("priority", v as Priority)}
          disabled={cargando}
        >
          <SelectTrigger className="w-full bg-input border-border">
            <SelectValue placeholder="Seleccioná prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="low">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className={LABEL}>Asignado a <span className="text-destructive">*</span></label>
        <Select
          value={campos.userId ? String(campos.userId) : ""}
          onValueChange={(v) => actualizar("userId", Number(v))}
          disabled={cargando}
        >
          <SelectTrigger className="w-full bg-input border-border">
            <SelectValue placeholder="Seleccioná un usuario" />
          </SelectTrigger>
          <SelectContent>
            {usuarios.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.firstName} {u.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errores.userId && <p role="alert" className="text-xs text-destructive mt-1">{errores.userId}</p>}
      </div>

      <DialogFooter className="gap-2 sm:gap-0 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onAbiertoCambio(false)}
          disabled={cargando}
          className="cursor-pointer"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={cargando}
          className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
        >
          {cargando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {valoresPorDefecto ? "Guardar cambios" : "Crear tarea"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Dialog contenedor ────────────────────────────────────────────────────────
// La `key` fuerza un remount de CuerpoFormulario cada vez que cambia `abierto`
// o `valoresPorDefecto`, reiniciando el estado sin necesidad de useEffect.

export function FormularioTareaDialog({
  abierto,
  onAbiertoCambio,
  onSubmit,
  usuarios,
  cargando,
  titulo,
  valoresPorDefecto,
}: PropsFormularioTareaDialog) {
  const key = abierto ? `abierto-${valoresPorDefecto?.todo ?? "nuevo"}` : "cerrado";

  return (
    <Dialog open={abierto} onOpenChange={onAbiertoCambio}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {valoresPorDefecto
              ? "Modificá los datos de la tarea."
              : "Completá los campos para crear una nueva tarea."}
          </DialogDescription>
        </DialogHeader>
        <CuerpoFormulario
          key={key}
          onAbiertoCambio={onAbiertoCambio}
          onSubmit={onSubmit}
          usuarios={usuarios}
          cargando={cargando}
          valoresPorDefecto={valoresPorDefecto}
        />
      </DialogContent>
    </Dialog>
  );
}