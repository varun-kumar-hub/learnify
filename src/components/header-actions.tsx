'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Settings, Key, Flame, LogOut } from 'lucide-react'
import { SettingsDialog } from '@/components/settings-dialog'
import { GeminiKeyModal } from '@/components/gemini-key-modal'
import { getStreak, logout } from '@/app/actions'

interface HeaderActionsProps {
    profile: any
    email: string
}

export function HeaderActions({ profile, email }: HeaderActionsProps) {
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)
    const [streak, setStreak] = useState<{ count: number, active: boolean } | null>(null)

    // Fetch streak on mount
    useEffect(() => {
        getStreak().then(setStreak)
    }, [])

    return (
        <div className="flex items-center gap-4">
            {/* User Details */}
            <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{profile?.full_name}</p>
                <p className="text-xs text-zinc-500">{email}</p>
            </div>

            {/* Settings Dialog (Includes Streak & API Key now) */}
            <SettingsDialog initialName={profile?.full_name as string} hasKey={profile?.hasKey || false} />

            {/* Direct Log Out Button (Visible) */}
            <form action={logout}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-500 hover:text-red-400 hover:bg-red-950/20"
                    title="Log Out"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </form>
        </div>
    )
}
