'use client'

import { useState, useTransition } from "react"
import { Switch } from "@/components/ui/switch"
import { toggleSubjectVisibility } from "@/app/actions"
import { Globe, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubjectVisibilityToggleProps {
    subjectId: string
    initialIsPublic: boolean
}

export function SubjectVisibilityToggle({ subjectId, initialIsPublic }: SubjectVisibilityToggleProps) {
    const [isPublic, setIsPublic] = useState(initialIsPublic)
    const [isPending, startTransition] = useTransition()

    function handleToggle(checked: boolean) {
        setIsPublic(checked) // Optimistic update
        startTransition(async () => {
            try {
                await toggleSubjectVisibility(subjectId, checked)
            } catch (error) {
                // Revert on error
                setIsPublic(!checked)
                console.error("Failed to toggle visibility:", error)
            }
        })
    }

    return (
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2">
                {isPublic ? (
                    <Globe className="h-3.5 w-3.5 text-blue-400" />
                ) : (
                    <Lock className="h-3.5 w-3.5 text-zinc-400" />
                )}
                <span className={cn(
                    "text-xs font-medium",
                    isPublic ? "text-blue-200" : "text-zinc-400"
                )}>
                    {isPublic ? "Public" : "Private"}
                </span>
            </div>
            <Switch
                checked={isPublic}
                onCheckedChange={handleToggle}
                disabled={isPending}
                className="scale-75 data-[state=checked]:bg-blue-600 h-5 w-9"
            />
        </div>
    )
}
