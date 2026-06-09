"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CheckCircle2, Info, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "info" | "error" | "violet";
type Toast = { id: number; message: string; variant: ToastVariant };

type Ctx = {
  toast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<Ctx | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const ICONS = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
  violet: CheckCircle2,
};

const STYLES: Record<ToastVariant, string> = {
  success: "bg-mint text-white",
  info: "bg-ink text-white",
  error: "bg-coral text-white",
  violet: "bg-violet text-white",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* الحاوية */}
      <div
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] mx-auto flex max-w-md flex-col items-center gap-2 px-4"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => {
          const Icon = ICONS[t.variant];
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex w-full items-center gap-2.5 rounded-lg px-4 py-3 shadow-cardHover animate-in fade-in slide-in-from-top-2",
                STYLES[t.variant]
              )}
              role="status"
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-[13px] font-semibold">{t.message}</span>
              <button
                onClick={() =>
                  setToasts((arr) => arr.filter((x) => x.id !== t.id))
                }
                aria-label="إغلاق"
                className="opacity-80 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

// CSS بسيط للأنيميشن (يضاف في globals.css):
// تكرار سياسة Tailwind: نضيفه يدوياً بدون plugin.
