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
    return redirect('/dashboard')
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
    // Check if we are running in a Capacitor environment context (client-side)
    // However, this is a server action, so we can't check window.
    // For now, let's hardcode the production URL or localhost.
    // Ideally, pass a parameter to indicate source.

    if (process.env.NODE_ENV === 'production') {
        return 'https://learnify-rep1.vercel.app';
    }
    return 'http://localhost:3000';
}

import { headers } from 'next/headers'

export async function signInWithGithub() {
    const supabase = await createClient()
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

    // Construct the callback URL dynamically based on the current host (localhost or IP)
    const redirectUrl = `${protocol}://${host}/auth/callback?next=/dashboard`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: redirectUrl,
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
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

    const redirectUrl = `${protocol}://${host}/auth/callback?next=/dashboard`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectUrl,
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

