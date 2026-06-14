'use client'

import { useState, useEffect, useRef } from 'react'
import { useLang } from '@/lib/lang'

interface LocalNote {
    id: string
    content: string
    date: string
}

const totalCells = 28

function getDayNames(lang: 'en' | 'es'): string[] {
    const names: string[] = []
    for (let i = 0; i < 7; i++) {
        const d = new Date(2024, 0, 7 + i)
        const name = d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'short' })
        names.push(name.charAt(0).toUpperCase() + name.slice(1))
    }
    return names
}

function DayMarkLogo() {
    return (
        <svg viewBox="0 0 32 32" className="w-5 h-5 text-black shrink-0" fill="none">
            <rect x="1" y="1" width="30" height="30" stroke="currentColor" strokeWidth="1" />
            <line x1="6" y1="22" x2="13" y2="15" stroke="currentColor" strokeWidth="1" />
            <line x1="12" y1="22" x2="19" y2="15" stroke="currentColor" strokeWidth="1" />
            <line x1="18" y1="22" x2="25" y2="15" stroke="currentColor" strokeWidth="1" />
        </svg>
    )
}

function buildMonthDays(): number[] {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const dow = start.getDay()
    const days: number[] = []
    for (let i = 0; i < dow; i++) days.push(0)
    for (let d = 1; d <= 31; d++) {
        const date = new Date(now.getFullYear(), now.getMonth(), d)
        if (date.getMonth() !== now.getMonth()) break
        days.push(d)
    }
    while (days.length < totalCells) days.push(0)
    return days.slice(0, totalCells)
}

const monthDays = buildMonthDays()

interface Props {
    variant: 'login' | 'register'
}

