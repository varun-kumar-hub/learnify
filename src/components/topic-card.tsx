import Link from "next/link"
import { CheckCircle, Circle, Lock, ArrowRight, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface TopicCardProps {
    id: string
    title: string
    status: 'LOCKED' | 'AVAILABLE' | 'GENERATED' | 'COMPLETED'
    level: string
}

export function TopicCard({ id, title, status, level }: TopicCardProps) {
    const isLocked = status === 'LOCKED'

    // Status Logic
    const getStatusConfig = () => {
        switch (status) {
            case 'COMPLETED': return { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" }
            case 'GENERATED': return { icon: Play, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" }
            case 'AVAILABLE': return { icon: Circle, color: "text-white", bg: "bg-zinc-800", border: "border-white/10" }
            default: return { icon: Lock, color: "text-zinc-600", bg: "bg-zinc-900/50", border: "border-white/5" }
        }
    }

    const config = getStatusConfig()
    const Icon = config.icon

    return (
        <Link
            href={isLocked ? '#' : `/dashboard/learn/${id}`}
            className={cn(
                "group relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-300",
                config.bg,
                config.border,
                isLocked ? "cursor-not-allowed opacity-60" : "hover:border-white/20 hover:scale-[1.02] cursor-pointer"
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={cn("p-2 rounded-lg", isLocked ? "bg-zinc-800" : "bg-white/5")}>
                    <Icon className={cn("h-5 w-5", config.color)} />
                </div>
                {!isLocked && (
                    <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-300" />
                )}
            </div>

            <div>
                <h3 className={cn("font-bold text-sm leading-tight mb-2", isLocked ? "text-zinc-500" : "text-zinc-100")}>
                    {title}
                </h3>
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                        isLocked ? "border-zinc-800 text-zinc-600" : "border-white/10 text-zinc-400"
                    )}>
                        {level}
                    </span>
                    {status === 'GENERATED' && (
                        <span className="text-[10px] font-bold text-blue-400 animate-pulse">
                            Learning
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
