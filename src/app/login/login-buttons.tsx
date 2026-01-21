'use client'

import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { signInWithGithub, signInWithGoogle } from './actions' // We will pass these as props or keep using server actions for web
import { createClient } from '@/utils/supabase/client'
import { Capacitor } from '@capacitor/core'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

// We need to import the server actions in a way that we can call them from the client
// Actually, creating a client component that takes the server actions as props is cleaner, or just importing them.
// Ensure 'signInWithGithub' and 'signInWithGoogle' are 'use server' in actions.ts (they are).

export function LoginButtons() {
    const [isLoading, setIsLoading] = useState(false)

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            if (Capacitor.isNativePlatform()) {
                // NATIVE FLOW
                const supabase = createClient()
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: 'com.learnify.rep://google-auth',
                        queryParams: {
                            access_type: 'offline',
                            prompt: 'consent',
                        }
                    }
                })
                if (error) throw error
                // The browser will open, and AuthListener will handle the rest.
            } else {
                // WEB FLOW - Use Server Action
                // We use a hidden form or just call it directly if it accepts formData?
                // Server actions called directly from onClick work if they don't depend on formData or if we act like a form.
                // But the original usage was formAction. 
                // Let's wrapping it in a form submission for consistency or just call it.
                // signInWithGoogle() is async.
                await signInWithGoogle()
            }
        } catch (e) {
            console.error("Login failed", e)
            setIsLoading(false)
        }
    }

    const handleGithubLogin = async () => {
        // Github is less critical for the user request, but let's apply same logic if needed.
        // For now, keep it simple using the server action for Web fallback.
        await signInWithGithub()
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <form action={signInWithGithub}>
                <Button type="submit" variant="outline" className="w-full border-zinc-800 hover:bg-zinc-900 text-white bg-zinc-900">
                    <Github className="mr-2 h-4 w-4" /> Github
                </Button>
            </form>

            <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full border-zinc-800 hover:bg-zinc-900 text-white bg-zinc-900"
            >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                )}
                Google
            </Button>
        </div>
    )
}
