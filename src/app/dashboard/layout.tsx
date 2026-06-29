import { ThemeProvider } from '@/lib/theme-context'
import Sidebar from '@/components/Sidebar'
import LangToggle from '@/components/LangToggle'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--theme-bg)' }}>
                <Sidebar />
                <main className="flex-1 flex flex-col overflow-hidden transition-all duration-200" style={{ marginLeft: 'var(--sidebar-width, 224px)', borderLeftWidth: 1, borderLeftStyle: 'solid', borderLeftColor: 'var(--theme-border)' }}>
                    <div
                        className="flex items-center justify-end px-6 py-2 shrink-0"
                        style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}
                    >
                        <LangToggle />
                    </div>
                    {children}
                </main>
            </div>
        </ThemeProvider>
    )
}
