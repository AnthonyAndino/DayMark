'use client'

import { useLang } from '@/lib/lang'

export default function LangToggle() {
    const { lang, setLang } = useLang()

    return (
        <div
            className="flex items-center gap-1.5 text-[10px] tracking-[0.35em] font-semibold shrink-0"
            style={{ color: 'var(--theme-muted)' }}
        >
            <button
                onClick={() => setLang('en')}
                className={`transition-colors cursor-pointer ${lang === 'en' ? '' : 'opacity-40 hover:opacity-70'}`}
                style={{ color: lang === 'en' ? 'var(--theme-fg)' : 'inherit' }}
            >
                EN
            </button>
            <span style={{ color: 'var(--theme-border)' }}>|</span>
            <button
                onClick={() => setLang('es')}
                className={`transition-colors cursor-pointer ${lang === 'es' ? '' : 'opacity-40 hover:opacity-70'}`}
                style={{ color: lang === 'es' ? 'var(--theme-fg)' : 'inherit' }}
            >
                ES
            </button>
        </div>
    )
}
