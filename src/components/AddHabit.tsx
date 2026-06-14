'use client'

import { useState } from "react"
import { createHabit } from "@/lib/actions/habits"
import { useRouter } from "next/navigation"

interface Props {
    userId: number
}

export default function AddHabit({ userId }: Props) {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

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
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
            <input
                type="text"
                placeholder="Nuevo hábito (ej: Ejercicio)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 bg-zinc-950/40 placeholder-zinc-500 flex-1 focus:outline-none focus:border-zinc-600 transition-colors"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-zinc-100 text-zinc-950 rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
                {loading ? '...' : 'Agregar'}
            </button>
        </form>
    )
}
