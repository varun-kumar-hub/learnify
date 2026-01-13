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

            {/* Layer 2: Dot Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-100 dark:opacity-40 transition-opacity duration-500" />

            {/* Layer 3: Mouse Follower Spotlight */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--glow-color), transparent 40%)`,
                }}
            />

            {/* Layer 4: Static Highlights */}
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[80vw] max-w-[1000px] rounded-full bg-[var(--primary)] opacity-10 blur-[100px] dark:opacity-20 dark:blur-[120px] transition-all duration-700" />
            <div className="absolute right-0 bottom-0 -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/20 blur-[120px] opacity-20 dark:opacity-10 transition-all duration-700" />
        </div>
    )
}
