'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react'
import { chatWithTutor } from '@/app/actions'
import { cn } from '@/lib/utils'

interface DefaultMessage {
    role: string
    content: string
}

export function ChatInterface({ topicId, title }: { topicId: string; title: string }) {
    const [messages, setMessages] = useState<DefaultMessage[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isOpen])

    async function handleSend() {
        if (!input.trim() || isLoading) return

        const userMsg = { role: 'user', content: input }
        const newMessages = [...messages, userMsg]

        setMessages(newMessages)
        setInput('')
        setIsLoading(true)

        try {
            const response = await chatWithTutor(topicId, newMessages)
            setMessages([...newMessages, response])
        } catch (error) {
            console.error(error)
            setMessages([...newMessages, { role: 'model', content: "Sorry, I encountered an error." }])
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-500 z-50 flex items-center justify-center"
            >
                <MessageSquare className="h-6 w-6 text-white" />
            </Button>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 w-full max-w-sm sm:w-[400px] h-[500px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Bot className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-white">AI Tutor</h3>
                        <p className="text-xs text-zinc-400 truncate max-w-[150px]">{title}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-zinc-400 hover:text-white">
                    <span className="sr-only">Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
                </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-zinc-500 mt-10 space-y-2">
                        <Bot className="h-8 w-8 mx-auto opacity-50" />
                        <p className="text-sm">Ask me anything about <br /><span className="text-zinc-300 font-semibold">{title}</span>!</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={cn(
                        "flex gap-3 text-sm mb-4",
                        m.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            m.role === 'user' ? "bg-zinc-700" : "bg-blue-600/20 text-blue-400"
                        )}>
                            {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={cn(
                            "px-4 py-2 rounded-2xl max-w-[80%]",
                            m.role === 'user'
                                ? "bg-zinc-800 text-white rounded-tr-sm"
                                : "bg-blue-900/10 border border-blue-500/10 text-zinc-200 rounded-tl-sm"
                        )}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="px-4 py-2 rounded-2xl bg-blue-900/10 border border-blue-500/10 rounded-tl-sm flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-zinc-900/30">
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
                        placeholder="Type a question..."
                        className="bg-black/50 border-white/10 focus-visible:ring-blue-500"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shrink-0 bg-blue-600 hover:bg-blue-500">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
