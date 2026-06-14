'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLang } from '@/lib/lang'
import { deleteNote } from '@/lib/actions/notes'

interface Note { id?: number; date: string; content: string }

function XIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1" className="shrink-0">
            <line x1="2" y1="2" x2="10" y2="10" /><line x1="10" y1="2" x2="2" y2="10" />
        </svg>
    )
}

export default function NotesView({ notes }: { notes: Note[] }) {
    const { lang, txt } = useLang()
    const router = useRouter()
    const [deleting, setDeleting] = useState<number | null>(null)

    async function handleDelete(noteId: number) {
        setDeleting(noteId)
        try {
            await deleteNote(noteId)
            router.refresh()
        } catch (err) {
            console.error(err)
            setDeleting(null)
        }
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {notes.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[10px] tracking-widest" style={{ color: 'var(--theme-muted)' }}>
                        {txt.emptyNotes}
                    </p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto px-6 pt-4">
                    <div className="flex flex-col gap-px" style={{ backgroundColor: 'var(--theme-border)' }}>
                        {notes.map((note, i) => {
                            const d = new Date(note.date)
                            const label = d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })
                            const noteId = note.id ?? i
                            const isDeleting = deleting === noteId
                            return (
                                <div
                                    key={i}
                                    className="flex items-start justify-between px-4 py-3 group"
                                    style={{ backgroundColor: 'var(--theme-bg)' }}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] tracking-widest mb-1" style={{ color: 'var(--theme-muted)' }}>
                                            {label.toUpperCase()}
                                        </p>
                                        <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-fg)' }}>
                                            {note.content}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(noteId)}
                                        disabled={isDeleting}
                                        className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-red-400/30 p-1 rounded-none shrink-0 disabled:opacity-30"
                                        style={{ color: 'var(--theme-muted)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-muted)' }}
                                    >
                                        <XIcon />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
