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
}

export function TopicViewer({ topic, content }: TopicViewerProps) {
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
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="p-6 rounded-full bg-zinc-900 border border-zinc-800 shadow-2xl relative group">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all opacity-0 group-hover:opacity-100" />
                    <Sparkles className="w-12 h-12 text-blue-400 relative z-10" />
                </div>

                <div className="max-w-md space-y-2">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500">
                        {topic.title}
                    </h1>
                    <p className="text-zinc-400">
                        This topic is ready to be explored. Generate the interactive lesson to begin your journey.
                    </p>
                </div>

                <Button
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="relative overflow-hidden bg-white text-black hover:bg-blue-50 transition-all px-8 py-6 rounded-full text-lg font-medium shadow-2xl hover:shadow-blue-500/50"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin mr-3" />
                            Crafting Lesson...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-5 h-5 mr-3" />
                            Generate Lesson
                        </>
                    )}
                </Button>
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

                        {/* Example Block - Redesigned to match "Applied Science" style */}
                        {section.example && (
                            <div className="ml-0 md:ml-14 my-10 group/example">
                                <div className="bg-zinc-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:border-emerald-500/40 hover:shadow-emerald-500/5">
                                    <div className="p-6 md:p-8 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-px flex-1 bg-emerald-500/20" />
                                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Applied Science</span>
                                            <div className="h-px flex-1 bg-emerald-500/20" />
                                        </div>
                                        <div className="prose prose-invert prose-emerald max-w-none text-zinc-300 leading-relaxed font-light">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    strong: ({ node, ...props }) => <span className="font-bold text-emerald-400" {...props} />,
                                                    code: ({ node, ...props }) => <code className="bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded text-sm font-mono border border-emerald-500/20" {...props} />
                                                }}
                                            >
                                                {section.example}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

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
                        className="bg-blue-600 hover:bg-blue-700 text-white border-none"
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
            <ChatInterface topicId={topic.id} title={topic.title} />

        </div >
    )
}
