"use client"

import { useState, useEffect } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart2, TrendingUp, TrendingDown, RefreshCw, Star, Filter, Info } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// All figures are representative educational data
interface Stock {
    symbol: string; name: string; sector: string; price: number
    change: number    // % 1-day change
    return1y: number  // % 1-year return
    return3y: number  // % 3-year CAGR
    pe: number        // P/E ratio
    marketCap: string // "Large" | "Mid" | "Small"
    low52: number; high52: number
    rating: number    // 1-5 stars (analyst consensus)
    finproScore: number // Our composite score
}

const BASE_STOCKS: Stock[] = [
    { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", price: 2854, change: 0.82, return1y: 14.2, return3y: 18.4, pe: 28.1, marketCap: "Large", low52: 2220, high52: 3217, rating: 5, finproScore: 88 },
    { symbol: "TCS", name: "Tata Consultancy Svcs", sector: "IT", price: 4012, change: -0.31, return1y: 8.4, return3y: 12.1, pe: 30.2, marketCap: "Large", low52: 3311, high52: 4592, rating: 5, finproScore: 85 },
    { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking", price: 1648, change: 0.55, return1y: 4.2, return3y: 9.8, pe: 18.4, marketCap: "Large", low52: 1363, high52: 1980, rating: 4, finproScore: 80 },
    { symbol: "INFY", name: "Infosys", sector: "IT", price: 1876, change: -0.92, return1y: 6.1, return3y: 10.2, pe: 26.8, marketCap: "Large", low52: 1358, high52: 2081, rating: 4, finproScore: 79 },
    { symbol: "BAJFINANCE", name: "Bajaj Finance", sector: "NBFC", price: 6980, change: 1.24, return1y: 22.4, return3y: 28.1, pe: 32.4, marketCap: "Large", low52: 5200, high52: 8182, rating: 5, finproScore: 87 },
    { symbol: "LT", name: "Larsen & Toubro", sector: "Infrastructure", price: 3612, change: 1.10, return1y: 32.1, return3y: 24.8, pe: 34.2, marketCap: "Large", low52: 2600, high52: 3900, rating: 5, finproScore: 86 },
    { symbol: "MARUTI", name: "Maruti Suzuki India", sector: "Auto", price: 12480, change: 0.45, return1y: 18.8, return3y: 22.3, pe: 27.1, marketCap: "Large", low52: 9800, high52: 13680, rating: 4, finproScore: 81 },
    { symbol: "TITAN", name: "Titan Company", sector: "Consumer", price: 3248, change: -0.18, return1y: 12.4, return3y: 28.2, pe: 78.4, marketCap: "Large", low52: 2810, high52: 3850, rating: 4, finproScore: 78 },
    { symbol: "NESTLEIND", name: "Nestle India", sector: "FMCG", price: 2184, change: 0.62, return1y: 6.8, return3y: 14.2, pe: 68.2, marketCap: "Large", low52: 1982, high52: 2778, rating: 4, finproScore: 74 },
    { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", sector: "Pharma", price: 1812, change: 0.94, return1y: 38.4, return3y: 31.2, pe: 38.2, marketCap: "Large", low52: 1180, high52: 1960, rating: 5, finproScore: 89 },
    { symbol: "HCLTECH", name: "HCL Technologies", sector: "IT", price: 1764, change: -0.44, return1y: 24.1, return3y: 18.8, pe: 27.4, marketCap: "Large", low52: 1248, high52: 1960, rating: 4, finproScore: 82 },
    { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking", price: 1892, change: 0.28, return1y: 2.8, return3y: 6.4, pe: 22.8, marketCap: "Large", low52: 1544, high52: 2191, rating: 3, finproScore: 68 },
    { symbol: "ADANIPORTS", name: "Adani Ports & SEZ", sector: "Infrastructure", price: 1284, change: 1.82, return1y: 48.2, return3y: 38.1, pe: 22.1, marketCap: "Large", low52: 782, high52: 1396, rating: 4, finproScore: 83 },
    { symbol: "WIPRO", name: "Wipro", sector: "IT", price: 554, change: -1.12, return1y: 4.2, return3y: 8.4, pe: 22.4, marketCap: "Large", low52: 412, high52: 616, rating: 3, finproScore: 65 },
    { symbol: "POWERGRID", name: "Power Grid Corp", sector: "Utilities", price: 324, change: 0.88, return1y: 42.1, return3y: 28.4, pe: 18.2, marketCap: "Large", low52: 210, high52: 365, rating: 5, finproScore: 84 },
    { symbol: "DMART", name: "Avenue Supermarts", sector: "Retail", price: 4412, change: -0.64, return1y: -8.2, return3y: 12.1, pe: 92.4, marketCap: "Large", low52: 3680, high52: 5484, rating: 3, finproScore: 62 },
    // Mid Cap
    { symbol: "POLICYBZR", name: "PB Fintech", sector: "Fintech", price: 1548, change: 2.42, return1y: 88.4, return3y: 42.1, pe: 182.4, marketCap: "Mid", low52: 712, high52: 1680, rating: 4, finproScore: 80 },
    { symbol: "IDEAFORGE", name: "ideaForge Technology", sector: "Defence", price: 614, change: 3.12, return1y: 12.8, return3y: 18.4, pe: 88.4, marketCap: "Mid", low52: 484, high52: 1124, rating: 3, finproScore: 61 },
    { symbol: "KAYNES", name: "Kaynes Technology", sector: "Electronics", price: 4812, change: 1.82, return1y: 42.8, return3y: 68.1, pe: 98.2, marketCap: "Mid", low52: 2818, high52: 5624, rating: 5, finproScore: 85 },
    { symbol: "ZENTEC", name: "Zen Technologies", sector: "Defence", price: 1912, change: 0.92, return1y: 112.4, return3y: 84.2, pe: 64.2, marketCap: "Small", low52: 818, high52: 2184, rating: 4, finproScore: 82 },
]

const SECTORS = ["All", "IT", "Banking", "Pharma", "Auto", "FMCG", "Infrastructure", "Energy", "NBFC", "Consumer", "Utilities", "Fintech", "Defence", "Electronics", "Retail"]
const CAPS = ["All", "Large", "Mid", "Small"]

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
    const color = score >= 85 ? "bg-emerald-600" : score >= 75 ? "bg-blue-600" : score >= 65 ? "bg-yellow-500" : "bg-gray-400"
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-white text-xs font-bold ${color}`}>{score}</span>
}

function RangeBar({ low52, high52, price }: { low52: number; high52: number; price: number }) {
    const pct = Math.min(100, Math.max(0, ((price - low52) / (high52 - low52)) * 100))
    return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{(low52 / 1000).toFixed(1)}k</span>
            <div className="w-16 h-1.5 bg-gray-200 rounded-full relative">
                <div className="absolute h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span>{(high52 / 1000).toFixed(1)}k</span>
        </div>
    )
}

export default function StockRankingPage() {
    const [stocks, setStocks] = useState<Stock[]>(BASE_STOCKS)
    const [lastUpdate, setLastUpdate] = useState(new Date())
    const [sector, setSector] = useState("All")
    const [cap, setCap] = useState("All")
    const [sortBy, setSortBy] = useState<"finproScore" | "return1y" | "return3y" | "change">("finproScore")
    const [search, setSearch] = useState("")

    // Live simulation — small price ticks
    useEffect(() => {
        const interval = setInterval(() => {
            setStocks(prev => prev.map(s => {
                const tick = (Math.random() * 1.6 - 0.8)
                const newPrice = Math.max(1, s.price + tick)
                const newChange = Number((s.change + (tick / s.price * 10)).toFixed(2))
                return { ...s, price: Number(newPrice.toFixed(2)), change: newChange }
            }))
            setLastUpdate(new Date())
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    const filtered = stocks
        .filter(s => sector === "All" || s.sector === sector)
        .filter(s => cap === "All" || s.marketCap === cap)
        .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.symbol.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b[sortBy] - a[sortBy])

    const top3 = [...stocks].sort((a, b) => b.finproScore - a.finproScore).slice(0, 3)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <BarChart2 className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Stock Ranking & Analysis</h1>
                            <p className="text-muted-foreground">FinPro Score = Returns (40%) + Fundamentals (35%) + Momentum (25%)</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border">
                        <RefreshCw className="h-3 w-3 animate-spin text-green-500" />
                        Live · {lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                </div>

                {/* Top 3 Spotlight */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {top3.map((s, i) => (
                        <div key={s.symbol} className={`bg-white rounded-xl border-2 p-4 relative overflow-hidden ${i === 0 ? "border-yellow-400" : i === 1 ? "border-gray-300" : "border-orange-300"}`}>
                            <div className={`absolute top-0 left-0 right-0 h-1 ${i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-400" : "bg-orange-400"}`} />
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold ${i === 0 ? "text-yellow-600" : i === 1 ? "text-gray-500" : "text-orange-500"}`}>
                                    #{i + 1} {i === 0 ? "🏆 Top Pick" : i === 1 ? "🥈 Runner Up" : "🥉 Third"}
                                </span>
                                <ScoreBadge score={s.finproScore} />
                            </div>
                            <div className="font-bold text-lg">{s.symbol}</div>
                            <div className="text-xs text-muted-foreground mb-3">{s.name} · {s.sector}</div>
                            <div className="grid grid-cols-3 text-center gap-1">
                                <div className="bg-slate-50 rounded p-1.5">
                                    <div className="text-xs text-muted-foreground">Price</div>
                                    <div className="font-bold text-sm">₹{s.price.toFixed(0)}</div>
                                </div>
                                <div className="bg-slate-50 rounded p-1.5">
                                    <div className="text-xs text-muted-foreground">1Y Return</div>
                                    <div className={`font-bold text-sm ${s.return1y >= 0 ? "text-green-600" : "text-red-500"}`}>{s.return1y}%</div>
                                </div>
                                <div className="bg-slate-50 rounded p-1.5">
                                    <div className="text-xs text-muted-foreground">3Y CAGR</div>
                                    <div className={`font-bold text-sm text-green-700`}>{s.return3y}%</div>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <StarRating rating={s.rating} />
                                <span className="text-xs text-muted-foreground">P/E: {s.pe}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border p-4 mb-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
                            <Filter className="h-4 w-4" /> Sort:
                        </div>
                        {[["finproScore", "FinPro Score"], ["return1y", "1Y Return"], ["return3y", "3Y CAGR"], ["change", "Today %"]].map(([key, label]) => (
                            <Button key={key} size="sm" variant={sortBy === key ? "default" : "outline"} onClick={() => setSortBy(key as any)} className="h-8 text-xs">
                                {label}
                            </Button>
                        ))}
                        <div className="ml-auto">
                            <Input placeholder="Search symbol or name..." value={search} onChange={e => setSearch(e.target.value)} className="w-52 h-8 text-xs" />
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <span className="text-xs font-medium text-muted-foreground self-center mr-1">Cap:</span>
                        {CAPS.map(c => <Button key={c} size="sm" variant={cap === c ? "default" : "ghost"} onClick={() => setCap(c)} className="h-7 text-xs px-3">{c}</Button>)}
                        <span className="text-xs font-medium text-muted-foreground self-center ml-4 mr-1">Sector:</span>
                        {["All", "IT", "Banking", "Pharma", "Auto", "Infrastructure", "Energy", "Fintech", "Defence"].map(s => (
                            <Button key={s} size="sm" variant={sector === s ? "default" : "ghost"} onClick={() => setSector(s)} className="h-7 text-xs px-3">{s}</Button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-2">Symbol</div>
                        <div className="col-span-2">Company</div>
                        <div className="col-span-1 text-right">Price</div>
                        <div className="col-span-1 text-right">Today</div>
                        <div className="col-span-1 text-right">1Y Ret</div>
                        <div className="col-span-1 text-right">3Y CAGR</div>
                        <div className="col-span-1 text-right">P/E</div>
                        <div className="col-span-1 text-center">Rating</div>
                        <div className="col-span-1 text-center">Score</div>
                    </div>

                    <div className="divide-y">
                        {filtered.map((s, i) => (
                            <div key={s.symbol} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-slate-50 transition-colors">
                                <div className="col-span-1">
                                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold
                                        ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"}`}>
                                        {i + 1}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <span className="font-mono font-bold text-sm text-blue-700">{s.symbol}</span>
                                    <div className="text-xs text-muted-foreground">{s.marketCap} Cap</div>
                                </div>
                                <div className="col-span-2 text-sm leading-tight">
                                    <div className="font-medium truncate">{s.name}</div>
                                    <div className="text-xs text-muted-foreground">{s.sector}</div>
                                </div>
                                <div className="col-span-1 text-right font-bold text-sm">₹{s.price.toFixed(0)}</div>
                                <div className={`col-span-1 text-right text-sm font-semibold flex items-center justify-end gap-0.5 ${s.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                                    {s.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}%
                                </div>
                                <div className={`col-span-1 text-right text-sm font-semibold ${s.return1y >= 0 ? "text-green-600" : "text-red-500"}`}>
                                    {s.return1y >= 0 ? "+" : ""}{s.return1y}%
                                </div>
                                <div className="col-span-1 text-right text-sm font-bold text-green-700">{s.return3y}%</div>
                                <div className="col-span-1 text-right text-sm text-gray-600">{s.pe}x</div>
                                <div className="col-span-1 flex justify-center"><StarRating rating={s.rating} /></div>
                                <div className="col-span-1 flex justify-center"><ScoreBadge score={s.finproScore} /></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2 text-xs text-blue-700">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span><b>FinPro Score</b> is a composite score combining 1Y &amp; 3Y returns (40%), P/E relative to sector (35%), and price momentum/52W position (25%). Prices update live via simulation. Star ratings reflect analyst consensus (5 = Strong Buy). Data is for educational purposes.</span>
                </div>
            </main>
        </div>
    )
}
