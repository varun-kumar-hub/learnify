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
            fontFamily: 'inherit'
        })
    }, [])

    useEffect(() => {
        const renderChart = async () => {
            if (!chart) return

            // Sanitize chart: fix unquoted labels with parentheses
            // Regex finds id[Text (Content)] and ensures quotes: id["Text (Content)"]
            const sanitizedChart = chart.replace(/\[([^"\]]*[\(\)][^"\]]*)\]/g, '["$1"]')

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
