'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, Loader2, Sparkles, X, ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react'
import { chatWithDashboardTutor } from '@/app/actions'
import { cn } from '@/lib/utils'

interface Message {
    role: 'user' | 'model'
    content: string
}

export function DashboardAssistant({ hasApiKey = false }: { hasApiKey?: boolean }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isOpen])

    async function handleSend() {
        if (!input.trim() || isLoading) return

        const userMsg: Message = { role: 'user', content: input }
        const newMessages = [...messages, userMsg]

        setMessages(newMessages)
        setInput('')
        setIsLoading(true)

        try {
            const response = await chatWithDashboardTutor(newMessages)
            setMessages([...newMessages, response as Message])
        } catch (error) {
            console.error(error)
            setMessages([...newMessages, { role: 'model', content: "I'm having trouble connecting right now. Please check your internet or API key." }])
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-auto px-6 rounded-full shadow-2xl shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 z-50 flex items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-500"
            >
                <Sparkles className="h-5 w-5 text-white" />
                <span className="font-medium text-white">Ask AI Tutor</span>
            </Button>
        )
    }

    return (
        <div className={cn(
            "fixed bottom-6 right-6 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "w-[90vw] h-[80vh] max-w-4xl" : "w-full max-w-sm sm:w-[400px] h-[600px]"
        )}>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-white/5">
                        <Sparkles className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-white">Learning Assistant</h3>
                        <p className="text-xs text-zinc-400">Ask about any subject</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 text-zinc-400 hover:text-white hidden sm:flex">
                        {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-zinc-400 hover:text-white">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 space-y-6">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 opacity-60">
                        <div className="p-4 rounded-full bg-white/5 border border-white/10">
                            <Bot className="h-8 w-8 text-blue-400" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-white">How can I help you learn?</h4>
                            <p className="text-sm text-zinc-400 max-w-[250px] mx-auto">
                                I can explain concepts, solve doubts from your uploaded files, or help you plan your study.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 w-full max-w-[280px]">
                            <Button variant="outline" className="justify-start text-xs border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 h-auto py-3" onClick={() => setInput("Explain a complex concept from my subjects")}>
                                "Explain a complex concept..."
                            </Button>
                            <Button variant="outline" className="justify-start text-xs border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 h-auto py-3" onClick={() => setInput("What should I focus on next?")}>
                                "What should I focus on next?"
                            </Button>
                        </div>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={cn(
                        "flex gap-4 text-sm mb-6",
                        m.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5",
                            m.role === 'user' ? "bg-zinc-800" : "bg-blue-600/20 text-blue-400"
                        )}>
                            {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                            "px-5 py-3 rounded-2xl max-w-[85%] leading-relaxed shadow-sm",
                            m.role === 'user'
                                ? "bg-zinc-800 text-white rounded-tr-sm"
                                : "bg-blue-950/30 border border-blue-500/10 text-zinc-100 rounded-tl-sm"
                        )}>
                            <div className="prose prose-invert prose-sm max-w-none">
                                {m.content.split('\n').map((line, j) => (
                                    <p key={j} className="mb-2 last:mb-0">{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-white/5">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="px-5 py-3 rounded-2xl bg-blue-950/30 border border-blue-500/10 rounded-tl-sm flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                            <span className="text-zinc-400 text-xs">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-zinc-900/40 backdrop-blur-md">
                <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()
                    }}
                >
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={hasApiKey ? "Ask a doubt about any topic..." : "Add API Key in Settings to Chat"}
                        disabled={isLoading || !hasApiKey}
                        className={cn(
                            "bg-black/50 border-white/10 focus-visible:ring-blue-500 h-10 transition-all",
                            !hasApiKey && "opacity-50 cursor-not-allowed placeholder:text-red-400/70"
                        )}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim() || !hasApiKey} className="shrink-0 h-10 w-10 bg-blue-600 hover:bg-blue-500">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
