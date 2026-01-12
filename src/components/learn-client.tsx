'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { KnowledgeGraph } from '@/components/knowledge-graph'
import { Button } from '@/components/ui/button'
import { Brain, ArrowLeft, BookOpen, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export function LearnClient() {
    const router = useRouter()
    const [data, setData] = useState<any>(null)
    const [selectedNode, setSelectedNode] = useState<any>(null)

    useEffect(() => {
        // Retrieve transient data
        try {
            const stored = localStorage.getItem('current_topic')
            if (stored) {
                const parsed = JSON.parse(stored)
                setData(parsed)
                // Select logic: pick root or first node
                if (parsed.nodes && parsed.nodes.length > 0) {
                    setSelectedNode(parsed.nodes.find((n: any) => n.type === 'root') || parsed.nodes[0])
                }
            } else {
                router.push('/')
            }
        } catch (e) {
            router.push('/')
        }
    }, [router])

    if (!data) return <div className="min-h-screen bg-[#030014] flex items-center justify-center text-white">Loading...</div>

    return (
        <main className="min-h-screen bg-[#030014] text-white flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="text-zinc-400 hover:text-white">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-lg leading-tight">{data.title}</h1>
                        <span className="text-xs text-zinc-400">Interactive Learning Session</span>
                    </div>
                </div>
                <div>
                    <Button variant="outline" size="sm" className="border-white/10 text-zinc-300 hover:bg-white/5">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-12 overflow-hidden">

                {/* Left Sidebar: Syllabus */}
                <aside className="col-span-3 border-r border-white/5 bg-black/10 backdrop-blur-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="font-semibold text-zinc-300 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Curriculum
                        </h2>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-2">
                            {data.nodes.map((node: any) => (
                                <button
                                    key={node.id}
                                    onClick={() => setSelectedNode(node)}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all border ${selectedNode?.id === node.id
                                            ? 'bg-blue-600/10 border-blue-500/50 text-blue-200 shadow-lg shadow-blue-500/10'
                                            : 'bg-transparent border-transparent hover:bg-white/5 text-zinc-400'
                                        }`}
                                >
                                    <div className="font-medium">{node.label}</div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </aside>

                {/* Center: Graph View */}
                <section className="col-span-6 relative bg-black/40">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#030014]/50 to-[#030014]" />
                    <div className="absolute top-4 right-4 z-10 bg-black/50 px-3 py-1 rounded-full text-xs text-zinc-500 border border-white/5 backdrop-blur-md">
                        Graph Mode: Interactive
                    </div>
                    <KnowledgeGraph initialNodes={data.nodes} initialEdges={data.edges} />
                </section>

                {/* Right Sidebar: Details */}
                <aside className="col-span-3 border-l border-white/5 bg-black/10 backdrop-blur-sm p-6 flex flex-col overflow-y-auto">
                    {selectedNode ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <div className="inline-block px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-medium mb-3 border border-blue-500/20">
                                    {selectedNode.type === 'root' ? 'Core Concept' : 'Topic Node'}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{selectedNode.label}</h2>
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    {selectedNode.description}
                                </p>
                            </div>

                            <Card className="bg-zinc-900/50 border-white/5">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-zinc-300">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button className="w-full justify-start bg-white/5 hover:bg-white/10 text-zinc-300" variant="ghost">Generate Flashcards</Button>
                                    <Button className="w-full justify-start bg-white/5 hover:bg-white/10 text-zinc-300" variant="ghost">Take Quiz</Button>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-zinc-500 text-sm">
                            Select a node to view details
                        </div>
                    )}
                </aside>

            </div>
        </main>
    )
}
