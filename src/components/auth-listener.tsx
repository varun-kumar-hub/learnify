'use client'

import { useEffect } from 'react'
import { App } from '@capacitor/app'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Capacitor } from '@capacitor/core'

export function AuthListener() {
    const router = useRouter()

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return

        const handleUrlOpen = async (data: any) => {
            // URL format: com.learnify.rep://google-auth#access_token=...&refresh_token=...
            const url = data.url
            if (!url.includes('google-auth')) return

            console.log("Deep link received:", url)

            // Extract fragment
            const fragment = url.split('#')[1]
            if (!fragment) return

            const params = new URLSearchParams(fragment)
            const accessToken = params.get('access_token')
            const refreshToken = params.get('refresh_token')

            if (accessToken && refreshToken) {
                const supabase = createClient()
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                })

                if (error) {
                    console.error("Failed to set session form deep link", error)
                } else {
                    console.log("Deep link login successful")
                    router.push('/dashboard')
                    router.refresh()
                }
            }
        }

        App.addListener('appUrlOpen', handleUrlOpen)

        return () => {
            App.removeAllListeners()
        }
    }, [router])

    return null
}
