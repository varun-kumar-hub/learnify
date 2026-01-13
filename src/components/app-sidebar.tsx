'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Users,
    Settings,
    User,
    LogOut,
    Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions'

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Community', href: '/dashboard/community', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex bg-black/50 backdrop-blur-xl border-r border-white/10 w-20 flex-col items-center py-6 h-screen sticky top-0 left-0 z-40 transition-all duration-300 hover:w-64 group overflow-hidden">

            {/* Logo Area */}
            <div className="mb-8 flex items-center justify-center w-full px-4 group-hover:justify-start group-hover:px-6">
                <div className="h-10 w-10 min-w-[2.5rem] bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <span className="font-bold text-xl text-white">L</span>
                </div>
                <span className="ml-4 font-bold text-xl text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Learnify
                </span>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 w-full px-3 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.name} href={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full flex items-center justify-start h-12 px-3 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-400 hover:bg-blue-600/20"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5",
                                    !isActive && "hover:pl-4"
                                )}
                            >
                                <item.icon className={cn("h-6 w-6 min-w-[1.5rem]", isActive ? "text-blue-400" : "text-zinc-400")} />

                                <span className={cn(
                                    "ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap",
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
                <Link href="/">
                    <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start h-12 px-3 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5"
                    >
                        <Home className="h-6 w-6 min-w-[1.5rem]" />
                        <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Home
                        </span>
                    </Button>
                </Link>

                <form action={logout}>
                    <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start h-12 px-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-950/20"
                    >
                        <LogOut className="h-6 w-6 min-w-[1.5rem]" />
                        <span className="ml-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Log Out
                        </span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
