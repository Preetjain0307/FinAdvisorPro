"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Star, Info, TrendingUp, Filter } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"

interface NPSFund {
    id: number; manager: string; scheme: string; type: "E" | "C" | "G"
    return1y: number; return3y: number; return5y: number
    aum: string; rating: number; finproScore: number
}

const FUNDS: NPSFund[] = [
    { id: 1, manager: "HDFC Pension Fund", scheme: "Scheme E – Equity", type: "E", return1y: 28.5, return3y: 18.2, return5y: 15.6, aum: "55,000", rating: 5, finproScore: 91 },
    { id: 2, manager: "Kotak Pension Fund", scheme: "Scheme E – Equity", type: "E", return1y: 27.1, return3y: 17.9, return5y: 15.1, aum: "12,000", rating: 5, finproScore: 88 },
    { id: 3, manager: "ICICI Pru Pension", scheme: "Scheme E – Equity", type: "E", return1y: 26.8, return3y: 17.5, return5y: 14.9, aum: "48,000", rating: 4, finproScore: 85 },
    { id: 4, manager: "Axis Pension Fund", scheme: "Scheme E – Equity", type: "E", return1y: 25.4, return3y: 17.1, return5y: 14.4, aum: "8,200", rating: 4, finproScore: 82 },
    { id: 5, manager: "SBI Pension Fund", scheme: "Scheme E – Equity", type: "E", return1y: 24.2, return3y: 16.8, return5y: 14.2, aum: "85,000", rating: 4, finproScore: 80 },
    { id: 6, manager: "Aditya Birla Sun Life", scheme: "Scheme E – Equity", type: "E", return1y: 23.8, return3y: 16.4, return5y: 13.8, aum: "6,400", rating: 3, finproScore: 76 },
    { id: 7, manager: "HDFC Pension Fund", scheme: "Scheme C – Corporate", type: "C", return1y: 9.4, return3y: 8.2, return5y: 8.8, aum: "12,000", rating: 5, finproScore: 84 },
    { id: 8, manager: "ICICI Pru Pension", scheme: "Scheme C – Corporate", type: "C", return1y: 8.9, return3y: 7.8, return5y: 8.4, aum: "9,200", rating: 4, finproScore: 78 },
    { id: 9, manager: "LIC Pension Fund", scheme: "Scheme G – Govt Bonds", type: "G", return1y: 8.5, return3y: 7.2, return5y: 8.1, aum: "1,20,000", rating: 4, finproScore: 72 },
    { id: 10, manager: "SBI Pension Fund", scheme: "Scheme G – Govt Bonds", type: "G", return1y: 8.2, return3y: 7.0, return5y: 7.9, aum: "95,000", rating: 4, finproScore: 70 },
]

const TYPES = ["All", "E", "C", "G"]
const TYPE_LABELS: Record<string, string> = { E: "Equity (E)", C: "Corporate Bond (C)", G: "Govt Bond (G)" }
const TYPE_COLORS: Record<string, string> = { E: "text-violet-600 bg-violet-50", C: "text-blue-600 bg-blue-50", G: "text-emerald-600 bg-emerald-50" }

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-3.5 w-3.5 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
        </div>
    )
}

function ScoreBadge({ score }: { score: number }) {
    const color = score >= 88 ? "bg-emerald-600" : score >= 78 ? "bg-blue-600" : "bg-gray-500"
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-white text-xs font-bold ${color}`}>{score}</span>
}

export default function NPSRankingPage() {
    const [filter, setFilter] = useState("All")
    const [sortBy, setSortBy] = useState<"finproScore" | "return1y" | "return3y" | "return5y">("finproScore")

    const filtered = FUNDS
        .filter(f => filter === "All" || f.type === filter)
        .sort((a, b) => b[sortBy] - a[sortBy])

    const chartData = FUNDS.filter(f => f.type === "E").map(f => ({
        name: f.manager.split(" ")[0],
        "1Y": f.return1y, "3Y": f.return3y, "5Y": f.return5y
    }))

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Shield className="h-7 w-7" /></div>
                    <div>
                        <h1 className="text-3xl font-bold">NPS Fund Rankings</h1>
                        <p className="text-muted-foreground">FinPro Score = 1Y/3Y/5Y Returns (60%) + Consistency (25%) + AUM Stability (15%)</p>
                    </div>
                </div>

                {/* Chart — Equity only */}
                <div className="bg-white rounded-xl border p-6 mb-8">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Equity (E) Fund Returns Comparison</h2>
                    <div className="h-64">
                        <ResponsiveContainer>
                            <BarChart data={chartData} barGap={2}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} unit="%" />
                                <Tooltip formatter={(v: any) => `${v}%`} />
                                <Legend />
                                <Bar dataKey="1Y" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="3Y" fill="#0891b2" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="5Y" fill="#059669" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border p-4 mb-4 flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Filter className="h-4 w-4" /> Scheme Type:</span>
                    {TYPES.map(t => (
                        <Button key={t} size="sm" variant={filter === t ? "default" : "outline"} onClick={() => setFilter(t)} className="h-8">
                            {t === "All" ? "All" : TYPE_LABELS[t]}
                        </Button>
                    ))}
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm font-medium text-muted-foreground">Sort:</span>
                        {[["finproScore", "Score"], ["return1y", "1Y"], ["return3y", "3Y"], ["return5y", "5Y"]].map(([k, l]) => (
                            <Button key={k} size="sm" variant={sortBy === k ? "default" : "ghost"} onClick={() => setSortBy(k as any)} className="h-8 text-xs">{l}</Button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-3">Fund Manager</div>
                        <div className="col-span-2">Scheme</div>
                        <div className="col-span-1 text-right">1Y</div>
                        <div className="col-span-1 text-right">3Y</div>
                        <div className="col-span-1 text-right">5Y</div>
                        <div className="col-span-1 text-right">AUM (Cr)</div>
                        <div className="col-span-1 text-center">Stars</div>
                        <div className="col-span-1 text-center">Score</div>
                    </div>
                    <div className="divide-y">
                        {filtered.map((f, i) => (
                            <div key={f.id} className="grid grid-cols-12 gap-2 px-4 py-3.5 items-center hover:bg-slate-50 transition-colors">
                                <div className="col-span-1">
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold
                                        ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : "bg-slate-100 text-slate-500"}`}>{i + 1}</div>
                                </div>
                                <div className="col-span-3 font-semibold text-sm">{f.manager}</div>
                                <div className="col-span-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[f.type]}`}>{TYPE_LABELS[f.type]}</span>
                                </div>
                                <div className="col-span-1 text-right text-sm font-bold text-green-600">{f.return1y}%</div>
                                <div className="col-span-1 text-right text-sm font-bold text-green-700">{f.return3y}%</div>
                                <div className="col-span-1 text-right text-sm font-bold text-green-800">{f.return5y}%</div>
                                <div className="col-span-1 text-right text-sm text-gray-600">{f.aum}</div>
                                <div className="col-span-1 flex justify-center"><StarRating rating={f.rating} /></div>
                                <div className="col-span-1 flex justify-center"><ScoreBadge score={f.finproScore} /></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2 text-xs text-blue-700">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span><b>Scheme Types:</b> E = Equity (high growth, market-linked), C = Corporate Bonds (medium return, low risk), G = Government Securities (stable, low risk). Subscribers &lt;50 yrs can have up to 75% in Scheme E. Returns are CAGR (annualized).</span>
                </div>
            </main>
        </div>
    )
}
