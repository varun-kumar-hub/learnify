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
                        <Card className="w-full h-full bg-zinc-900/50 border-blue-500/20 flex items-center justify-center p-8 text-center hover:border-blue-500/50 transition-colors">
                            <CardContent className="p-0">
                                <h3 className="text-2xl font-bold text-white mb-4">Question</h3>
                                <p className="text-xl text-zinc-300">{currentCard.front}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 backface-hidden"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <Card className="w-full h-full bg-blue-950/20 border-blue-500/50 flex items-center justify-center p-8 text-center">
                            <CardContent className="p-0">
                                <h3 className="text-2xl font-bold text-blue-400 mb-4">Answer</h3>
                                <p className="text-xl text-white">{currentCard.back}</p>
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
