import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ToastInput = {
  title: string;
  description?: string;
  variant?: "success" | "error";
};

type Toast = ToastInput & {
  id: string;
};

type ToastContextValue = {
  notify: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (input: ToastInput) => {
      const toast = { ...input, id: crypto.randomUUID() };
      setToasts((current) => [...current, toast]);
      window.setTimeout(() => dismiss(toast.id), 4_500);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext value={value}>
      {children}
      <div
        className="pointer-events-none fixed top-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            className={cn(
              "pointer-events-auto flex gap-3 rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg",
              toast.variant === "error" && "border-destructive/30",
            )}
            key={toast.id}
          >
            <HugeiconsIcon
              className={cn(
                "mt-0.5 size-5 shrink-0 text-emerald-600",
                toast.variant === "error" && "text-destructive",
              )}
              icon={
                toast.variant === "error" ? Alert02Icon : CheckmarkCircle02Icon
              }
              strokeWidth={2}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <Button
              aria-label="Dismiss notification"
              className="-mt-1 -mr-1"
              onClick={() => dismiss(toast.id)}
              size="icon-sm"
              variant="ghost"
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            </Button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
