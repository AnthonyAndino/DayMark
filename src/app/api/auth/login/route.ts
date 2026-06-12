import { NextRequest, NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'
import { verifyPassword, createToken } from "@/lib/auth"


export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        return NextResponse.json({ error: 'Credenciales invalidas' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
        return NextResponse.json({ error: 'Credenciales invalidas' }, { status: 401 })
    }

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