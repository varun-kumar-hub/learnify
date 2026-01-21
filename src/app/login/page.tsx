import { login, signInWithGithub, signInWithGoogle } from './actions'
import { Button } from "@/components/ui/button"
import { LoginButtons } from "./login-buttons"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, Github } from "lucide-react"
import Link from "next/link"

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    const params = await searchParams
    return (
        <div className="flex min-h-screen items-center justify-center bg-black/95 p-4">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <Card className="w-full max-w-sm border-zinc-800 bg-zinc-950/50 backdrop-blur-xl relative z-10 shadow-2xl shadow-blue-900/20">
                <CardHeader className="space-y-1 text-center relative">
                    <div className="absolute left-2 top-2">
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                ← Back
                            </Button>
                        </Link>
                    </div>
                    <div className="flex justify-center mb-4 pt-8">
                        <div className="p-3 rounded-full bg-blue-600/10 ring-1 ring-blue-600/30">
                            <Brain className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-white">Welcome back</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Enter your credentials to access your knowledge graph
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-300">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                suppressHydrationWarning
                                className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-blue-600"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-zinc-300">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                suppressHydrationWarning
                                className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-blue-600"
                            />
                        </div>
                        {params.error && (
                            <div className="text-red-400 text-sm text-center">
                                {params.error}
                            </div>
                        )}
                        <Button formAction={login} className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg shadow-blue-900/20">
                            Sign In
                        </Button>

                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-950 px-2 text-zinc-400">Or continue with</span></div>

                        <LoginButtons />
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <span className="text-zinc-400">Don&apos;t have an account? </span>
                        <Link href="/signup" className="text-blue-500 hover:text-blue-400 hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center text-sm text-zinc-500">
                    <p>By continuing, you agree to our Terms of Service.</p>
                </CardFooter>
            </Card>
        </div >
    )
}
