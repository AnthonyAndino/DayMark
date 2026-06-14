import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NotesView from '@/components/NotesView'

export default async function NotesPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) redirect('/login')

    const payload = await verifyToken(token)
    if (!payload) redirect('/login')

    const userId = payload.userId

    const notes = await prisma.dayNote.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
    })

    const serializedNotes = notes.map(n => ({ id: n.id, date: n.date.toISOString(), content: n.content }))

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-fg)' }}>
            <NotesView notes={serializedNotes} />
        </div>
    )
}
