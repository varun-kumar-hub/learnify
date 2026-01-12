'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-black text-white">
            <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-6 w-6" />
                <h2 className="text-xl font-bold">Something went wrong!</h2>
            </div>
            <p className="text-zinc-400">{error.message}</p>
            <Button
                onClick={() => reset()}
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
                Try again
            </Button>
        </div>
    )
}
