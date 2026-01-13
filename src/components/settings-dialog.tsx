'use client'

import { useState, useTransition, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, LogOut, Key, Flame, Loader2 } from 'lucide-react'
import { logout, updateProfile, deleteGeminiKey } from '@/app/actions'

interface SettingsDialogProps {
    initialName?: string
    hasKey: boolean
}

export function SettingsDialog({ initialName = "", hasKey = false }: SettingsDialogProps) {
    const [open, setOpen] = useState(false)
    const [streak, setStreak] = useState<{ count: number, active: boolean } | null>(null)

    // Profile State
    const [name, setName] = useState(initialName)
    const [isProfilePending, startProfileTransition] = useTransition()

    // Key State
    const [key, setKey] = useState("")
    const [isKeyPending, startKeyTransition] = useTransition()

    // Fetch streak when open
    useEffect(() => {
        if (open) {
            import('@/app/actions').then(({ getStreak }) => {
                getStreak().then(setStreak)
            })
        }
    }, [open])

    async function handleSaveProfile() {
        startProfileTransition(async () => {
            try {
                await updateProfile({ full_name: name })
                setOpen(false)
            } catch (e) {
                console.error(e)
            }
        })
    }

    async function handleSaveKey() {
        startKeyTransition(async () => {
            try {
                await updateProfile({ gemini_api_key: key })
                setKey("")
                setOpen(false)
            } catch (e) {
                console.error(e)
            }
        })
    }

    async function handleDeleteKey() {
        if (!confirm("Are you sure? AI features will stop working.")) return;
        startKeyTransition(async () => {
            try {
                await deleteGeminiKey()
                setOpen(false)
            } catch (e) {
                console.error(e)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                    <Settings className="h-5 w-5" />
                </Button>
            </DialogTrigger>

            {/* Redesigned Content: Absolute positioned to look like a dropdown menu below the trigger */}
            <DialogContent className="absolute top-14 right-4 w-[380px] bg-zinc-950/95 backdrop-blur-xl border-zinc-800 text-white shadow-2xl p-0 overflow-hidden rounded-xl data-[state=open]:slide-in-from-top-2 data-[state=open]:fade-in-0 sm:zoom-in-95 data-[state=closed]:slide-out-to-top-2 data-[state=closed]:fade-out-0">

                {/* Header Area */}
                <div className="p-6 pb-2 border-b border-white/5 relative">
                    <DialogHeader className="text-left space-y-1">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-lg">Settings</DialogTitle>
                        </div>
                        <DialogDescription>
                            Account & Preferences
                        </DialogDescription>
                    </DialogHeader>

                    {/* Streak Badge in Header */}
                    {streak !== null && (
                        <div className="mt-4 flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-orange-200 uppercase font-bold tracking-wider">Current Streak</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-orange-400">
                                <Flame className={`w-4 h-4 ${streak.active ? 'fill-orange-500 text-orange-500' : 'text-zinc-500'}`} />
                                <span className="font-mono font-bold text-lg">{streak.count}</span>
                            </div>
                        </div>
                    )}
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50 p-1 m-4 mb-0 w-[calc(100%-2rem)] rounded-lg">
                        <TabsTrigger value="profile" className="rounded-md data-[state=active]:bg-zinc-800 data-[state=active]:text-white">Profile</TabsTrigger>
                        <TabsTrigger value="api-key" className="rounded-md data-[state=active]:bg-zinc-800 data-[state=active]:text-white flex items-center gap-2">
                            API Key
                            {hasKey && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                        </TabsTrigger>
                    </TabsList>

                    {/* PROFILE TAB */}
                    <TabsContent value="profile" className="p-6 pt-4 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-400">Display Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex. John Doe"
                                className="bg-zinc-900 border-zinc-800 focus:border-blue-500/50"
                            />
                        </div>
                        <Button onClick={handleSaveProfile} disabled={isProfilePending} className="w-full bg-white text-black hover:bg-zinc-200">
                            {isProfilePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Profile
                        </Button>
                    </TabsContent>

                    {/* API KEY TAB */}
                    <TabsContent value="api-key" className="p-6 pt-4 space-y-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
                            <p>An API Key is required for AI features.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="key" className="text-zinc-400">Gemini API Key</Label>
                            <div className="relative">
                                <Input
                                    id="key"
                                    type="password"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    placeholder={hasKey ? "••••••••••••••••" : "Paste key here"}
                                    className="bg-zinc-900 border-zinc-800 pr-10 focus:border-blue-500/50"
                                />
                                <Key className="absolute right-3 top-2.5 h-4 w-4 text-zinc-500" />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            {hasKey && (
                                <Button variant="destructive" className="flex-1 bg-red-950/30 text-red-400 hover:bg-red-950/50 border border-red-900/20" onClick={handleDeleteKey} disabled={isKeyPending}>
                                    Remove
                                </Button>
                            )}
                            <Button onClick={handleSaveKey} disabled={isKeyPending || !key} className="flex-1 bg-white text-black hover:bg-zinc-200">
                                {isKeyPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {hasKey ? 'Update Key' : 'Save Key'}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="p-4 bg-zinc-900/30 border-t border-white/5 flex justify-center">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">Learnify v1.0</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
