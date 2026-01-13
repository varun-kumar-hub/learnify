import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    if (code) {
        const supabase = await createClient();
        console.log("Exchanging code for session...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            console.log("Session exchange successful.");
            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocalEnv = process.env.NODE_ENV === "development";

            if (isLocalEnv) {
                console.log("Redirecting for Local Env");
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                console.log("Redirecting for Forwarded Host:", forwardedHost);
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                console.log("Redirecting for Origin (Forced HTTPS):", origin);
                // Force HTTPS in production if falling back to origin
                const secureOrigin = origin.replace('http://', 'https://');
                return NextResponse.redirect(`${secureOrigin}${next}`);
            }
        } else {
            console.error("Auth Callback Error:", error);
            return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`);
        }
    }

    console.error("Auth Callback Missing Code");
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=missing_code`);
}
