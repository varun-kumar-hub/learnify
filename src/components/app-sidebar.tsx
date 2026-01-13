'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
    LayoutDashboard,
    Users,
    Settings,
    User,
    LogOut,
    Home,
    Menu,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions'

const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Community', href: '/dashboard/community', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function AppSidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Mobile Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 md:hidden text-white bg-zinc-900/50 backdrop-blur-md border border-white/10"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={cn(
                "flex flex-col py-6 h-screen z-50 transition-all duration-300 overflow-hidden",
                "bg-black/80 backdrop-blur-xl border-r border-white/10",
                // Mobile Styles
                "fixed top-0 left-0 w-64 shadow-2xl shadow-black",
                isOpen ? "translate-x-0" : "-translate-x-full",
                // Desktop Styles (Override Mobile)
                "md:sticky md:translate-x-0 md:top-0 md:w-20 md:hover:w-64 md:shadow-none"
            )}>

                {/* Mobile Close Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 md:hidden text-zinc-400 hover:text-white"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-5 w-5" />
                </Button>

                {/* Logo Area */}
                <div className="mb-8 flex items-center justify-center w-full px-4 md:group-hover:justify-start md:group-hover:px-6 mt-8 md:mt-0">
                    <div className="h-10 w-10 min-w-[2.5rem] bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 shrink-0">
                        <span className="font-bold text-xl text-white">L</span>
                    </div>
                    {/* Text: Visible on Mobile OR Desktop Hover */}
                    <span className={cn(
                        "ml-4 font-bold text-xl text-white transition-opacity duration-300 whitespace-nowrap",
                        "md:opacity-0 md:group-hover:opacity-100", // Desktop hover logic
                        "opacity-100" // Always visible on mobile drawer
                    )}>
                        Learnify
                    </span>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 w-full px-3 space-y-2 overflow-y-auto no-scrollbar">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)} // Close on navigate (mobile)
                            >
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full flex items-center justify-start h-12 px-3 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20"
                                            : "text-zinc-400 hover:text-white hover:bg-white/5",
                                        !isActive && "md:hover:pl-4"
                                    )}
                                >
                                    <item.icon className={cn("h-6 w-6 min-w-[1.5rem] shrink-0", isActive ? "text-blue-400" : "text-zinc-400")} />

                                    <span className={cn(
                                        "ml-4 font-medium transition-opacity duration-300 whitespace-nowrap",
                                        "md:opacity-0 md:group-hover:opacity-100", // Desktop hover
                                        "opacity-100", // Mobile always visible
                                        isActive ? "text-white" : "text-zinc-400"
                                    )}>
                                        {item.name}
                                    </span>
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="w-full px-3 mt-auto space-y-2">
                    <form action={async () => {
                        await logout()
                    }}>
                        <Button
                            variant="ghost"
                            className="w-full flex items-center justify-start h-12 px-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-950/20"
                        >
                            <LogOut className="h-6 w-6 min-w-[1.5rem] shrink-0" />
                            <span className={cn(
                                "ml-4 font-medium transition-opacity duration-300 whitespace-nowrap",
                                "md:opacity-0 md:group-hover:opacity-100",
                                "opacity-100"
                            )}>
                                Log Out
                            </span>
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}
