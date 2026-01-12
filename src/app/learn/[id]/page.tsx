import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { TopicViewer } from "@/components/topic-viewer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function LearnPage({ params }: { params: { id: string } }) {
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

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
                    <Link href={`/subject/${topic.subject_id}`} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <span className="font-semibold text-sm text-zinc-400 uppercase tracking-widest">
                        {topic.status}
                    </span>
                </div>
            </header>

            <main className="pt-24 px-6">
                <TopicViewer topic={topic} content={content?.content_json} />
            </main>
        </div>
    )
}
