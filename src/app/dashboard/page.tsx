import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Calendar from '@/components/Calendar'
import AddHabit from '@/components/AddHabit'
import { getStreak } from '@/lib/actions/habits'

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) redirect('/login')

    const payload = await verifyToken(token)
    if (!payload) redirect('/login')

    const userId = payload.userId

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const habits = await prisma.habit.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' }
    })

    const [logs, notes] = await Promise.all([
        prisma.habitLog.findMany({
            where: {
                habitId: { in: habits.map(h => h.id) },
                date: { gte: startOfMonth, lte: endOfMonth }
            }
        }),
        prisma.dayNote.findMany({
            where: { userId, date: { gte: startOfMonth, lte: endOfMonth } }
        })
    ])

    const streakResults = await Promise.all(
        habits.map(h => getStreak(h.id).then(count => ({ habitId: h.id, count })))
    )

    const serializedLogs = logs.map(l => ({ habitId: l.habitId, date: l.date.toISOString() }))
    const serializedNotes = notes.map(n => ({ date: n.date.toISOString(), content: n.content }))

    return (
        <div className="min-h-full p-6">
            <AddHabit userId={userId} />
            <Calendar habits={habits} logs={serializedLogs} notes={serializedNotes} streaks={streakResults} userId={userId} />
        </div>
    )
}
