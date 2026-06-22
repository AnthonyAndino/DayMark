'use client'

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'

interface Toast {
    id: number
    message: string
    type: 'success' | 'error'
}

interface Ctx {
    show: (message: string, type?: 'success' | 'error') => void
}

const ToastCtx = createContext<Ctx | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const counter = useRef(0)

    const show = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        const id = ++counter.current
        setToasts((prev) => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 2500)
    }, [])

    return (
        <ToastCtx.Provider value={{ show }}>
            {children}
            <div
                className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none"
                style={{ maxWidth: 320 }}
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className="px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase shadow-lg animate-toast"
                        style={{
                            backgroundColor: t.type === 'error' ? '#ef4444' : 'var(--theme-accent)',
                            color: t.type === 'error' ? '#ffffff' : 'var(--theme-accent-fg)',
                        }}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastCtx.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastCtx)
    if (!ctx) throw new Error('useToast debe usarse dentro de un ToastProvider')
    return ctx
}
