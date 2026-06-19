'use client';

import { useState, useMemo } from 'react';
import { toggleHabitLog } from '@/lib/actions/habits';
import { createNote } from '@/lib/actions/notes';
import { useLang } from '@/lib/lang';
import Link from 'next/link';

interface Habit {
    id: number;
    name: string;
    daysOfWeek: number[] | null;
    createdAt: string;
}

interface HabitLog {
    habitId: number;
    date: string;
}

interface Streak {
    habitId: number;
    count: number;
}

interface Props {
    habits: Habit[];
    logs: HabitLog[];
    notes: { date: string; content: string }[];
    streaks: Streak[];
    userId: number;
    userName: string;
    habitId?: number;
}

function ArrowLeft() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className="shrink-0">
            <polyline points="10,4 6,8 10,12" />
        </svg>
    )
}

function ArrowRight() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" className="shrink-0">
            <polyline points="6,4 10,8 6,12" />
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0">
            <polyline points="2,6 5,9 10,3" />
        </svg>
    )
}

const localeMap = { en: 'en-US', es: 'es-ES' } as const

function getMonthName(lang: 'en' | 'es', monthIndex: number): string {
    const d = new Date(2024, monthIndex, 1)
    const name = d.toLocaleDateString(localeMap[lang], { month: 'long' })
    return name.charAt(0).toUpperCase() + name.slice(1)
}

function getDayHeaders(lang: 'en' | 'es'): string[] {
    const headers: string[] = []
    for (let i = 0; i < 7; i++) {
        const d = new Date(2024, 0, 7 + i)
        const name = d.toLocaleDateString(localeMap[lang], { weekday: 'short' })
        headers.push(name.toUpperCase())
    }
    return headers
}

function habitAppliesOnDate(habit: Habit, year: number, month: number, day: number): boolean {
    const date = new Date(year, month, day)
    const createdAt = new Date(habit.createdAt)
    createdAt.setHours(0, 0, 0, 0)
    if (date < createdAt) return false

    if (habit.daysOfWeek && !habit.daysOfWeek.includes(date.getDay())) return false

    return true
}

