import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getStreak } from '@/lib/actions/habits'
import OverviewView from '@/components/OverviewView'

export default async function OverviewPage() {
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

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-fg)' }}>
            <OverviewView
                habits={habits}
                logs={serializedLogs}
                streaks={streakResults}
                notesCount={notes.length}
                userName={userName}
            />
        </div>
    )
}
