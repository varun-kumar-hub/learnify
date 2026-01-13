'use client'

import { useState, useTransition, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getProfile, updateProfile } from '@/app/actions'
import { Loader2, User } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProfilePage() {
    const [name, setName] = useState('')
    const [occupation, setOccupation] = useState('')
    const [educationLevel, setEducationLevel] = useState('undergrad')
    const [learningStyle, setLearningStyle] = useState('visual')
    const [learningSchedule, setLearningSchedule] = useState('few')
    const [isPending, startTransition] = useTransition()

    // Load initial data
    useEffect(() => {
        getProfile().then(p => {
            if (p) {
                setName(p.full_name)
                setOccupation(p.occupation || '')
                setEducationLevel(p.education_level || 'undergrad')
                setLearningStyle(p.learning_style || 'visual')
                setLearningSchedule(p.learning_schedule || 'few')
            }
        })
    }, [])

    function handleSave() {
        startTransition(async () => {
            await updateProfile({
                full_name: name,
                occupation,
                education_level: educationLevel,
                learning_style: learningStyle,
                learning_schedule: learningSchedule
            })
        })
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold bg-blue-600 shadow-xl shadow-blue-900/20">
                    <User className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">Your Profile</h1>
                    <p className="text-zinc-400">Tell us about yourself to get personalized learning paths</p>
                </div>
            </div>

            <div className="grid gap-8">
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 space-y-8">

                    {/* Personal Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider">
                            <User className="h-4 w-4" />
                            Personal Details
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    placeholder="Enter your name"
                                    className="bg-zinc-950 border-zinc-800 h-12"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Occupation</Label>
                                <Input
                                    placeholder="Student, Professional, etc."
                                    className="bg-zinc-950 border-zinc-800 h-12"
                                    value={occupation}
                                    onChange={(e) => setOccupation(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* Education Style */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider">
                            <BrainIcon className="h-4 w-4" />
                            Education & Learning Style
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Education Level</Label>
                                <Select value={educationLevel} onValueChange={setEducationLevel}>
                                    <SelectTrigger className="bg-zinc-950 border-zinc-800 h-12">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hs">High School</SelectItem>
                                        <SelectItem value="undergrad">Undergraduate</SelectItem>
                                        <SelectItem value="grad">Graduate</SelectItem>
                                        <SelectItem value="pro">Professional</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Preferred Learning Style</Label>
                                <Select value={learningStyle} onValueChange={setLearningStyle}>
                                    <SelectTrigger className="bg-zinc-950 border-zinc-800 h-12">
                                        <SelectValue placeholder="Select style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="visual">Visual (Images, Diagrams)</SelectItem>
                                        <SelectItem value="text">Textual (Reading)</SelectItem>
                                        <SelectItem value="kinesthetic">Interactive (Doing)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Typical Learning Schedule</Label>
                            <Select value={learningSchedule} onValueChange={setLearningSchedule}>
                                <SelectTrigger className="bg-zinc-950 border-zinc-800 h-12">
                                    <SelectValue placeholder="Select schedule" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="few">Few times a week</SelectItem>
                                    <SelectItem value="weekend">Weekends only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            className="bg-white text-black hover:bg-zinc-200 h-12 px-8 font-bold rounded-xl"
                            onClick={handleSave}
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="animate-spin mr-2" />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BrainIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
            <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
            <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
            <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
            <path d="M6 18a4 4 0 0 1-1.97-3.29" />
            <path d="M19.97 14.71a4 4 0 0 1-1.97 3.29" />
        </svg>
    )
}
