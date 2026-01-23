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
            // URL format: com.learnify.rep://google-auth#access_token=... OR ...?code=...
            const url = data.url
            if (!url.includes('google-auth') && !url.includes('github-auth')) return

            console.log("Deep link received:", url)


            // 1. Check for Fragment (Implicit Flow / Access Token)
            const fragment = url.split('#')[1]
            if (fragment) {
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

                    } else {

                        router.push('/dashboard')
                        router.refresh()
                    }
                    return
                }
            }

            // 2. Check for Query Param (PKCE Flow / Auth Code)
            const queryPart = url.split('?')[1]
            if (queryPart) {
                const params = new URLSearchParams(queryPart)
                const code = params.get('code')

                if (code) {

                    const supabase = createClient()
                    const { error } = await supabase.auth.exchangeCodeForSession(code)

                    if (error) {

                    } else {

                        router.push('/dashboard')
                        router.refresh()
                    }
                    return
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
