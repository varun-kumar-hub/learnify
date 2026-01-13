import { Brain } from 'lucide-react'
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getSubjects, getProfile, getResumeTopic } from "@/app/actions";
import { SubjectCard } from "@/components/subject-card";
import { CreateSubjectModal } from "@/components/create-subject-modal";
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { StatsCards } from "@/components/stats-cards";
import { ActivityChart } from "@/components/activity-chart";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    const subjects = await getSubjects();
    const profile = await getProfile();
    const resumeTopic = await getResumeTopic();

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent mb-2">My Subjects</h1>
                    <p className="text-zinc-400">Manage your learning subjects and track progress</p>
                </div>
                <CreateSubjectModal />
            </div>

            {/* Continue Learning Section */}
            {resumeTopic && (
                <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-2xl p-6 flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium uppercase tracking-wider">
                            <Brain className="w-4 h-4" />
                            <span>Continue where you left off</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{resumeTopic.title}</h2>
                        <p className="text-zinc-400">In {resumeTopic.subjects.title}</p>
                    </div>
                    <Link href={`/dashboard/learn/${resumeTopic.id}`}>
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 shadow-lg shadow-blue-900/20">
                            Resume Lesson
                        </Button>
                    </Link>
                </div>
            )}

            {/* Subject Grid */}
            {subjects.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/5 space-y-4">
                    <div className="p-4 rounded-full bg-white/5">
                        <Brain className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <div className="text-center max-w-md px-4">
                        <h3 className="text-lg font-medium text-white">No subjects yet</h3>
                        <p className="text-zinc-400 text-sm mt-1 mb-6">
                            Start by creating a subject you want to master. We'll help you break it down into a map.
                        </p>
                        <CreateSubjectModal />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject.id}
                            id={subject.id}
                            title={subject.title}
                            description={subject.description}
                            createdAt={subject.created_at}
                            isPublic={subject.is_public}
                        />
                    ))}
                </div>
            )}

            {/* Statistics Section (Re-adding them as they fit well in the main dashboard) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                <div className="lg:col-span-1">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Total Study Time</h3>
                    {/* Simplified Stats Display */}
                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
                        <div className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                            <span className="font-mono">0h 0m</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Subject Progress</h3>
                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4">
                        {subjects.slice(0, 3).map(s => (
                            <div key={s.id} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-white">{s.title}</span>
                                    <span className="text-zinc-500">{s.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${s.progress}%` }} />
                                </div>
                            </div>
                        ))}
                        {subjects.length === 0 && <p className="text-zinc-500 text-sm">No progress recorded yet.</p>}
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-white/5">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Weekly Activity</h3>
                <ActivityChart />
            </div>
        </div>
    );
}
