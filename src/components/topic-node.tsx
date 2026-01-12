'use client'

import { Handle, Position } from 'reactflow'
import { Lock, CheckCircle, PlayCircle, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TopicNode({ data }: { data: { label: string; status: 'LOCKED' | 'AVAILABLE' | 'GENERATED' | 'COMPLETED'; level: string } }) {

    const statusColor = {
        'LOCKED': 'bg-zinc-900 border-zinc-700 text-zinc-500',
        'AVAILABLE': 'bg-blue-950/50 border-blue-500/50 text-blue-200 shadow-[0_0_15px_rgba(37,99,235,0.3)]',
        'GENERATED': 'bg-purple-950/50 border-purple-500/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
        'COMPLETED': 'bg-green-950/50 border-green-500/50 text-green-200'
    }

    const icon = {
        'LOCKED': <Lock className="h-4 w-4" />,
        'AVAILABLE': <PlayCircle className="h-4 w-4" />,
        'GENERATED': <BookOpen className="h-4 w-4" />,
        'COMPLETED': <CheckCircle className="h-4 w-4" />
    }

    return (
        <div className={cn(
            "px-4 py-3 rounded-xl border-2 min-w-[150px] transition-all duration-300 backdrop-blur-md flex items-center gap-3",
            statusColor[data.status] || statusColor['LOCKED']
        )}>
            <Handle type="target" position={Position.Top} className="!bg-zinc-500 !w-3 !h-1 !rounded-full !border-none" />

            {icon[data.status]}

            <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight">{data.label}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-70 font-semibold">{data.status}</span>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-zinc-500 !w-3 !h-1 !rounded-full !border-none" />
        </div>
    )
}
