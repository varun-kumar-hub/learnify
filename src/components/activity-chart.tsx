import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ActivityChart() {
    return (
        <Card className="bg-zinc-900/50 border-white/10 h-full min-h-[300px]">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold">Weekly Activity</CardTitle>
                    <span className="text-xs text-zinc-500">Total: 0 mins</span>
                </div>
            </CardHeader>
            <CardContent className="flex items-end justify-center h-[200px] pb-4">
                <div className="text-zinc-600 text-sm">
                    No activity recorded yet
                </div>
            </CardContent>
        </Card>
    )
}
