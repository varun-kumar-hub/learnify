'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, CheckCircle2, ChevronRight, Play, RotateCcw, Brain, X, Sparkles, FileText, Printer, Share2, Flame, Wand2, Loader2 } from 'lucide-react'
import { generateContent, completeTopic, incrementActivity } from '@/app/actions'
import { FlashcardCarousel } from '@/components/flashcard-carousel'
import { ChatInterface } from '@/components/chat-interface'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { QuizModal } from '@/components/quiz-modal'
import { CodePlayground } from '@/components/code-playground'
import { CodeBlock } from '@/components/code-block'
import { cn } from '@/lib/utils'

import { MermaidDiagram } from '@/components/mermaid-diagram'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface TopicViewerProps {
    topic: any
    content: any
    hasApiKey?: boolean
}

export function TopicViewer({ topic, content, hasApiKey = false }: TopicViewerProps) {
    const router = useRouter()
    const [isGenerating, startGeneration] = useTransition()
    const [isCompleting, startCompletion] = useTransition()
    const [isQuizOpen, setIsQuizOpen] = useState(false)
    const [showFlashcards, setShowFlashcards] = useState(false)

    // Check if topic is completed based on status
    const isCompleted = topic.status === 'COMPLETED'

    const handleComplete = () => {
        startCompletion(async () => {
            await completeTopic(topic.id)
            router.push(`/subject/${topic.subject_id}`)
        })
    }

    // Body scroll lock
    useEffect(() => {
        if (showFlashcards || isQuizOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [showFlashcards, isQuizOpen])

    // Activity Logging
    useEffect(() => {
        const interval = setInterval(() => {
            incrementActivity(1)
        }, 60000) // Log 1 minute every 60 seconds

        return () => clearInterval(interval)
    }, [])

    // Handler for Manual Generation
    const handleGenerate = () => {
        startGeneration(async () => {
            await generateContent(topic.id)
            router.refresh()
        })
    }



    // If content is missing, show generation prompt
    if (!content) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] w-full animate-in fade-in zoom-in duration-500 relative overflow-hidden">

                {/* Ambient Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
                    <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full mix-blend-screen" />
                </div>

                <div className="relative z-10 w-full max-w-3xl mx-auto p-8 md:p-12">

                    {/* Main Card */}
                    <div className="relative backdrop-blur-2xl bg-black/20 border border-white/5 rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden group">

                        {/* Shimmer Border Effect */}
                        <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30 pointer-events-none" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center text-center space-y-10">

                            {/* Icon & Title */}
                            <div className="space-y-6">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 shadow-inner border border-white/10 mb-2 group-hover:scale-105 transition-transform duration-500">
                                    <Sparkles className="w-10 h-10 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                </div>
                                <div>
                                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
                                        {topic.title}
                                    </h1>
                                    <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed font-medium">
                                        Ready to master this topic? Generate a comprehensive, interactive lesson guide instantly.
                                    </p>
                                </div>
                            </div>

                            {/* Features Preview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
                                <div className="group/item flex flex-col p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                                    <div className="p-2.5 w-fit rounded-lg bg-indigo-500/20 text-indigo-400 mb-3 group-hover/item:scale-110 transition-transform">
                                        <Share2 className="w-5 h-5" />
                                    </div>
                                    <div className="font-bold text-white mb-1">Knowledge Graph</div>
                                    <div className="text-xs text-zinc-500 font-medium">Visual concept mapping</div>
                                </div>
                                <div className="group/item flex flex-col p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                                    <div className="p-2.5 w-fit rounded-lg bg-emerald-500/20 text-emerald-400 mb-3 group-hover/item:scale-110 transition-transform">
                                        <Brain className="w-5 h-5" />
                                    </div>
                                    <div className="font-bold text-white mb-1">Smart Recall</div>
                                    <div className="text-xs text-zinc-500 font-medium">AI-generated flashcards</div>
                                </div>
                                <div className="group/item flex flex-col p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                                    <div className="p-2.5 w-fit rounded-lg bg-amber-500/20 text-amber-400 mb-3 group-hover/item:scale-110 transition-transform">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div className="font-bold text-white mb-1">Assessment</div>
                                    <div className="text-xs text-zinc-500 font-medium">Quiz & Progress tracking</div>
                                </div>
                            </div>

                            {/* Divider with Start Button */}
                            <div className="w-full pt-4 relative flex flex-col items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/0 via-zinc-900/0 to-zinc-900/0 pointer-events-none" />

                                <Button
                                    size="lg"
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !hasApiKey}
                                    className={cn(
                                        "relative group overflow-hidden w-full md:w-auto min-w-[280px] h-16 bg-white text-black hover:bg-zinc-200 transition-all rounded-full text-lg font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] z-20",
                                        !hasApiKey && "opacity-50 grayscale cursor-not-allowed bg-zinc-800 text-zinc-500 shadow-none hover:shadow-none hover:bg-zinc-800",
                                        isGenerating && "cursor-wait"
                                    )}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />

                                    <span className="relative flex items-center justify-center gap-3">
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
                                                <span className="text-zinc-800">Constructing Lesson...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Wand2 className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" />
                                                {hasApiKey ? 'Start Learning Journey' : 'Configure API Key'}
                                            </>
                                        )}
                                    </span>
                                </Button>

                                {!hasApiKey && (
                                    <Link href="/dashboard/settings" className="mt-6 text-sm text-zinc-500 hover:text-white transition-colors underline underline-offset-4 decoration-zinc-800 hover:decoration-white">
                                        Go to Settings to add API Key
                                    </Link>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Content View
    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Overview */}
            <section className="space-y-4 text-left relative">


                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                    {topic.level}
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{topic.title}</h1>

                <div className="relative max-w-4xl mx-auto group space-y-6">
                    <div className="text-xl leading-relaxed text-zinc-300 transition-all duration-500 prose prose-invert prose-lg max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content.overview}
                        </ReactMarkdown>
                    </div>
                </div>
            </section>

            {/* Code Playground (Visible only if practice code exists) */}
            {content.practice_code && (
                <section className="space-y-4 print:hidden max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-2xl font-bold">Interactive Playground</h2>
                        <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">Beta</span>
                    </div>
                    <CodePlayground
                        initialCode={content.practice_code.snippet}
                        language={content.practice_code.language}
                    />
                    {content.practice_code.description && (
                        <p className="text-sm text-zinc-400 italic">
                            {content.practice_code.description}
                        </p>
                    )}
                </section>
            )}

            {/* Dynamic Sections rendering */}
            <section className="space-y-16">
                {content.sections && content.sections.map((section: any, idx: number) => (
                    <div key={idx} className="relative space-y-8">
                        {/* Section Marker */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold shrink-0">
                                {idx + 1}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{section.heading.replace(/^\d+\.\s*/, '')}</h2>
                        </div>

                        {/* Content Prose */}
                        <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed pl-4 md:pl-14 border-l-2 border-zinc-800">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    strong: ({ node, ...props }) => <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-white mt-6 mb-3 border-l-4 border-blue-500 pl-3" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 my-4" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1 marker:text-blue-500/50" {...props} />
                                }}
                            >
                                {section.content}
                            </ReactMarkdown>
                        </div>

                        {/* Chart (if present in this section) */}
                        {section.diagram && (
                            <div className="ml-4 md:ml-14 my-8">
                                <div className="flex items-center gap-2 mb-4 text-indigo-400">
                                    <Flame className="w-5 h-5" />
                                    <span className="text-sm font-bold uppercase tracking-wider">Visual Model</span>
                                </div>
                                <MermaidDiagram chart={section.diagram} />
                            </div>
                        )}

                        {/* Table (if present in this section) */}
                        {section.table && (
                            <div className="ml-4 md:ml-14 my-8 overflow-hidden rounded-xl border border-white/10">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-zinc-900 text-zinc-400">
                                        <tr>
                                            {section.table.headers.map((h: string, i: number) => (
                                                <th key={i} className="px-6 py-4 font-medium uppercase tracking-wider">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 bg-zinc-950/50">
                                        {section.table.rows.map((row: string[], i: number) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                {row.map((cell: string, j: number) => (
                                                    <td key={j} className="px-6 py-4 text-zinc-300 font-mono">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Example Block */}
                        {section.example && (
                            <div className="ml-4 md:ml-14 my-8 p-6 rounded-xl bg-purple-900/10 border border-purple-500/20">
                                <div className="flex items-center gap-2 mb-3 text-purple-400">
                                    <Sparkles className="w-5 h-5" />
                                    <span className="text-sm font-bold uppercase tracking-wider">Example</span>
                                </div>
                                <div className="text-zinc-300 italic leading-relaxed prose prose-invert">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {section.example}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </section>

            {/* Real World Application */}
            {content.real_world_application && (
                <section className="mt-16 bg-gradient-to-br from-emerald-900/20 to-teal-900/10 border border-emerald-500/20 rounded-2xl p-8 md:p-12">
                    <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4 block">Applied Science</span>
                    <h3 className="text-3xl font-bold text-white mb-6">{content.real_world_application.title}</h3>
                    <div className="text-lg text-emerald-100/70 leading-relaxed prose prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content.real_world_application.description}
                        </ReactMarkdown>
                    </div>
                </section>
            )}

            {/* Mermaid Chart */}
            {
                content.mermaid_chart && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                <Flame className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Process Flow</h2>
                        </div>
                        <MermaidDiagram chart={content.mermaid_chart} />
                    </section>
                )
            }

            {/* Comparison Table */}
            {
                content.comparison_table && (
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Feature Comparison</h2>
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-zinc-900 text-zinc-400">
                                    <tr>
                                        {content.comparison_table.headers.map((h: string, i: number) => (
                                            <th key={i} className="px-6 py-4 font-medium uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 bg-zinc-950/50">
                                    {content.comparison_table.rows.map((row: string[], i: number) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            {row.map((cell: string, j: number) => (
                                                <td key={j} className="px-6 py-4 text-zinc-300 font-mono">
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )
            }

            {/* Mistakes */}
            {content.common_mistakes && (
                <section className="bg-red-950/10 border border-red-900/20 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-red-400 mb-6">Common Mistakes to Avoid</h3>
                    <ul className="space-y-3">
                        {content.common_mistakes.map((mistake: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3 text-zinc-300">
                                <span className="text-red-500 font-bold">•</span>
                                {mistake}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Flashcards */}
            {/* Flashcards Toggle Button */}
            {content.flashcards && content.flashcards.length > 0 && (
                <section className="flex justify-center py-8">
                    <Button
                        onClick={() => setShowFlashcards(true)}
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-6 rounded-full text-lg shadow-lg shadow-purple-900/20 transition-all hover:scale-105"
                    >
                        <Brain className="w-5 h-5 mr-2" />
                        Practice with Flashcards
                    </Button>
                </section>
            )}

            {/* Flashcards Modal Overlay */}
            {showFlashcards && content.flashcards && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-4xl relative">
                        <Button
                            onClick={() => setShowFlashcards(false)}
                            variant="ghost"
                            className="absolute -top-12 right-0 text-zinc-400 hover:text-white"
                        >
                            <X className="w-6 h-6 mr-2" />
                            Close
                        </Button>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Interactive Flashcards</h2>
                            <p className="text-zinc-400">Test your knowledge</p>
                        </div>
                        <FlashcardCarousel flashcards={content.flashcards} />

                        <div className="flex justify-center mt-8">
                            <Button
                                onClick={() => setShowFlashcards(false)}
                                variant="outline"
                                className="border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white"
                            >
                                Stop Practicing
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Complete Action */}
            <div className="max-w-3xl mx-auto mt-12 mb-20 flex items-center justify-between gap-4">
                <Button variant="outline" onClick={() => router.back()} className="border-white/10 hover:bg-white/5">
                    Back to Map
                </Button>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsQuizOpen(true)}
                        disabled={!hasApiKey}
                        title={!hasApiKey ? "API Key Required" : "Take Quiz"}
                        className={cn(
                            "bg-blue-600 hover:bg-blue-700 text-white border-none",
                            !hasApiKey && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Brain className="w-4 h-4 mr-2" />
                        Take Quiz
                    </Button>

                    <Button
                        onClick={() => handleComplete()}
                        disabled={isCompleting || isCompleted}
                        className={cn(
                            "min-w-[160px]",
                            isCompleted
                                ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                                : "bg-white text-black hover:bg-zinc-200"
                        )}
                    >
                        {isCompleted ? (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Completed
                            </>
                        ) : (
                            <>
                                {isCompleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                Mark as Complete
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <QuizModal
                isOpen={isQuizOpen}
                onOpenChange={setIsQuizOpen}
                topicId={topic.id}
                topicTitle={topic.title}
            />
            {/* AI Tutor Chat */}
            <ChatInterface topicId={topic.id} title={topic.title} hasApiKey={hasApiKey} />

        </div >
    )
}
