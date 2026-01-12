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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Manage your account preferences and API keys.
                    </DialogDescription>
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

                <DialogFooter className="sm:justify-start border-t border-white/10 pt-4 mt-4">
                    <form action={logout} className="w-full">
                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/20 gap-2">
                            <LogOut className="h-4 w-4" />
                            Log Out
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
