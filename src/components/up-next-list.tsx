import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Sparkles } from "lucide-react"
import Link from "next/link"

interface UpNextListProps {
    topics: any[]
}

export function UpNextList({ topics }: UpNextListProps) {
    // Filter for "AVAILABLE" topics (Next up) and maybe recent "COMPLETED" (Review)
    // For now, let's just show the first 2 "AVAILABLE" or "GENERATED" topics
    const upNext = topics
        .filter(t => t.data.status === 'AVAILABLE' || t.data.status === 'GENERATED')
        .slice(0, 2)

    if (upNext.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    <h3 className="font-bold text-lg text-blue-500">Up Next</h3>
                </div>
                <div className="p-6 rounded-xl border border-dashed border-white/10 text-center text-zinc-500 text-sm">
                    No topics queued.
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-lg text-blue-500">Up Next</h3>
            </div>

            {upNext.map((topic, i) => (
                <Card key={topic.id} className="bg-zinc-900/50 border-white/10 relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1 h-full ${topic.data.status === 'GENERATED' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${topic.data.status === 'GENERATED' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                    {topic.data.status === 'GENERATED' ? 'Learning' : 'Up Next'}
                                </span>
                            </div>
                            <h4 className="font-bold text-sm">{topic.data.label}</h4>
                            <p className="text-xs text-zinc-500">{topic.data.level || 'General'}</p>
                        </div>
                        <Link href={`/learn/${topic.id}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-zinc-400 hover:text-white hover:bg-white/10">
                                <Play className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
