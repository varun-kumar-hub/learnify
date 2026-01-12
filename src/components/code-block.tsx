'use client'

import { useState } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
    code: string
    language?: string
    title?: string
}

export function CodeBlock({ code, language = 'Code', title }: CodeBlockProps) {
    const [isCopied, setIsCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy code', err)
        }
    }

    return (
        <div className="rounded-lg overflow-hidden bg-[#1e1e1e] border border-white/10 my-4 font-mono text-sm shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/5">
                <div className="flex items-center gap-2 text-zinc-400">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="ml-2 text-xs font-medium uppercase tracking-wider opacity-70">
                        {language}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                    {isCopied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-green-500">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto">
                <pre className="text-zinc-100 whitespace-pre leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    )
}
