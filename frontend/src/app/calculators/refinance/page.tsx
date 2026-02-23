"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRightLeft, CheckCircle2, XCircle } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function RefinancePage() {
    const [balance, setBalance] = useLocalStorage("ref_bal", 3000000)
    const [tenure, setTenure] = useLocalStorage("ref_tenure", 15) // Remaining years
    const [currentRate, setCurrentRate] = useLocalStorage("ref_rate_old", 9.5)
    const [newRate, setNewRate] = useLocalStorage("ref_rate_new", 8.5)
    const [processingFee, setProcessingFee] = useLocalStorage("ref_fee", 10000)

    // Calculation Utility
    const calculateEMI = (p: number, r: number, n: number) => { // n in months
        const rate = r / 12 / 100
        return p * rate * (Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1)
    }

    const months = tenure * 12
    const currentEMI = calculateEMI(balance, currentRate, months)
    const newEMI = calculateEMI(balance, newRate, months)

    const monthlySavings = currentEMI - newEMI
    const totalSavings = (monthlySavings * months) - processingFee
    const resultColor = totalSavings > 0 ? "text-green-600" : "text-red-600"
    const isWorthIt = totalSavings > 25000 // Threshold for hassle

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <ArrowRightLeft className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Loan Refinance Calculator</h1>
                        <p className="text-muted-foreground">Should you switch your home loan to a new bank?</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Loan Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Outstanding Loan Balance</Label>
                                <Input type="number" value={balance} onChange={e => setBalance(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Remaining Tenure (Years)</Label>
                                <Input type="number" value={tenure} onChange={e => setTenure(Number(e.target.value))} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Current Interest Rate (%)</Label>
                                    <Input type="number" value={currentRate} onChange={e => setCurrentRate(Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-green-600">New Offer Rate (%)</Label>
                                    <Input type="number" value={newRate} onChange={e => setNewRate(Number(e.target.value))} className="border-green-200 focus-visible:ring-green-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Processing Fees & Charges (New Bank)</Label>
                                <Input type="number" value={processingFee} onChange={e => setProcessingFee(Number(e.target.value))} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Analysis</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className={`p-6 rounded-xl border-2 ${isWorthIt ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                                <div className="flex items-start gap-4">
                                    {isWorthIt ? <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" /> : <XCircle className="h-8 w-8 text-red-600 shrink-0" />}
                                    <div>
                                        <h3 className={`text-xl font-bold ${isWorthIt ? 'text-green-800' : 'text-red-800'}`}>
                                            {isWorthIt ? "Yes, Switch!" : "Not Recommended"}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {isWorthIt
                                                ? `You will save significantly even after paying the processing fees.`
                                                : `The savings are too low to justify the paperwork and fees.`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded border">
                                    <div className="text-xs text-gray-500">Current EMI</div>
                                    <div className="font-bold">₹{Math.round(currentEMI).toLocaleString('en-IN')}</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded border border-green-100">
                                    <div className="text-xs text-green-700">New EMI</div>
                                    <div className="font-bold text-green-700">₹{Math.round(newEMI).toLocaleString('en-IN')}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Monthly Savings</span>
                                    <span className="font-bold text-green-600">+₹{Math.round(monthlySavings).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Refinance Cost</span>
                                    <span className="font-bold text-red-500">-₹{processingFee.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                                    <span>Net Savings (Lifetime)</span>
                                    <span className={resultColor}>₹{Math.round(totalSavings).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
