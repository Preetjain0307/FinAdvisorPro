"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Home, Calculator } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function EMICalculatorPage() {
    const [loanAmount, setLoanAmount] = useLocalStorage("emi_amount", 5000000)
    const [rate, setRate] = useLocalStorage("emi_rate", 8.5)
    const [tenure, setTenure] = useLocalStorage("emi_tenure", 20)

    // Calculation Logic
    const r = rate / 12 / 100
    const n = tenure * 12
    const emi = loanAmount * r * (Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

    const totalPayment = emi * n
    const totalInterest = totalPayment - loanAmount

    const chartData = [
        { name: "Principal Amount", value: loanAmount, color: "#3b82f6" },
        { name: "Interest Payable", value: Math.round(totalInterest), color: "#f97316" }
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                        <Home className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">EMI & Loan Planner</h1>
                        <p className="text-muted-foreground">Calculate your monthly outflow and interest liability.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Loan Details</CardTitle></CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Loan Amount</Label>
                                    <span className="font-bold bg-slate-100 rounded px-2">₹{loanAmount.toLocaleString()}</span>
                                </div>
                                <Slider value={[loanAmount]} min={100000} max={10000000} step={50000} onValueChange={v => setLoanAmount(v[0])} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Interest Rate (% p.a)</Label>
                                    <span className="font-bold bg-slate-100 rounded px-2">{rate}%</span>
                                </div>
                                <Slider value={[rate]} min={6} max={18} step={0.1} onValueChange={v => setRate(v[0])} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label>Tenure (Years)</Label>
                                    <span className="font-bold bg-slate-100 rounded px-2">{tenure} Yr</span>
                                </div>
                                <Slider value={[tenure]} min={1} max={30} step={1} onValueChange={v => setTenure(v[0])} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Breakdown</CardTitle></CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <div className="w-full grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-slate-900 text-white rounded-xl text-center col-span-2">
                                    <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Monthly EMI</div>
                                    <div className="text-3xl font-bold">₹{Math.round(emi).toLocaleString('en-IN')}</div>
                                </div>
                                <div className="p-3 border rounded text-center">
                                    <div className="text-xs text-gray-500">Total Interest</div>
                                    <div className="font-bold text-orange-600">₹{Math.round(totalInterest).toLocaleString('en-IN')}</div>
                                </div>
                                <div className="p-3 border rounded text-center">
                                    <div className="text-xs text-gray-500">Total Payment</div>
                                    <div className="font-bold text-blue-600">₹{Math.round(totalPayment).toLocaleString('en-IN')}</div>
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
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
