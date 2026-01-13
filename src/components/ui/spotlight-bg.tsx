'use client';

import React, { useEffect, useRef, useState } from 'react';

export function SpotlightBg() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none -z-10 bg-black overflow-hidden"
        >
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
                    backgroundSize: `40px 40px`,
                }}
            />

            {/* Spotlight Logic */}
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
                }}
            />
        </div>
    );
}
