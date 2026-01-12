'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { generateContent, completeTopic } from '@/app/actions'
import { FlashcardCarousel } from '@/components/flashcard-carousel'
import { ChatInterface } from '@/components/chat-interface'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TopicViewerProps {
    topic: any
    content: any
}

export function TopicViewer({ topic, content }: TopicViewerProps) {
    const router = useRouter()
    const [isGenerating, startGeneration] = useTransition()
    const [isCompleting, startCompletion] = useTransition()

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
            <section className="space-y-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                    {topic.level}
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{topic.title}</h1>
                <p className="text-xl text-zinc-300 leading-relaxed max-w-2xl mx-auto">
                    {content.overview}
                </p>
            </section>

            {/* Core Concepts */}
            <section className="grid gap-6 md:grid-cols-2">
                {content.core_concepts.map((concept: any, idx: number) => (
                    <Card key={idx} className="bg-zinc-900/50 border-zinc-800">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xl font-bold text-blue-200">{concept.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">{concept.explanation}</p>
                            <div className="bg-blue-950/30 p-4 rounded-lg border border-blue-900/30 text-sm text-blue-100/80">
                                <span className="font-semibold text-blue-400 block mb-1">Example:</span>
                                {concept.example}
                            </div>
                        </CardContent>
                    </Card>
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
            <div className="flex flex-col items-center gap-6 pt-12 border-t border-white/10">
                <p className="text-zinc-500">Finished this lesson?</p>
                <div className="flex gap-4">
                    <Link href={`/subject/${topic.subject_id}`}>
                        <Button variant="outline">Back to Map</Button>
                    </Link>
                    <Button
                        size="lg"
                        onClick={() => startCompletion(async () => {
                            await completeTopic(topic.id)
                            router.push(`/subject/${topic.subject_id}`)
                        })}
                        disabled={isCompleting || topic.status === 'COMPLETED'}
                        className={topic.status === 'COMPLETED' ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                        {isCompleting ? <Loader2 className="animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
                        {topic.status === 'COMPLETED' ? 'Completed' : 'Mark as Complete'}
                    </Button>
                </div>
            </div>

            {/* AI Tutor Chat */}
            <ChatInterface topicId={topic.id} title={topic.title} />

        </div>
    )
}
