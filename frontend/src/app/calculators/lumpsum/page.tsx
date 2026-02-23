"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Wallet, TrendingUp } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function LumpsumPage() {
    const [investment, setInvestment] = useLocalStorage("lump_inv", 500000)
    const [rate, setRate] = useLocalStorage("lump_rate", 12)
    const [years, setYears] = useLocalStorage("lump_years", 10)

    // A = P(1 + r/n)^nt --> Annual compounding
    const totalValue = Math.round(investment * Math.pow((1 + rate / 100), years))
    const wealthGained = totalValue - investment

    const chartData = [
        { name: "Invested", value: investment, color: "#94a3b8" },
        { name: "Gain", value: wealthGained, color: "#22c55e" }
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Lumpsum Calculator</h1>
                        <p className="text-muted-foreground">Calculate returns on your one-time investment.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Investment Details</CardTitle></CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <Label>Total Investment (₹)</Label>
                                <Input type="number" value={investment} onChange={e => setInvestment(Number(e.target.value))} className="text-lg font-bold" />
                                <Slider value={[investment]} min={5000} max={10000000} step={5000} onValueChange={v => setInvestment(v[0])} />
                            </div>

                            <div className="space-y-4">
                                <Label>Expected Return (% p.a)</Label>
                                <div className="flex gap-4">
                                    <Slider value={[rate]} min={4} max={30} step={0.5} onValueChange={v => setRate(v[0])} className="flex-1" />
                                    <span className="font-bold w-12 text-right">{rate}%</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Time Period (Years)</Label>
                                <div className="flex gap-4">
                                    <Slider value={[years]} min={1} max={40} step={1} onValueChange={v => setYears(v[0])} className="flex-1" />
                                    <span className="font-bold w-12 text-right">{years} Yr</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Growth Summary</CardTitle></CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <div className="grid grid-cols-2 gap-4 w-full mb-6">
                                <div className="p-4 bg-slate-900 text-white rounded-xl col-span-2 text-center">
                                    <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Maturity Value</div>
                                    <div className="text-3xl font-bold">₹{totalValue.toLocaleString('en-IN')}</div>
                                </div>
                            </div>

                            <div className="h-[250px] w-full">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`} />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="w-full mt-4 p-4 bg-green-50 rounded-lg flex justify-between items-center text-green-800">
                                <span className="font-medium">Total Wealth Gained</span>
                                <span className="text-xl font-bold">+₹{wealthGained.toLocaleString('en-IN')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
