'use server'

import { prisma } from '@/lib/prisma'
import { verifyToken } from '../auth'
import { cookies } from 'next/headers'
import { z } from 'zod'

const HabitSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(50)
})

async function getUserId(): Promise<number> { 
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token ) throw new Error('No autenticado')
    const payload = await verifyToken(token)
    if (!payload) throw new Error('Token invalido')
    if (typeof payload.userId !== 'number') throw new Error('Token invalido: userId ausente')
    return payload.userId
}

export async function createHabit(formData: { name: string, userId: number }) {
    const { name, userId } = HabitSchema.extend({ userId: z.number() }).parse(formData)

    const habit = await prisma.habit.create({
        data: { name, userId }
    })

    return habit
}

export async function getHabits() {
    const userId = await getUserId()

    return prisma.habit.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' }
    })
}

export async function toggleHabitLog(habitId: number, date: Date, userId: number) {

    const habit = await prisma.habit.findFirst({
        where: { id: habitId, userId }
    })

    if (!habit) throw new Error('Habito no encontrado')

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const existing = await prisma.habitLog.findFirst({
        where: {
            habitId,
            date: { gte: startOfDay, lte: endOfDay }
        }
    })

    if (existing) {
        await prisma.habitLog.delete({ where: { id: existing.id } })
        return { marked: false }
    } else {
        await prisma.habitLog.create({
            data: { habitId, date: startOfDay }
        })
        return { marked: true }
    }
}

export async function deleteHabit(habitId: number) {
    const userId = await getUserId()

    const habit = await prisma.habit.findFirst({
        where: { id: habitId, userId }
    })
    if (!habit) throw new Error('Hábito no encontrado')

    await prisma.habitLog.deleteMany({ where: { habitId } })
    await prisma.habit.delete({ where: { id: habitId } })

    return { success: true }
}

export async function getStreak(habitId: number): Promise<number> {
    const userId = await getUserId()

    const habit = await prisma.habit.findFirst({
        where: { id: habitId, userId }
    })

    if (!habit) return 0

    const logs = await prisma.habitLog.findMany({
        where: { habitId },
        orderBy: { date: 'asc' }
    })

    if (logs.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < logs.length; i++) {
        const logDate = new Date(logs[i].date)
        logDate.setHours(0, 0, 0, 0)

        const expectedDate = new Date(today)
        expectedDate.setDate(today.getDate() - i)
        
        if (logDate.getTime() === expectedDate.getTime()) {
            streak++
        } else {
            break
        }
    }

    return streak
}

