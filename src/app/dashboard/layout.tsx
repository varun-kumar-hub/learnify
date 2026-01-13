import { AppSidebar } from "@/components/app-sidebar"
import { SpotlightBg } from "@/components/ui/spotlight-bg"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-black text-white relative">
            <SpotlightBg />

            <AppSidebar />

            <main className="flex-1 relative z-10 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    )
}
