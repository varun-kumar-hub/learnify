'use client'

import { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createSubject } from '@/app/actions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Upload, CheckCircle2, Sparkles, Loader2 } from 'lucide-react'

export function CreateSubjectModal() {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [activeTab, setActiveTab] = useState("upload")
    const [file, setFile] = useState<File | null>(null)

    async function handleSubmit(formData: FormData) {
        if (activeTab === "upload" && file) {
            formData.append('file', file)
            // Title is optional for upload, handled by backend auto-title
        } else {
            // Manual mode: ensure file is cleared if any residue
            formData.delete('file')
        }

        startTransition(async () => {
            try {
                await createSubject(formData)
                setOpen(false)
                setFile(null)
                setActiveTab("upload") // Reset to default
            } catch (error) {
                console.error("Failed to create subject:", error)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                    <Plus className="h-5 w-5" />
                    Create New Subject
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle>Create Subject</DialogTitle>
                    <DialogDescription>
                        Start a new learning journey. Choose how to begin.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-zinc-900 border border-zinc-800">
                        <TabsTrigger value="upload" disabled={isPending} className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                            Upload Material
                        </TabsTrigger>
                        <TabsTrigger value="manual" disabled={isPending} className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                            Manual Entry
                        </TabsTrigger>
                    </TabsList>

                    <form action={handleSubmit}>
                        <TabsContent value="upload" className="space-y-4">
                            <div className={`grid gap-2 p-8 border-2 border-dashed rounded-xl transition-all text-center ${file ? 'border-green-500/50 bg-green-900/10' : 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700'}`}>
                                <Label htmlFor="file" className="cursor-pointer space-y-4">
                                    <div className="flex justify-center">
                                        <div className={`p-4 rounded-full ${file ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            {file ? <CheckCircle2 className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-lg font-semibold mb-1">
                                            {file ? file.name : "Drop your file here"}
                                        </span>
                                        <span className="text-sm text-zinc-500 block">
                                            {file ? "Ready to upload" : "PDF, DOCX, Images (PNG/JPG)"}
                                        </span>
                                    </div>
                                    <Input
                                        id="file"
                                        type="file"
                                        accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                </Label>
                            </div>

                            <div className="bg-blue-900/10 border border-blue-900/20 rounded-lg p-3 flex gap-3 text-blue-200/80 text-sm">
                                <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
                                <p>We'll automatically name the subject and generate topics from your file.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="manual" className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Subject Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="e.g., Quantum Physics"
                                    required={activeTab === "manual"}
                                    disabled={activeTab !== "manual"}
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Brief overview..."
                                    disabled={activeTab !== "manual"}
                                    className="bg-zinc-900 border-zinc-700 h-24"
                                />
                            </div>
                        </TabsContent>

                        <DialogFooter className="mt-6">
                            <Button type="submit" disabled={isPending || (activeTab === "upload" && !file)} className="w-full bg-blue-600 hover:bg-blue-500 h-10 text-base">
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {activeTab === 'upload' ? 'Analyzing File...' : 'Creating...'}
                                    </>
                                ) : (
                                    activeTab === 'upload' ? 'Generate from File' : 'Create Subject'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
