'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { GoogleGenerativeAI } from '@google/generative-ai'

// === AUTH & SETTINGS ===

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, gemini_api_key')
        .eq('id', user.id)
        .single()

    // Attempt to seed profile if missing (resilience)
    if (!profile) return { full_name: user.user_metadata?.full_name || user.email, hasKey: false }

    return {
        full_name: profile.full_name || user.user_metadata?.full_name || user.email,
        hasKey: !!profile.gemini_api_key
    }
}

export async function updateProfile(data: { full_name?: string; gemini_api_key?: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const updates: any = { updated_at: new Date().toISOString() }
    if (data.full_name !== undefined) updates.full_name = data.full_name
    if (data.gemini_api_key !== undefined) updates.gemini_api_key = data.gemini_api_key

    const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...updates })

    if (error) throw error
    revalidatePath('/')
}

export async function deleteGeminiKey() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    await supabase.from('profiles').update({ gemini_api_key: null }).eq('id', user.id)

    // Also clear cookie for good measure if it exists
    const cookieStore = await cookies()
    cookieStore.delete('gemini_api_key')

    revalidatePath('/')
}

async function getApiKeyInternal() {
    // 1. Try DB
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data } = await supabase.from('profiles').select('gemini_api_key').eq('id', user.id).single()
        if (data?.gemini_api_key) return data.gemini_api_key
    }

    // 2. Try Cookie (Fallback)
    const cookieStore = await cookies()
    const cookieKey = cookieStore.get('gemini_api_key')?.value
    return cookieKey || null
}

// === SUBJECTS ===

export async function getSubjects() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching subjects:', error)
        return []
    }

    return data
}

export async function createSubject(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!title) throw new Error('Title is required')

    const { error } = await supabase
        .from('subjects')
        .insert({
            user_id: user.id,
            title,
            description,
        })

    if (error) {
        console.error('Error creating subject:', error)
        throw new Error('Failed to create subject')
    }

    revalidatePath('/')
}

export async function deleteSubject(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting subject:', error)
        throw new Error('Failed to delete subject')
    }

    revalidatePath('/')
}

export async function getSubject(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Authentication required. Please log in." }
    }

    // DEBUG: First try to find the subject IGNORING user_id to see if it exists at all
    const { data: globalSubject, error: globalError } = await supabase
        .from('subjects')
        .select('id, user_id, title')
        .eq('id', id)
        .single()

    if (globalError || !globalSubject) {
        return { error: `Subject ID ${id} does not exist in the database.` }
    }

    // Check ownership
    if (globalSubject.user_id !== user.id) {
        return { error: `Access Denied. Subject Owner: ${globalSubject.user_id}, Current User: ${user.id}` }
    }

    // If we get here, it exists and we own it. Fetch full data.
    return { data: globalSubject, error: null }
}

export async function getSubjectTopics(subjectId: string) {
    const supabase = await createClient()

    // Fetch Topics
    const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('subject_id', subjectId)

    if (topicsError) {
        console.error('Error fetching topics:', topicsError)
        return { nodes: [], edges: [] }
    }

    // Construct Nodes
    const nodes = topics.map(t => ({
        id: t.id,
        type: 'topicNode',
        position: { x: t.x || 0, y: t.y || 0 },
        data: {
            label: t.title,
            status: t.status,
            level: t.level
        }
    }))

    // Fetch Dependencies
    const { data: edgesData } = await supabase
        .from('topic_dependencies')
        .select('*')
        .in('parent_topic_id', topics.map(t => t.id))

    const edges = edgesData ? edgesData.map(e => ({
        id: `${e.parent_topic_id}-${e.child_topic_id}`,
        source: e.parent_topic_id,
        target: e.child_topic_id,
        animated: true,
        style: { stroke: '#2563eb' }
    })) : []

    return { nodes, edges }
}

export async function updateNodePosition(topicId: string, x: number, y: number) {
    const supabase = await createClient()

    await supabase
        .from('topics')
        .update({ x, y })
        .eq('id', topicId)
}

// === AI FEATURES ===

