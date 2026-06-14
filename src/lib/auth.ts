import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export function createToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export async function verifyToken(token: string): Promise<{ userId: number } | null> {
    try {
        const [headerB64, payloadB64, signatureB64] = token.split('.')
        if (!headerB64 || !payloadB64 || !signatureB64) return null

        const encoder = new TextEncoder()
        const data = encoder.encode(`${headerB64}.${payloadB64}`)
        
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(JWT_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        )

        const sigBuf = Uint8Array.from(
            atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')),
            c => c.charCodeAt(0)
        )

        const isValid = await crypto.subtle.verify(
            'HMAC',
            key,
            sigBuf,
            data
        )

        if (!isValid) return null

        const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')))
        
        if (payload.exp && Date.now() >= payload.exp * 1000) {
            return null
        }

        return payload as { userId: number }
    } catch {
        return null
    }
}