"use client"

import { useState, useEffect } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, DollarSign } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function SIPCalculatorPage() {
    const [monthlyInvestment, setMonthlyInvestment] = useLocalStorage("sip_amount", 5000)
    const [rate, setRate] = useLocalStorage("sip_rate", 12)
    const [years, setYears] = useLocalStorage("sip_years", 10)
    const [stepUp, setStepUp] = useLocalStorage("sip_stepup", 0) // Annual increase %

    // Calculation Logic
    const calculateSIP = () => {
        let invested = 0
        let currentMonthVal = 0
        const monthlyRate = rate / 12 / 100
        const data = []

        let currentSipAmount = monthlyInvestment

        for (let i = 1; i <= years; i++) {
            // For each month in this year
            for (let m = 0; m < 12; m++) {
                invested += currentSipAmount
                currentMonthVal = (currentMonthVal + currentSipAmount) * (1 + monthlyRate)
            }

            data.push({
                year: `Year ${i}`,
                invested: Math.round(invested),
                wealth: Math.round(currentMonthVal)
            })

            // Apply step-up for next year
            if (stepUp > 0) {
                currentSipAmount += (currentSipAmount * stepUp / 100)
            }
        }

        return { totalInvested: Math.round(invested), totalValue: Math.round(currentMonthVal), chartData: data }
    }

    const { totalInvested, totalValue, chartData } = calculateSIP()
    const wealthGained = totalValue - totalInvested

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Smart SIP Calculator</h1>
                        <p className="text-muted-foreground">Plan your wealth with Step-Up capability.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Inputs */}
                    <Card className="lg:col-span-4 h-fit">
                        <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Monthly Investment (₹)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="number"
                                        value={monthlyInvestment}
                                        onChange={e => setMonthlyInvestment(Number(e.target.value))}
                                        className="pl-9 text-lg font-semibold"
                                    />
                                </div>
                                <Slider value={[monthlyInvestment]} min={500} max={100000} step={500} onValueChange={v => setMonthlyInvestment(v[0])} />
                            </div>

                            <div className="space-y-2">
                                <Label>Expected Return (Annually %)</Label>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>FD (6%)</span>
                                    <span>Debt (8%)</span>
                                    <span>Equity (12%)</span>
                                    <span>High Risks (18%)</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Slider value={[rate]} min={4} max={30} step={0.5} onValueChange={v => setRate(v[0])} className="flex-1" />
                                    <div className="w-16 font-bold text-right">{rate}%</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Time Period (Years)</Label>
                                <div className="flex items-center gap-4">
                                    <Slider value={[years]} min={1} max={40} step={1} onValueChange={v => setYears(v[0])} className="flex-1" />
                                    <div className="w-16 font-bold text-right">{years} Yr</div>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="flex justify-between items-center mb-2">
                                    <Label className="text-indigo-600 font-semibold">Step-Up SIP (Optional)</Label>
                                    <Badge variant="outline">{stepUp}% Yearly Increase</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">Increase your investment automatically every year as your income grows.</p>
                                <div className="flex items-center gap-4">
                                    <Slider value={[stepUp]} min={0} max={20} step={1} onValueChange={v => setStepUp(v[0])} className="flex-1" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    <Card className="lg:col-span-8 flex flex-col">
                        <CardHeader><CardTitle>Projected Growth</CardTitle></CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="text-sm text-gray-500">Invested Amount</div>
                                    <div className="text-xl font-bold text-slate-700">₹{totalInvested.toLocaleString('en-IN')}</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <div className="text-sm text-green-600">Wealth Gained</div>
                                    <div className="text-xl font-bold text-green-700">+₹{wealthGained.toLocaleString('en-IN')}</div>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 shadow-sm">
                                    <div className="text-sm text-indigo-600">Total Value</div>
                                    <div className="text-2xl font-bold text-indigo-700">₹{totalValue.toLocaleString('en-IN')}</div>
                                </div>
                            </div>

                            <div className="h-[400px] w-full mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="year" />
                                        <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <Tooltip
                                            formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="invested" stackId="1" stroke="#94a3b8" fill="url(#colorInvested)" name="Invested Amount" />
                                        <Area type="monotone" dataKey="wealth" stackId="2" stroke="#4f46e5" fill="url(#colorWealth)" name="Total Value" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
