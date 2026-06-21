import { ThemeProvider } from '@/lib/theme-context'
import Sidebar from '@/components/Sidebar'
import LangToggle from '@/components/LangToggle'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

async function getTodaySummary() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    const payload = await verifyToken(token)
    if (!payload || typeof payload.userId !== 'number') return null

    const userId = payload.userId
    const total = await prisma.habit.count({ where: { userId } })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const completed = await prisma.habitLog.count({
        where: { habit: { userId }, date: { gte: today, lt: tomorrow } }
    })

    return { total, completed }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const summary = await getTodaySummary()

    return (
        <ThemeProvider>
            <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--theme-bg)' }}>
                <Sidebar summary={summary} />
                <main className="flex-1 ml-56 flex flex-col overflow-hidden" style={{ borderLeftWidth: 1, borderLeftStyle: 'solid', borderLeftColor: 'var(--theme-border)' }}>
                    <div
                        className="flex items-center justify-end px-6 py-2 shrink-0"
                        style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}
                    >
                        <LangToggle />
                    </div>
                    {children}
                </main>
            </div>
        </ThemeProvider>
    )
}
