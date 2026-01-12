import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Sparkles } from "lucide-react"

export function UpNextList() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <h3 className="font-bold text-lg text-blue-500">Up Next</h3>
            </div>

            {/* Review Due Card */}
            <Card className="bg-zinc-900/50 border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded uppercase">
                                Review Due
                            </span>
                        </div>
                        <h4 className="font-bold text-sm">Python Basics & Setup</h4>
                        <p className="text-xs text-zinc-500">⏱ 30 min</p>
                    </div>
                    <Button size="icon" className="h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white">
                        <Play className="h-4 w-4 fill-current" />
                    </Button>
                </CardContent>
            </Card>

            {/* Newly Unlocked Topic Card */}
            <Card className="bg-zinc-900/50 border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded uppercase">
                                Newly Unlocked Topic
                            </span>
                        </div>
                        <h4 className="font-bold text-sm">Python Data Types</h4>
                        <p className="text-xs text-zinc-500">⏱ 45 min</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-zinc-400 hover:text-white hover:bg-white/10">
                        <Play className="h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
