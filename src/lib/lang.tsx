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
        // tabs
        overview: '← Overview',
        habits: 'Habits (4)',
        notes: 'Notes (1) →',
        // metrics
        totalStreak: 'TOTAL STREAK',
        completion: 'COMPLETION',
        completedTasks: 'COMPLETED TASKS',
        streakValue: '14 DAYS',
        completionValue: '88%',
        tasksValue: '32',
        // title login
        titleTagLogin: 'YOUR HISTORY',
        welcomeLogin1: 'WELCOME',
        welcomeLogin2: 'BACK',
        consistencyQuoteLogin: 'Consistency never fails',
        // title register
        titleTagRegister: 'FIRST DAY',
        welcomeRegister1: 'NEW',
        welcomeRegister2: 'BEGINNING',
        consistencyQuoteRegister: 'Start your streak',
        // timeline
        metricsSummary: 'Metrics Summary',
        timeline: 'Timeline',
        staticInstant: 'static · instant',
        infiniteHist: '∞ history',
        completed: 'Completed',
        pending: 'Pending',
        constancy: 'constancy',
        // mosaic
        monthlyMosaic: 'Monthly Mosaic',
        monthComplete: '✓ month complete',
        fillingMosaic: 'filling mosaic · day',
        mosaicComplete: 'mosaic complete · next cycle soon...',
        liveProgress: 'Live Progress',
        days: 'days',
        // notes
        quickNote: 'Quick Note',
        localPersistent: 'local · persistent',
        writeNote: 'Write your note here...',
        saveNote: 'SAVE NOTE',
        // bottom login
        globalConsistency: 'Global Consistency',
        activeStreak: 'active streak · 12 days',
        infiniteHistory: 'infinite history · scrolling through time',
        // bottom register
        liveProgressTitle: 'Live Progress',
        // footer
        timelineInf: 'Timeline · ∞',
        cascadeV1: 'Cascade · v1',
        trackRecord: 'Track · Record · Repeat',
        // right form login
        access: 'Access',
        signIn: 'Sign in',
        email: 'Email',
        emailPlaceholder: 'you@example.com',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        enter: 'Enter',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
        // right form register
        register: 'Register',
        createAccount: 'Create your account',
        confirmPassword: 'Confirm password',
        createAccountBtn: 'Create account',
        alreadyAccount: 'Already have an account?',
        signInLink: 'Sign in',
        passwordsMismatch: 'Passwords do not match',
    },
    es: {
        overview: '← Overview',
        habits: 'Hábitos (4)',
        notes: 'Notas (1) →',
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
    },
}

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>('es')

    useEffect(() => {
        const saved = localStorage.getItem('daymark_lang') as Lang | null
        if (saved === 'en' || saved === 'es') setLang(saved)
    }, [])

    useEffect(() => {
        document.documentElement.lang = lang
        localStorage.setItem('daymark_lang', lang)
    }, [lang])

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
