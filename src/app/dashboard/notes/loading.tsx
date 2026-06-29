export default function NotesLoading() {
    return (
        <div className="flex-1 flex flex-col overflow-hidden animate-pulse">
            <div className="flex-1 px-6 pt-4">
                <div className="flex flex-col gap-px">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-start justify-between px-4 py-3" style={{ backgroundColor: 'var(--theme-bg)' }}>
                            <div className="flex-1 min-w-0">
                                <div className="h-2 w-28 mb-2" style={{ backgroundColor: 'var(--theme-border)' }} />
                                <div className="space-y-1">
                                    <div className="h-3 w-full" style={{ backgroundColor: 'var(--theme-border)' }} />
                                    <div className="h-3 w-3/4" style={{ backgroundColor: 'var(--theme-border)' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
