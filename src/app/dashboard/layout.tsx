import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen relative">
            <AppSidebar />

            <main className="flex-1 relative z-10 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    )
}
