'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '◈' },
    { href: '/dashboard/habits', label: 'Hábitos', icon: '✦' },
    { href: '/dashboard/notes', label: 'Notas', icon: '◉' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [loggingOut, setLoggingOut] = useState(false)

    async function handleLogout() {
        setLoggingOut(true)
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
        } catch {}
        router.push('/login')
    }

    return (
        <aside className="fixed left-0 top-0 h-full w-56 border-r border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl flex flex-col z-50">
            <div className="px-5 pt-8 pb-6 border-b border-zinc-800/40">
                <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                    DayMark
                </h1>
                <p className="text-zinc-600 text-[10px] mt-0.5 tracking-wider uppercase font-semibold">
                    Habit tracker
                </p>
            </div>

            <nav className="flex-1 flex flex-col gap-1 px-3 py-6">
                {links.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                                ${isActive
                                    ? 'bg-zinc-800/60 text-zinc-100 font-medium'
                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                                }
                            `}
                        >
                            <span className="text-xs w-4 text-center">{link.icon}</span>
                            {link.label}
                        </a>
                    )
                })}
            </nav>

            <div className="px-3 pb-6">
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition-all disabled:opacity-50"
                >
                    <span className="text-xs w-4 text-center">↩</span>
                    {loggingOut ? 'Saliendo...' : 'Cerrar sesión'}
                </button>
            </div>
        </aside>
    )
}
