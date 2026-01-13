'use client'

import { useState, useTransition, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getProfile, updateProfile, deleteGeminiKey } from '@/app/actions'
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
    const [name, setName] = useState('')
    const [key, setKey] = useState('')
    const [hasKey, setHasKey] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Load initial data
    useEffect(() => {
        getProfile().then(p => {
            if (p) {
                setName(p.full_name)
                setHasKey(p.hasKey)
            }
        })
    }, [])

    function handleSaveKey() {
        startTransition(async () => {
            await updateProfile({ gemini_api_key: key })
            setKey('')
            setHasKey(true)
        })
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent mb-2">Settings</h1>
                <p className="text-zinc-400">Manage your application preferences and API keys</p>
            </div>

            <div className="grid gap-8">
                {/* API Key Section */}
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Gemini API Key</h2>
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                            <p className="font-bold mb-1">Why do we need this?</p>
                            <p>Your API key allows us to communicate with Google's Gemini AI to generate personalized curriculum, quizzes, and flashcards for you. It is stored securely.</p>
                        </div>
                    </div>

                    <div className="space-y-4 max-w-xl">
                        {hasKey && (
                            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                                <Label className="text-zinc-500 text-xs uppercase tracking-wider mb-2 block">Current Status</Label>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-mono text-zinc-300">Key is active and secure</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Update Gemini Key</Label>
                            <Input
                                type="password"
                                placeholder={hasKey ? "••••••••••••••••" : "Paste your API Key here"}
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                className="bg-zinc-950 border-zinc-800 h-12"
                            />
                        </div>

                        <Button
                            className="bg-blue-600 hover:bg-blue-500 text-white w-full h-12 text-lg font-medium"
                            disabled={!key || isPending}
                            onClick={handleSaveKey}
                        >
                            {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                            {hasKey ? "Update Key" : "Save API Key"}
                        </Button>

                        <div className="pt-4">
                            <p className="text-xs text-zinc-500">Need a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-400 hover:underline">Get one from Google AI Studio</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
