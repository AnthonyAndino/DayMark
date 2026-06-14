'use client'

import { useLang } from '@/lib/lang'
import HabitsChart from './HabitsChart'

interface Habit { id: number; name: string }
interface HabitLog { habitId: number; date: string }
interface Streak { habitId: number; count: number }

interface Props {
    habits: Habit[]
    logs: HabitLog[]
    streaks: Streak[]
    notesCount: number
    userName: string
}

export default function OverviewView({ habits, logs, streaks, notesCount, userName }: Props) {
    const { txt } = useLang()

    const totalHabits = habits.length
    const totalLogs = logs.length
    const bestStreak = streaks.length > 0 ? Math.max(...streaks.map(s => s.count)) : 0

    const completionRate = totalHabits > 0
        ? Math.round((totalLogs / (totalHabits * new Date().getDate())) * 100)
        : 0

    const metrics = [
        { label: txt.totalStreak, value: `${bestStreak} ${txt.days}` },
        { label: txt.completion, value: `${completionRate}%` },
        { label: txt.completedTasks, value: String(totalLogs) },
        { label: 'NOTES', value: String(notesCount) },
    ]

    return (
        <div className="flex-1 flex flex-col overflow-hidden p-6 pt-8">
            <p className="text-[10px] tracking-[0.35em] font-bold uppercase mb-6" style={{ color: 'var(--theme-muted)' }}>
                {txt.welcomeBack}{userName.toUpperCase()}
            </p>
            <div className="grid grid-cols-4 gap-3 mb-8">
                {metrics.map((m) => (
                    <div
                        key={m.label}
                        className="flex flex-col items-center justify-center text-center px-4 py-6"
                        style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--theme-border)' }}
                    >
                        <span className="text-[10px] tracking-[0.25em] font-semibold uppercase mb-2" style={{ color: 'var(--theme-muted)' }}>
                            {m.label}
                        </span>
                        <span className="text-lg tracking-[-0.02em] font-bold" style={{ color: 'var(--theme-fg)' }}>
                            {m.value}
                        </span>
                    </div>
                ))}
            </div>

            {totalHabits > 0 && (
                <div className="flex-1 flex flex-col min-h-0">
                    <p className="text-[10px] tracking-[0.35em] font-bold uppercase mb-3" style={{ color: 'var(--theme-muted)' }}>
                        HÁBITOS COMPLETADOS / DÍA
                    </p>
                    <div className="flex-1 min-h-0">
                        <HabitsChart logs={logs} />
                    </div>
                </div>
            )}

            {totalHabits === 0 && (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[10px] tracking-widest" style={{ color: 'var(--theme-muted)' }}>
                        {txt.emptyHabits}
                    </p>
                </div>
            )}
        </div>
    )
}
