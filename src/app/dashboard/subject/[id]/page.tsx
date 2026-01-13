import { getSubject, getSubjectTopics, getProfile } from "@/app/actions"
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
import { SubjectHeaderActions } from "@/components/subject-header-actions"
import { Globe, Lock } from "lucide-react"

// Next.js 15+ convention: params is a promise
export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch profile to check API key status
    const profile = await getProfile()
    const hasApiKey = profile?.hasKey || false

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
                        <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-full transition-colors">
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

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                        {subject.is_public ? (
                            <>
                                <Globe className="h-3.5 w-3.5 text-blue-400" />
                                <span className="text-xs font-medium text-blue-200">Public</span>
                            </>
                        ) : (
                            <>
                                <Lock className="h-3.5 w-3.5 text-zinc-400" />
                                <span className="text-xs font-medium text-zinc-400">Private</span>
                            </>
                        )}
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    <SubjectHeaderActions
                        subjectId={subject.id}
                        title={subject.title}
                        hasApiKey={hasApiKey}
                        isOwner={subject.user_id === user.id}
                    />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* API Key Warning Banner */}
                {!hasApiKey && (
                    <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-4 text-orange-200">
                        <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-sm">Action Required: Add API Key</p>
                            <p className="text-xs text-orange-200/70">You need to configure your Gemini API key in settings to generate topics and content.</p>
                        </div>
                        {/* Settings trigger is handled globally or user goes to dashboard, but we can just inform here */}
                    </div>
                )}

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
                                <ActivityChart subjectId={id} />
                            </div>
                            <div>
                                <UpNextList topics={nodes} />
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
                                    <GenerateGraphButton subjectId={id} hasApiKey={hasApiKey} />
                                </div>
                            </div>
                        ) : (
                            <GraphVisualizer initialNodes={nodes} initialEdges={edges} />
                        )}
                    </TabsContent>



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


