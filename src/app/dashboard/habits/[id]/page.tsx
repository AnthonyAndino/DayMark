import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getStreak } from '@/lib/actions/habits'
import Calendar from '@/components/Calendar'
import Link from 'next/link'

export default async function HabitDetailPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params
    const habitId = parseInt(id, 10)
    if (isNaN(habitId)) redirect('/dashboard')

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) redirect('/login')

    const payload = await verifyToken(token)
    if (!payload) redirect('/login')

    const userId = payload.userId

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
    })
    if (!user) redirect('/login')

    const userName = user.email.split('@')[0]

    const habit = await prisma.habit.findFirst({
        where: { id: habitId, userId }
    })

    if (!habit) redirect('/dashboard/habits')

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const [logs, notes] = await Promise.all([
        prisma.habitLog.findMany({
            where: {
                habitId,
                date: { gte: startOfMonth, lte: endOfMonth }
            }
        }),
        prisma.dayNote.findMany({
            where: { userId, date: { gte: startOfMonth, lte: endOfMonth } }
        })
    ])

    const streak = await getStreak(habitId)

    const serializedLogs = logs.map(l => ({ habitId: l.habitId, date: l.date.toISOString() }))
    const serializedNotes = notes.map(n => ({ date: n.date.toISOString(), content: n.content }))

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-fg)' }}>
            <div
                className="flex items-center gap-2 px-6 py-3 shrink-0"
                style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}
            >
                <Link
                    href="/dashboard"
                    className="text-[10px] font-semibold tracking-widest uppercase hover:underline"
                    style={{ color: 'var(--theme-accent)' }}
                >
                    ← Volver
                </Link>
                <span className="text-xs font-bold tracking-wider" style={{ color: 'var(--theme-fg)' }}>
                    {habit.name}
                </span>
            </div>
            <Calendar
                habits={[{
                    id: habit.id,
                    name: habit.name,
                    daysOfWeek: habit.daysOfWeek as number[] | null,
                    createdAt: habit.createdAt.toISOString()
                }]}
                logs={serializedLogs}
                notes={serializedNotes}
                streaks={[{ habitId: habit.id, count: streak }]}
                userId={userId}
                userName={userName}
                habitId={habit.id}
            />
        </div>
    )
}
