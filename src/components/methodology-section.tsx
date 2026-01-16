import Image from "next/image"

export function MethodologySection() {
    return (
        <section id="methodology" className="py-24 relative z-10 overflow-hidden">
            {/* Background Elements to connect with GlobalBackground */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent mb-6">
                        Structured for Success
                    </h2>
                </div>

                <div className="space-y-24 max-w-6xl mx-auto">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                        <div className="w-full md:flex-1 space-y-6 text-left">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 font-bold text-xl mb-2">01</div>
                            <h3 className="text-3xl font-bold text-foreground">Declare Intent</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Simply tell Learnify what you want to master. No rigid syllabus—just your goal and our intelligence.
                            </p>
                        </div>
                        <div className="w-full md:flex-1 relative group">
                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full -z-10 group-hover:bg-blue-500/30 transition-colors duration-500" />
                            <div className="relative aspect-video w-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl p-2">
                                <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted/20">
                                    <Image
                                        src="/landing/methodology_goal.png"
                                        alt="Declare Intent"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 500px"
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
                        <div className="w-full md:flex-1 space-y-6 text-left">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 font-bold text-xl mb-2">02</div>
                            <h3 className="text-3xl font-bold text-foreground">Visual Synthesis</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Watch as we break the topic into atomic concepts and map their relationships. See the forest <i>and</i> the trees.
                            </p>
                        </div>
                        <div className="w-full md:flex-1 relative group">
                            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full -z-10 group-hover:bg-purple-500/30 transition-colors duration-500" />
                            <div className="relative aspect-video w-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl p-2">
                                <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted/20">
                                    <Image
                                        src="/landing/methodology_graph.png"
                                        alt="Visual Synthesis"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 500px"
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                        <div className="w-full md:flex-1 space-y-6 text-left">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xl mb-2">03</div>
                            <h3 className="text-3xl font-bold text-foreground">Permanent Storage</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Convert temporary understanding into long-term memory through our adaptive quiz engine. Never forget what you learn.
                            </p>
                        </div>
                        <div className="w-full md:flex-1 relative group">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full -z-10 group-hover:bg-emerald-500/30 transition-colors duration-500" />
                            <div className="relative aspect-video w-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl p-2">
                                <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted/20">
                                    <Image
                                        src="/landing/methodology_retention.png"
                                        alt="Permanent Storage"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 500px"
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
