"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Wallet, Info } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function GratuityPage() {
    const [salary, setSalary] = useLocalStorage("grat_salary", 50000) // Basic + DA
    const [years, setYears] = useLocalStorage("grat_years", 5)

    // Rule: (15 * Salary * Years) / 26
    const gratuity = Math.round((15 * salary * years) / 26)
    const taxFreeLimit = 2000000 // 20 Lakhs
    const taxable = Math.max(0, gratuity - taxFreeLimit)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-teal-100 text-teal-600 rounded-lg">
                        <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Gratuity Calculator</h1>
                        <p className="text-muted-foreground">Estimate your end-of-service benefit (15/26 Rule).</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Service Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Basic Salary + DA (Monthly)</Label>
                                <Input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} />
                                <p className="text-xs text-muted-foreground">Do not include HRA or other allowances.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Years of Service</Label>
                                <Input type="number" value={years} onChange={e => setYears(Number(e.target.value))} />
                                {years < 5 && <p className="text-xs text-red-500">Minimum 5 years required for eligibility.</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Result</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-slate-900 text-white p-6 rounded-xl text-center">
                                <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Total Gratuity Payable</div>
                                <div className="text-4xl font-bold">₹{gratuity.toLocaleString('en-IN')}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg bg-green-50">
                                    <div className="text-xs text-gray-500">Tax Free Amount</div>
                                    <div className="font-bold text-green-700">₹{Math.min(gratuity, taxFreeLimit).toLocaleString('en-IN')}</div>
                                </div>
                                <div className="p-4 border rounded-lg bg-red-50">
                                    <div className="text-xs text-gray-500">Taxable Amount</div>
                                    <div className="font-bold text-red-700">₹{taxable.toLocaleString('en-IN')}</div>
                                </div>
                            </div>

                            <div className="flex gap-2 text-xs text-gray-500 bg-gray-100 p-3 rounded">
                                <Info className="h-4 w-4 shrink-0" />
                                <p>Formula used: (15 × Last Drawn Salary × Years of Service) / 26 working days. Max tax-free limit is ₹20 Lakhs.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
