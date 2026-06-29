'use client'

import { useEffect } from 'react'

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Dashboard error:', error)
    }, [error])

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-12" style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-fg)' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" className="mb-6" style={{ color: 'var(--theme-muted)' }}>
                <circle cx="16" cy="16" r="14" />
                <line x1="16" y1="10" x2="16" y2="18" />
                <circle cx="16" cy="22" r="1" fill="currentColor" />
            </svg>
            <p className="text-[10px] tracking-[0.3em] font-bold uppercase mb-2" style={{ color: 'var(--theme-muted)' }}>
                ERROR
            </p>
            <p className="text-xs tracking-wider mb-8 text-center max-w-xs" style={{ color: 'var(--theme-muted)' }}>
                Something went wrong. This may be a temporary issue.
            </p>
            <button
                onClick={reset}
                className="py-3 px-8 text-[10px] tracking-widest uppercase font-semibold transition-all duration-200"
                style={{
                    backgroundColor: 'var(--theme-accent)',
                    color: 'var(--theme-accent-fg)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.8'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1'
                }}
            >
                TRY AGAIN
            </button>
        </div>
    )
}
