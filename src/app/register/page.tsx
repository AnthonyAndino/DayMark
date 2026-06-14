'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/lang'
import LeftPanel from '@/components/LeftPanel'

export default function RegisterPage() {
    const { txt } = useLang()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (password !== confirm) {
            setError(txt.passwordsMismatch)
            return
        }

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        if (res.ok) {
            router.push('/dashboard')
        } else {
            const data = await res.json()
            setError(data.error)
        }
    }

    return (
        <div className="min-h-screen w-full bg-white text-black grid grid-cols-1 md:grid-cols-2">
            <LeftPanel variant="register" />

            {/* ───── RIGHT: Form ───── */}
            <div className="flex flex-col justify-center p-12 md:p-20 max-w-lg mx-auto w-full">
                {/* mobile title */}
                <div className="md:hidden mb-16">
                    <h1 className="text-[16vw] leading-[0.85] font-light tracking-[-0.04em] text-black mb-4">
                        DAY
                        <br />
                        MARK
                    </h1>
                    <div className="w-12 h-px bg-black" />
                </div>

                <span className="text-[10px] tracking-[0.3em] font-bold text-black mb-2 uppercase">
                    {txt.register}
                </span>
                <h2 className="text-2xl font-light tracking-[-0.02em] text-black mb-12">
                    {txt.createAccount}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    {/* email */}
                    <div>
                        <label className="text-[10px] tracking-widest font-bold text-black mb-2 uppercase block">
                            {txt.email}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder={txt.emailPlaceholder}
                            className="w-full border-b border-black bg-transparent pb-2 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-b-2 transition-all rounded-none"
                        />
                    </div>

                    {/* password */}
                    <div>
                        <label className="text-[10px] tracking-widest font-bold text-black mb-2 uppercase block">
                            {txt.password}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder={txt.passwordPlaceholder}
                            className="w-full border-b border-black bg-transparent pb-2 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-b-2 transition-all rounded-none"
                        />
                    </div>

                    {/* confirm password */}
                    <div>
                        <label className="text-[10px] tracking-widest font-bold text-black mb-2 uppercase block">
                            {txt.confirmPassword}
                        </label>
                        <input
                            type="password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder={txt.passwordPlaceholder}
                            className="w-full border-b border-black bg-transparent pb-2 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-b-2 transition-all rounded-none"
                        />
                    </div>

                    {error && (
                        <p className="text-[11px] tracking-wider uppercase text-black bg-neutral-100 border border-black px-4 py-3 rounded-none">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-semibold rounded-none transition-all duration-300 hover:bg-white hover:text-black hover:border hover:border-black mt-2"
                    >
                        {txt.createAccountBtn}
                    </button>
                </form>

                <p className="text-[10px] tracking-wider text-neutral-500 mt-8 text-center">
                    {txt.alreadyAccount}{' '}
                    <a href="/login" className="text-black underline underline-offset-4 hover:no-underline">
                        {txt.signInLink}
                    </a>
                </p>

                <div className="w-full h-px bg-black mt-16 md:hidden" />
            </div>
        </div>
    )
}
