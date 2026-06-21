'use server'

import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '../auth'
import { cookies } from 'next/headers'
import { z } from 'zod'

const HabitSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(50),
    daysOfWeek: z.array(z.number().min(0).max(6)).optional()
})

async function getUserId(): Promise<number> {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) throw new Error('No autenticado')
    const payload = await verifyToken(token)
    if (!payload) throw new Error('Token invalido')
    if (typeof payload.userId !== 'number') throw new Error('Token invalido: userId ausente')
    return payload.userId
}

export async function createHabit(formData: { name: string; userId: number; daysOfWeek?: number[] }) {
    const { name, userId, daysOfWeek } = HabitSchema.extend({ userId: z.number() }).parse(formData)

    const habit = await prisma.habit.create({
        data: {
            name,
            userId,
            daysOfWeek: daysOfWeek ?? Prisma.DbNull
        }
    })

    return habit
}

export async function updateHabit(habitId: number, formData: { name?: string; daysOfWeek?: number[] | null }) {
    const userId = await getUserId()

    const habit = await prisma.habit.findFirst({
        where: { id: habitId, userId }
    })
    if (!habit) throw new Error('Hábito no encontrado')

    const data: { name?: string; daysOfWeek?: Prisma.NullableJsonNullValueInput | number[] } = {}
    if (formData.name !== undefined) data.name = formData.name
    if (formData.daysOfWeek !== undefined) data.daysOfWeek = formData.daysOfWeek ?? Prisma.DbNull

    return prisma.habit.update({
        where: { id: habitId },
        data
    })
}

export async function getHabits() {
    const userId = await getUserId()

    return prisma.habit.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' }
    })
}

export async function getTodaySummary(todayDate?: string) {
    const userId = await getUserId()

    // todayDate viene del cliente como "YYYY-MM-DD" en su zona horaria local
    let today: Date
    if (todayDate) {
        const [y, m, d] = todayDate.split('-').map(Number)
        today = new Date(y, m - 1, d)
    } else {
        today = new Date()
        today.setHours(0, 0, 0, 0)
    }

    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const todayDay = today.getDay()

    const allHabits = await prisma.habit.findMany({
        where: { userId },
        select: { id: true, daysOfWeek: true }
    })

    const applicableIds: number[] = []
    for (const h of allHabits) {
        const dow = h.daysOfWeek as number[] | null
        if (dow && !dow.includes(todayDay)) continue
        applicableIds.push(h.id)
    }

    const completed = await prisma.habitLog.count({
        where: {
            habitId: { in: applicableIds },
            date: { gte: today, lt: tomorrow }
        }
    })

    return { total: applicableIds.length, completed }
}

export async function toggleHabitLog(habitId: number, dateStr: string, userId: number) {
    // dateStr viene como "YYYY-MM-DD" desde el cliente (zona horaria local)
    const [y, m, d] = dateStr.split('-').map(Number)
    const targetDayStart = new Date(y, m - 1, d)
    const targetDayEnd = new Date(targetDayStart)
    targetDayEnd.setHours(23, 59, 59, 999)

    const existing = await prisma.habitLog.findFirst({
        where: {
            habitId,
            date: { gte: targetDayStart, lte: targetDayEnd }
        }
    })

    if (existing) {
        await prisma.habitLog.delete({ where: { id: existing.id } })
        return { marked: false }
    } else {
        await prisma.habitLog.create({
            data: { habitId, date: targetDayStart }
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

    const daysOfWeek = habit.daysOfWeek as number[] | null

    const logs = await prisma.habitLog.findMany({
        where: { habitId },
        orderBy: { date: 'asc' }
    })

    if (logs.length === 0) return 0

    const logSet = new Set<string>()
    for (const log of logs) {
        const d = new Date(log.date)
        logSet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
    }

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

    if (!logSet.has(todayKey)) return 0

    for (let i = 0; ; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)

        if (daysOfWeek && !daysOfWeek.includes(d.getDay())) continue

        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        if (logSet.has(key)) {
            streak++
        } else {
            break
        }
    }

    return streak
}

export async function getHabitStats(habitId: number, year: number, month: number) {
    const userId = await getUserId()

    const habit = await prisma.habit.findFirst({
        where: { id: habitId, userId }
    })

    if (!habit) throw new Error('Hábito no encontrado')

    const daysOfWeek = habit.daysOfWeek as number[] | null

    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59)

    const logs = await prisma.habitLog.findMany({
        where: {
            habitId,
            date: { gte: startOfMonth, lte: endOfMonth }
        }
    })

    const logDays = new Set<string>()
    for (const log of logs) {
        const d = new Date(log.date)
        logDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const createdAt = new Date(habit.createdAt)
    let scheduled = 0
    let completed = 0

    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day)
        if (d < new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())) continue
        if (daysOfWeek && !daysOfWeek.includes(d.getDay())) continue

        scheduled++
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        if (logDays.has(key)) completed++
    }

    return {
        totalScheduledDays: scheduled,
        completedDays: completed,
        completionRate: scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0
    }
}
