'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, ArrowRight, BookOpen } from 'lucide-react'
import { deleteSubject } from '@/app/actions'
import Link from 'next/link'
import { useTransition } from 'react'

interface SubjectCardProps {
    id: string
    title: string
    description: string | null
    createdAt: string
}

export function SubjectCard({ id, title, description }: SubjectCardProps) {
    const [isPending, startTransition] = useTransition()

    return (
        <Card className="bg-card border-white/10 hover:border-primary/50 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

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
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    disabled={isPending}
                    onClick={() => startTransition(() => deleteSubject(id))}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>

                <Button className="w-full ml-2 gap-2 group/btn" asChild>
                    <Link href={`/subject/${id}`}>
                        Open Subject
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
