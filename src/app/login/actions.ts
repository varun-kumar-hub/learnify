'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/login?error=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    return redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return redirect('/login?error=Could not create user')
    }

    revalidatePath('/', 'layout')
    return redirect('/')
}

// Helper to get the base URL
const getURL = () => {
    let url =
        process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000'

    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`
    // Remove trailing slash if present
    url = url.endsWith('/') ? url.slice(0, -1) : url
    return url
}

export async function signInWithGithub() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${getURL()}/auth/callback`,
        },
    })

    if (error) {
        console.error("Github Auth Error:", error)
        return redirect('/login?error=Could not authenticate with GitHub')
    }

    if (data.url) {
        return redirect(data.url)
    }
}

export async function signInWithGoogle() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${getURL()}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        console.error("Google Auth Error:", error)
        return redirect('/login?error=Could not authenticate with Google')
    }

    if (data.url) {
        return redirect(data.url)
    }
}

