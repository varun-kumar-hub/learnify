'use client'

import { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createSubject } from '@/app/actions'
import { Plus } from 'lucide-react'

export function CreateSubjectModal() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            await createSubject(formData)
            setOpen(false)
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                    <Plus className="h-5 w-5" />
                    Create New Subject
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle>Create Subject</DialogTitle>
                    <DialogDescription>
                        Start a new learning journey. What do you want to master?
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Subject Title</Label>
                        <Input id="title" name="title" placeholder="e.g., Quantum Physics, React Hooks" required className="bg-zinc-900 border-zinc-700" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea id="description" name="description" placeholder="Brief overview of what you'll learn..." className="bg-zinc-900 border-zinc-700" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? 'Creating...' : 'Create Subject'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
