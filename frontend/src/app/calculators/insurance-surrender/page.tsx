"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, RotateCcw } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function InsuranceSurrenderPage() {
    const [premium, setPremium] = useLocalStorage("ins_calc_prem", 50000)
    const [yearsPaid, setYearsPaid] = useLocalStorage("ins_calc_years", 5)
    const [policyTerm, setPolicyTerm] = useLocalStorage("ins_calc_term", 20)
    const [type, setType] = useLocalStorage("ins_calc_type", "endowment")

    // Logic
    // Factor is rough estimate for demo: starts low, increases with time
    const getSurrenderFactor = (years: number) => {
        if (years < 2) return 0 // Usually 0 in first 2 years
        if (years < 4) return 0.30
        if (years < 7) return 0.50
        return 0.70 + (years / 50) // Slowly approaches 90%
    }

    const totalPaid = premium * yearsPaid
    const factor = getSurrenderFactor(yearsPaid)
    const surrenderValue = totalPaid * factor
    const loss = totalPaid - surrenderValue

    const data = [
        { name: "Total Paid", value: totalPaid, fill: "#94a3b8" },
        { name: "Surrender Value", value: surrenderValue, fill: "#22c55e" },
        { name: "Loss", value: loss, fill: "#ef4444" }
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <Calculator className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Insurance Surrender Calculator</h1>
                        <p className="text-muted-foreground">Estimate how much you get back if you stop your policy.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Policy Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Policy Type</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="endowment">Endowment / Traditional</SelectItem>
                                        <SelectItem value="ulip">ULIP (Market Linked)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Annual Premium (₹)</Label>
                                <Input type="number" value={premium} onChange={e => setPremium(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Number of Premiums Paid (Years)</Label>
                                <Input type="number" value={yearsPaid} onChange={e => setYearsPaid(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Policy Term (Years)</Label>
                                <Input type="number" value={policyTerm} onChange={e => setPolicyTerm(Number(e.target.value))} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Calculation Result</CardTitle></CardHeader>
                        <CardContent className="text-center space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded border">
                                    <div className="text-sm text-gray-500">Total Premium Paid</div>
                                    <div className="text-xl font-bold">₹{totalPaid.toLocaleString('en-IN')}</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded border border-green-100">
                                    <div className="text-sm text-green-700">Surrender Value (Est.)</div>
                                    <div className="text-2xl font-bold text-green-600">₹{Math.round(surrenderValue).toLocaleString('en-IN')}</div>
                                    <div className="text-xs text-green-600">Factor: {(factor * 100).toFixed(0)}%</div>
                                </div>
                            </div>

                            {loss > 0 && (
                                <div className="text-red-500 font-medium p-2 bg-red-50 rounded">
                                    You will lose ₹{Math.round(loss).toLocaleString('en-IN')} if you surrender now!
                                </div>
                            )}

                            <div className="h-[250px] w-full mt-4">
                                <ResponsiveContainer>
                                    <BarChart data={data}>
                                        <XAxis dataKey="name" />
                                        <YAxis hide />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]} label={{ position: 'top', formatter: (val: number) => `₹${(val / 1000).toFixed(0)}k` }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
