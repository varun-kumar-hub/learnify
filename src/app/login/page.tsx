import { login, signInWithGithub, signInWithGoogle } from './actions'
import { Button } from "@/components/ui/button"
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
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
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

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-950 px-2 text-zinc-400">Or continue with</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Button formAction={signInWithGithub} formNoValidate variant="outline" className="w-full border-zinc-800 hover:bg-zinc-900 text-white bg-zinc-900">
                                <Github className="mr-2 h-4 w-4" /> Github
                            </Button>
                            <Button formAction={signInWithGoogle} formNoValidate variant="outline" className="w-full border-zinc-800 hover:bg-zinc-900 text-white bg-zinc-900">
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                Google
                            </Button>
                        </div>
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
        </div>
    )
}
