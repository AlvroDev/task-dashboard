import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface PropsEliminarTareaDialog {
  abierto: boolean;
  onAbiertoCambio: (abierto: boolean) => void;
  onConfirmar: () => Promise<void>;
  tituloTarea: string;
  cargando: boolean;
}

export function EliminarTareaDialog({
  abierto,
  onAbiertoCambio,
  onConfirmar,
  tituloTarea,
  cargando,
}: PropsEliminarTareaDialog) {
  return (
    <AlertDialog open={abierto} onOpenChange={onAbiertoCambio}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar tarea</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            ¿Estás seguro de que querés eliminar{" "}
            <span className="font-medium text-foreground">"{tituloTarea}"</span>?
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cargando} className="cursor-pointer">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent) => { e.preventDefault(); onConfirmar(); }}
            disabled={cargando}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            {cargando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}