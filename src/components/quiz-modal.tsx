"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react"
import { generateQuiz } from "@/app/actions"
import { cn } from "@/lib/utils"

interface QuizModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    topicId: string
    topicTitle: string
}

interface Question {
    id: string
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
}

export function QuizModal({ isOpen, onOpenChange, topicId, topicTitle }: QuizModalProps) {
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [score, setScore] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [quizStarted, setQuizStarted] = useState(false)

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setLoading(false)
            setQuestions([])
            setCurrentQuestion(0)
            setSelectedAnswer(null)
            setScore(0)
            setShowResult(false)
            setQuizStarted(false)
        }
    }, [isOpen])

    const startQuiz = async () => {
        setLoading(true)
        try {
            const generatedQuestions = await generateQuiz(topicId)
            if (generatedQuestions) {
                setQuestions(generatedQuestions)
                setQuizStarted(true)
            }
        } catch (error) {
            console.error("Failed to start quiz:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer)
        if (answer === questions[currentQuestion].correctAnswer) {
            setScore(prev => prev + 1)
        }
    }

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1)
            setSelectedAnswer(null)
        } else {
            setShowResult(true)
        }
    }

    const getScoreMessage = () => {
        const percentage = (score / questions.length) * 100
        if (percentage === 100) return "Perfect Score! You're a master! 🏆"
        if (percentage >= 80) return "Great job! Keep it up! 🌟"
        if (percentage >= 60) return "Good effort! Review and try again. 📚"
        return "Keep learning! You'll get it next time. 💪"
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl bg-zinc-950 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Quiz: {topicTitle}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6">
                    {!quizStarted ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                                <BrainIcon className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Ready to test your knowledge?</h3>
                                <p className="text-zinc-400">
                                    Take a quick AI-generated quiz to verify what you've learned.
                                </p>
                            </div>
                            <Button
                                onClick={startQuiz}
                                disabled={loading}
                                className="bg-white text-black hover:bg-zinc-200 min-w-[150px]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Start Quiz"
                                )}
                            </Button>
                        </div>
                    ) : showResult ? (
                        <div className="text-center space-y-6 animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                                <Trophy className="w-10 h-10 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{score} / {questions.length}</h3>
                                <p className="text-lg text-zinc-300">{getScoreMessage()}</p>
                            </div>
                            <Button
                                onClick={() => onOpenChange(false)}
                                className="bg-white text-black hover:bg-zinc-200"
                            >
                                Close Quiz
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Progress Bar */}
                            <div className="flex justify-between text-sm text-zinc-400 mb-2">
                                <span>Question {currentQuestion + 1} of {questions.length}</span>
                                <span>Score: {score}</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                />
                            </div>

                            {/* Question */}
                            <h3 className="text-xl font-semibold leading-relaxed">
                                {questions[currentQuestion].question}
                            </h3>

                            {/* Options */}
                            <div className="space-y-3">
                                {questions[currentQuestion].options.map((option, idx) => {
                                    const isSelected = selectedAnswer === option
                                    const isCorrect = option === questions[currentQuestion].correctAnswer
                                    const showCorrect = selectedAnswer && isCorrect
                                    const showWrong = selectedAnswer === option && !isCorrect

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => !selectedAnswer && handleAnswer(option)}
                                            disabled={!!selectedAnswer}
                                            className={cn(
                                                "w-full p-4 rounded-xl text-left transition-all border",
                                                selectedAnswer
                                                    ? isCorrect
                                                        ? "bg-green-500/10 border-green-500/50 text-green-400"
                                                        : isSelected
                                                            ? "bg-red-500/10 border-red-500/50 text-red-400"
                                                            : "bg-zinc-900/50 border-zinc-800 opacity-50"
                                                    : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{option}</span>
                                                {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                                {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Explanation & Next Button */}
                            {selectedAnswer && (
                                <div className="mt-6 pt-6 border-t border-zinc-800 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-blue-300">
                                            <span className="font-semibold">Explanation: </span>
                                            {questions[currentQuestion].explanation}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={nextQuestion}
                                        className="w-full bg-white text-black hover:bg-zinc-200"
                                    >
                                        {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function BrainIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
            <path d="M14.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1 4.96.44 2.5 2.5 0 0 1 2.96-3.08 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1-1.32-4.24 2.5 2.5 0 0 1-1.98-3A2.5 2.5 0 0 1 14.5 2Z" />
        </svg>
    )
}
