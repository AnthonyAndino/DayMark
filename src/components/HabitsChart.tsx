'use client'

import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useLang } from '@/lib/lang'

interface Props {
    logs: { habitId: number; date: string }[]
}

export default function HabitsChart({ logs }: Props) {
    const { txt } = useLang()
    const data = useMemo(() => {
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        const counts: Record<number, Set<number>> = {}
        for (const log of logs) {
            const d = new Date(log.date)
            if (d.getFullYear() === year && d.getMonth() === month) {
                const day = d.getDate()
                if (!counts[day]) counts[day] = new Set()
                counts[day].add(log.habitId)
            }
        }

        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            return { day, completed: counts[day]?.size ?? 0 }
        })
    }, [logs])

    const maxY = Math.max(...data.map(d => d.completed), 1)

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 12, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="habitGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--theme-accent)" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border)" opacity={0.3} />
                    <XAxis
                        dataKey="day"
                        tick={{ fontSize: 10, fill: 'var(--theme-muted)', fontFamily: 'monospace' }}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--theme-border)', strokeWidth: 1 }}
                    />
                    <YAxis
                        domain={[0, maxY + 1]}
                        tick={{ fontSize: 10, fill: 'var(--theme-muted)', fontFamily: 'monospace' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const val = payload[0].value as number
                            return (
                                <div
                                    className="px-3 py-2 text-[10px] font-mono tracking-widest"
                                    style={{
                                        borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--theme-border)',
                                        backgroundColor: 'var(--theme-bg)', color: 'var(--theme-fg)',
                                    }}
                                >
                                    {txt.chartDay} {payload[0].payload.day}: {val} {txt.chartHabit}{val !== 1 ? 's' : ''}
                                </div>
                            )
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="var(--theme-accent)"
                        strokeWidth={1.5}
                        fill="url(#habitGradient)"
                        dot={{ r: 2.5, fill: '#ffffff', stroke: 'var(--theme-accent)', strokeWidth: 1.5 }}
                        activeDot={{ r: 4, fill: '#ffffff', stroke: 'var(--theme-accent)', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
