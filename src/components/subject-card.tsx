'use client'

import { useState, useTransition } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react'
import { deleteSubject } from '@/app/actions'
import Link from 'next/link'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'

interface SubjectCardProps {
    id: string
    title: string
    description: string | null
    createdAt: string
}

export function SubjectCard({ id, title, description }: SubjectCardProps) {
    const [isPending, startTransition] = useTransition()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    return (
        <>
            <Card className="bg-card border-white/10 hover:border-primary/50 transition-all group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <Link href={`/subject/${id}`} className="absolute inset-0 z-20" aria-label={`Open ${title}`} />

                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="truncate pr-4 text-xl">{title}</span>
                        <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardTitle>
                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                        {description || "No description provided."}
                    </CardDescription>
                </CardHeader>

                <CardFooter className="flex gap-2 justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 relative z-30"
                        disabled={isPending}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setShowDeleteDialog(true)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <Button className="w-full ml-2 gap-2 group/btn bg-secondary text-secondary-foreground hover:bg-secondary/80 pointer-events-none">
                        Open Subject
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
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