export default function Calendar({ habits, logs, notes, streaks, userId, userName, habitId }: Props) {
    const { lang, txt } = useLang()
    const [currentDate, setCurrentDate] = useState(() => new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [localLogs, setLocalLogs] = useState(logs);
    const [localNotes, setLocalNotes] = useState(notes);
    const [noteContent, setNoteContent] = useState('');
    const [savingNote, setSavingNote] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const totalGridCells = firstDay + daysInMonth;
    const gridRows = Math.ceil(totalGridCells / 7);

    const monthName = getMonthName(lang, month)
    const dayHeaders = useMemo(() => getDayHeaders(lang), [lang])

    const welcomeMsg = `${txt.welcomeBack}${userName.toUpperCase()}`
    const emptyHabitsMsg = txt.emptyHabits
    const emptyNotesMsg = txt.emptyNotes

    function dateStr(day: number) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }

    function isLogged(habitId: number, day: number): boolean {
        const ds = dateStr(day)
        return localLogs.some((log) => log.habitId === habitId && log.date.startsWith(ds))
    }

    function applicableHabits(day: number): Habit[] {
        return habits.filter(h => habitAppliesOnDate(h, year, month, day))
    }

    function allDone(day: number): boolean {
        const applicable = applicableHabits(day)
        if (applicable.length === 0) return false
        return applicable.every(h => isLogged(h.id, day))
    }

    function hasNote(day: number): boolean {
        const ds = dateStr(day)
        return localNotes.some((n) => n.date.startsWith(ds))
    }

    function notesForDay(day: number) {
        const ds = dateStr(day)
        return localNotes.filter((n) => n.date.startsWith(ds))
    }

    async function handleToggle(habitId: number, day: number) {
        const date = new Date(year, month, day);
        const ds = dateStr(day)

        const exists = isLogged(habitId, day);
        if (exists) {
            setLocalLogs((prev) => prev.filter((l) => !(l.habitId === habitId && l.date.startsWith(ds))));
        } else {
            setLocalLogs((prev) => [...prev, { habitId, date: ds }]);
        }

        await toggleHabitLog(habitId, date, userId);
    }

    async function handleSaveNote() {
        if (!selectedDateStr || !noteContent.trim()) return;
        setSavingNote(true);

        try {
            await createNote({ content: noteContent, date: selectedDateStr });
            setLocalNotes(prev => [...prev, { date: selectedDateStr, content: noteContent }]);
            setNoteContent('');
        } catch (err) {
            console.error(err);
        } finally {
            setSavingNote(false);
        }
    }

    function prevMonth() {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDay(null);
    }

    function nextMonth() {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDay(null);
    }

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const selectedDateStr = selectedDay ? dateStr(selectedDay) : null;
    const dayNotes = selectedDay ? notesForDay(selectedDay) : [];
    const noNotesForDay = dayNotes.length === 0 && !noteContent.trim();

    const filteredHabits = habitId ? habits.filter(h => h.id === habitId) : habits

    return (
        <div className="flex-1 flex flex-col overflow-hidden p-6 pt-4">
            <div className="mb-4 shrink-0">
                <p className="text-[10px] tracking-[0.35em] font-bold uppercase" style={{ color: 'var(--theme-muted)' }}>
                    {welcomeMsg}
                </p>
            </div>

            <div className="flex items-center justify-between mb-4 shrink-0">
                <button
                    onClick={prevMonth}
                    className="flex items-center gap-1 px-3 py-1.5 border transition-all cursor-pointer rounded-none"
                    style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-muted)', backgroundColor: 'var(--theme-bg)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--theme-fg)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-fg) 5%, transparent)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-muted)'; e.currentTarget.style.backgroundColor = 'var(--theme-bg)' }}
                >
                    <ArrowLeft />
                </button>
                <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--theme-fg)' }}>
                    {monthName} {year}
                </h2>
                <button
                    onClick={nextMonth}
                    className="flex items-center gap-1 px-3 py-1.5 border transition-all cursor-pointer rounded-none"
                    style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-muted)', backgroundColor: 'var(--theme-bg)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--theme-fg)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-fg) 5%, transparent)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-muted)'; e.currentTarget.style.backgroundColor = 'var(--theme-bg)' }}
                >
                    <ArrowRight />
                </button>
            </div>

            <div className="grid grid-cols-7 mb-2 shrink-0">
                {dayHeaders.map((d) => (
                    <div
                        key={d}
                        className="text-center text-[10px] font-bold uppercase tracking-widest py-1"
                        style={{ color: 'var(--theme-muted)' }}
                    >
                        {d}
                    </div>
                ))}
            </div>

            <div
                className="flex-1 grid grid-cols-7"
                style={{
                    gridTemplateRows: `repeat(${gridRows}, 1fr)`,
                    gap: '1px',
                    backgroundColor: 'var(--theme-border)',
                }}
            >
                {days.map((day, i) => {
                    const isToday =
                        day === new Date().getDate() &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear();
                    const done = day ? allDone(day) : false;

                    return (
                        <div
                            key={i}
                            onClick={() => {
                                if (day) {
                                    setSelectedDay(day);
                                    setNoteContent('');
                                }
                            }}
                            className="flex items-center justify-center text-sm cursor-pointer relative transition-colors"
                            style={{
                                backgroundColor: !day ? 'color-mix(in srgb, var(--theme-bg) 97%, var(--theme-fg))' : 'var(--theme-bg)',
                                color: day === selectedDay ? 'var(--theme-accent-fg)' : 'var(--theme-fg)',
                                ...(day === selectedDay ? { backgroundColor: 'var(--theme-accent)' } : {}),
                                ...(isToday && day !== selectedDay ? { fontWeight: 700, borderWidth: 2, borderStyle: 'solid', borderColor: 'var(--theme-accent)' } : {}),
                            }}
                            onMouseEnter={(e) => { if (day && day !== selectedDay) e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--theme-fg) 8%, var(--theme-bg))' }}
                            onMouseLeave={(e) => { if (day && day !== selectedDay) e.currentTarget.style.backgroundColor = 'var(--theme-bg)' }}
                        >
                            {day}
                            {done && (
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                                    <line x1="15" y1="15" x2="85" y2="85" />
                                    <line x1="85" y1="15" x2="15" y2="85" />
                                </svg>
                            )}
                            {day && hasNote(day) && (
                                <span className="absolute bottom-1 w-1 h-1" style={{ backgroundColor: day === selectedDay ? 'var(--theme-accent-fg)' : 'var(--theme-accent)' }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedDay && (
                <div className="shrink-0 mt-3 pt-3 flex gap-6" style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--theme-border)' }}>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--theme-muted)' }}>{txt.habitsSection}</p>
                        {filteredHabits.length === 0 ? (
                            <p className="text-[10px] tracking-widest" style={{ color: 'var(--theme-muted)' }}>
                                {emptyHabitsMsg}
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {filteredHabits.map((habit) => {
                                    const applies = habitAppliesOnDate(habit, year, month, selectedDay)
                                    const checked = applies && isLogged(habit.id, selectedDay);
                                    const streak = streaks.find((s) => s.habitId === habit.id);
                                    return applies ? (
                                        <div key={habit.id} className="flex items-center gap-2 py-1">
                                            <button
                                                onClick={() => handleToggle(habit.id, selectedDay)}
                                                className="w-4 h-4 border flex items-center justify-center transition-all cursor-pointer rounded-none"
                                                style={{
                                                    borderColor: checked ? 'var(--theme-accent)' : 'var(--theme-border)',
                                                    backgroundColor: checked ? 'var(--theme-accent)' : 'transparent',
                                                    color: checked ? 'var(--theme-accent-fg)' : 'transparent',
                                                }}
                                            >
                                                {checked && <CheckIcon />}
                                            </button>
                                            {!habitId ? (
                                                <Link
                                                    href={`/dashboard/habits/${habit.id}`}
                                                    className="text-xs hover:underline"
                                                    style={{ color: checked ? 'var(--theme-fg)' : 'var(--theme-muted)' }}
                                                >
                                                    {habit.name}
                                                </Link>
                                            ) : (
                                                <span className="text-xs" style={{ color: checked ? 'var(--theme-fg)' : 'var(--theme-muted)' }}>
                                                    {habit.name}
                                                </span>
                                            )}
                                            {streak && streak.count > 0 && (
                                                <span className="text-[10px] px-1.5 py-0.5 border rounded-none" style={{ color: 'var(--theme-muted)', borderColor: 'var(--theme-border)' }}>
                                                    {streak.count}
                                                </span>
                                            )}
                                        </div>
                                    ) : null
                                })}
                            </div>
                        )}
                    </div>

                    <div className="w-px shrink-0" style={{ backgroundColor: 'var(--theme-border)' }} />

                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--theme-muted)' }}>{txt.noteOfDay}</p>
                        {noNotesForDay && (
                            <p className="text-[10px] tracking-widest mb-2" style={{ color: 'var(--theme-muted)' }}>
                                {emptyNotesMsg}
                            </p>
                        )}
                        {dayNotes.length > 0 && (
                            <div className="space-y-1 mb-3 max-h-20 overflow-y-auto">
                                {dayNotes.map((n, i) => (
                                    <p key={i} className="text-[10px] leading-relaxed" style={{ color: 'var(--theme-muted)' }}>
                                        {n.content}
                                    </p>
                                ))}
                            </div>
                        )}
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder={txt.writeNotePrivate}
                            rows={2}
                            className="w-full border px-3 py-1.5 text-xs focus:outline-none transition-colors resize-none rounded-none"
                            style={{
                                borderColor: 'var(--theme-border)',
                                color: 'var(--theme-fg)',
                                backgroundColor: 'var(--theme-bg)',
                            }}
                        />
                        <div className="flex items-center justify-between mt-1.5">
                            <button
                                onClick={handleSaveNote}
                                disabled={savingNote || !noteContent.trim()}
                                className="px-3 py-1 text-[10px] font-semibold tracking-widest uppercase transition-all rounded-none disabled:opacity-50"
                                style={{
                                    backgroundColor: 'var(--theme-accent)',
                                    color: 'var(--theme-accent-fg)',
                                }}
                            >
                                {savingNote ? txt.saving : txt.saveNoteDay}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
