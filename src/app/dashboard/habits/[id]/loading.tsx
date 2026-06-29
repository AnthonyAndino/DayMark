export default function HabitDetailLoading() {
    return (
        <div className="flex flex-col h-full overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-fg)' }}>
            <div className="flex items-center gap-2 px-6 py-3 shrink-0" style={{ borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--theme-border)' }}>
                <div className="h-3 w-16" style={{ backgroundColor: 'var(--theme-border)' }} />
                <div className="h-3 w-32" style={{ backgroundColor: 'var(--theme-border)' }} />
            </div>
            <div className="flex-1 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="h-4 w-40" style={{ backgroundColor: 'var(--theme-border)' }} />
                    <div className="h-4 w-24" style={{ backgroundColor: 'var(--theme-border)' }} />
                </div>
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((_, i) => (
                    <div key={i} className="flex gap-2">
                        {Array.from({ length: 7 }).map((_, j) => (
                            <div key={j} className="flex-1 aspect-square" style={{ backgroundColor: 'var(--theme-border)' }} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
