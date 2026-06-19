'use client'

import { useState } from "react"
import { createHabit } from "@/lib/actions/habits"
import { useRouter } from "next/navigation"
import { useLang } from "@/lib/lang"

interface Props {
    userId: number
}

const DAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
const PRESETS: { label: string; days: number[] | null }[] = [
    { label: 'Diario', days: null },
    { label: 'L-V', days: [1, 2, 3, 4, 5] },
    { label: 'Findes', days: [0, 6] },
]

function AddIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" className="shrink-0">
            <line x1="7" y1="2" x2="7" y2="12" />
            <line x1="2" y1="7" x2="12" y2="7" />
        </svg>
    )
}

export default function AddHabit({ userId }: Props) {
    const [name, setName] = useState('')
    const [selectedDays, setSelectedDays] = useState<number[] | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { txt } = useLang()

    function toggleDay(day: number) {
        setSelectedDays(prev => {
            if (prev === null) return [day]
            if (prev.includes(day)) {
                const next = prev.filter(d => d !== day)
                return next.length === 0 ? null : next
            }
            return [...prev, day]
        })
    }

    function applyPreset(days: number[] | null) {
        setSelectedDays(days)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) return
        setLoading(true)

        try {
            await createHabit({ name, userId, daysOfWeek: selectedDays ?? undefined })
            setName('')
            setSelectedDays(null)
            router.refresh()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col shrink-0"
            style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}
        >
            <div className="flex items-center gap-2 px-6 pt-3 pb-2">
                <input
                    type="text"
                    placeholder={txt.newHabitPlaceholder}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="flex-1 border px-3 py-1.5 text-sm focus:outline-none transition-colors rounded-none"
                    style={{
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-fg)',
                        backgroundColor: 'var(--theme-bg)',
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all rounded-none disabled:opacity-50"
                    style={{
                        backgroundColor: 'var(--theme-accent)',
                        color: 'var(--theme-accent-fg)',
                    }}
                >
                    <AddIcon />
                    {loading ? '...' : txt.addHabit}
                </button>
            </div>
            <div className="flex items-center gap-2 px-6 pb-3">
                <div className="flex gap-0.5">
                    {DAY_LABELS.map((label, i) => {
                        const active = selectedDays === null || selectedDays.includes(i)
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => toggleDay(i)}
                                className="w-6 h-6 text-[10px] font-bold border transition-all cursor-pointer rounded-none"
                                style={{
                                    borderColor: active ? 'var(--theme-accent)' : 'var(--theme-border)',
                                    color: active ? 'var(--theme-accent)' : 'var(--theme-muted)',
                                    backgroundColor: active ? 'color-mix(in srgb, var(--theme-accent) 10%, transparent)' : 'transparent',
                                }}
                            >
                                {label}
                            </button>
                        )
                    })}
                </div>
                <div className="flex gap-1 ml-2">
                    {PRESETS.map(p => (
                        <button
                            key={p.label}
                            type="button"
                            onClick={() => applyPreset(p.days)}
                            className="px-2 py-0.5 text-[9px] font-semibold tracking-wider border transition-all cursor-pointer rounded-none uppercase"
                            style={{
                                borderColor: 'var(--theme-border)',
                                color: 'var(--theme-muted)',
                                backgroundColor: 'transparent',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.color = 'var(--theme-accent)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.color = 'var(--theme-muted)' }}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>
        </form>
    )
}
