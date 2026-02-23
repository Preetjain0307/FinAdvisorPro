"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Landmark, Calendar } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function AdvanceTaxPage() {
    const [salary, setSalary] = useLocalStorage("adv_salary", 0)
    const [business, setBusiness] = useLocalStorage("adv_business", 1500000)
    const [other, setOther] = useLocalStorage("adv_other", 50000)
    const [tds, setTds] = useLocalStorage("adv_tds", 25000)

    const totalIncome = salary + business + other
    const stdDeduction = 50000
    const taxable = Math.max(0, totalIncome - stdDeduction)

    // Rough Tax Calc (Mix of new/old for simple estimation - assuming 20% avg for simplicity in this tool)
    // In a real app, we'd reuse the robust engine from planning/tax
    const estimatedTax = taxable * 0.15 // 15% effective rate assumption for quick calc
    const netTaxLiability = Math.max(0, estimatedTax - tds)

    const installments = [
        { date: "15th June", pct: 15, amt: netTaxLiability * 0.15 },
        { date: "15th Sept", pct: 45, amt: netTaxLiability * 0.45 },
        { date: "15th Dec", pct: 75, amt: netTaxLiability * 0.75 },
        { date: "15th Mar", pct: 100, amt: netTaxLiability }, // Cumulative
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <Landmark className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Advance Tax Calculator</h1>
                        <p className="text-muted-foreground">Estimate your quarterly tax dues (Section 208).</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Estimated Income (FY 24-25)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Salary Income</Label>
                                <Input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Business/Profession</Label>
                                <Input type="number" value={business} onChange={e => setBusiness(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Other Sources (FD, Capital Gains)</Label>
                                <Input type="number" value={other} onChange={e => setOther(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-green-600">Total TDS Deducted</Label>
                                <Input type="number" value={tds} onChange={e => setTds(Number(e.target.value))} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Payment Schedule</CardTitle></CardHeader>
                        <CardContent>
                            <div className="bg-slate-900 text-white p-4 rounded-lg text-center mb-6">
                                <div className="text-xs text-slate-400 uppercase">Net Tax Liability</div>
                                <div className="text-3xl font-bold">₹{Math.round(netTaxLiability).toLocaleString('en-IN')}</div>
                                {netTaxLiability < 10000 && <div className="text-xs text-green-400 mt-1">No Advance Tax needed (Liability &lt; 10k)</div>}
                            </div>

                            <div className="space-y-0 border rounded-lg overflow-hidden">
                                {installments.map((inst, i) => {
                                    const prevAmt = i > 0 ? installments[i - 1].amt : 0
                                    const payableNow = Math.max(0, inst.amt - prevAmt)

                                    return (
                                        <div key={i} className="flex justify-between items-center p-4 border-b last:border-0 hover:bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {inst.pct}%
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{inst.date}</div>
                                                    <div className="text-xs text-muted-foreground">Cumulative: ₹{Math.round(inst.amt).toLocaleString('en-IN')}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-gray-400 uppercase">Payable</div>
                                                <div className="font-bold text-lg">₹{Math.round(payableNow).toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
