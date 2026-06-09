'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type Toast = { message: string; type?: 'success' | 'error' }
type ToastContextType = {
  toast: (t: Toast) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (t: Toast) => {
    setToasts(p => [...p, t])
    setTimeout(() => setToasts(p => p.slice(1)), 3000)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        {toasts.map((t, i) => (
          <div key={i} className={`px-4 py-2 rounded-lg text-white text-sm ${t.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}