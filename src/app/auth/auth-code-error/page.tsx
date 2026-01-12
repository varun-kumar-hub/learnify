
import Link from 'next/link'

export default function AuthCodeError() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl">
                <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
                <p className="text-zinc-400 mb-8 leading-relaxed">
                    We couldn't verify your login. This usually happens if the link has expired or there's a configuration mismatch.
                </p>
                <Link
                    href="/login"
                    className="inline-block w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    )
}
