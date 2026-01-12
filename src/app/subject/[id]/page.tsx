import { getSubject, getSubjectTopics } from "@/app/actions"
import { GraphVisualizer } from "@/components/graph-visualizer"
import { GenerateGraphButton } from "@/components/generate-graph-button"
import { ArrowLeft, Brain, Share2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

// Next.js 15+ convention: params is a promise
export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: subject, error } = await getSubject(id)

    if (error || !subject) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
                <div className="p-4 rounded-full bg-red-500/10 mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Subject Not Found</h1>
                <p className="text-red-400 font-mono text-sm mb-4 max-w-md bg-red-950/30 p-2 rounded border border-red-900/50">
                    {error || "Unknown Error"}
                </p>
                <p className="text-xs text-zinc-600 font-mono mb-8">Ref: {id}</p>
                <Link href="/" className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 font-medium transition-colors">
                    Back to Dashboard
                </Link>
            </div>
        )
    }

    const { nodes, edges } = await getSubjectTopics(id)
    const isEmpty = nodes.length === 0

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Link>
                        <div>
                            <h1 className="font-bold text-lg leading-none">{subject.title}</h1>
                            <span className="text-xs text-muted-foreground">Knowledge Graph</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 h-[calc(100vh-4rem)] flex flex-col">
                {/* DEBUG OVERLAY */}
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-4 rounded-xl font-bold text-center shadow-2xl pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
                    <p>DEBUG MODE</p>
                    <p>Nodes: {nodes?.length ?? 'undefined'}</p>
                    <p>Edges: {edges?.length ?? 'undefined'}</p>
                    <p>ID: {id}</p>
                </div>

                {isEmpty ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-6 border border-dashed border-white/10 rounded-3xl bg-white/5 m-4">
                        <div className="p-4 rounded-full bg-blue-500/10">
                            <Brain className="h-10 w-10 text-blue-500" />
                        </div>
                        <div className="text-center max-w-md px-4">
                            <h2 className="text-2xl font-bold">Map your journey</h2>
                            <p className="text-muted-foreground mt-2 mb-8">
                                This subject is empty. Use AI to generate a structured learning path with topics and dependencies.
                            </p>
                            <GenerateGraphButton subjectId={id} />
                        </div>
                    </div>
                ) : (
                    <GraphVisualizer initialNodes={nodes} initialEdges={edges} />
                )}
            </main>
        </div>
    )
}
