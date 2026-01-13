'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'
import { generateTopics } from '@/app/actions'

import { cn } from '@/lib/utils'

export function GenerateGraphButton({ subjectId, hasApiKey = false }: { subjectId: string, hasApiKey?: boolean }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState('')

    function handleGenerate() {
        setError('')
        startTransition(async () => {
            try {
                await generateTopics(subjectId)
            } catch (e: any) {
                console.error(e)
                setError(e.message || "Failed to generate. Check your API key.")
            }
        })
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <Button
                size="lg"
                onClick={handleGenerate}
                disabled={isPending || !hasApiKey}
                className={cn(
                    "w-full sm:w-auto font-semibold shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-0",
                    !hasApiKey && "opacity-50 grayscale cursor-not-allowed"
                )}
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Designing Curriculum...
                    </>
                ) : !hasApiKey ? (
                    <>
                        <Sparkles className="mr-2 h-5 w-5 fill-white/20" />
                        Add API Key to Generate
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-5 w-5 fill-white/20" />
                        Generate Learning Path (AI)
                    </>
                )}
            </Button>
            {error && (
                <p className="text-red-400 text-sm bg-red-950/50 px-4 py-2 rounded-lg border border-red-900">
                    {error}
                </p>
            )}
        </div>
    )
}
