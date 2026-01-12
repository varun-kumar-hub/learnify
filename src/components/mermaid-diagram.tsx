'use client'

import mermaid from 'mermaid'
import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'

export function MermaidDiagram({ chart }: { chart: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const [svg, setSvg] = useState<string>('')
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            fontFamily: 'inherit',
            suppressErrorRendering: true, // Attempt to suppress default error UI
        })
        mermaid.parseError = (err) => {
            // Suppress console error to avoid clutter, or just log clearly
            // console.warn("Mermaid Parse Error Suppressed:", err) 
        }
    }, [])

    useEffect(() => {
        const renderChart = async () => {
            if (!chart) return

            // Aggressive sanitization: quote ALL unquoted labels and escape inner quotes
            let sanitizedChart = chart.trim()

            // 1. Remove markdown wrappers if the AI accidentally included them
            sanitizedChart = sanitizedChart.replace(/^```mermaid\n?/, '').replace(/\n?```$/, '')

            // 2. Wrap all label contents in quotes if they aren't already, and escape internal quotes
            // This handles id[Label], id{Label}, id(Label)
            sanitizedChart = sanitizedChart
                .replace(/\[(?!"|#)([^\]\n]+)\]/g, (_, p1) => `["${p1.replace(/"/g, "'")}"]`)
                .replace(/\{(?!"|#)([^}\n]+)\}/g, (_, p1) => `{"${p1.replace(/"/g, "'")} "}`) // Added space to avoid {}} issues
                .replace(/\((?!"|#)([^)\n]+)\)/g, (_, p1) => `("${p1.replace(/"/g, "'")}")`)

            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
                // Configure strictly to prevent error injection into DOM
                mermaid.parseError = (err) => {
                    console.error("Mermaid Parse Error:", err)
                    setError(true)
                }
                const { svg } = await mermaid.render(id, sanitizedChart)
                setSvg(svg)
                setError(false)
            } catch (err) {
                console.error("Mermaid Render Error:", err)
                setError(true)
            }
        }

        renderChart()
    }, [chart])

    if (error) return null
    if (!svg) return <div className="h-40 flex items-center justify-center text-zinc-500"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Rendering Chart...</div>

    return (
        <div
            ref={ref}
            className="w-full overflow-x-auto p-4 bg-zinc-900/50 rounded-lg border border-white/5 flex justify-center"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    )
}
