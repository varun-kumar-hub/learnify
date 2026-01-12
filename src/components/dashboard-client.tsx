'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KnowledgeGraph } from '@/components/knowledge-graph'
import { GeminiKeyModal } from '@/components/gemini-key-modal'
import { Brain, Sparkles, Loader2, Search, ArrowRight, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { deleteGeminiKey } from '@/app/actions'

export function DashboardClient({ userEmail, hasKey }: { userEmail: string | undefined; hasKey: boolean }) {
    const [showSettings, setShowSettings] = useState(false)

    return (
        <>
            <GeminiKeyModal isOpen={showSettings} onClose={() => setShowSettings(false)} hasKey={hasKey} />
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="text-muted-foreground hover:text-foreground hover:bg-white/5"
                    suppressHydrationWarning
                >
                    <Settings className="h-4 w-4 mr-2" />
                    API Key
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                        const supabase = createClient()
                        await Promise.all([
                            supabase.auth.signOut(),
                            deleteGeminiKey()
                        ])
                        window.location.href = '/login'
                    }}
                    className="text-muted-foreground hover:text-foreground hover:bg-white/5 cursor-pointer"
                    suppressHydrationWarning
                >
                    Log Out
                </Button>
                <span className="text-sm text-muted-foreground font-medium hidden sm:block">{userEmail}</span>
            </div>
        </>
    )
}
