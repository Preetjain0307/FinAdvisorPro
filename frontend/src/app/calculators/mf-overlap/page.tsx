"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layers, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Progress } from "@/components/ui/progress"

// Mock Data for Funds
const FUNDS = [
    { id: "1", name: "HDFC Top 100 Fund" },
    { id: "2", name: "SBI Bluechip Fund" },
    { id: "3", name: "Axis Small Cap Fund" },
    { id: "4", name: "Parag Parikh Flexi Cap" },
    { id: "5", name: "ICICI Prudential Bluechip" },
]

export default function FundOverlapPage() {
    const [fundA, setFundA] = useLocalStorage("calc_mf_a", "1")
    const [fundB, setFundB] = useLocalStorage("calc_mf_b", "2")

    // Mock Overlap Logic (Deterministic hash-like based on IDs)
    const getMockOverlap = (id1: string, id2: string) => {
        if (id1 === id2) return 100
        const combined = Number(id1) + Number(id2)
        // Simulate higher overlap for specific pairs (e.g. 1+2 Large Caps)
        if ((id1 === "1" && id2 === "2") || (id1 === "2" && id2 === "5")) return 65 // High overlap
        if (id1 === "3") return 12 // Low overlap with Small Cap
        return (combined * 7) % 50 // Randomish
    }

    const overlap = getMockOverlap(fundA, fundB)
    const isHigh = overlap > 30

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Layers className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Mutual Fund Overlap Tool</h1>
                        <p className="text-muted-foreground">Check if you are holding the same stocks in different funds.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-1 h-fit">
                        <CardHeader><CardTitle>Select Funds</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fund A</label>
                                <Select value={fundA} onValueChange={setFundA}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {FUNDS.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-center text-gray-300">
                                <div className="h-8 w-px bg-current"></div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fund B</label>
                                <Select value={fundB} onValueChange={setFundB}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {FUNDS.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>Overlap Analysis</CardTitle></CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-8">

                            {/* Visual Representation */}
                            <div className="relative h-48 w-full max-w-sm flex items-center justify-center mb-8">
                                <div className={`absolute w-32 h-32 rounded-full border-4 border-blue-500 bg-blue-500/20 mix-blend-multiply transition-all duration-500 flex items-center justify-center transform`} style={{ left: `calc(50% - ${40 + (overlap / 4)}px)` }}>
                                    <span className="text-xs font-bold text-blue-900 bg-white/80 px-1 rounded">Fund A</span>
                                </div>
                                <div className={`absolute w-32 h-32 rounded-full border-4 border-purple-500 bg-purple-500/20 mix-blend-multiply transition-all duration-500 flex items-center justify-center transform`} style={{ right: `calc(50% - ${40 + (overlap / 4)}px)` }}>
                                    <span className="text-xs font-bold text-purple-900 bg-white/80 px-1 rounded">Fund B</span>
                                </div>
                                <div className="z-10 font-bold text-2xl text-slate-800 bg-white/50 px-2 rounded shadow-sm">
                                    {overlap}%
                                </div>
                            </div>

                            <div className="text-center space-y-4 max-w-md">
                                <h3 className="text-xl font-bold">Portfolio Overlap: <span className={isHigh ? 'text-red-500' : 'text-green-500'}>{overlap}%</span></h3>
                                {isHigh ? (
                                    <div className="p-4 bg-red-50 text-red-800 rounded-lg flex gap-3 text-left">
                                        <AlertTriangle className="h-6 w-6 shrink-0" />
                                        <div>
                                            <div className="font-bold">Diversification Warning</div>
                                            <div className="text-sm mt-1">These funds hold very similar stocks within their portfolio. You are effectively paying double expense ratio for the same assets. Consider replacing one.</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-green-50 text-green-800 rounded-lg flex gap-3 text-left">
                                        <CheckCircle2 className="h-6 w-6 shrink-0" />
                                        <div>
                                            <div className="font-bold">Good Diversification</div>
                                            <div className="text-sm mt-1">These funds complement each other well. There is minimal stock overlap between them.</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-full mt-8 grid grid-cols-2 gap-4 text-sm">
                                <div className="border rounded p-3">
                                    <div className="text-gray-500 mb-1">Common Stocks (Est.)</div>
                                    <div className="font-semibold">HDFC Bank, RIL, ICICI</div>
                                </div>
                                <div className="border rounded p-3">
                                    <div className="text-gray-500 mb-1">Uncommon Sector</div>
                                    <div className="font-semibold">Pharma vs IT</div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
