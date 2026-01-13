import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, Sparkles, Zap, Globe } from 'lucide-react'

export function LandingHero({ isLoggedIn }: { isLoggedIn?: boolean }) {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
                <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-purple-500 opacity-10 blur-[120px]"></div>
            </div>

            <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl relative z-10">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-lg">L</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Learnify</span>
                    </div>
                    {isLoggedIn ? (
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-zinc-400 hover:text-white">
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" className="text-zinc-400 hover:text-white">
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </nav>

            <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Sparkles className="w-4 h-4" />
                    <span>The Future of Learning is Here</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    Turn Any Topic Into a <br />
                    <span className="text-blue-500">Mastery Graph</span>
                </h1>

                <p className="text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    Learnify uses advanced AI to break down complex subjects into structured knowledge graphs. Track your progress, quiz yourself, and master anything faster.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    {isLoggedIn ? (
                        <Link href="/dashboard">
                            <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/20 transition-all hover:scale-105">
                                Open Dashboard
                                <Brain className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/20 transition-all hover:scale-105">
                                Get Started for Free
                                <Zap className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    )}
                    <Link href="/login">
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white rounded-full">
                            View Demo
                        </Button>
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl text-left w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                    <FeatureCard
                        icon={<Brain className="w-6 h-6 text-blue-400" />}
                        title="AI Knowledge Graphs"
                        description="Automatically visualize connections between concepts to build a stronger mental model."
                    />
                    <FeatureCard
                        icon={<Zap className="w-6 h-6 text-purple-400" />}
                        title="Instant Consistency"
                        description="Generate flashcards, quizzes, and summaries that adapt to your verified API key."
                    />
                    <FeatureCard
                        icon={<Globe className="w-6 h-6 text-green-400" />}
                        title="Track Progress"
                        description="Monitor your mastery level across multiple subjects with detailed analytics."
                    />
                </div>

            </main>

            <footer className="border-t border-white/5 bg-black/50 backdrop-blur-xl py-8 relative z-10">
                <div className="container mx-auto px-6 text-center text-zinc-600 text-sm">
                    &copy; {new Date().getFullYear()} Learnify. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
            <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-zinc-400 leading-relaxed">{description}</p>
        </div>
    )
}
