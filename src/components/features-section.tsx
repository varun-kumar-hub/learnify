import { Brain, Network, TrendingUp } from "lucide-react"

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 relative z-10">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
                        Everything you need to <span className="text-blue-500">excel</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We use spaced repetition algorithms to create the ultimate learning engine.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard
                        icon={<Brain className="w-8 h-8 text-white" />}
                        title="Instant Roadmap"
                        description="Don't waste time planning. Get a tailored curriculum that adapts to your goals instantly."
                    />
                    <FeatureCard
                        icon={<Network className="w-8 h-8 text-white" />}
                        title="Knowledge Explorer"
                        description="Navigate through concepts visually. See how ideas connect rather than just memorizing lists."
                    />
                    <FeatureCard
                        icon={<TrendingUp className="w-8 h-8 text-white" />}
                        title="Active Recall Engine"
                        description="Our smart algorithms predict exactly when you're about to forget and quiz you to lock it in."
                    />
                </div>
            </div>
        </section>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="group p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 hover:bg-zinc-900/80 transition-all duration-300">
            <div className="mb-6 inline-flex p-4 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-zinc-400 leading-relaxed">{description}</p>
        </div>
    )
}
