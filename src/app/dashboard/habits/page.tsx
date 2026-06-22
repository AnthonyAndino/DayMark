import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getStreak } from '@/lib/actions/habits'
import HabitsView from '@/components/HabitsView'

export default async function HabitsPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) redirect('/login')

    const payload = await verifyToken(token)
    if (!payload) redirect('/login')

    const userId = payload.userId

    const habits = await prisma.habit.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' }
    })

    const serializedHabits = habits.map(h => ({
        id: h.id,
        name: h.name,
        daysOfWeek: h.daysOfWeek as number[] | null
    }))

    const streaks = await Promise.all(
        habits.map(h => getStreak(h.id).then(count => ({ habitId: h.id, count })))
    )

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-fg)' }}>
            <HabitsView habits={serializedHabits} streaks={streaks} />
        </div>
    )
}
