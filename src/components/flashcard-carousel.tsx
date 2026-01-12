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
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto py-10">
            <div className="flex items-center justify-between w-full text-zinc-400 text-sm">
                <span>Card {currentIndex + 1} of {flashcards.length}</span>
                <span>Click to flip</span>
            </div>

            <div
                className="relative w-full aspect-[3/2] cursor-pointer perspective-1000 group"
                onClick={handleFlip}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d transition-all duration-500"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden">
                        <Card className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 border-white/10 flex flex-col items-center justify-center p-8 text-center shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                            <CardContent className="p-0 z-10">
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4 block">Question</span>
                                <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                                    {currentCard.front}
                                </h3>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 backface-hidden"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <Card className="w-full h-full bg-gradient-to-br from-blue-950/30 to-purple-950/30 border-blue-500/20 flex flex-col items-center justify-center p-8 text-center shadow-xl backdrop-blur-sm">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <Check className="w-24 h-24 text-blue-500" />
                            </div>
                            <CardContent className="p-0 z-10">
                                <span className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4 block">Answer</span>
                                <p className="text-lg text-zinc-200 leading-relaxed font-light">
                                    {currentCard.back}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handlePrev() }}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button variant="ghost" className="gap-2" onClick={(e) => { e.stopPropagation(); handleFlip() }}>
                    <RotateCw className="h-4 w-4" /> Flip
                </Button>

                <Button variant="outline" size="icon" onClick={(e) => { e.stopPropagation(); handleNext() }}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}
