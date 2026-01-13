'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/app/actions'
import { useRouter } from 'next/navigation'

export function GeminiKeyModal({ isOpen, onClose, hasKey }: { isOpen: boolean; onClose?: () => void; hasKey?: boolean }) {
    const [key, setKey] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSave() {
        if (!key) return
        setLoading(true)
        // Trim whitespace to prevent copy-paste errors
        await updateProfile({ gemini_api_key: key.trim() })
        setLoading(false)
        router.refresh()
        if (onClose) onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose && onClose()}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-white" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>
                        {hasKey ? 'Update Gemini API Key' : 'Enter Gemini API Key'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {hasKey
                            ? "Your API key is currently saved. Enter a new one to update it."
                            : "To generate personalized topics, we need your Google Gemini API Key. It is stored securely in your account profile."
                        }
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="apiKey" className="text-right text-zinc-300">
                            API Key
                        </Label>
                        <Input
                            id="apiKey"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            className="col-span-3 bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-600"
                            placeholder={hasKey ? "••••••••••••••••••••••••" : "AIza..."}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {loading ? 'Saving...' : 'Save API Key'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
