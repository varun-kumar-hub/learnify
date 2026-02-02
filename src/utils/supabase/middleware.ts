import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // CRITICAL FIX: Check for session cookies instead of making API calls
    // This prevents 504 Gateway Timeouts by avoiding network requests in middleware
    const accessToken = request.cookies.get('sb-access-token')
    const refreshToken = request.cookies.get('sb-refresh-token')

    // Check for any Supabase auth cookie patterns (different naming in production)
    const hasSupabaseSession = request.cookies.getAll().some(cookie =>
        cookie.name.includes('sb-') && cookie.name.includes('-auth-token')
    )

    const isAuthenticated = accessToken || refreshToken || hasSupabaseSession

    // Define public routes that don't require authentication
    const isPublicRoute =
        request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup') ||
        request.nextUrl.pathname.startsWith('/auth') ||
        request.nextUrl.pathname.startsWith('/android')

    // Redirect unauthenticated users to login
    if (!isAuthenticated && !isPublicRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Refresh session in the background (returns immediately)
    // This ensures tokens are kept fresh without blocking the request
    try {
        await supabase.auth.getSession()
    } catch (error) {
        // Silently fail - user will be prompted to re-login on next page load
        console.error('[Middleware] Session refresh error:', error)
    }

    return supabaseResponse
}
