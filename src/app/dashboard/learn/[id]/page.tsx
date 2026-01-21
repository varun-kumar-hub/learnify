import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { TopicViewer } from "@/components/topic-viewer"
import { getProfile } from "@/app/actions"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function LearnPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: topic } = await supabase
        .from('topics')
        .select('*')
        .eq('id', id)
        .single()

    if (!topic) redirect('/dashboard')

    const { data: content } = await supabase
        .from('topic_content')
        .select('content_json')
        .eq('topic_id', id)
        .single()

    // Fetch profile for API key check
    const profile = await getProfile()
    const hasApiKey = profile?.hasKey || false

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
                    <Link href={`/dashboard/subject/${topic.subject_id}`}>
                        <Button variant="ghost" className="text-zinc-400 hover:text-white pl-0 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="font-semibold text-sm uppercase tracking-widest">Go Back</span>
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="pt-24 px-6">
                <TopicViewer topic={topic} content={content?.content_json} hasApiKey={hasApiKey} />
            </main>
        </div>
    )
}
