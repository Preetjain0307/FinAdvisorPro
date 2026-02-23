"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Banknote, TrendingDown } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function SWPCalculatorPage() {
    const [corpus, setCorpus] = useLocalStorage("swp_corpus", 5000000)
    const [withdrawal, setWithdrawal] = useLocalStorage("swp_withdrawal", 25000)
    const [rate, setRate] = useLocalStorage("swp_rate", 8) // Expected return
    const [years, setYears] = useLocalStorage("swp_years", 20)

    const calculateSWP = () => {
        let balance = corpus
        const monthlyRate = rate / 12 / 100
        const data = []
        let totalWithdrawn = 0

        for (let i = 1; i <= years; i++) {
            for (let m = 0; m < 12; m++) {
                if (balance > 0) {
                    balance = (balance - withdrawal) * (1 + monthlyRate)
                    totalWithdrawn += withdrawal
                } else {
                    balance = 0
                }
            }
            data.push({
                year: `Year ${i}`,
                balance: Math.round(balance),
                withdrawn: totalWithdrawn
            })
        }
        return { finalBalance: Math.round(balance), totalWithdrawn, data }
    }

    const { finalBalance, totalWithdrawn, data } = calculateSWP()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                        <Banknote className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">SWP Calculator</h1>
                        <p className="text-muted-foreground">Systematic Withdrawal Plan - Monthly Income Generator.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    <Card className="lg:col-span-4 h-fit">
                        <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Total Investment (₹)</Label>
                                <Input type="number" value={corpus} onChange={e => setCorpus(Number(e.target.value))} />
                                <Slider value={[corpus]} min={500000} max={50000000} step={100000} onValueChange={v => setCorpus(v[0])} />
                            </div>

                            <div className="space-y-2">
                                <Label>Monthly Withdrawal (₹)</Label>
                                <Input type="number" value={withdrawal} onChange={e => setWithdrawal(Number(e.target.value))} />
                                <Slider value={[withdrawal]} min={1000} max={200000} step={500} onValueChange={v => setWithdrawal(v[0])} />
                            </div>

                            <div className="space-y-2">
                                <Label>Expected Return on Balance (%)</Label>
                                <div className="flex gap-4 items-center">
                                    <Slider value={[rate]} min={4} max={15} step={0.5} onValueChange={v => setRate(v[0])} className="flex-1" />
                                    <span className="font-bold w-12 text-right">{rate}%</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Time Period (Years)</Label>
                                <div className="flex gap-4 items-center">
                                    <Slider value={[years]} min={1} max={40} step={1} onValueChange={v => setYears(v[0])} className="flex-1" />
                                    <span className="font-bold w-12 text-right">{years} Yr</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-8 flex flex-col">
                        <CardHeader><CardTitle>Balance Projection</CardTitle></CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-slate-50 rounded-lg border">
                                    <div className="text-sm text-gray-500">Total Withdrawn</div>
                                    <div className="text-2xl font-bold text-slate-700">₹{totalWithdrawn.toLocaleString('en-IN')}</div>
                                </div>
                                <div className={`p-4 rounded-lg border ${finalBalance > 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                    <div className="text-sm text-gray-500">Remaining Value</div>
                                    <div className={`text-2xl font-bold ${finalBalance > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                        ₹{finalBalance.toLocaleString('en-IN')}
                                    </div>
                                    {finalBalance === 0 && <span className="text-xs text-red-600">Corpus exhausted!</span>}
                                </div>
                            </div>

                            <div className="h-[400px] w-full mt-auto">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="year" />
                                        <YAxis tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <Tooltip
                                            formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Area type="monotone" dataKey="balance" stroke="#ef4444" fill="url(#colorBalance)" name="Remaining Balance" />
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
