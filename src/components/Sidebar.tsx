'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTheme, presetThemes } from '@/lib/theme-context'
import { useLang } from '@/lib/lang'

const CUSTOM_THEMES_KEY = 'daymark-custom-themes'

function DayMarkLogo() {
    return (
        <svg viewBox="0 0 32 32" className="w-5 h-5 shrink-0" fill="none" style={{ color: 'var(--theme-fg)' }}>
            <rect x="1" y="1" width="30" height="30" stroke="currentColor" strokeWidth="1" />
            <line x1="6" y1="22" x2="13" y2="15" stroke="currentColor" strokeWidth="1" />
            <line x1="12" y1="22" x2="19" y2="15" stroke="currentColor" strokeWidth="1" />
            <line x1="18" y1="22" x2="25" y2="15" stroke="currentColor" strokeWidth="1" />
        </svg>
    )
}

function LogoutIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className="shrink-0">
            <rect x="2" y="3" width="10" height="10" />
            <polyline points="10,6 14,8 10,10" />
            <line x1="14" y1="8" x2="6" y2="8" />
        </svg>
    )
}

type PresetKey = keyof typeof presetThemes

interface SidebarProps {
    summary: { total: number; completed: number } | null
}

export default function Sidebar({ summary }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { txt } = useLang()
    const [loggingOut, setLoggingOut] = useState(false)
    const [themeOpen, setThemeOpen] = useState(false)
    const [customInput, setCustomInput] = useState('')
    const [customThemes, setCustomThemes] = useState<string[]>([])
    const [themesHydrated, setThemesHydrated] = useState(false)
    const { scheme, setPreset, setCustom } = useTheme()

    useEffect(() => {
        if (themeOpen) setCustomInput(scheme.bg)
    }, [themeOpen, scheme.bg])

    useEffect(() => {
        const saved = localStorage.getItem(CUSTOM_THEMES_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed) && parsed.every(c => typeof c === 'string')) {
                    setCustomThemes(parsed)
                }
            } catch {}
        }
        setThemesHydrated(true)
    }, [])

    useEffect(() => {
        if (themesHydrated) {
            localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(customThemes))
        }
    }, [customThemes, themesHydrated])

    async function handleLogout() {
        setLoggingOut(true)
        try { await fetch('/api/auth/logout', { method: 'POST' }) } catch {}
        router.push('/login')
    }

    function handleOK() {
        const val = customInput.trim()
        if (!val) return
        setCustom(val)
        setCustomThemes(prev => {
            if (prev.length < 4) return [...prev, val]
            const next = [...prev]
            next[3] = val
            return next
        })
    }

    const links = [
        { href: '/dashboard/overview', label: txt.overview, icon: (active: boolean) => (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={active ? '#fff' : 'currentColor'} strokeWidth="1" className="shrink-0">
                <circle cx="8" cy="8" r="6" /><circle cx="8" cy="8" r="2" />
            </svg>
        )},
        { href: '/dashboard', label: txt.dashboard, icon: (active: boolean) => (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={active ? '#fff' : 'currentColor'} strokeWidth="1" className="shrink-0">
                <rect x="1" y="1" width="6" height="6" /><rect x="9" y="1" width="6" height="6" />
                <rect x="1" y="9" width="6" height="6" /><rect x="9" y="9" width="6" height="6" />
            </svg>
        )},
        { href: '/dashboard/habits', label: txt.habits, icon: (active: boolean) => (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={active ? '#fff' : 'currentColor'} strokeWidth="1" className="shrink-0">
                <polyline points="3,9 6,12 13,5" />
            </svg>
        )},
        { href: '/dashboard/notes', label: txt.notes, icon: (active: boolean) => (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={active ? '#fff' : 'currentColor'} strokeWidth="1" className="shrink-0">
                <rect x="2" y="1" width="12" height="14" /><line x1="5" y1="6" x2="11" y2="6" />
                <line x1="5" y1="9" x2="11" y2="9" /><line x1="5" y1="12" x2="9" y2="12" />
            </svg>
        )},
    ]

    const presetKeys = Object.keys(presetThemes) as PresetKey[]

    // Formatea la fecha de hoy en espanol, ejemplo: "martes, 20 de junio de 2026"
    const todayStr = new Date().toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    return (
        <aside className="fixed left-0 top-0 h-full w-56 flex flex-col z-50" style={{ backgroundColor: 'var(--theme-bg)', borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'var(--theme-border)' }}>
            <div className="flex items-center gap-3 px-5 pt-8 pb-6" style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}>
                <DayMarkLogo />
                <h1 className="text-sm tracking-[0.3em] font-bold uppercase" style={{ color: 'var(--theme-fg)' }}>DAYMARK</h1>
            </div>

            <div className="px-5 pt-4 pb-4" style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}>
                <p className="text-[10px] capitalize tracking-wider" style={{ color: 'var(--theme-muted)' }}>{todayStr}</p>
                {summary && (
                    <p className="text-xs mt-1" style={{ color: 'var(--theme-fg)' }}>
                        <span className="font-bold">{summary.completed}</span>
                        <span style={{ color: 'var(--theme-muted)' }}>/{summary.total}</span> hábitos completados hoy
                    </p>
                )}
            </div>

            <nav className="flex flex-col gap-px px-3 py-6">
                {links.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-3 py-2.5 border text-sm transition-all rounded-none"
                            style={{
                                borderColor: isActive ? 'var(--theme-accent)' : 'transparent',
                                backgroundColor: isActive ? 'var(--theme-accent)' : 'transparent',
                                color: isActive ? 'var(--theme-accent-fg)' : 'var(--theme-muted)',
                            }}
                            onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.color = 'var(--theme-fg)' } }}
                            onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--theme-muted)' } }}
                        >
                            {link.icon(isActive)}
                            <span className="text-xs tracking-widest uppercase">{link.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="px-3 py-3" style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--theme-border)' }}>
                <button
                    onClick={() => setThemeOpen(!themeOpen)}
                    className="flex items-center justify-between w-full px-3 py-2 border border-transparent text-xs tracking-widest uppercase transition-all rounded-none"
                    style={{ color: 'var(--theme-muted)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.color = 'var(--theme-fg)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--theme-muted)' }}
                >
                    {txt.theme}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"
                        className={`shrink-0 transition-transform duration-200 ${themeOpen ? 'rotate-90' : ''}`}
                    >
                        <polyline points="3,3.5 5,6.5 7,3.5" />
                    </svg>
                </button>

                {themeOpen && (
                    <div className="mt-3 space-y-3">
                        <div className="grid grid-cols-4 gap-2">
                            {presetKeys.map((key) => {
                                const t = presetThemes[key]
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setPreset(t)}
                                        title={t.label}
                                        className="w-full aspect-square border transition-all rounded-none"
                                        style={{
                                            backgroundColor: t.bg, borderColor: t.border,
                                            outline: scheme.bg === t.bg ? '2px solid var(--theme-accent)' : 'none',
                                            outlineOffset: 1,
                                        }}
                                    />
                                )
                            })}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {Array.from({ length: 4 }).map((_, i) => {
                                const color = customThemes[i]
                                return (
                                    <button
                                        key={i}
                                        onClick={() => color && setCustom(color)}
                                        className="w-full aspect-square border transition-all rounded-none flex items-center justify-center"
                                        style={{
                                            backgroundColor: color || 'transparent',
                                            borderColor: color ? 'var(--theme-border)' : 'var(--theme-muted)',
                                            borderStyle: color ? 'solid' : 'dashed',
                                            outline: color && scheme.bg === color ? '2px solid var(--theme-accent)' : 'none',
                                            outlineOffset: 1,
                                        }}
                                    >
                                        {!color && (
                                            <span className="text-[10px] leading-none" style={{ color: 'var(--theme-muted)' }}>+</span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="flex gap-1">
                            <input type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleOK() }}
                                placeholder={txt.hexPlaceholder}
                                className="flex-1 border px-2 py-1 text-[10px] font-mono outline-none transition-colors rounded-none"
                                style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-fg)', backgroundColor: 'var(--theme-bg)' }}
                            />
                            <button onClick={handleOK}
                                className="px-2 py-1 text-[10px] tracking-widest uppercase font-semibold rounded-none"
                                style={{ backgroundColor: 'var(--theme-accent)', color: 'var(--theme-accent-fg)' }}
                            >OK</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto px-3 py-4" style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--theme-border)' }}>
                <button onClick={handleLogout} disabled={loggingOut}
                    className="flex items-center gap-3 w-full px-3 py-2.5 border border-transparent text-sm transition-all rounded-none disabled:opacity-50"
                    style={{ color: 'var(--theme-muted)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.color = 'var(--theme-fg)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--theme-muted)' }}
                >
                    <LogoutIcon />
                    <span className="text-xs tracking-widest uppercase">{loggingOut ? `${txt.logout}...` : txt.logout}</span>
                </button>
            </div>
        </aside>
    )
}