/* ───────── REGISTER: Cascade Mosaic ───────── */
function RegisterPanel() {
    const { lang, setLang, txt } = useLang()
    const [activeTab, setActiveTab] = useState<'overview' | 'habits' | 'notes'>('habits')
    const [filledCount, setFilledCount] = useState<number>(0)
    const [phase, setPhase] = useState<'filling' | 'holding'>('filling')
    const [notes, setNotes] = useState<LocalNote[]>([])
    const [noteInput, setNoteInput] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (phase === 'filling') {
            const timer = window.setTimeout(() => {
                if (filledCount < totalCells) {
                    setFilledCount((c) => c + 1)
                } else {
                    setPhase('holding')
                }
            }, 2800)
            return () => window.clearTimeout(timer)
        }

        if (phase === 'holding') {
            const timer = window.setTimeout(() => {
                setFilledCount(0)
                setPhase('filling')
            }, 3200)
            return () => window.clearTimeout(timer)
        }
    }, [phase, filledCount])

    const rate = Math.round((filledCount / totalCells) * 100)

    useEffect(() => {
        const raw = localStorage.getItem('daymark_preview_notes_register')
        if (raw) {
            try { setNotes(JSON.parse(raw)) } catch { setNotes([]) }
        } else {
            const demo: LocalNote = {
                id: crypto.randomUUID(),
                content: txt.welcomeDemoNote,
                date: new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            }
            setNotes([demo])
            localStorage.setItem('daymark_preview_notes_register', JSON.stringify([demo]))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('daymark_preview_notes_register', JSON.stringify(notes))
    }, [notes])

    const saveNote = () => {
        const trimmed = noteInput.trim()
        if (!trimmed) return
        const newNote: LocalNote = {
            id: crypto.randomUUID(),
            content: trimmed,
            date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        }
        setNotes((prev) => [newNote, ...prev])
        setNoteInput('')
        textareaRef.current?.focus()
    }

    const deleteNote = (id: string) => {
        setNotes((prev) => prev.filter((n) => n.id !== id))
    }

    const tabClass = (tab: 'overview' | 'habits' | 'notes') =>
        `cursor-pointer transition-colors duration-300 ${
            activeTab === tab
                ? 'text-black font-bold'
                : 'text-neutral-500 font-semibold hover:text-black'
        }`

    return (
        <div className="flex flex-col h-full">
            {/* ─── HEADER TABS ─── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black text-sm tracking-[0.2em] uppercase">
                <div className="flex items-center gap-5">
                    <DayMarkLogo />
                    <span className="text-[10px] tracking-[0.4em] font-bold text-black mr-1">DAYMARK</span>
                    <button onClick={() => setActiveTab('overview')} className={tabClass('overview')}>
                        {txt.panelOverview}
                    </button>
                    <button onClick={() => setActiveTab('habits')} className={tabClass('habits')}>
                        {txt.cardHabits}
                    </button>
                    <button onClick={() => setActiveTab('notes')} className={tabClass('notes')}>
                        {txt.cardNotes}
                    </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs tracking-[0.35em]">
                    <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-black font-bold' : 'text-neutral-400 hover:text-black cursor-pointer transition-colors'}>EN</button>
                    <span className="text-neutral-300">|</span>
                    <button onClick={() => setLang('es')} className={lang === 'es' ? 'text-black font-bold' : 'text-neutral-400 hover:text-black cursor-pointer transition-colors'}>ES</button>
                </div>
            </div>

            {/* ─── OVERVIEW METRICS (expand/collapse) ─── */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeTab === 'overview' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-6 pt-6 pb-4 border-b border-black">
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: txt.totalStreak, value: txt.streakValue },
                            { label: txt.completion, value: txt.completionValue },
                            { label: txt.completedTasks, value: txt.tasksValue },
                        ].map((m) => (
                            <div key={m.label} className="border border-black p-3 flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] tracking-[0.25em] text-neutral-500 font-semibold uppercase mb-1">{m.label}</span>
                                <span className="text-sm tracking-[-0.02em] text-black font-bold">{m.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── TITLE ─── */}
            <div
                className={`px-6 border-b border-black transition-all duration-500 ease-in-out ${
                    activeTab === 'overview' ? 'pt-4 pb-4' : 'pt-10 pb-6'
                }`}
            >
                <span className="text-sm tracking-[0.3em] font-bold text-black uppercase block mb-4">{txt.titleTagRegister}</span>
                <h1 className="text-[5.5vw] leading-[0.82] font-light tracking-[-0.04em] text-black">
                    {txt.welcomeRegister1}<br />{txt.welcomeRegister2}
                </h1>
                <p className="text-sm tracking-[0.25em] uppercase text-neutral-500 mt-3 font-semibold">{txt.consistencyQuoteRegister}</p>
            </div>

            {/* ─── MAIN CONTENT (dual-panel overlay) ─── */}
            <div className="flex-1 relative overflow-hidden border-b border-black">
                {/* Mosaic panel (habits) */}
                <div
                    className={`absolute inset-0 px-6 pt-6 pb-4 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
                        activeTab === 'notes'
                            ? 'opacity-0 translate-y-3 pointer-events-none'
                            : 'opacity-100 translate-y-0'
                    }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm tracking-[0.25em] font-bold uppercase text-black">
                            {activeTab === 'overview' ? txt.metricsSummary : txt.monthlyMosaic}
                        </span>
                        <span className="text-sm tracking-[0.1em] text-neutral-500 font-mono font-semibold">
                            {activeTab === 'overview'
                                ? txt.staticInstant
                                : phase === 'filling'
                                ? `${filledCount + 1}/${totalCells}`
                                : txt.monthComplete}
                        </span>
                    </div>

                    <div className="grid grid-cols-7 gap-px mb-px">
                        {getDayNames(lang).map((d) => (
                            <div key={d} className="text-xs tracking-[0.2em] uppercase text-neutral-500 font-semibold text-center pb-1.5">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-px flex-1">
                        {monthDays.map((dayNum, i) => {
                            if (dayNum === 0) return <div key={`e-${i}`} />
                            const realDays = monthDays.filter((d) => d > 0)
                            const idx = realDays.indexOf(dayNum)
                            const isFilled = idx < filledCount

                            return (
                                <div
                                    key={i}
                                    className={`flex items-center justify-center font-mono border border-black transition-all duration-1000 ease-out rounded-none text-xs ${isFilled ? 'bg-black text-white' : 'bg-white text-neutral-500'}`}
                                    style={isFilled ? { background: `repeating-linear-gradient(45deg, #000, #000 1.5px, #fff 1.5px, #fff 3px)` } : {}}
                                >
                                    <span className={`inline-flex items-center justify-center w-5 h-5 text-sm leading-none font-bold ${isFilled ? 'bg-black text-white' : 'text-neutral-500'}`}>
                                        {dayNum}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    <div
                        className={`transition-all duration-500 ease-in-out ${
                            activeTab === 'habits'
                                ? 'max-h-12 opacity-100 mt-3'
                                : 'max-h-0 opacity-0 overflow-hidden'
                        }`}
                    >
                        <div className="flex items-center gap-5 text-sm tracking-[0.15em] uppercase text-neutral-600 font-semibold">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 border border-black bg-black inline-block rounded-none" />{txt.completed}</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 border border-black bg-white inline-block rounded-none" />{txt.pending}</span>
                        </div>
                    </div>
                </div>

                {/* Notes panel */}
                <div
                    className={`absolute inset-0 px-6 pt-6 pb-4 flex flex-col overflow-y-auto transition-all duration-500 ease-in-out ${
                        activeTab === 'notes'
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-3 pointer-events-none'
                    }`}
                >
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-sm tracking-[0.25em] font-bold uppercase text-black">{txt.quickNote}</span>
                        <span className="text-sm tracking-[0.1em] text-neutral-500 font-mono font-semibold">{txt.localPersistent}</span>
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder={txt.writeNote}
                        className="w-full bg-transparent border border-black rounded-none p-4 text-sm text-black font-mono resize-none outline-none placeholder-neutral-400 min-h-[120px]"
                    />

                    <div className="flex justify-end mt-3">
                        <button
                            onClick={saveNote}
                            className="bg-black text-white text-xs uppercase tracking-widest px-6 py-3 rounded-none hover:bg-neutral-800 transition-colors"
                        >
                            {txt.saveNote}
                        </button>
                    </div>

                    <div className="border-t border-black mt-6 pt-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="border border-black bg-white rounded-none p-4 relative flex flex-col justify-between"
                            >
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className="absolute top-2 right-2 text-neutral-400 hover:text-black transition-colors text-xs leading-none"
                                >
                                    ✕
                                </button>
                                <p className="text-sm text-black pr-4">{note.content}</p>
                                <span className="text-[10px] text-neutral-500 mt-3 font-mono">{note.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── BOTTOM (expand/collapse) ─── */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeTab === 'notes' ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100'
                }`}
            >
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-2 text-sm tracking-[0.2em] uppercase font-semibold">
                        <span className="text-black">{txt.liveProgress}</span>
                        <span className="text-black font-mono text-base tracking-[0.05em] font-bold">{rate}%</span>
                        <span className="text-neutral-500 font-mono text-sm font-semibold">{filledCount}/{totalCells} {txt.days}</span>
                    </div>
                    <div className="h-3 border border-black bg-white">
                        <div className="h-full bg-black transition-all duration-1000 ease-in-out" style={{ width: `${rate}%` }} />
                    </div>
                    <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-semibold mt-2">
                        {phase === 'filling' ? `${txt.fillingMosaic} ${filledCount + 1}` : txt.mosaicComplete}
                    </p>
                </div>
            </div>

            <div className="px-6 pb-4 flex justify-between text-xs tracking-[0.25em] uppercase text-neutral-400 font-semibold">
                <span>{txt.cascadeV1}</span>
                <span>{txt.trackRecord}</span>
            </div>
        </div>
    )
}

/* ───────── LOGIN: Infinite Timeline ───────── */
function LoginPanel() {
    const ROWS = 5
    const ITEMS_PER_ROW = 36
    const FILLED_RATIO = 0.24

    const rowConfig = [
        { direction: 'left', speed: 30 },
        { direction: 'right', speed: 52 },
        { direction: 'left', speed: 40 },
        { direction: 'right', speed: 84 },
        { direction: 'left', speed: 24 },
    ] as const

    const { lang, setLang, txt } = useLang()
    const [activeTab, setActiveTab] = useState<'overview' | 'habits' | 'notes'>('habits')
    const [rows, setRows] = useState<{ id: number; filled: boolean; day: number }[][] | null>(null)
    const [notes, setNotes] = useState<LocalNote[]>([])
    const [noteInput, setNoteInput] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        setRows(
            Array.from({ length: ROWS }, (_, row) =>
                Array.from({ length: ITEMS_PER_ROW }, (_, col) => ({
                    id: col,
                    filled: Math.random() < FILLED_RATIO,
                    day: Math.floor(Math.random() * 28) + 1,
                })),
            ),
        )
    }, [])

    useEffect(() => {
        const raw = localStorage.getItem('daymark_preview_notes')
        if (raw) {
            try { setNotes(JSON.parse(raw)) } catch { setNotes([]) }
        } else {
            const demo: LocalNote = {
                id: crypto.randomUUID(),
                content: txt.welcomeDemoNote,
                date: new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            }
            setNotes([demo])
            localStorage.setItem('daymark_preview_notes', JSON.stringify([demo]))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('daymark_preview_notes', JSON.stringify(notes))
    }, [notes])

    const saveNote = () => {
        const trimmed = noteInput.trim()
        if (!trimmed) return
        const newNote: LocalNote = {
            id: crypto.randomUUID(),
            content: trimmed,
            date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        }
        setNotes((prev) => [newNote, ...prev])
        setNoteInput('')
        textareaRef.current?.focus()
    }

    const deleteNote = (id: string) => {
        setNotes((prev) => prev.filter((n) => n.id !== id))
    }

    const tabClass = (tab: 'overview' | 'habits' | 'notes') =>
        `cursor-pointer transition-colors duration-300 ${
            activeTab === tab
                ? 'text-black font-bold'
                : 'text-neutral-500 font-semibold hover:text-black'
        }`

    return (
        <div className="flex flex-col h-full">
            {/* ─── HEADER TABS ─── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black text-sm tracking-[0.2em] uppercase">
                <div className="flex items-center gap-5">
                    <DayMarkLogo />
                    <span className="text-[10px] tracking-[0.4em] font-bold text-black mr-1">DAYMARK</span>
                    <button onClick={() => setActiveTab('overview')} className={tabClass('overview')}>
                        {txt.panelOverview}
                    </button>
                    <button onClick={() => setActiveTab('habits')} className={tabClass('habits')}>
                        {txt.cardHabits}
                    </button>
                    <button onClick={() => setActiveTab('notes')} className={tabClass('notes')}>
                        {txt.cardNotes}
                    </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs tracking-[0.35em]">
                    <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-black font-bold' : 'text-neutral-400 hover:text-black cursor-pointer transition-colors'}>EN</button>
                    <span className="text-neutral-300">|</span>
                    <button onClick={() => setLang('es')} className={lang === 'es' ? 'text-black font-bold' : 'text-neutral-400 hover:text-black cursor-pointer transition-colors'}>ES</button>
                </div>
            </div>

            {/* ─── OVERVIEW METRICS (expand/collapse) ─── */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeTab === 'overview' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-6 pt-6 pb-4 border-b border-black">
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: txt.totalStreak, value: txt.streakValue },
                            { label: txt.completion, value: txt.completionValue },
                            { label: txt.completedTasks, value: txt.tasksValue },
                        ].map((m) => (
                            <div key={m.label} className="border border-black p-3 flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] tracking-[0.25em] text-neutral-500 font-semibold uppercase mb-1">{m.label}</span>
                                <span className="text-sm tracking-[-0.02em] text-black font-bold">{m.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── TITLE ─── */}
            <div
                className={`px-6 border-b border-black transition-all duration-500 ease-in-out ${
                    activeTab === 'overview' ? 'pt-4 pb-4' : 'pt-10 pb-6'
                }`}
            >
                <span className="text-sm tracking-[0.3em] font-bold text-black uppercase block mb-4">{txt.titleTagLogin}</span>
                <h1 className="text-[5.5vw] leading-[0.82] font-light tracking-[-0.04em] text-black">
                    {txt.welcomeLogin1}<br />{txt.welcomeLogin2}
                </h1>
                <p className="text-sm tracking-[0.25em] uppercase text-neutral-500 mt-3 font-semibold">{txt.consistencyQuoteLogin}</p>
            </div>

            {/* ─── MAIN CONTENT (dual-panel overlay) ─── */}
            <div className="flex-1 relative overflow-hidden border-b border-black">
                {/* Timeline panel (habits + overview) */}
                <div
                    className={`absolute inset-0 px-6 pt-6 pb-4 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
                        activeTab === 'notes'
                            ? 'opacity-0 translate-y-3 pointer-events-none'
                            : 'opacity-100 translate-y-0'
                    }`}
                >
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-sm tracking-[0.25em] font-bold uppercase text-black">
                            {activeTab === 'overview' ? txt.metricsSummary : txt.timeline}
                        </span>
                        <span className="text-sm tracking-[0.1em] text-neutral-500 font-mono font-semibold">
                            {activeTab === 'overview' ? txt.staticInstant : txt.infiniteHist}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 flex-1 justify-center overflow-hidden w-full">
                        {rows?.map((row, rIdx) => {
                            const isLeft = rowConfig[rIdx].direction === 'left'
                            const speed = rowConfig[rIdx].speed
                            const animName = `marquee${isLeft ? '' : '-reverse'}`
                            return (
                                <div
                                    key={rIdx}
                                    className="overflow-hidden w-full flex select-none"
                                >
                                    <div
                                        className="flex whitespace-nowrap min-w-max justify-start transform-gpu backface-visibility-hidden animate-marquee"
                                        style={{ animation: `${animName} ${speed}s linear infinite` }}
                                    >
                                        {row.map((cell, cIdx) => (
                                            <div
                                                key={`${rIdx}-${cIdx}`}
                                                className={`w-9 h-9 flex-shrink-0 flex items-center justify-center font-mono text-xs font-bold border border-black mr-4 ${cell.filled ? 'text-white' : 'text-neutral-500'}`}
                                                style={cell.filled ? { background: `repeating-linear-gradient(45deg, #000, #000 1.5px, #fff 1.5px, #fff 3px)` } : { background: '#fff' }}
                                            >
                                                <span className={`inline-flex items-center justify-center w-5 h-5 text-xs leading-none ${cell.filled ? 'bg-black text-white' : 'text-neutral-500'}`}>
                                                    {cell.day}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        className="flex whitespace-nowrap min-w-max justify-start transform-gpu backface-visibility-hidden animate-marquee"
                                        style={{ animation: `${animName} ${speed}s linear infinite` }}
                                        aria-hidden="true"
                                    >
                                        {row.map((cell, cIdx) => (
                                            <div
                                                key={`${rIdx}-${cIdx}-dup`}
                                                className={`w-9 h-9 flex-shrink-0 flex items-center justify-center font-mono text-xs font-bold border border-black mr-4 ${cell.filled ? 'text-white' : 'text-neutral-500'}`}
                                                style={cell.filled ? { background: `repeating-linear-gradient(45deg, #000, #000 1.5px, #fff 1.5px, #fff 3px)` } : { background: '#fff' }}
                                            >
                                                <span className={`inline-flex items-center justify-center w-5 h-5 text-xs leading-none ${cell.filled ? 'bg-black text-white' : 'text-neutral-500'}`}>
                                                    {cell.day}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div
                        className={`transition-all duration-500 ease-in-out ${
                            activeTab === 'habits'
                                ? 'max-h-12 opacity-100 mt-3'
                                : 'max-h-0 opacity-0 overflow-hidden'
                        }`}
                    >
                        <div className="flex items-center gap-4 text-sm tracking-[0.15em] uppercase text-neutral-600 font-semibold">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 border border-black bg-black inline-block rounded-none" />{txt.completed}</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 border border-black bg-white inline-block rounded-none" />{txt.pending}</span>
                            <span className="ml-auto text-xs tracking-[0.2em] text-neutral-500">{Math.round(FILLED_RATIO * 100)}% {txt.constancy}</span>
                        </div>
                    </div>
                </div>

                {/* Notes panel */}
                <div
                    className={`absolute inset-0 px-6 pt-6 pb-4 flex flex-col overflow-y-auto transition-all duration-500 ease-in-out ${
                        activeTab === 'notes'
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-3 pointer-events-none'
                    }`}
                >
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-sm tracking-[0.25em] font-bold uppercase text-black">{txt.quickNote}</span>
                        <span className="text-sm tracking-[0.1em] text-neutral-500 font-mono font-semibold">{txt.localPersistent}</span>
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder={txt.writeNote}
                        className="w-full bg-transparent border border-black rounded-none p-4 text-sm text-black font-mono resize-none outline-none placeholder-neutral-400 min-h-[120px]"
                    />

                    <div className="flex justify-end mt-3">
                        <button
                            onClick={saveNote}
                            className="bg-black text-white text-xs uppercase tracking-widest px-6 py-3 rounded-none hover:bg-neutral-800 transition-colors"
                        >
                            {txt.saveNote}
                        </button>
                    </div>

                    <div className="border-t border-black mt-6 pt-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="border border-black bg-white rounded-none p-4 relative flex flex-col justify-between"
                            >
                                <button
                                    onClick={() => deleteNote(note.id)}
                                    className="absolute top-2 right-2 text-neutral-400 hover:text-black transition-colors text-xs leading-none"
                                >
                                    ✕
                                </button>
                                <p className="text-sm text-black pr-4">{note.content}</p>
                                <span className="text-[10px] text-neutral-500 mt-3 font-mono">{note.date}</span>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/* ─── BOTTOM (expand/collapse) ─── */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeTab === 'notes' ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100'
                }`}
            >
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between mb-2 text-sm tracking-[0.2em] uppercase font-semibold">
                        <span className="text-black">{txt.globalConsistency}</span>
                        <span className="text-black font-mono text-base tracking-[0.05em] font-bold">{Math.round(FILLED_RATIO * 100)}%</span>
                        <span className="text-neutral-500 font-mono text-sm font-semibold">{txt.activeStreak}</span>
                    </div>
                    <div className="h-3 border border-black bg-white">
                        <div className="h-full bg-black transition-all duration-1000" style={{ width: `${Math.round(FILLED_RATIO * 100)}%` }} />
                    </div>
                    <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-semibold mt-2">{txt.infiniteHistory}</p>
                </div>
            </div>

            <div className="px-6 pb-4 flex justify-between text-xs tracking-[0.25em] uppercase text-neutral-400 font-semibold">
                <span>{txt.timelineInf}</span>
                <span>{txt.trackRecord}</span>
            </div>
        </div>
    )
}

/* ───────── ENTRY ───────── */
export default function LeftPanel({ variant }: Props) {
    return (
        <div className="hidden md:flex flex-col border-r border-black relative h-full select-none bg-white">
            {variant === 'register' ? <RegisterPanel /> : <LoginPanel />}
            <div className="absolute top-0 right-0 w-px h-full bg-black/10" />
        </div>
    )
}
