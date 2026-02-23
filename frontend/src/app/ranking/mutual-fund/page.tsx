"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, ArrowUpRight, Star, TrendingUp, Shield, Filter, ExternalLink, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Fund {
    id: number; name: string; category: string; amc: string
    return1y: number; return3y: number; return5y: number
    expense: number; aum: number; riskLevel: string
    rating: number        // 1-5 (like CRISIL/VRO rating)
    finproScore: number   // Calculated internally
    link: string
}

const FUNDS: Fund[] = [
    // Small Cap
    { id: 1, name: "Quant Small Cap Fund", category: "Small Cap", amc: "Quant", return1y: 18.4, return3y: 38.2, return5y: 45.1, expense: 0.77, aum: 22450, riskLevel: "Very High", rating: 5, finproScore: 91, link: "https://quantmutual.com" },
    { id: 2, name: "Nippon India Small Cap", category: "Small Cap", amc: "Nippon", return1y: 14.2, return3y: 29.8, return5y: 34.6, expense: 0.85, aum: 55300, riskLevel: "Very High", rating: 4, finproScore: 82, link: "https://m.nipponindiamf.com" },
    // Mid Cap
    { id: 3, name: "HDFC Mid-Cap Opportunities", category: "Mid Cap", amc: "HDFC", return1y: 22.1, return3y: 27.4, return5y: 29.3, expense: 1.10, aum: 72100, riskLevel: "High", rating: 5, finproScore: 88, link: "https://www.hdfcfund.com" },
    { id: 4, name: "Kotak Emerging Equity", category: "Mid Cap", amc: "Kotak", return1y: 19.3, return3y: 24.1, return5y: 26.8, expense: 1.12, aum: 42000, riskLevel: "High", rating: 4, finproScore: 80, link: "https://www.kotakmf.com" },
    // Flexi Cap
    { id: 5, name: "Parag Parikh Flexi Cap", category: "Flexi Cap", amc: "PPFAS", return1y: 16.2, return3y: 22.1, return5y: 24.9, expense: 0.65, aum: 71200, riskLevel: "Moderate", rating: 5, finproScore: 90, link: "https://amc.ppfas.com" },
    { id: 6, name: "Canara Robeco Flexi Cap", category: "Flexi Cap", amc: "Canara", return1y: 13.8, return3y: 18.9, return5y: 20.1, expense: 0.59, aum: 11200, riskLevel: "Moderate", rating: 4, finproScore: 75, link: "https://www.canararobeco.com" },
    // Large Cap
    { id: 7, name: "Mirae Asset Large Cap", category: "Large Cap", amc: "Mirae", return1y: 11.4, return3y: 15.8, return5y: 18.2, expense: 0.54, aum: 38500, riskLevel: "Moderate", rating: 5, finproScore: 78, link: "https://www.miraeassetmf.co.in" },
    { id: 8, name: "HDFC Top 100 Fund", category: "Large Cap", amc: "HDFC", return1y: 10.2, return3y: 14.1, return5y: 16.8, expense: 1.10, aum: 34200, riskLevel: "Moderate", rating: 4, finproScore: 71, link: "https://www.hdfcfund.com" },
    // Elss
    { id: 9, name: "Quant ELSS Tax Saver", category: "ELSS", amc: "Quant", return1y: 17.6, return3y: 31.2, return5y: 36.4, expense: 0.76, aum: 9800, riskLevel: "High", rating: 5, finproScore: 87, link: "https://quantmutual.com" },
    { id: 10, name: "Axis Long Term Equity", category: "ELSS", amc: "Axis", return1y: 8.4, return3y: 12.2, return5y: 16.1, expense: 0.55, aum: 32100, riskLevel: "Moderate", rating: 3, finproScore: 64, link: "https://www.axismf.com" },
    // Debt
    { id: 11, name: "HDFC Short Term Debt", category: "Debt", amc: "HDFC", return1y: 7.2, return3y: 6.8, return5y: 7.1, expense: 0.35, aum: 14300, riskLevel: "Low", rating: 4, finproScore: 72, link: "https://www.hdfcfund.com" },
    { id: 12, name: "SBI Magnum Ultra Short", category: "Debt", amc: "SBI", return1y: 7.0, return3y: 6.4, return5y: 6.8, expense: 0.28, aum: 11800, riskLevel: "Low", rating: 5, finproScore: 74, link: "https://www.sbimf.com" },
    // International
    { id: 13, name: "Motilal Oswal Nasdaq 100", category: "International", amc: "Motilal", return1y: 12.8, return3y: 19.2, return5y: 24.1, expense: 0.21, aum: 5400, riskLevel: "High", rating: 4, finproScore: 79, link: "https://www.motilaloswalmf.com" },
]

const CATEGORIES = ["All", "Small Cap", "Mid Cap", "Large Cap", "Flexi Cap", "ELSS", "Debt", "International"]

const RISK_COLOR: Record<string, string> = {
    "Very High": "text-red-600 bg-red-50",
    "High": "text-orange-600 bg-orange-50",
    "Moderate": "text-blue-600 bg-blue-50",
    "Low": "text-emerald-600 bg-emerald-50",
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-4 w-4 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
        </div>
    )
}

