"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function GlobalBackground() {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        setMounted(true)
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY })
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            {/* Layer 1: Base Color */}
            <div className="absolute inset-0 bg-background transition-colors duration-500" />

            {/* Layer 2: Base Dot Grid Pattern (Minor) - High Visibility */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 dark:opacity-40 translate-z-0" />

            {/* Layer 2.5: Large Grid Pattern (Major) - Bold Structure */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:96px_96px] opacity-50 dark:opacity-50 translate-z-0" />

            {/* Layer 3: Mouse Follower Spotlight (Brighter) */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--glow-color), transparent 40%)`,
                }}
            />

            {/* Layer 4: Static Highlights (Vivid & Defined) */}
            <div className="absolute left-[5%] top-[5%] -z-10 h-[600px] w-[600px] rounded-full bg-sky-500/40 blur-[100px] dark:bg-sky-500/30 animate-pulse transition-all duration-1000" />
            <div className="absolute right-[5%] bottom-[15%] -z-10 h-[500px] w-[500px] rounded-full bg-violet-500/40 blur-[80px] dark:bg-violet-500/30 animate-pulse delay-1000 transition-all duration-1000" />
            <div className="absolute left-[15%] bottom-[5%] -z-10 h-[400px] w-[400px] rounded-full bg-teal-500/40 blur-[80px] dark:bg-teal-500/30 animate-pulse delay-700 transition-all duration-1000" />
        </div>
    )
}
