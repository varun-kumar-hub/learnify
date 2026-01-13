'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, LogOut, Key, User, Loader2 } from 'lucide-react'
import { logout, updateProfile, deleteGeminiKey } from '@/app/actions' // We will implement these
import { useToast } from '@/hooks/use-toast' // Assuming shadcn toast exists, or we use simple alert

interface SettingsDialogProps {
    initialName?: string
    hasKey: boolean
}

export function SettingsDialog({ initialName = "", hasKey = false }: SettingsDialogProps) {
    const [open, setOpen] = useState(false)

    // Profile State
    const [name, setName] = useState(initialName)
    const [isProfilePending, startProfileTransition] = useTransition()

    // Key State
    const [key, setKey] = useState("")
    const [isKeyPending, startKeyTransition] = useTransition()

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
                setKey("") // Clear local state for security
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
                await deleteGeminiKey() // Calls server action
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
            <DialogContent className="absolute top-16 right-6 w-[400px] bg-zinc-950 border-zinc-800 text-white shadow-2xl p-0 overflow-hidden sm:rounded-xl data-[state=open]:slide-in-from-top-2 data-[state=open]:fade-in-0 sm:zoom-in-95 data-[state=closed]:slide-out-to-top-2 data-[state=closed]:fade-out-0">
                <DialogHeader className="relative pr-16 text-left">
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Manage your account preferences.
                    </DialogDescription>

                    {/* Top Right Log Out Button */}
                    <form action={logout} className="absolute top-0 right-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-full h-8 w-8"
                            title="Log Out"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </form>
                </DialogHeader>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="api-key">API Key</TabsTrigger>
                    </TabsList>

                    {/* PROFILE TAB */}
                    <TabsContent value="profile" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex. John Doe"
                            />
                            <p className="text-xs text-muted-foreground">
                                This name will be displayed on your dashboard.
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveProfile} disabled={isProfilePending}>
                                {isProfilePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </TabsContent>

                    {/* API KEY TAB */}
                    <TabsContent value="api-key" className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="key" className="flex items-center gap-2">
                                Gemini API Key
                                {hasKey && <span className="text-xs text-green-500 font-mono bg-green-950/30 px-2 py-0.5 rounded">Active</span>}
                            </Label>
                            <Input
                                id="key"
                                type="password"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder={hasKey ? "••••••••••••••••" : "Paste your API Key here"}
                            />
                            <p className="text-xs text-muted-foreground">
                                Your key is encrypted and stored securely.
                            </p>
                        </div>
                        <div className="flex justify-between gap-2">
                            {hasKey && (
                                <Button variant="destructive" size="sm" onClick={handleDeleteKey} disabled={isKeyPending}>
                                    Remove Key
                                </Button>
                            )}
                            <Button onClick={handleSaveKey} disabled={isKeyPending || !key} className="ml-auto">
                                {isKeyPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Key
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
