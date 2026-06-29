export default function OverviewLoading() {
    return (
        <div className="flex-1 flex flex-col overflow-hidden p-6 pt-8 animate-pulse">
            <div className="h-3 w-48 mb-6" style={{ backgroundColor: 'var(--theme-border)' }} />
            <div className="grid grid-cols-4 gap-3 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 px-4 py-6" style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--theme-border)' }}>
                        <div className="h-3 w-20" style={{ backgroundColor: 'var(--theme-border)' }} />
                        <div className="h-5 w-12" style={{ backgroundColor: 'var(--theme-border)' }} />
                    </div>
                ))}
            </div>
            <div className="h-3 w-56 mb-3" style={{ backgroundColor: 'var(--theme-border)' }} />
            <div className="flex-1 flex items-end gap-2 pb-4">
                {[40, 60, 35, 80, 55, 45, 70, 50, 65, 30, 75, 50, 45, 85, 60, 40, 55, 70, 50, 45, 80, 35, 65, 55, 75, 45, 60, 50, 70, 40].map((h, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: 'var(--theme-border)', height: `${h}%` }} />
                ))}
            </div>
        </div>
    )
}
