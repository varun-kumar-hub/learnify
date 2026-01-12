import { Brain } from 'lucide-react'
import { createClient } from "@/utils/supabase/server";
import { GeminiKeyModal } from "@/components/gemini-key-modal";
import { redirect } from "next/navigation";
import { getSubjects, getProfile } from "./actions";
import { SubjectCard } from "@/components/subject-card";
import { CreateSubjectModal } from "@/components/create-subject-modal";
import { HeaderActions } from "@/components/header-actions";
import { SettingsDialog } from "@/components/settings-dialog";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const subjects = await getSubjects();
  const profile = await getProfile();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 pb-20">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Learnify</span>
          </div>

          <div className="flex items-center gap-4">
            <HeaderActions profile={profile} email={user.email || ''} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent mb-2">Your Subjects</h1>
            <p className="text-zinc-400">Manage your learning paths and knowledge graphs.</p>
          </div>
          <CreateSubjectModal />
        </div>

        {/* Key Modal handled by Settings now, but if we want to force prompt if missing, we could reuse it or rely on empty state/error handling. Steps did not require force prompt. */}

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
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
