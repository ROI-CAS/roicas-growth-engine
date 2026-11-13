import { useRef, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface AccessibleDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

/** Controlled modal whose trigger can live outside the dialog tree. */
export function AccessibleDialog({ open, onClose, title, description, children, className = "" }: AccessibleDialogProps) {
  const returnFocus = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);
  if (open && !wasOpen.current && typeof document !== "undefined") {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  wasOpen.current = open;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/70" />
        <Dialog.Content
          aria-modal="true"
          className={`fixed left-1/2 top-1/2 z-[81] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-background text-foreground shadow-xl focus:outline-none ${className}`}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (returnFocus.current?.isConnected) returnFocus.current.focus();
          }}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">{description}</Dialog.Description>
            </div>
            <Dialog.Close className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Cerrar diálogo">
              <X size={22} aria-hidden="true" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}


