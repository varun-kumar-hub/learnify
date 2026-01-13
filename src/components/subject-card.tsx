'use client'

import { useState, useTransition, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowRight, BookOpen, AlertTriangle, Globe, Lock } from 'lucide-react'
import { deleteSubject, toggleSubjectVisibility } from '@/app/actions'
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { Switch } from "@/components/ui/switch"

interface SubjectCardProps {
    id: string
    title: string
    description: string | null
    createdAt: string
    isPublic: boolean
}

export function SubjectCard({ id, title, description, isPublic }: SubjectCardProps) {
    const [isPending, startTransition] = useTransition()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [optimisticPublic, setOptimisticPublic] = useState(isPublic)

    // Sync local state with prop when it changes (server revalidation)
    useEffect(() => {
        setOptimisticPublic(isPublic)
    }, [isPublic])

    function handleTogglePublic(checked: boolean) {
        // Optimistic update
        setOptimisticPublic(checked)

        startTransition(async () => {
            try {
                await toggleSubjectVisibility(id, checked)
            } catch (error) {
                // Revert on error
                setOptimisticPublic(!checked)
                console.error("Failed to toggle visibility:", error)
            }
        })
    }

    return (
        <>
            <Card className="bg-card border-white/10 hover:border-primary/50 transition-all group overflow-hidden relative flex flex-col h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <Link href={`/dashboard/subject/${id}`} className="absolute inset-0 z-20" aria-label={`Open ${title}`} />

                <CardHeader>
                    <div className="flex items-start justify-between">
                        <CardTitle className="truncate pr-4 text-xl">{title}</CardTitle>
                        <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                        {description || "No description provided."}
                    </CardDescription>
                </CardHeader>

                <CardFooter className="mt-auto flex flex-col gap-4 relative z-30">
                    <div
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-white/10 hover:border-white/20 transition-colors cursor-pointer relative z-50"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (!isPending) handleTogglePublic(!optimisticPublic)
                        }}
                    >
                        <div className="flex flex-col gap-0.5 pointer-events-none">
                            <div className="flex items-center gap-2 text-sm font-medium text-white">
                                {optimisticPublic ? <Globe className="h-4 w-4 text-blue-400" /> : <Lock className="h-4 w-4 text-zinc-400" />}
                                <span>{optimisticPublic ? "Public" : "Private"}</span>
                            </div>
                            <span className="text-xs text-zinc-500">
                                {optimisticPublic ? "Visible to community" : "Only you can see this"}
                            </span>
                        </div>
                        <div className="pointer-events-none">
                            <Switch
                                checked={optimisticPublic}
                                disabled={isPending}
                                className="data-[state=checked]:bg-blue-600 bg-zinc-700"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 w-full">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0"
                            disabled={isPending}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setShowDeleteDialog(true)
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>

                        <Link
                            href={`/dashboard/subject/${id}`}
                            className="w-full"
                        >
                            <Button className="w-full gap-2 group/btn bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                Open Subject
                                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                            <AlertTriangle className="h-5 w-5" />
                            Delete Subject?
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone and all topics/flashcards will be lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                startTransition(async () => {
                                    await deleteSubject(id)
                                    setShowDeleteDialog(false)
                                })
                            }}
                            disabled={isPending}
                        >
                            {isPending ? "Deleting..." : "Delete Permanently"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
