'use client'

import { LangProvider } from '@/lib/lang'
import { ToastProvider } from '@/lib/toast'
import type { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <LangProvider>
            <ToastProvider>{children}</ToastProvider>
        </LangProvider>
    )
}
