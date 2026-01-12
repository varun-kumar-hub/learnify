'use client'

import { useState, useTransition, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Link as LinkIcon, Loader2, ArrowDown } from 'lucide-react'
import { getTopicsSimple, linkTopics } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface LinkTopicModalProps {
    subjectId: string
}

export function LinkTopicModal({ subjectId }: LinkTopicModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [topics, setTopics] = useState<{ id: string, title: string, status: string }[]>([])
    const [parentId, setParentId] = useState<string>('')
    const [childId, setChildId] = useState<string>('')
    const router = useRouter()

    useEffect(() => {
        if (isOpen) {
            getTopicsSimple(subjectId).then(setTopics).catch(console.error)
        }
    }, [isOpen, subjectId])

    const handleLink = () => {
        if (!parentId || !childId) return

        startTransition(async () => {
            try {
                await linkTopics(parentId, childId)
                setIsOpen(false)
                setParentId('')
                setChildId('')
                router.refresh()
            } catch (error: any) {
                alert(error.message || "Failed to link topics")
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-secondary/50 border-white/5 hover:bg-secondary"
                >
                    <LinkIcon className="h-3 w-3" />
                    Link
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Link Topics</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Create a dependency: user must learn <strong>Parent</strong> before <strong>Child</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Parent Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Parent Topic (Prerequisite)</label>
                        <Select value={parentId} onValueChange={setParentId}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                                <SelectValue placeholder="Select prerequisite..." />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700 text-white max-h-[200px]">
                                {topics.filter(t => t.id !== childId).map(topic => (
                                    <SelectItem key={topic.id} value={topic.id} className="focus:bg-zinc-800 focus:text-white">
                                        {topic.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-center -my-2">
                        <ArrowDown className="w-5 h-5 text-zinc-600" />
                    </div>

                    {/* Child Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Child Topic (Locked)</label>
                        <Select value={childId} onValueChange={setChildId}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                                <SelectValue placeholder="Select target topic..." />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700 text-white max-h-[200px]">
                                {topics.filter(t => t.id !== parentId).map(topic => (
                                    <SelectItem key={topic.id} value={topic.id} className="focus:bg-zinc-800 focus:text-white">
                                        {topic.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)} className="hover:bg-white/10 text-zinc-400 hover:text-white">
                        Cancel
                    </Button>
                    <Button onClick={handleLink} disabled={!parentId || !childId || isPending} className="bg-blue-600 hover:bg-blue-500 text-white min-w-[100px]">
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Create Link
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
