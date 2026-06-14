'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

const STORAGE_KEY = 'daymark-theme-color'
const ACTIVE_KEY = 'daymark-active-theme'

export interface ThemeScheme {
    bg: string
    fg: string
    border: string
    muted: string
    accent: string
    accentFg: string
}

export const presetThemes: Record<string, ThemeScheme & { label: string }> = {
    minimal:      { bg: '#ffffff', fg: '#0a0a0a', border: '#e5e5e5', muted: '#a3a3a3', accent: '#0a0a0a', accentFg: '#ffffff', label: 'Minimalista' },
    industrialGray: { bg: '#f5f5f5', fg: '#171717', border: '#d4d4d4', muted: '#a3a3a3', accent: '#171717', accentFg: '#ffffff', label: 'Gris Industrial' },
    pureBlack:    { bg: '#000000', fg: '#fafafa', border: '#333333', muted: '#737373', accent: '#fafafa', accentFg: '#0a0a0a', label: 'Negro Puro' },
    dracula:      { bg: '#282a36', fg: '#f8f8f2', border: '#44475a', muted: '#6272a4', accent: '#bd93f9', accentFg: '#0a0a0a', label: 'Dracula' },
}

const DEFAULT_BG = '#ffffff'

function computeScheme(bg: string): ThemeScheme | null {
    const rgb = parseColor(bg)
    if (!rgb) return null
    const lum = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
    const isLight = lum > 0.5
    return {
        bg,
        fg: isLight ? '#0a0a0a' : '#fafafa',
        border: isLight ? '#e5e5e5' : '#555555',
        muted: isLight ? '#a3a3a3' : '#999999',
        accent: isLight ? '#0a0a0a' : '#fafafa',
        accentFg: isLight ? '#ffffff' : '#0a0a0a',
    }
}

function applyVars(s: ThemeScheme) {
    const r = document.documentElement
    r.style.setProperty('--theme-bg', s.bg)
    r.style.setProperty('--theme-fg', s.fg)
    r.style.setProperty('--theme-border', s.border)
    r.style.setProperty('--theme-muted', s.muted)
    r.style.setProperty('--theme-accent', s.accent)
    r.style.setProperty('--theme-accent-fg', s.accentFg)
}

interface Ctx {
    scheme: ThemeScheme
    setPreset: (s: ThemeScheme) => void
    setCustom: (bg: string) => void
}

const ThemeCtx = createContext<Ctx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [scheme, setScheme] = useState<ThemeScheme>(computeScheme(DEFAULT_BG)!)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(ACTIVE_KEY)
            if (saved) {
                const s = computeScheme(saved)
                if (s) {
                    setScheme(s)
                    applyVars(s)
                }
            } else {
                applyVars(computeScheme(DEFAULT_BG)!)
            }
        } catch {
            applyVars(computeScheme(DEFAULT_BG)!)
        }
        setReady(true)
    }, [])

    function persist(bg: string) {
        localStorage.setItem(STORAGE_KEY, bg)
        localStorage.setItem(ACTIVE_KEY, bg)
    }

    const setPreset = useCallback((s: ThemeScheme) => {
        setScheme(s)
        applyVars(s)
        persist(s.bg)
    }, [])

    const setCustom = useCallback((bg: string) => {
        const s = computeScheme(bg)
        if (!s) return
        setScheme(s)
        applyVars(s)
        persist(bg)
    }, [])

    return (
        <ThemeCtx.Provider value={{ scheme, setPreset, setCustom }}>
            {children}
        </ThemeCtx.Provider>
    )
}

export function useTheme() {
    const ctx = useContext(ThemeCtx)
    if (!ctx) throw new Error('useTheme debe usarse dentro de un ThemeProvider')
    return ctx
}

function parseColor(c: string): { r: number; g: number; b: number } | null {
    const s = c.trim()
    if (s.startsWith('#')) {
        const h = s.replace('#', '')
        if (h.length === 3) return { r: parseInt(h[0] + h[0], 16), g: parseInt(h[1] + h[1], 16), b: parseInt(h[2] + h[2], 16) }
        if (h.length === 6) return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
        if (h.length === 8) return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
        return null
    }
    if (/^[0-9a-fA-F]{3,8}$/.test(s)) {
        if (s.length === 3) return { r: parseInt(s[0] + s[0], 16), g: parseInt(s[1] + s[1], 16), b: parseInt(s[2] + s[2], 16) }
        if (s.length === 6) return { r: parseInt(s.slice(0, 2), 16), g: parseInt(s.slice(2, 4), 16), b: parseInt(s.slice(4, 6), 16) }
        if (s.length === 8) return { r: parseInt(s.slice(0, 2), 16), g: parseInt(s.slice(2, 4), 16), b: parseInt(s.slice(4, 6), 16) }
        return null
    }
    const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (m) return { r: +m[1], g: +m[2], b: +m[3] }
    return null
}
