'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2, Link as LinkIcon, Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { generateTopics, addTopic } from '@/app/actions'
import { LinkTopicModal } from '@/components/link-topic-modal'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SubjectHeaderActionsProps {
    subjectId: string
    title: string
    hasApiKey?: boolean
    isOwner: boolean
}

import { useRouter } from 'next/navigation'

export function SubjectHeaderActions({ subjectId, title, hasApiKey = false, isOwner }: SubjectHeaderActionsProps) {
    const router = useRouter()
    const [isGenerating, startGenerating] = useTransition()
    const [isAdding, startAdding] = useTransition()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [errorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [newTopicTitle, setNewTopicTitle] = useState('')

    // Hide all actions if not owner
    if (!isOwner) return null

    function handleGenerate() {
        startGenerating(async () => {
            try {
                console.log("Starting generation...")
                await generateTopics(subjectId)
                console.log("Generation complete")
                router.refresh() // Force reload to show new topics
            } catch (error: any) {
                console.error("Failed to generate:", error)
                setErrorMessage(error.message || "An unexpected error occurred.")
                setErrorModalOpen(true)
            }
        })
    }



    function handleAddTopic(e: React.FormEvent) {
        e.preventDefault()
        if (!newTopicTitle.trim()) return

        startAdding(async () => {
            try {
                await addTopic(subjectId, newTopicTitle)
                setIsAddModalOpen(false)
                setNewTopicTitle('')
            } catch (error) {
                console.error("Failed to add topic:", error)
            }
        })
    }

    return (
        <div className="flex items-center gap-2">
            {/* AI Generate Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating || !hasApiKey}
                title={!hasApiKey ? "API Key Required" : "Generate Topics"}
                className={cn(
                    "gap-2 border-dashed border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10",
                    !hasApiKey && "opacity-50 cursor-not-allowed"
                )}
            >
                {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {isGenerating ? 'Generating...' : !hasApiKey ? 'Key Required' : 'AI Generate'}
            </Button>

            {/* Link Button (Topic Dependency) */}
            <LinkTopicModal subjectId={subjectId} />

            {/* Add Topic Button */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-500 text-white">
                        <Plus className="h-4 w-4" />
                        Add Topic
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Add New Topic</DialogTitle>
                        <DialogDescription>
                            Manually add a topic to <strong>{title}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddTopic} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="topic-title">Topic Title</Label>
                            <Input
                                id="topic-title"
                                value={newTopicTitle}
                                onChange={(e) => setNewTopicTitle(e.target.value)}
                                placeholder="e.g., Advanced Patterns"
                                className="bg-zinc-900 border-zinc-700"
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isAdding || !newTopicTitle.trim()} className="bg-blue-600 hover:bg-blue-500">
                                {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Add Topic
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Error Modal */}
            <Dialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
                <DialogContent className="bg-red-950/20 border-red-900/50 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-400 flex items-center gap-2">
                            Generation Failed
                        </DialogTitle>
                        <DialogDescription className="text-red-200/80">
                            {errorMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setErrorModalOpen(false)} variant="outline" className="border-red-900/50 hover:bg-red-900/20 text-red-300">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
