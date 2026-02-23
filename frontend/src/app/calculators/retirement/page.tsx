"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Shield, TrendingUp, AlertTriangle } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function RetirementCalcPage() {
    const [currentAge, setCurrentAge] = useLocalStorage("ret_age_curr", 30)
    const [retireAge, setRetireAge] = useLocalStorage("ret_age_goal", 60)
    const [expectancy, setExpectancy] = useLocalStorage("ret_expect", 85)
    const [expense, setExpense] = useLocalStorage("ret_expense", 50000) // Monthly
    const [inflation, setInflation] = useLocalStorage("ret_infl", 6)

    // Calculation
    const yearsToRetire = retireAge - currentAge
    const yearsInRetirement = expectancy - retireAge

    // Monthly expense at the time of retirement (FV of current expense)
    const futureMonthlyExpense = expense * Math.pow(1 + (inflation / 100), yearsToRetire)

    // Corpus required (Rough: Expense * 12 * Years)
    // Detailed: PV of annuity. Assuming 8% return post retirement vs 6% inflation = 2% Real Return.
    const realReturn = 2 / 100 // 8% conservative return - 6% inflation
    const annualExpenseAtRetirement = futureMonthlyExpense * 12

    // PMT formula approximation for Corpus
    // Corpus = AnnualExp * [ (1 - (1+r)^-n) / r ]
    const corpusRequired = annualExpenseAtRetirement * ((1 - Math.pow(1 + realReturn, -yearsInRetirement)) / realReturn)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Retirement Corpus Planner</h1>
                        <p className="text-muted-foreground">Calculate the exact amount you need to retire fearlessly.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Your Details</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Current Age</Label>
                                    <Input type="number" value={currentAge} onChange={e => setCurrentAge(Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Retirement Age</Label>
                                    <Input type="number" value={retireAge} onChange={e => setRetireAge(Number(e.target.value))} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Current Monthly Expenses (₹)</Label>
                                <Input type="number" value={expense} onChange={e => setExpense(Number(e.target.value))} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label>Expected Inflation (%)</Label>
                                    <span className="font-bold text-sm bg-slate-100 px-2 rounded">{inflation}%</span>
                                </div>
                                <Slider value={[inflation]} min={4} max={10} step={0.5} onValueChange={v => setInflation(v[0])} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label>Life Expectancy (Age)</Label>
                                    <span className="font-bold text-sm bg-slate-100 px-2 rounded">{expectancy}</span>
                                </div>
                                <Slider value={[expectancy]} min={70} max={100} step={1} onValueChange={v => setExpectancy(v[0])} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Your retirement reality</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-6 bg-slate-900 text-white rounded-xl text-center">
                                <div className="text-sm text-slate-400 uppercase tracking-widest mb-2">Required Corpus</div>
                                <div className="text-4xl font-bold text-blue-400">₹{(corpusRequired / 10000000).toFixed(2)} Cr</div>
                                <div className="text-xs text-slate-500 mt-2">To sustain lifestyle till age {expectancy}</div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 border rounded-lg bg-yellow-50 flex gap-3 text-sm text-yellow-800">
                                    <TrendingUp className="h-5 w-5 shrink-0" />
                                    <div>
                                        <span className="font-bold">Inflation Alert:</span> Your current expense of
                                        <strong> ₹{expense.toLocaleString()}</strong> will become
                                        <strong> ₹{Math.round(futureMonthlyExpense).toLocaleString()}</strong> by the time you retire.
                                    </div>
                                </div>

                                <div className="p-4 border rounded-lg bg-blue-50 flex gap-3 text-sm text-blue-800">
                                    <Shield className="h-5 w-5 shrink-0" />
                                    <div>
                                        <span className="font-bold">Recommendation:</span> To build this corpus in
                                        <strong> {yearsToRetire} years</strong>, you need to invest approx
                                        <strong> ₹{Math.round(corpusRequired / (yearsToRetire * 12 * 2)).toLocaleString()} </strong>
                                        monthly in SIPs (assuming 12% return).
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
