import { Button } from "@/components/ui/button"
import { Users } from 'lucide-react'

export default function CommunityPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent mb-2">Community</h1>
                    <p className="text-zinc-400">Discover and clone knowledge paths created by others</p>
                </div>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-zinc-500" />
                    </span>
                    <input
                        type="search"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all focus:w-80"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mock Community Items */}
                {[
                    { title: "matter in our surroundings", author: "Pullpaka Sanjana", clones: 19 },
                    { title: "Predictive Analytics", author: "G. Santhosh Reddy", clones: 46 },
                    { title: "Biology for Engineering", author: "G. Santhosh Reddy", clones: 20 },
                    { title: "Database Management System", author: "G. Santhosh Reddy", clones: 21 },
                    { title: "Microsoft Excel", author: "G. Santhosh Reddy", clones: 18 },
                    { title: "Copy of UI/UX Design Principles", author: "Leo", clones: 14 }
                ].map((item, i) => (
                    <div key={i} className="group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-blue-500/30 transition-all hover:bg-zinc-900/60">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
                            <span className="text-[10px] uppercase font-bold text-green-400 bg-green-950/30 px-2 py-0.5 rounded-full">Public</span>
                        </div>
                        <p className="text-zinc-500 text-sm mb-6 line-clamp-2">No description provided.</p>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                                    {item.author[0]}
                                </div>
                                <span className="text-xs text-zinc-400">{item.author}</span>
                            </div>

                            <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                                Clone
                            </Button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center text-xs text-zinc-500 gap-4">
                            <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                                {item.clones}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
