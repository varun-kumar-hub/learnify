import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Brain, Sparkles, Zap, Globe, Layers, Cpu } from 'lucide-react'

export function LandingHero({ isLoggedIn }: { isLoggedIn?: boolean }) {
    return (
        <div className="min-h-screen text-foreground selection:bg-blue-500/30 overflow-hidden relative">
            {/* 
                BACKGROUND NOTE:
                The actual visual background is handled by GlobalBackground in the root layout.
                This container is transparent to let it show through.
            */}

            {/* Floating Pill Navbar */}
            <nav className="sticky top-6 inset-x-0 z-50 mx-auto max-w-5xl px-6 h-16 rounded-full border border-border/50 bg-background/70 backdrop-blur-xl shadow-lg shadow-black/5 flex items-center justify-between transition-all duration-300">
                {/* Left: Branding */}
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                        <span className="font-bold text-lg text-primary">L</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Learnify</span>
                </div>

                {/* Center: Navigation Links (Desktop) */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                    <a href="#methodology" className="hover:text-foreground transition-colors">Methodology</a>
                    <ThemeToggle />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Mobile Toggle (only visible on small screens to replace center links) */}
                    <div className="md:hidden">
                        <ThemeToggle />
                    </div>

                    {isLoggedIn ? (
                        <Link href="/dashboard">
                            <Button className="rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 px-6">
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button className="rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 px-6">
                                Get Started
                            </Button>
                        </Link>
                    )}
                </div>
            </nav>

            <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Sparkles className="w-4 h-4" />
                    <span>The Future of Learning is Here</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-5xl bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 drop-shadow-sm">
                    Turn Any Topic Into a <br />
                    <span className="text-blue-600 dark:text-blue-500">Structured Knowledge Graph</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    Stop random studying. Learnify uses advanced AI to break down complex subjects into interconnected nodes, instant quizzes, and mastery paths.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    {isLoggedIn ? (
                        <Link href="/dashboard">
                            <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                                Go to Dashboard
                                <Brain className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                                Start Learning Free
                                <Zap className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center p-1">
                        <div className="w-1 h-3 bg-muted-foreground/50 rounded-full" />
                    </div>
                </div>

            </main>

            <footer className="border-t border-border/40 bg-background/50 backdrop-blur-xl py-8 relative z-10">
                <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
                    &copy; {new Date().getFullYear()} Learnify. Engineered for Mastery.
                </div>
            </footer>
        </div >
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-card/40 border border-border/50 hover:border-primary/20 hover:bg-card/60 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="mb-4 p-3 bg-primary/10 rounded-xl w-fit">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
        </div>
    )
}
