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
    // Check if we are running in a Capacitor environment context (client-side)
    // However, this is a server action, so we can't check window.
    // For now, let's hardcode the production URL or localhost.
    // Ideally, pass a parameter to indicate source.

    if (process.env.NODE_ENV === 'production') {
        return 'https://learnify-rep1.vercel.app';
    }
    return 'http://localhost:3000';
}

export async function signInWithGithub() {
    const supabase = await createClient()

    // For mobile (Capacitor), we want to redirect to a custom scheme.
    // Since we can't easily detect "mobile" here without extra headers,
    // we will rely on the fact that if the user is on mobile, the browser won't open
    // unless we use a deep link.
    // OPTION: We can try to use a specific flow.
    // But for simplicity, let's just use the web flow but ensure the callback 
    // is caught by the intent filter if it matches the domain.
    // However, Supabase auth redirects to the site URL.

    // KEY FIX: Use the custom scheme for the redirect URL if possible.
    // But Supabase only allows redirects to URLs allowed in the dashboard.
    // The user needs to add `com.learnify.rep://auth/callback` to Supabase.

    // Let's assume the user will be on mobile
    // We can't know for sure here.
    // A better approach is to let the client call signInWithOAuth directly (client-side SDK),
    // but we are using server actions.

    // For now, let's stick to the web URL, but rely on the Android Intent Filter 
    // to intercept `https://learnify-rep1.vercel.app/auth/callback` if possible,
    // OR try to use `com.learnify.rep`.

    // The safest "universal" link approach is to use the production URL for callbacks,
    // and have the app intercept it.
    // ANDROID MANIFEST already has: <data android:scheme="https" android:host="learnify-rep1.vercel.app" />
    // So if the user clicks "Back to App" or if the redirect happens, it SHOULD open.

    // But often `localhost` fails.
    // So let's use the local IP for dev if strictly needed, but `localhost` inside the Android emulator
    // refers to the emulated device itself, not the host.
    // So `http://localhost:3000/auth/callback` will fail.

    let redirectUrl = `http://10.0.10.238:3000/auth/callback`; // Hardcoded local IP for dev
    if (process.env.NODE_ENV === 'production') {
        redirectUrl = `https://learnify-rep1.vercel.app/auth/callback`;
    }

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

    let redirectUrl = `http://10.0.10.238:3000/auth/callback`; // Hardcoded local IP for dev
    if (process.env.NODE_ENV === 'production') {
        redirectUrl = `https://learnify-rep1.vercel.app/auth/callback`;
    }

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

