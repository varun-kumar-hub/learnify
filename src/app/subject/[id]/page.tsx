import { getSubject, getSubjectTopics } from "@/app/actions"
import { GraphVisualizer } from "@/components/graph-visualizer"
import { GenerateGraphButton } from "@/components/generate-graph-button"
import { ArrowLeft, Brain, Share2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function SubjectPage({ params }: { params: { id: string } }) {
    const subject = await getSubject(params.id)
    if (!subject) redirect('/dashboard')

    const { nodes, edges } = await getSubjectTopics(params.id)
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
                            <GenerateGraphButton subjectId={params.id} />
                        </div>
                    </div>
                ) : (
                    <GraphVisualizer initialNodes={nodes} initialEdges={edges} />
                )}
            </main>
        </div>
    )
}
