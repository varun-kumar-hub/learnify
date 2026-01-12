'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWeeklyActivity } from "@/app/actions"
import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function ActivityChart() {
    const [data, setData] = useState<{ activity_date: string, minutes_active: number }[]>([])
    const [totalMinutes, setTotalMinutes] = useState(0)

    useEffect(() => {
        getWeeklyActivity().then(logs => {
            // Format data for chart: Ensure last 7 days exist even if 0
            const filledData = []
            for (let i = 6; i >= 0; i--) {
                const d = new Date()
                d.setDate(d.getDate() - i)
                const dateStr = d.toISOString().split('T')[0]
                const log = logs.find((l: any) => l.activity_date === dateStr)
                filledData.push({
                    name: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    minutes: log ? log.minutes_active : 0
                })
            }
            setData(filledData)
            setTotalMinutes(logs.reduce((acc: number, curr: any) => acc + curr.minutes_active, 0))
        })
    }, [])

    return (
        <Card className="bg-zinc-900/50 border-white/10 h-full min-h-[300px]">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold">Weekly Activity</CardTitle>
                    <span className="text-xs text-zinc-500">Total: {totalMinutes} mins</span>
                </div>
            </CardHeader>
            <CardContent className="h-[200px] pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#52525b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#52525b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}m`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ fill: 'transparent' }}
                        />
                        <Bar
                            dataKey="minutes"
                            fill="#2563eb"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
