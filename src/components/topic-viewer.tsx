'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, CheckCircle, ArrowRight, Loader2, Brain, CheckCircle2, Sparkles } from 'lucide-react'
import { generateContent, completeTopic, incrementActivity } from '@/app/actions'
import { FlashcardCarousel } from '@/components/flashcard-carousel'
import { ChatInterface } from '@/components/chat-interface'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { QuizModal } from '@/components/quiz-modal'
import { CodePlayground } from '@/components/code-playground'
import { CodeBlock } from '@/components/code-block'
import { simplifyContent } from '@/app/actions'
import { cn } from '@/lib/utils'
import { Wand2, FileText, Printer, Flame } from 'lucide-react'
import { useEffect } from 'react'

interface TopicViewerProps {
    topic: any
    content: any
}

export function TopicViewer({ topic, content }: TopicViewerProps) {
    const router = useRouter()
    const [isGenerating, startGeneration] = useTransition()
    const [isCompleting, startCompletion] = useTransition()
    const [isQuizOpen, setIsQuizOpen] = useState(false)

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

    if (!content) {
        return (
            <div className="max-w-3xl mx-auto py-20 text-center space-y-8">
                <div className="space-y-4">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full mx-auto flex items-center justify-center border border-zinc-800">
                        <Wand2 className="w-10 h-10 text-purple-500" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                        {topic.title}
                    </h1>
                    <p className="text-zinc-400 max-w-lg mx-auto">
                        This topic is waiting to be explored. Generate the learning material to get started.
                    </p>
                </div>

                <Button
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6 h-auto shadow-lg shadow-purple-900/20"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                            Generating Lesson...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-3" />
                            Generate Lesson
                        </>
                    )}
                </Button>
            </div>
        )
    }

    // ELI5 State
    const [isSimplifying, startSimplifying] = useTransition()
    const [simplifiedOverview, setSimplifiedOverview] = useState<string | null>(null)
    const [showSimplified, setShowSimplified] = useState(false)

    // Check if topic is completed based on status
    const isCompleted = topic.status === 'COMPLETED'

    const handleComplete = () => {
        startCompletion(async () => {
            await completeTopic(topic.id)
            router.push(`/subject/${topic.subject_id}`)
        })
    }

    const handleSimplify = () => {
        if (simplifiedOverview) {
            setShowSimplified(!showSimplified)
            return
        }

        startSimplifying(async () => {
            const simplified = await simplifyContent(content.overview)
            setSimplifiedOverview(simplified)
            setShowSimplified(true)
        })
    }




    // If no content but status is AVAILABLE, show Generate Button
    if (!content && topic.status === 'AVAILABLE') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
                <div className="p-6 rounded-full bg-blue-500/10">
                    <BookOpen className="h-12 w-12 text-blue-500" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold">{topic.title}</h2>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                        Ready to learn? Generate the interactive lesson for this topic.
                    </p>
                </div>
                <Button
                    size="lg"
                    onClick={() => startGeneration(() => generateContent(topic.id))}
                    disabled={isGenerating}
                    className="gap-2 shadow-lg shadow-blue-500/20"
                >
                    {isGenerating ? <Loader2 className="animate-spin" /> : <BookOpen className="h-4 w-4" />}
                    Generate Lesson
                </Button>
            </div>
        )
    }

    // If still no content (and not available), showing Locked or Error
    if (!content) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500">
                <p>This topic is currently locked or unavailable.</p>
                <Link href={`/subject/${topic.subject_id}`} className="mt-4 underline">
                    Return to Graph
                </Link>
            </div>
        )
    }

    // Content View
    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Overview */}
            <section className="space-y-4 text-center relative">
                {/* ELI5 Toggle - Moved to Top Right */}
                <div className="absolute top-0 right-0 hidden md:block">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSimplify}
                        className="text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                        disabled={isSimplifying}
                    >
                        {isSimplifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                        {showSimplified ? "Show Original" : "Explain Like I'm 5"}
                    </Button>
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                    {topic.level}
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{topic.title}</h1>

                <div className="relative max-w-2xl mx-auto group space-y-4">
                    <p className={cn(
                        "text-xl leading-relaxed transition-all duration-500",
                        showSimplified ? "text-blue-200 font-medium" : "text-zinc-300"
                    )}>
                        {showSimplified ? simplifiedOverview : content.overview}
                    </p>
                </div>
            </section>

            {/* Code Playground (Visible only if practice code exists) */}
            {content.practice_code && (
                <section className="space-y-4 print:hidden">
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

            {/* Core Concepts */}
            {/* Core Concepts - Straight Path Layout */}
            <section className="relative space-y-12 before:absolute before:left-4 md:before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-purple-500 before:opacity-20">
                {content.core_concepts && Array.isArray(content.core_concepts) && content.core_concepts.map((concept: any, idx: number) => (
                    <div key={idx} className="relative pl-12 md:pl-20">
                        {/* Timeline Node */}
                        <div className="absolute left-0 md:left-4 top-0 w-8 h-8 rounded-full bg-zinc-950 border border-blue-500/50 flex items-center justify-center z-10">
                            <span className="text-xs font-mono text-blue-400">{idx + 1}</span>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white mb-2">{concept.title}</h3>
                            <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
                                {concept.explanation}
                            </p>

                            {concept.example && (
                                <div className="mt-4">
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 block ml-1">Example & Application</span>
                                    <CodeBlock
                                        code={concept.example}
                                        language="Example"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </section>

            {/* Mistakes */}
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

            {/* Flashcards */}
            {content.flashcards && content.flashcards.length > 0 && (
                <section className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white">Interactive Flashcards</h2>
                        <p className="text-zinc-500">Test your knowledge before completing the topic.</p>
                    </div>
                    <FlashcardCarousel flashcards={content.flashcards} />
                </section>
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

        </div>
    )
}
