import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, CheckCircle, Circle, Lock, Brain, Trophy } from "lucide-react"

interface StatsCardsProps {
    total: number
    unlocked: number
    learning: number
    reviewing: number
    mastered: number
    completion: number
}

export function StatsCards({ total, unlocked, learning, reviewing, mastered, completion }: StatsCardsProps) {
    const stats = [
        {
            label: "TOTAL",
            value: total,
            icon: BookOpen,
            color: "text-white"
        },
        {
            label: "NEWLY UNLOCKED TOPICS",
            value: unlocked,
            icon: Lock, // Using Lock icon to represent unlocked state contextually or just generic
            color: "text-white"
        },
        {
            label: "LEARNING",
            value: learning,
            icon: Brain,
            color: "text-blue-400"
        },
        {
            label: "REVIEWING",
            value: reviewing,
            icon: Circle,
            color: "text-orange-400"
        },
        {
            label: "MASTERED",
            value: mastered,
            icon: CheckCircle,
            color: "text-green-400"
        },
        {
            label: "COMPLETION",
            value: `${completion}%`,
            icon: Trophy,
            color: "text-blue-500"
        }
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
                <Card key={i} className="bg-zinc-900/50 border-white/10">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                {stat.label}
                            </span>
                            <span className={`text-2xl font-bold ${stat.color}`}>
                                {stat.value}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
