'use client';

import { useState } from 'react';
import { toggleHabitLog } from '@/lib/actions/habits';
import { upserNote } from '@/lib/actions/notes';

interface Habit {
    id: number;
    name: string;
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
}

export default function Calendar({ habits, logs, notes, streaks, userId }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [localLogs, setLocalLogs] = useState(logs);
    const [noteContent, setNoteContent] = useState('');
    const [savingNote, setSavingNote] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];

    function isLogged(habitId: number, day: number): boolean {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return localLogs.some(
            (log) => log.habitId === habitId && log.date.startsWith(dateStr),
        );
    }

    function hasNote(day: number): boolean {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return notes.some((n) => n.date.startsWith(dateStr));
    }

    async function handleToggle(habitId: number, day: number) {
        const date = new Date(year, month, day);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const exists = isLogged(habitId, day);
        if (exists) {
            setLocalLogs((prev) =>
                prev.filter(
                    (l) =>
                        !(l.habitId === habitId && l.date.startsWith(dateStr)),
                ),
            );
        } else {
            setLocalLogs((prev) => [...prev, { habitId, date: dateStr }]);
        }

        await toggleHabitLog(habitId, date, userId);
    }

    async function handleSaveNote() {
        if (!selectedDateStr || !noteContent.trim()) return;
        setSavingNote(true);

        try {
            await upserNote({ content: noteContent, date: selectedDateStr });
            const existing = notes.find((n) => n.date.startsWith(selectedDateStr!));
            if (existing) {
                existing.content = noteContent;
            } else {
                notes.push({ date: selectedDateStr, content: noteContent });
            }
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

    const selectedDateStr = selectedDay
        ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
        : null;

    const selectedNote = selectedDateStr
        ? notes.find((n) => n.date.startsWith(selectedDateStr))
        : null;

    return (
        <div className="p-1">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={prevMonth}
                    className="px-3 py-1.5 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 bg-zinc-950/40 transition-all cursor-pointer"
                >
                    ←
                </button>
                <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                    {monthNames[month]} {year}
                </h2>
                <button
                    onClick={nextMonth}
                    className="px-3 py-1.5 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 bg-zinc-950/40 transition-all cursor-pointer"
                >
                    →
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-3">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
                    <div
                        key={d}
                        className="text-center text-xs text-zinc-500 font-bold uppercase tracking-wider py-1"
                    >
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-8">
                {days.map((day, i) => {
                    const isToday =
                        day === new Date().getDate() &&
                        month === new Date().getMonth() &&
                        year === new Date().getFullYear();

                    return (
                        <div
                            key={i}
                            onClick={() => {
                                if (day) {
                                    setSelectedDay(day);
                                    const note = notes.find((n) =>
                                        n.date.startsWith(
                                            `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                                        ),
                                    );
                                    setNoteContent(note?.content ?? '');
                                }
                            }}
                            className={`
                                aspect-square flex items-center justify-center rounded-xl text-sm cursor-pointer relative transition-all duration-200
                                ${!day ? 'pointer-events-none opacity-0' : 'border border-zinc-800 bg-zinc-900/10 text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100'}
                                ${day === selectedDay ? 'bg-zinc-800 border-zinc-700 text-zinc-50 ring-1 ring-zinc-600' : ''}
                                ${isToday ? 'font-bold border-zinc-600 bg-zinc-900/60 text-zinc-50 shadow-sm' : ''}
                            `}
                        >
                            {day}
                            {day && hasNote(day) && (
                                <span className="absolute bottom-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full shadow-sm shadow-purple-500/50" />
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedDay && (
                <div className="border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-md rounded-2xl p-5 shadow-2xl">
                    <h3 className="text-base font-bold text-zinc-100 mb-4 border-b border-zinc-800 pb-2">
                        Detalles del {selectedDay} de {monthNames[month]}
                    </h3>

                    <div className="mb-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Hábitos</p>
                        {habits.length === 0 && (
                            <p className="text-sm text-zinc-500 italic">
                                No tienes hábitos registrados aún
                            </p>
                        )}
                        <div className="flex flex-col gap-1">
                            {habits.map((habit) => {
                                const checked = isLogged(habit.id, selectedDay);
                                const streak = streaks.find((s) => s.habitId === habit.id);
                                return (
                                    <div
                                        key={habit.id}
                                        className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-zinc-900/40 transition-colors"
                                    >
                                        <button
                                            onClick={() =>
                                                handleToggle(habit.id, selectedDay)
                                            }
                                            className={`w-6 h-6 border rounded-md flex items-center justify-center font-bold text-xs transition-all cursor-pointer
                                            ${
                                                checked
                                                    ? 'bg-zinc-100 border-zinc-100 text-zinc-950 hover:bg-zinc-200'
                                                    : 'border-zinc-800 bg-zinc-950 text-transparent hover:border-zinc-700'
                                            }`}
                                        >
                                            {checked ? '✓' : ''}
                                        </button>
                                        <span className={`text-sm ${checked ? 'text-zinc-200 font-medium' : 'text-zinc-400'}`}>
                                            {habit.name}
                                        </span>
                                        {streak && streak.count > 0 && (
                                            <span className="ml-auto text-xs text-zinc-500 bg-zinc-800/50 rounded-full px-2 py-0.5">
                                                🔥 {streak.count}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-t border-zinc-800 pt-4 mt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Nota del día</p>
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Escribe una nota privada..."
                            rows={3}
                            className="w-full border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 bg-zinc-950/40 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                        />
                        <button
                            onClick={handleSaveNote}
                            disabled={savingNote || !noteContent.trim()}
                            className="mt-2 bg-zinc-100 text-zinc-950 rounded-xl px-4 py-2 text-sm font-bold hover:bg-zinc-200 transition-all disabled:opacity-50"
                        >
                            {savingNote ? 'Guardando...' : 'Guardar nota'}
                        </button>
                        {selectedNote && (
                            <div className="bg-purple-950/10 border border-purple-900/20 rounded-xl p-4 mt-4">
                                <p className="text-sm text-zinc-300 leading-relaxed">
                                    {selectedNote.content}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