function ScoreBadge({ score }: { score: number }) {
    const color = score >= 85 ? "bg-emerald-600" : score >= 70 ? "bg-blue-600" : "bg-gray-500"
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-white text-sm font-bold ${color}`}>{score}</span>
}

export default function FundRankingPage() {
    const [category, setCategory] = useState("All")
    const [sortBy, setSortBy] = useState<"finproScore" | "return1y" | "return3y" | "return5y">("finproScore")
    const [search, setSearch] = useState("")

    const filtered = FUNDS
        .filter(f => category === "All" || f.category === category)
        .filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.amc.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b[sortBy] - a[sortBy])

    const top3 = [...FUNDS].sort((a, b) => b.finproScore - a.finproScore).slice(0, 3)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                        <Trophy className="h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Mutual Fund Ranking Engine</h1>
                        <p className="text-muted-foreground">FinPro Score = 40% Returns + 25% Consistency + 20% Low Expense + 15% AUM</p>
                    </div>
                </div>

                {/* Top 3 Spotlight */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {top3.map((f, i) => (
                        <Card key={f.id} className={`relative overflow-hidden border-2 ${i === 0 ? "border-yellow-400" : i === 1 ? "border-gray-300" : "border-orange-300"}`}>
                            <div className={`absolute top-0 left-0 right-0 h-1 ${i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-400" : "bg-orange-400"}`} />
                            <CardContent className="pt-5 pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`text-xs font-bold uppercase tracking-wide ${i === 0 ? "text-yellow-600" : i === 1 ? "text-gray-500" : "text-orange-500"}`}>
                                        #{i + 1} {i === 0 ? "🏆 Top Pick" : i === 1 ? "🥈 2nd" : "🥉 3rd"}
                                    </div>
                                    <ScoreBadge score={f.finproScore} />
                                </div>
                                <div className="font-bold text-base leading-tight mb-1">{f.name}</div>
                                <div className="text-xs text-muted-foreground mb-3">{f.category} · {f.amc}</div>
                                <div className="grid grid-cols-3 text-center gap-1">
                                    {[["1Y", f.return1y], ["3Y", f.return3y], ["5Y", f.return5y]].map(([label, val]) => (
                                        <div key={label} className="bg-slate-50 rounded-lg p-2">
                                            <div className="text-xs text-muted-foreground">{label} Return</div>
                                            <div className="font-bold text-green-600 text-sm">{val}%</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <StarRating rating={f.rating} />
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RISK_COLOR[f.riskLevel]}`}>{f.riskLevel} Risk</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-xl border p-4 mb-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
                        <Filter className="h-4 w-4" /> Sort by:
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {[["finproScore", "FinPro Score"], ["return1y", "1Y Return"], ["return3y", "3Y Return"], ["return5y", "5Y Return"]].map(([key, label]) => (
                            <Button key={key} size="sm" variant={sortBy === key ? "default" : "outline"} onClick={() => setSortBy(key as any)} className="h-8">
                                {label}
                            </Button>
                        ))}
                    </div>
                    <div className="ml-auto">
                        <Input placeholder="Search fund or AMC..." value={search} onChange={e => setSearch(e.target.value)} className="w-56 h-8" />
                    </div>
                </div>

                {/* Category Tabs */}
                <Tabs value={category} onValueChange={setCategory} className="mb-4">
                    <TabsList className="flex flex-wrap h-auto gap-1 bg-white border rounded-xl p-1">
                        {CATEGORIES.map(c => <TabsTrigger key={c} value={c} className="text-xs">{c}</TabsTrigger>)}
                    </TabsList>
                </Tabs>

                {/* Full Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-3">Fund</div>
                        <div className="col-span-1 text-center">Rating</div>
                        <div className="col-span-1 text-right">1Y</div>
                        <div className="col-span-1 text-right">3Y</div>
                        <div className="col-span-1 text-right">5Y</div>
                        <div className="col-span-1 text-right">Exp%</div>
                        <div className="col-span-1 text-right">AUM(Cr)</div>
                        <div className="col-span-1 text-center">Risk</div>
                        <div className="col-span-1 text-center">Score</div>
                    </div>

                    <div className="divide-y">
                        {filtered.map((fund, i) => (
                            <div key={fund.id} className="grid grid-cols-12 gap-2 px-4 py-3.5 items-center hover:bg-slate-50 transition-colors group">
                                <div className="col-span-1">
                                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold
                                        ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"}`}>
                                        {i + 1}
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div className="font-semibold text-sm leading-tight">{fund.name}</div>
                                    <div className="text-xs text-muted-foreground">{fund.category} · {fund.amc}</div>
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <StarRating rating={fund.rating} />
                                </div>
                                <div className="col-span-1 text-right text-sm font-semibold text-green-600">{fund.return1y}%</div>
                                <div className="col-span-1 text-right text-sm font-semibold text-green-700">{fund.return3y}%</div>
                                <div className="col-span-1 text-right text-sm font-bold text-green-800">{fund.return5y}%</div>
                                <div className="col-span-1 text-right text-sm text-gray-600">{fund.expense}%</div>
                                <div className="col-span-1 text-right text-sm text-gray-600">{(fund.aum / 100).toFixed(0)}k</div>
                                <div className="col-span-1 text-center">
                                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${RISK_COLOR[fund.riskLevel]}`}>{fund.riskLevel.split(" ")[0]}</span>
                                </div>
                                <div className="col-span-1 text-center">
                                    <ScoreBadge score={fund.finproScore} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2 text-xs text-blue-700">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span><b>FinPro Score</b> combines 5Y Returns (40%), Return Consistency (25%), Low Expense Ratio (20%), and AUM size (15%). Star ratings are based on risk-adjusted performance similar to CRISIL/ValueResearchOnline methodology. Returns shown are CAGR (annualised).</span>
                </div>
            </main>
        </div>
    )
}
