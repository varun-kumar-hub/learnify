import { AppSidebar } from "@/components/app-sidebar"
import { DashboardAssistant } from "@/components/dashboard-assistant"
import { getProfile } from "@/app/actions"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const profile = await getProfile()

    return (
        <div className="flex min-h-screen relative">
            <AppSidebar />

            <main className="flex-1 relative z-10 overflow-y-auto h-screen w-full">
                <div className="container-fix py-8 max-w-[100vw] overflow-x-hidden text-left">
                    {children}
                </div>
            </main>

            <DashboardAssistant hasApiKey={profile?.hasKey} />
        </div>
    )
}
