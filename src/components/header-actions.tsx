'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings, Key, Flame } from 'lucide-react'
import { SettingsDialog } from '@/components/settings-dialog'
import { GeminiKeyModal } from '@/components/gemini-key-modal'

interface HeaderActionsProps {
    profile: any
    email: string
}

export function HeaderActions({ profile, email }: HeaderActionsProps) {
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)
    const [streak, setStreak] = useState<{ count: number, active: boolean } | null>(null)

    // Fetch streak on mount
    useState(() => {
        import('@/app/actions').then(({ getStreak }) => {
            getStreak().then(setStreak)
        })
    })

    return (
        <div className="flex items-center gap-4">
            {/* Streak Indicator */}
            {streak !== null && (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400">
                    <Flame className={`w-4 h-4 ${streak.active ? 'fill-orange-500 text-orange-500' : 'text-zinc-500'}`} />
                    <span className="text-sm font-bold">{streak.count}</span>
                </div>
            )}

            {/* API Key Button (Prominent) */}
            <Button
                variant="outline"
                className="gap-2 border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-all font-medium"
                onClick={() => setIsKeyModalOpen(true)}
            >
                <Key className="h-4 w-4" />
                <span>Gemini API Key</span>
                <span className={isKeyModalOpen ? "w-2 h-2 rounded-full bg-green-500 animate-pulse" : "w-2 h-2 rounded-full bg-zinc-600"} />
            </Button>

            {/* User Details */}
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{profile?.full_name}</p>
                <p className="text-xs text-zinc-500">{email}</p>
            </div>

            {/* Settings Dialog */}
            <SettingsDialog initialName={profile?.full_name as string} hasKey={profile?.hasKey || false} />

            {/* API Key Modal (Standalone) */}
            <GeminiKeyModal
                isOpen={isKeyModalOpen}
                onClose={() => setIsKeyModalOpen(false)}
                hasKey={profile?.hasKey || false}
            />
        </div>
    )
}
