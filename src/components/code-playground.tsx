"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Play, RotateCcw, Code2 } from "lucide-react"

interface CodePlaygroundProps {
    initialCode?: string
    language?: string
}

export function CodePlayground({ initialCode, language = "html" }: CodePlaygroundProps) {
    const defaultCode = initialCode || `<!-- Edit this code to see changes live -->
<h1>Hello!</h1>
<p>Start coding...</p>`

    const [code, setCode] = useState(defaultCode)
    const [srcDoc, setSrcDoc] = useState("")

    const isWebLanguage = ['html', 'css', 'javascript', 'js'].includes(language.toLowerCase())

    useEffect(() => {
        const isWeb = ['html', 'css', 'javascript', 'js'].includes(language.toLowerCase())
        if (isWeb) {
            const timeout = setTimeout(() => {
                setSrcDoc(code)
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [code, language])

    const handleReset = () => {
        setCode(defaultCode)
    }

    return (
        <Card className="bg-zinc-950/50 border-zinc-800 overflow-hidden">
            <CardHeader className="bg-zinc-900/50 border-b border-zinc-800 pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Code2 className="w-5 h-5 text-blue-400" />
                        Code Playground
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-zinc-400 hover:text-white">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 grid md:grid-cols-2 h-[500px]">
                {/* Editor */}
                <div className={isWebLanguage ? "border-r border-zinc-800 flex flex-col" : "col-span-2 flex flex-col"}>
                    <div className="bg-zinc-900 px-4 py-2 text-xs font-mono text-zinc-500 border-b border-zinc-800 uppercase">
                        {language}
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 w-full bg-zinc-950 p-4 font-mono text-sm text-zinc-300 resize-none focus:outline-none"
                        spellCheck={false}
                    />
                </div>

                {/* Preview (Only for Web Languages) */}
                {isWebLanguage && (
                    <div className="flex flex-col bg-white">
                        <div className="bg-zinc-100 px-4 py-2 text-xs font-mono text-zinc-500 border-b border-zinc-200">
                            Preview
                        </div>
                        <iframe
                            srcDoc={srcDoc}
                            title="output"
                            sandbox="allow-scripts"
                            frameBorder="0"
                            width="100%"
                            height="100%"
                            className="flex-1"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

