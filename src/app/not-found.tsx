import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-white text-black flex flex-col items-center justify-center p-12">
            <h1 className="text-[12vw] leading-[0.85] font-light tracking-[-0.04em] mb-4">
                DAY
                <br />
                MARK
            </h1>
            <div className="w-12 h-px bg-black mb-8" />
            <p className="text-[10px] tracking-[0.3em] font-bold uppercase mb-2">404</p>
            <p className="text-xs tracking-wider text-neutral-500 mb-8 text-center max-w-xs">
                This page does not exist. It may have been removed or the URL may be incorrect.
            </p>
            <Link
                href="/dashboard"
                className="py-4 px-12 bg-black text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:bg-white hover:text-black hover:border hover:border-black"
            >
                BACK TO DASHBOARD
            </Link>
        </div>
    )
}
