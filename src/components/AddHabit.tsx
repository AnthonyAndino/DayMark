'use client'

import { useState } from "react"
import { createHabit } from "@/lib/actions/habits"
import { useRouter } from "next/navigation"
import { useLang } from "@/lib/lang"

interface Props {
    userId: number
}

const OPTIONS: { label: string; desc: string; days: number[] | null }[] = [
    { label: 'Todos los días', desc: 'El hábito cuenta de lunes a domingo', days: null },
    { label: 'Lunes a viernes', desc: 'El hábito solo cuenta entre semana', days: [1, 2, 3, 4, 5] },
    { label: 'Fines de semana', desc: 'El hábito solo cuenta sábado y domingo', days: [0, 6] },
]

export default function AddHabit({ userId }: Props) {
    const [name, setName] = useState('')
    const [step, setStep] = useState<'name' | 'schedule'>('name')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { txt } = useLang()

    function handleFirstSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) return
        setStep('schedule')
    }

    async function handlePickSchedule(days: number[] | null) {
        setLoading(true)
        try {
            await createHabit({ name, userId, daysOfWeek: days ?? undefined })
            setName('')
            setStep('name')
            router.refresh()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (step === 'schedule') {
        return (
            <div
                className="flex flex-col shrink-0 px-6 py-3"
                style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}
            >
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--theme-fg)' }}>
                    ¿Cada cuánto aplica <span style={{ color: 'var(--theme-accent)' }}>"{name}"</span>?
                </p>
                <div className="flex flex-wrap gap-2">
                    {OPTIONS.map(o => (
                        <button
                            key={o.label}
                            type="button"
                            disabled={loading}
                            onClick={() => handlePickSchedule(o.days)}
                            className="flex flex-col items-start px-4 py-2.5 border transition-all cursor-pointer rounded-none disabled:opacity-50"
                            style={{
                                borderColor: 'var(--theme-border)',
                                backgroundColor: 'var(--theme-bg)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--theme-accent)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-accent) 8%, transparent)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.backgroundColor = 'var(--theme-bg)' }}
                        >
                            <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--theme-fg)' }}>
                                {o.label}
                            </span>
                            <span className="text-[9px] mt-0.5 tracking-wider" style={{ color: 'var(--theme-muted)' }}>
                                {o.desc}
                            </span>
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => setStep('name')}
                    className="mt-2 self-start text-[10px] tracking-wider hover:underline"
                    style={{ color: 'var(--theme-muted)' }}
                >
                  ← Cancelar
                </button>
            </div>
        )
    }

    return (
        <form
            onSubmit={handleFirstSubmit}
            className="flex items-center gap-2 px-6 py-3 shrink-0"
            style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}
        >
            <input
                type="text"
                placeholder={txt.newHabitPlaceholder}
                value={name}
                onChange={e => { setName(e.target.value); setStep('name') }}
                className="flex-1 border px-3 py-1.5 text-sm focus:outline-none transition-colors rounded-none"
                style={{
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-fg)',
                    backgroundColor: 'var(--theme-bg)',
                }}
            />
            <button
                type="submit"
                disabled={!name.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all rounded-none disabled:opacity-50"
                style={{
                    backgroundColor: 'var(--theme-accent)',
                    color: 'var(--theme-accent-fg)',
                }}
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" className="shrink-0">
                    <line x1="7" y1="2" x2="7" y2="12" />
                    <line x1="2" y1="7" x2="12" y2="7" />
                </svg>
                {txt.addHabit}
            </button>
        </form>
    )
}
