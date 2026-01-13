import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
        console.log("Exchanging code for session...");
        const cookieStore = await cookies();

        // Prepare to capture cookies
        let responseCookies: { name: string, value: string, options: CookieOptions }[] = [];

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        // Capture cookies to set on the response later
                        responseCookies = cookiesToSet;

                        // Also try to set on request store just in case downstream needs it (though read-only often)
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch (e) {
                            // Ignored: Read-only in Route Handlers
                        }
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            console.log("Session exchange successful.");
            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocalEnv = process.env.NODE_ENV === "development";
            let redirectUrl = `${origin}${next}`;

            if (isLocalEnv) {
                redirectUrl = `${origin}${next}`;
            } else if (forwardedHost) {
                redirectUrl = `https://${forwardedHost}${next}`;
            } else {
                // Force HTTPS in production if falling back to origin
                const secureOrigin = origin.replace('http://', 'https://');
                redirectUrl = `${secureOrigin}${next}`;
            }

            // Create the response object
            const response = NextResponse.redirect(redirectUrl);

            // Apply the captured cookies to the response
            responseCookies.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
            });

            return response;

        } else {
            console.error("Auth Callback Error:", error);
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`);
        }
    }

    console.error("Auth Callback Missing Code");
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=missing_code`);
}
