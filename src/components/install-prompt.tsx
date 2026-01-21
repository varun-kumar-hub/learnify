"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { Capacitor } from '@capacitor/core'

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // 1. Check if native platform (Capacitor)
        if (Capacitor.isNativePlatform()) return

        // 2. Check if already installed (standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        if (isStandalone) return

        // 2. Check if user permanently dismissed it
        // TEMPORARY DEBUG: Commented out to ensure user sees it
        // const hasSeenPrompt = localStorage.getItem("learnify_install_prompt_dismissed")
        // if (hasSeenPrompt) return

        // 3. Listen for the event
        const handler = (e: any) => {
            e.preventDefault() // Prevent Chrome's default mini-infobar
            setDeferredPrompt(e)
            setIsVisible(true) // Show our custom UI
        }

        window.addEventListener("beforeinstallprompt", handler)

        return () => window.removeEventListener("beforeinstallprompt", handler)
    }, [])

    const handleInstall = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
            setIsVisible(false)
        }
        setDeferredPrompt(null)
    }

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem("learnify_install_prompt_dismissed", "true")
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-500">
            <div className="bg-white border border-zinc-200 text-black p-4 rounded-xl shadow-2xl flex items-center gap-5 w-auto max-w-[400px]">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Download className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-0.5">
                    <p className="font-bold text-base leading-none">Get the Android App</p>
                    <p className="text-sm text-zinc-500 font-medium">Better experience, offline mode</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                    <Button
                        size="sm"
                        onClick={handleInstall}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 rounded-full font-semibold shadow-lg shadow-blue-500/20"
                    >
                        Download
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleDismiss}
                        className="h-8 w-8 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-black"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
