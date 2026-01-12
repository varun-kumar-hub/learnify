import { getSubject, getSubjectTopics } from "@/app/actions"
import { GraphVisualizer } from "@/components/graph-visualizer"
import { GenerateGraphButton } from "@/components/generate-graph-button"
import { ArrowLeft, Brain, Share2, AlertTriangle, Plus, Link as LinkIcon, Sparkles } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from "@/components/stats-cards"
import { TopicCard } from "@/components/topic-card"
import { UpNextList } from "@/components/up-next-list"
import { ActivityChart } from "@/components/activity-chart"
import { Switch } from "@/components/ui/switch"

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

    // Calculate Stats
    const total = nodes.length
    const unlocked = nodes.filter((n: any) => n.data.status === 'AVAILABLE').length
    const learning = nodes.filter((n: any) => n.data.status === 'GENERATED').length
    const mastered = nodes.filter((n: any) => n.data.status === 'COMPLETED').length
    // Reviewing is not explicitly tracked yet, assume 0 or derived from some logic
    const reviewing = 0
    const completion = total > 0 ? Math.round((mastered / total) * 100) : 0

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
                            <div className="flex items-center gap-2">
                                <h1 className="font-bold text-lg leading-none">{subject.title}</h1>
                                <button className="text-zinc-500 hover:text-white transition-colors">
                                    <span className="sr-only">Edit</span>
                                </button>
                            </div>
                            <span className="text-xs text-muted-foreground">{nodes.length} topics</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-zinc-400">Private</span>
                        <Switch className="scale-75 data-[state=checked]:bg-blue-600" />
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    <Button variant="outline" size="sm" className="gap-2 border-dashed border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                        <Sparkles className="h-3 w-3" />
                        AI Generate
                    </Button>

                    <Button variant="outline" size="sm" className="gap-2 bg-secondary/50 border-white/5 hover:bg-secondary">
                        <LinkIcon className="h-3 w-3" />
                        Link
                    </Button>

                    <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-500 text-white">
                        <Plus className="h-4 w-4" />
                        Add Topic
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="bg-transparent border border-white/10 p-1 h-auto rounded-lg inline-flex gap-1">
                        <TabsTrigger value="overview" className="px-4 py-2 rounded-md data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 hover:text-zinc-200 transition-colors">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="graph" className="px-4 py-2 rounded-md data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 hover:text-zinc-200 transition-colors">
                            Knowledge Graph
                        </TabsTrigger>
                        <TabsTrigger value="topics" className="px-4 py-2 rounded-md data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 hover:text-zinc-200 transition-colors">
                            All Topics
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <StatsCards
                            total={total}
                            unlocked={unlocked}
                            learning={learning}
                            reviewing={reviewing}
                            mastered={mastered}
                            completion={completion}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <ActivityChart />
                            </div>
                            <div>
                                <UpNextList />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="graph" className="h-[calc(100vh-16rem)] min-h-[500px] border border-white/10 rounded-xl overflow-hidden bg-zinc-950/50 backdrop-blur-sm relative animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {isEmpty ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                                <div className="p-4 rounded-full bg-blue-500/10">
                                    <Brain className="h-10 w-10 text-blue-500" />
                                </div>
                                <div className="text-center max-w-md px-4">
                                    <h2 className="text-2xl font-bold">Map your journey</h2>
                                    <p className="text-muted-foreground mt-2 mb-8">
                                        This subject is empty. Use AI to generate a structured learning path.
                                    </p>
                                    <GenerateGraphButton subjectId={id} />
                                </div>
                            </div>
                        ) : (
                            <GraphVisualizer initialNodes={nodes} initialEdges={edges} />
                        )}
                    </TabsContent>

                    import {TopicCard} from "@/components/topic-card"

                    // ... inside the component ...

                    <TabsContent value="topics">
                        {isEmpty ? (
                            <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-zinc-500">
                                No topics generated yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {nodes.map((node: any) => (
                                    <TopicCard
                                        key={node.id}
                                        id={node.id}
                                        title={node.data.label}
                                        status={node.data.status}
                                        level={node.data.level || 'General'}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div >
    )
}

function Lock({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    )
}
