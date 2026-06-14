'use server'

import { prisma } from '@/lib/prisma'
import { verifyToken } from '../auth'
import { cookies } from 'next/headers'
import { z } from 'zod'

const NoteSchema = z.object({
    content: z.string().min(1).max(500),
    date: z.string()
})

async function getUserId(): Promise<number> {
    const cookieStore = await cookies()
    const token = cookieStore.get('token',)?.value
    if (!token) throw new Error('No autenticado')
    const payload = await verifyToken(token)
    if (!payload) throw new Error('Token invalido')
    return payload.userId
}

export async function upserNote(formData: { content: string, date: string }) {
    const userId = await getUserId()
    const { content, date } = NoteSchema.parse(formData)

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    return prisma.dayNote.upsert({
        where: {
            userId_date: { userId, date: startOfDay }
        },
        update: { content },
        create: { userId, date: startOfDay, content }
    })
}

export async function getNoteByDate(date: string) {
    const userId = await getUserId()

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return prisma.dayNote.findFirst({
        where: {
            userId,
            date: { gte: startOfDay, lte: endOfDay }
        }
    })
}