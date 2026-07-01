'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Lang = 'en' | 'es'

interface LangContextType {
    lang: Lang
    setLang: (l: Lang) => void
    txt: typeof dict.en
}

const LangContext = createContext<LangContextType | null>(null)

export const dict = {
    en: {
        dashboard: 'DASHBOARD',
        habits: 'HABITS',
        notes: 'NOTES',
        logout: 'LOG OUT',
        theme: 'THEME',
        hexPlaceholder: '#HEX or rgba()',
        welcomeBack: 'WELCOME BACK, ',
        emptyHabits: 'NO HABITS REGISTERED YET. CREATE ONE ABOVE.',
        emptyNotes: 'NO NOTES FOR THIS DAY. WRITE YOUR FIRST NOTE.',
        habitsSection: 'Habits',
        noteOfDay: 'Note of the Day',
        writeNotePrivate: 'Write a private note...',
        saving: 'Saving...',
        saveNoteDay: 'Save note',
        newHabitPlaceholder: 'New habit (e.g. Exercise)',
        addHabit: 'Add',
        welcomeDemoNote: 'Welcome to DayMark! This is a local test note.',
        overview: 'OVERVIEW',
        panelOverview: '← Overview',
        cardHabits: 'Habits (4)',
        cardNotes: 'Notes (1) →',
        totalStreak: 'TOTAL STREAK',
        completion: 'COMPLETION',
        completedTasks: 'COMPLETED TASKS',
        streakValue: '14 DAYS',
        completionValue: '88%',
        tasksValue: '32',
        titleTagLogin: 'YOUR HISTORY',
        welcomeLogin1: 'WELCOME',
        welcomeLogin2: 'BACK',
        consistencyQuoteLogin: 'Consistency never fails',
        titleTagRegister: 'FIRST DAY',
        welcomeRegister1: 'NEW',
        welcomeRegister2: 'BEGINNING',
        consistencyQuoteRegister: 'Start your streak',
        metricsSummary: 'Metrics Summary',
        timeline: 'Timeline',
        staticInstant: 'static · instant',
        infiniteHist: '∞ history',
        completed: 'Completed',
        pending: 'Pending',
        constancy: 'constancy',
        monthlyMosaic: 'Monthly Mosaic',
        monthComplete: '✓ month complete',
        fillingMosaic: 'filling mosaic · day',
        mosaicComplete: 'mosaic complete · next cycle soon...',
        liveProgress: 'Live Progress',
        days: 'days',
        quickNote: 'Quick Note',
        localPersistent: 'local · persistent',
        writeNote: 'Write your note here...',
        saveNote: 'SAVE NOTE',
        globalConsistency: 'Global Consistency',
        activeStreak: 'active streak · 12 days',
        infiniteHistory: 'infinite history · scrolling through time',
        liveProgressTitle: 'Live Progress',
        timelineInf: 'Timeline · ∞',
        cascadeV1: 'Cascade · v1',
        trackRecord: 'Track · Record · Repeat',
        access: 'Access',
        signIn: 'Sign in',
        email: 'Email',
        emailPlaceholder: 'you@example.com',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        enter: 'Enter',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
        register: 'Register',
        createAccount: 'Create your account',
        confirmPassword: 'Confirm password',
        createAccountBtn: 'Create account',
        alreadyAccount: 'Already have an account?',
        signInLink: 'Sign in',
        passwordsMismatch: 'Passwords do not match',
        habitCreated: 'Habit created ✓',
        habitDeleted: 'Habit deleted',
        chartDay: 'Day',
        chartHabit: 'habit',
        noteSaved: 'Note saved ✓',
        noteDeleted: 'Note deleted',
        errorOccurred: 'Error: could not save',
    },
    es: {
        dashboard: 'DASHBOARD',
        habits: 'HÁBITOS',
        notes: 'NOTAS',
        logout: 'CERRAR SESIÓN',
        theme: 'TEMA',
        hexPlaceholder: '#HEX o rgba()',
        welcomeBack: 'BIENVENIDO DE VUELTA, ',
        emptyHabits: 'TODAVÍA NO TIENES HÁBITOS REGISTRADOS. CREA UNO ARRIBA.',
        emptyNotes: 'NO HAY NOTAS PARA ESTE DÍA. ESCRIBE TU PRIMERA NOTA.',
        habitsSection: 'Hábitos',
        noteOfDay: 'Nota del día',
        writeNotePrivate: 'Escribe una nota privada...',
        saving: 'Guardando...',
        saveNoteDay: 'Guardar nota',
        newHabitPlaceholder: 'Nuevo hábito (ej: Ejercicio)',
        addHabit: 'Agregar',
        welcomeDemoNote: '¡Bienvenido a DayMark! Esto es una nota local de prueba.',
        overview: 'OVERVIEW',
        panelOverview: '← Overview',
        cardHabits: 'Hábitos (4)',
        cardNotes: 'Notas (1) →',
        totalStreak: 'RACHA TOTAL',
        completion: 'COMPLETADO',
        completedTasks: 'TAREAS HECHAS',
        streakValue: '14 DÍAS',
        completionValue: '88%',
        tasksValue: '32',
        titleTagLogin: 'TU HISTORIAL',
        welcomeLogin1: 'BIENVENIDO',
        welcomeLogin2: 'DE VUELTA',
        consistencyQuoteLogin: 'La constancia nunca falla',
        titleTagRegister: 'PRIMER DÍA',
        welcomeRegister1: 'NUEVO',
        welcomeRegister2: 'COMIENZO',
        consistencyQuoteRegister: 'Empieza tu racha',
        metricsSummary: 'Resumen de Métricas',
        timeline: 'Línea de Tiempo',
        staticInstant: 'estático · instantáneo',
        infiniteHist: '∞ histórico',
        completed: 'Completado',
        pending: 'Pendiente',
        constancy: 'constancia',
        monthlyMosaic: 'Mosaico Mensual',
        monthComplete: '✓ mes completo',
        fillingMosaic: 'llenando mosaico · día',
        mosaicComplete: 'mosaico completo · siguiente ciclo en breve...',
        liveProgress: 'Progreso en vivo',
        days: 'días',
        quickNote: 'Nota Rápida',
        localPersistent: 'local · persistente',
        writeNote: 'Escribe tu nota aquí...',
        saveNote: 'GUARDAR NOTA',
        globalConsistency: 'Consistencia Global',
        activeStreak: 'racha activa · 12 días',
        infiniteHistory: 'historial infinito · desplazándote en el tiempo',
        liveProgressTitle: 'Progreso en vivo',
        timelineInf: 'Timeline · ∞',
        cascadeV1: 'Cascada · v1',
        trackRecord: 'Track · Record · Repeat',
        access: 'Acceso',
        signIn: 'Inicia sesión',
        email: 'Correo electrónico',
        emailPlaceholder: 'tucorreo@ejemplo.com',
        password: 'Contraseña',
        passwordPlaceholder: '••••••••',
        enter: 'Entrar',
        noAccount: '¿No tienes cuenta?',
        signUp: 'Regístrate',
        register: 'Registro',
        createAccount: 'Crea tu cuenta',
        confirmPassword: 'Confirmar contraseña',
        createAccountBtn: 'Crear cuenta',
        alreadyAccount: '¿Ya tienes cuenta?',
        signInLink: 'Inicia sesión',
        passwordsMismatch: 'Las contraseñas no coinciden',
        habitCreated: 'Hábito creado ✓',
        habitDeleted: 'Hábito eliminado',
        chartDay: 'Día',
        chartHabit: 'hábito',
        noteSaved: 'Nota guardada ✓',
        noteDeleted: 'Nota eliminada',
        errorOccurred: 'Error: no se pudo guardar',
    },
}

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>('es')
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('daymark_lang') as Lang | null
        if (saved === 'en' || saved === 'es') setLang(saved)
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (hydrated) {
            document.documentElement.lang = lang
            localStorage.setItem('daymark_lang', lang)
        }
    }, [lang, hydrated])

    const txt = dict[lang]

    return (
        <LangContext.Provider value={{ lang, setLang, txt }}>
            {children}
        </LangContext.Provider>
    )
}

export function useLang() {
    const ctx = useContext(LangContext)
    if (!ctx) throw new Error('useLang debe usarse dentro de un LangProvider')
    return ctx
}
