import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { Filters } from "@/types/filters";
import type { User } from "@/types";

interface PropsFiltrosTareas {
  filters: Filters;
  onSearchChange: (search: string) => void;
  onStatusChange: (completed: boolean | null) => void;
  onUserChange: (userId: number | null) => void;
  onReset: () => void;
  usuarios: User[];
  cargandoUsuarios: boolean;
}

export function FiltrosTareas({
  filters,
  onSearchChange,
  onStatusChange,
  onUserChange,
  onReset,
  usuarios,
  cargandoUsuarios,
}: PropsFiltrosTareas) {

  const statusValue =
    filters.completed === null ? "all"
    : filters.completed ? "completed"
    : "pending";

  const hayFiltrosActivos =
    filters.search !== "" ||
    filters.completed !== null ||
    filters.userId !== null;

  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

        {/* Búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título o descripción..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-input border-border"
          />
        </div>

        {/* Estado */}
        <Select
          value={statusValue}
          onValueChange={(v) => {
            if (v === "all") onStatusChange(null);
            else onStatusChange(v === "completed");
          }}
        >
          <SelectTrigger className="w-full lg:w-40 bg-input border-border">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="completed">Completada</SelectItem>
          </SelectContent>
        </Select>

        {/* Usuario */}
        <Select
          value={filters.userId === null ? "all" : String(filters.userId)}
          onValueChange={(v) => onUserChange(v === "all" ? null : Number(v))}
          disabled={cargandoUsuarios}
        >
          <SelectTrigger className="w-full lg:w-48 bg-input border-border">
            <SelectValue placeholder={cargandoUsuarios ? "Cargando..." : "Asignado a"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los usuarios</SelectItem>
            {usuarios.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.firstName} {u.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Limpiar */}
        {hayFiltrosActivos && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}