'use client'

import { useState, useTransition, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Users, Copy, Loader2, BookOpen } from 'lucide-react'
import { getCommunitySubjects, cloneSubject } from '@/app/actions'
import { useRouter } from 'next/navigation'

export default function CommunityPage() {
    const [subjects, setSubjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [cloningId, setCloningId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    useEffect(() => {
        getCommunitySubjects().then(data => {
            setSubjects(data || [])
            setLoading(false)
        })
    }, [])

    function handleClone(id: string) {
        if (cloningId) return
        setCloningId(id)
        startTransition(async () => {
            try {
                await cloneSubject(id)
                router.push('/dashboard')
            } catch (e) {
                console.error("Failed to clone", e)
                setCloningId(null)
            }
        })
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent mb-2">Community</h1>
                    <p className="text-zinc-400">Discover and clone knowledge paths created by others</p>
                </div>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-zinc-500" />
                    </span>
                    <input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all focus:w-80"
                    />
                </div>
            </div>

            {subjects.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                    <Users className="mx-auto h-12 w-12 text-zinc-600 mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-zinc-400">No public subjects yet</h3>
                    <p className="text-zinc-500 mt-2">Share your first subject to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                        <div key={subject.id} className="group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-zinc-900/60 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors truncate pr-2" title={subject.title}>
                                    {subject.title}
                                </h3>
                                <span className="text-[10px] uppercase font-bold text-green-400 bg-green-950/30 px-2 py-0.5 rounded-full shrink-0">Public</span>
                            </div>
                            <p className="text-zinc-500 text-sm mb-6 line-clamp-2 h-10">
                                {subject.description || "No description provided."}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                                        {subject.profiles?.full_name?.[0] || 'U'}
                                    </div>
                                    <span className="text-xs text-zinc-400 truncate max-w-[100px]" title={subject.profiles?.full_name}>
                                        {subject.profiles?.full_name || 'Anonymous'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                                        <Copy className="h-3 w-3" />
                                        {subject.clones || 0}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-2 text-zinc-400 hover:text-white hover:bg-blue-600/20"
                                        onClick={() => handleClone(subject.id)}
                                        disabled={!!cloningId}
                                    >
                                        {cloningId === subject.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                        {cloningId === subject.id ? 'Cloning...' : 'Clone'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
