'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import { deleteHabit } from '@/lib/actions/habits'
import AddHabit from './AddHabit'

interface Habit { id: number; name: string }
interface Streak { habitId: number; count: number }

function XIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1" className="shrink-0">
            <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
        </svg>
    )
}

export default function HabitsView({ habits, streaks, userId }: { habits: Habit[]; streaks: Streak[]; userId: number }) {
    const { txt } = useLang()
    const router = useRouter()
    const [deleting, setDeleting] = useState<number | null>(null)

    async function handleDelete(habitId: number) {
        setDeleting(habitId)
        try {
            await deleteHabit(habitId)
            router.refresh()
        } catch (err) {
            console.error(err)
            setDeleting(null)
        }
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <AddHabit userId={userId} />
            {habits.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[10px] tracking-widest" style={{ color: 'var(--theme-muted)' }}>
                        {txt.emptyHabits}
                    </p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto px-6 pt-4">
                    <div className="flex flex-col gap-px" style={{ backgroundColor: 'var(--theme-border)' }}>
                        {habits.map((habit) => {
                            const streak = streaks.find((s) => s.habitId === habit.id)
                            const isDeleting = deleting === habit.id
                            return (
                                <div
                                    key={habit.id}
                                    className="flex items-center justify-between px-4 py-3 group"
                                    style={{ backgroundColor: 'var(--theme-bg)' }}
                                >
                                    <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--theme-fg)' }}>
                                        {habit.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {streak && streak.count > 0 && (
                                            <span className="text-[10px] px-2 py-0.5 border" style={{ color: 'var(--theme-muted)', borderColor: 'var(--theme-border)' }}>
                                                {streak.count}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => handleDelete(habit.id)}
                                            disabled={isDeleting}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-red-400/30 p-1 rounded-none disabled:opacity-30"
                                            style={{ color: 'var(--theme-muted)' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444' }}
                                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-muted)' }}
                                        >
                                            <XIcon />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
