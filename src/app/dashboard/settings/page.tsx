'use client'

import { useState, useTransition, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getProfile, updateProfile, deleteGeminiKey } from '@/app/actions'
import { Loader2, Lock, ExternalLink, AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
    const [name, setName] = useState('')
    const [key, setKey] = useState('')
    const [hasKey, setHasKey] = useState(false)
    const [isEditingKey, setIsEditingKey] = useState(false)
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
            setIsEditingKey(false)
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

                    <div className="space-y-6 max-w-xl">
                        {/* Status Display - "Encrypted" */}
                        {hasKey ? (
                            <div className="space-y-2">
                                <Label className="text-zinc-500 text-xs uppercase tracking-wider block">Current Key Status</Label>
                                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between group cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="text-zinc-300 font-mono text-sm tracking-widest">••••••••••••••••</div>
                                            <div className="text-[10px] text-green-500 font-medium uppercase tracking-wide flex items-center gap-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                                Active & Encrypted
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-500 text-sm flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                No API Key found.
                            </div>
                        )}

                        {/* Toggle Update Section */}
                        {!isEditingKey ? (
                            <Button
                                variant="outline"
                                className="w-full border-zinc-800 hover:bg-zinc-800 hover:text-white"
                                onClick={() => setIsEditingKey(true)}
                            >
                                {hasKey ? "Replace API Key" : "Add API Key"}
                            </Button>
                        ) : (
                            <div className="space-y-4 pt-4 border-t border-white/5 animate-in slide-in-from-top-2 fade-in duration-200">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>New API Key</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-zinc-500 hover:text-zinc-300"
                                            onClick={() => setIsEditingKey(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="Paste your Gemini API Key here"
                                        value={key}
                                        onChange={(e) => setKey(e.target.value)}
                                        className="bg-zinc-950 border-zinc-800 h-12 font-mono"
                                        autoFocus
                                    />
                                </div>

                                <Button
                                    className="bg-blue-600 hover:bg-blue-500 text-white w-full h-12 text-lg font-medium"
                                    disabled={!key || isPending}
                                    onClick={handleSaveKey}
                                >
                                    {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                                    Securely Save Key
                                </Button>
                            </div>
                        )}

                        <div className="pt-2 flex justify-center">
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-xs text-zinc-500 hover:text-blue-400 hover:underline flex items-center gap-1 transition-colors">
                                Get a key from Google AI Studio <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