export async function generateTopics(subjectId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // 1. Get Subject Details
    const { data: subject } = await supabase.from('subjects').select('title, description').eq('id', subjectId).single()
    if (!subject) throw new Error('Subject not found')

    // 2. Get API Key
    const apiKey = await getApiKeyInternal()
    if (!apiKey) throw new Error('API Key missing. Please set it in Settings.')

    // 3. Call Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `
        Act as a **University Professor and Expert Curriculum Designer**.
        Create a **comprehensive, advanced-level knowledge graph** for the subject: "${subject.title}".
        Context: ${subject.description || "In-depth academic exploration."}
        
        Your goal is to structure a rigorous learning path that matches a top-tier university syllabus.
        
        Return a JSON object with a list of "topics" and their "dependencies".
        
        Requirements:
        1. "topics": Array of objects { "id": "t1", "title": "Topic Name", "description": "Academic summary", "level": "Beginner|Intermediate|Advanced|Expert", "x": 0, "y": 0 }
           - Generate **15-20** high-quality topics.
           - Ensure granular breakdown of complex concepts.
           - "x" and "y": Assign logical coordinates for a directed acyclic graph (DAG) layout. Flow from top (y=0) to bottom. Spread x for branches.
           - "id": Use simple strings like "t1", "t2".
        
        2. "dependencies": Array of objects { "from": "t1", "to": "t2" }
           - "from" is the prerequisite for "to".
           - Ensure a logical academic progression.
           - No circular dependencies.
        
        RETURN JSON ONLY. NO MARKDOWN.
    `

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        const jsonStr = text.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim()
        const data = JSON.parse(jsonStr)

        if (!data.topics || !Array.isArray(data.topics)) throw new Error('Invalid AI response')

        // 4. Insert into DB (Batch)
        const idMap = new Map<string, string>() // t1 -> uuid

        // Propagate UUIDs
        const topicsToInsert = data.topics.map((t: any) => {
            const uuid = crypto.randomUUID()
            idMap.set(t.id, uuid)
            return {
                id: uuid,
                subject_id: subjectId,
                title: t.title,
                description: t.description || "",
                level: t.level || 'Beginner',
                status: 'LOCKED',
                x: t.x || 0,
                y: t.y || 0
            }
        })

        // Identify Roots (No dependencies pointing TO them)
        const dependentTopicIds = new Set(data.dependencies.map((d: any) => d.to))

        topicsToInsert.forEach((t: any, idx: number) => {
            const originalId = data.topics[idx].id
            // If nothing depends on it? No, if nothing points TO it.
            if (!dependentTopicIds.has(originalId)) {
                t.status = 'AVAILABLE'
            }
        })

        const { error: insertError } = await supabase.from('topics').insert(topicsToInsert)
        if (insertError) throw insertError

        // Insert Dependencies
        if (data.dependencies && data.dependencies.length > 0) {
            const depsToInsert = data.dependencies.map((d: any) => ({
                parent_topic_id: idMap.get(d.from),
                child_topic_id: idMap.get(d.to)
            })).filter((d: any) => d.parent_topic_id && d.child_topic_id)

            if (depsToInsert.length > 0) {
                const { error: depsError } = await supabase.from('topic_dependencies').insert(depsToInsert)
                if (depsError) console.error("Error saving dependencies:", depsError)
            }
        }

        revalidatePath(`/subject/${subjectId}`)

    } catch (error: any) {
        console.error("AI Generation Error:", error)
        throw new Error(error.message || "Failed to generate curriculum.")
    }
}

export async function generateContent(topicId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // 1. Get Topic & Subject Context
    const { data: topic } = await supabase
        .from('topics')
        .select('*, subjects(title, description)')
        .eq('id', topicId)
        .single()

    if (!topic) throw new Error('Topic not found')

    // 2. Get API Key
    const apiKey = await getApiKeyInternal()
    if (!apiKey) throw new Error('API Key missing. Please set it in Settings.')

    // 3. Call Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `
        Act as a **Senior Subject Matter Expert**.
        Generate a **detailed, advanced-level lesson** for the topic: "${topic.title}".
        Subject: "${topic.subjects.title}".
        Context: "${topic.subjects.description}".
        Level: "${topic.level}".

        Return a JSON object with the following structure:
        {
            "overview": "Comprehensive academic introduction (3-5 sentences)",
            "real_world_applications": [
                { "title": "Application Area", "description": "How this concept applies to real-world engineering, business, or science." }
            ],
            "core_concepts": [
                { "title": "Concept Name", "explanation": "In-depth technical explanation", "example": "Complex example or case study" }
            ],
            "flowchart": {
                "nodes": [ { "id": "1", "label": "Start" } ],
                "edges": [ { "from": "1", "to": "2", "label": "next" } ]
            },
            "technical_deep_dive": {
                 "title": "Advanced Insight",
                 "content": "A paragraph explaining a nuance, edge case, or internal mechanism."
            },
            "common_mistakes": [ "Mistake 1", "Mistake 2" ],
            "practice_code": {
                "language": "python",
                "snippet": "def example():\n    return 'Hello'",
                "description": "Brief description of what this code does."
            },
            "summary": "Executive summary of key takeaways",
            "flashcards": [
                { "front": "Advanced Question?", "back": "Detailed Answer" }
            ]
        }
        
        Keep the tone professional, academic, and rigorous.
        RETURN JSON ONLY.
    `

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        const jsonStr = text.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim()
        const content = JSON.parse(jsonStr)

        // 4. Save Content
        const { error: saveError } = await supabase
            .from('topic_content')
            .upsert({
                topic_id: topicId,
                content_json: content
            })

        if (saveError) throw saveError

        // 5. Update Status
        await supabase
            .from('topics')
            .update({ status: 'GENERATED' })
            .eq('id', topicId)

        // 6. Save Flashcards
        if (content.flashcards) {
            const flashcardsToInsert = content.flashcards.map((f: any) => ({
                topic_id: topicId,
                front: f.front,
                back: f.back
            }))
            await supabase.from('flashcards').delete().eq('topic_id', topicId) // Clear old
            await supabase.from('flashcards').insert(flashcardsToInsert)
        }

        revalidatePath(`/learn/${topicId}`)
        return content

    } catch (error: any) {
        console.error("AI Content Generation Error:", error)
        throw new Error(error.message || "Failed to generate content.")
    }
}

export async function completeTopic(topicId: string) {
    const supabase = await createClient()

    // 1. Mark current as COMPLETED
    await supabase.from('topics').update({ status: 'COMPLETED' }).eq('id', topicId)

    // 1b. Update Streak
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const today = new Date().toISOString().split('T')[0]

        const { data: profile } = await supabase
            .from('profiles')
            .select('streak_count, last_active_date')
            .eq('id', user.id)
            .single()

        if (profile) {
            let newStreak = profile.streak_count || 0
            const lastActive = profile.last_active_date

            if (lastActive !== today) {
                const yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)
                const yesterdayStr = yesterday.toISOString().split('T')[0]

                if (lastActive === yesterdayStr) {
                    newStreak += 1
                } else {
                    newStreak = 1 // Broken streak or first time
                }

                await supabase.from('profiles').update({
                    streak_count: newStreak,
                    last_active_date: today
                }).eq('id', user.id)
            }
        }
    }

    // 2. Find children (topics that depend on this one)
    const { data: childrenLinks } = await supabase
        .from('topic_dependencies')
        .select('child_topic_id')
        .eq('parent_topic_id', topicId)

    if (childrenLinks && childrenLinks.length > 0) {
        for (const link of childrenLinks) {
            const childId = link.child_topic_id

            // Check if ALL parents of this child are completed
            const { data: parents } = await supabase
                .from('topic_dependencies')
                .select('parent_topic_id')
                .eq('child_topic_id', childId)

            const parentIds = parents?.map(p => p.parent_topic_id) || []

            const { count } = await supabase
                .from('topics')
                .select('*', { count: 'exact', head: true })
                .in('id', parentIds)
                .neq('status', 'COMPLETED') // Count how many parents are NOT completed

            // If count is 0, it means all parents are completed
            if (count === 0) {
                await supabase
                    .from('topics')
                    .update({ status: 'AVAILABLE' })
                    .eq('id', childId)
                    // Only update if it was LOCKED. Don't overwrite if already GENERATED/COMPLETED
                    .eq('status', 'LOCKED')
            }
        }
    }

    revalidatePath('/')
}

export async function chatWithTutor(topicId: string, messages: { role: string, content: string }[]) {
    const supabase = await createClient()

    // 1. Context
    const { data: topic } = await supabase.from('topics').select('*, subjects(title, description)').eq('id', topicId).single()
    if (!topic) throw new Error("Topic not found")

    // 2. API Key
    const apiKey = await getApiKeyInternal()
    if (!apiKey) throw new Error('API Key missing.')

    // 3. Gemini Chat
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Construct history for Gemini
    // Ensure roles are mapped correctly (user -> user, model -> model)
    const history = messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
    }))

    const lastMessage = messages[messages.length - 1].content

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{
                    text: `System Instruction: You are an expert AI Tutor for the topic: "${topic.title}" (Subject: ${topic.subjects.title}).
Context: ${topic.description}.
Level: ${topic.level}.
Your goal is to answer the user's questions about this topic clearly and concisely.
If they ask about something unrelated, politely steer them back to ${topic.title}.`
                }]
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am ready to help you learn about " + topic.title + "." }]
            },
            ...history
        ]
    })

    try {
        const result = await chat.sendMessage(lastMessage)
        const response = await result.response
        const text = response.text()
        return { role: 'model', content: text }
    } catch (e: any) {
        console.error("Chat Error:", e)
        return { role: 'model', content: "I'm having trouble connecting right now. Please check your API key or try again." }
    }
}

export async function generateQuiz(topicId: string) {
    const supabase = await createClient()

    // 1. Get Topic Details
    const { data: topic } = await supabase
        .from('topics')
        .select('*, subjects(*)')
        .eq('id', topicId)
        .single()

    if (!topic) throw new Error("Topic not found")

    // 2. Generate Quiz with Gemini
    const apiKey = await getApiKeyInternal()
    if (!apiKey) throw new Error("Gemini API key not configured")

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `
        Act as an expert tutor.
        Generate a short quiz for the topic: "${topic.title}".
        Subject: "${topic.subjects.title}".
        Context: "${topic.subjects.description}".

        Return a JSON object with a "questions" array (3-5 questions).
        Each question object must be:
        {
            "id": "q1",
            "question": "The actual question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A",
            "explanation": "Why this is correct."
        }

        RETURN JSON ONLY. NO MARKDOWN.
    `

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        const jsonStr = text.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim()
        const data = JSON.parse(jsonStr)

        if (!data.questions || !Array.isArray(data.questions)) throw new Error('Invalid AI response')

        return data.questions
    } catch (error) {
        console.error('Quiz Generation Error:', error)
        return null // Handle error gracefully on client
    }
}

export async function simplifyContent(text: string) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("Gemini API key not configured")

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `
        You are an expert teacher helping a student.
        Rewrite the following text to be "explained like I'm 5" (ELI5).
        Make it simple, using analogies where possible, but keep it accurate.
        Keep the formatting strictly plain text or simple markdown.

        Original Text:
        "${text}"
    `

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error("ELI5 Generation Error:", error)
        throw new Error("Failed to simplify content.")
    }
}

export async function getStreak() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { count: 0, active: false }

    const { data } = await supabase
        .from('profiles')
        .select('streak_count, last_active_date')
        .eq('id', user.id)
        .single()

    if (!data) return { count: 0, active: false }

    const today = new Date().toISOString().split('T')[0]
    const isActiveToday = data.last_active_date === today

    return {
        count: data.streak_count || 0,
        active: isActiveToday
    }
}


export async function incrementActivity(minutes: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]

    const { data: text } = await supabase
        .from('activity_logs')
        .select('minutes_active')
        .eq('user_id', user.id)
        .eq('activity_date', today)
        .single()

    const current = text ? text.minutes_active : 0

    await supabase.from('activity_logs').upsert({
        user_id: user.id,
        activity_date: today,
        minutes_active: current + minutes
    })
}

export async function getWeeklyActivity() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('activity_logs')
        .select('activity_date, minutes_active')
        .eq('user_id', user.id)
        .order('activity_date', { ascending: true })
        .limit(7)

    return data || []
}

export async function addTopic(subjectId: string, title: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    // Verify ownership
    const { data: subject } = await supabase
        .from('subjects')
        .select('id')
        .eq('id', subjectId)
        .eq('user_id', user.id)
        .single()

    if (!subject) throw new Error("Subject not found or access denied")

    const { error } = await supabase
        .from('topics')
        .insert({
            subject_id: subjectId,
            title: title,
            status: 'AVAILABLE'
        })

    if (error) throw error
    revalidatePath(`/subject/${subjectId}`)
}
// Link Topics Feature
export async function getTopicsSimple(subjectId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase
        .from('topics')
        .select('id, title, status')
        .eq('subject_id', subjectId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
}

export async function linkTopics(parentTopicId: string, childTopicId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    // Check circular dependency (Basic check: Parent != Child)
    if (parentTopicId === childTopicId) {
        throw new Error("Cannot link a topic to itself")
    }

    // TODO: Advanced circular check could be added here (A->B->A)

    const { error } = await supabase
        .from('topic_dependencies')
        .insert({
            parent_topic_id: parentTopicId,
            child_topic_id: childTopicId
        })

    if (error) {
        if (error.code === '23505') throw new Error("These topics are already linked")
        throw error
    }

    // Revalidate to update graph
    // We need subjectId to revalidate path... but we only have topicIds.
    // We can fetch it or just rely on client refresh. 
    // Ideally fetch subjectId.
    const { data: topic } = await supabase.from('topics').select('subject_id').eq('id', parentTopicId).single()
    if (topic) {
        revalidatePath(`/subject/${topic.subject_id}`)
    }
}
