'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, RotateCw, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Flashcard {
    front: string
    back: string
}

export function FlashcardCarousel({ flashcards }: { flashcards: Flashcard[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    const currentCard = flashcards[currentIndex]

    const handleNext = () => {
        setIsFlipped(false)
        setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    }

    const handlePrev = () => {
        setIsFlipped(false)
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }

    const handleFlip = () => setIsFlipped(!isFlipped)

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto py-12">

            <div
                className="relative w-full aspect-[16/10] cursor-pointer perspective-1000 group"
                onClick={handleFlip}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d transition-all duration-700"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden">
                        <Card className="w-full h-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center p-12 text-center shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] relative overflow-hidden group-hover:border-blue-500/50 transition-all duration-500 rounded-[2.5rem]">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
                            <CardContent className="p-0 z-10 space-y-10 flex flex-col items-center w-full">
                                <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">Question</div>
                                <h3 className="text-xl md:text-3xl font-serif font-medium text-white leading-snug max-w-2xl drop-shadow-xl text-balance">
                                    {currentCard.front}
                                </h3>
                                <div className="pt-8 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                                        <RotateCw className="w-4 h-4 animate-spin-slow" />
                                        Click to flip
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 backface-hidden"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <Card className="w-full h-full bg-zinc-900/90 backdrop-blur-2xl border border-emerald-500/30 flex flex-col items-center justify-center p-12 text-center shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] relative overflow-hidden rounded-[2.5rem]">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
                            <CardContent className="p-0 z-10 space-y-10 flex flex-col items-center w-full">
                                <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em]">Explanation</div>
                                <p className="text-lg md:text-xl text-zinc-100 leading-relaxed max-w-2xl font-serif text-balance">
                                    {currentCard.back}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center gap-8">
                <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-zinc-800 bg-black/20 hover:bg-zinc-800 hover:text-white transition-all backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); handlePrev() }}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Card {currentIndex + 1} / {flashcards.length}</span>
                    <Button variant="ghost" className="gap-2 text-zinc-400 hover:text-white h-auto py-1 px-3 hover:bg-white/5 rounded-full" onClick={(e) => { e.stopPropagation(); handleFlip() }}>
                        <RotateCw className="h-3 w-3" />
                        <span className="text-xs">Flip to Reveal</span>
                    </Button>
                </div>

                <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-zinc-800 bg-black/20 hover:bg-zinc-800 hover:text-white transition-all backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); handleNext() }}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
