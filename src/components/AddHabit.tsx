'use client'

import { useState } from "react"
import { createHabit } from "@/lib/actions/habits"
import { useRouter } from "next/navigation"
import { useLang } from "@/lib/lang"

interface Props {
    userId: number
}

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
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { txt } = useLang()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) return
        setLoading(true)

        try {
            await createHabit({ name, userId })
            setName('')
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
            className="flex items-center gap-2 px-6 py-3 shrink-0"
            style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}
        >
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
        </form>
    )
}
