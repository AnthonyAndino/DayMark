import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        return NextResponse.json({ error: 'Email ya registrado' }, { status: 400 })
    }

    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
        data: { email, password: hashed }
    })

    const token = createToken(user.id)
    const response = NextResponse.json({ ok: true })
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
    })

    return response
}
