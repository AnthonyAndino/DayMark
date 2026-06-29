export default function HabitsLoading() {
    return (
        <div className="flex-1 flex flex-col overflow-hidden animate-pulse">
            <div className="flex items-center gap-2 px-6 py-4 shrink-0" style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}>
                <div className="h-9 flex-1" style={{ backgroundColor: 'var(--theme-border)' }} />
                <div className="h-9 w-16" style={{ backgroundColor: 'var(--theme-border)' }} />
            </div>
            <div className="flex-1 px-6 pt-4">
                <div className="flex flex-col gap-px">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: 'var(--theme-bg)' }}>
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-32" style={{ backgroundColor: 'var(--theme-border)' }} />
                                <div className="h-2 w-20" style={{ backgroundColor: 'var(--theme-border)' }} />
                            </div>
                            <div className="h-5 w-8" style={{ backgroundColor: 'var(--theme-border)' }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
