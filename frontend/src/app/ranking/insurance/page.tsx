"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, ShieldCheck, CheckCircle2, XCircle, Info, Filter } from "lucide-react"

interface InsurancePlan {
    id: number; name: string; insurer: string; type: "Health" | "Term"
    coverageMin: string; premiumsFrom: number      // ₹/month approx
    claimRatio: number   // % (higher = better)
    networkHospitals: number
    rating: number       // 1-5
    finproScore: number
    features: string[]
    missingFeatures: string[]
}

const PLANS: InsurancePlan[] = [
    // Health
    { id: 1, name: "Optima Secure", insurer: "HDFC ERGO", type: "Health", coverageMin: "5L", premiumsFrom: 812, claimRatio: 98.4, networkHospitals: 13000, rating: 5, finproScore: 94, features: ["No Room Capping", "Restore Benefit", "Zero Copay", "Pre/Post 90/180 days"], missingFeatures: [] },
    { id: 2, name: "Star Comprehensive", insurer: "Star Health", type: "Health", coverageMin: "5L", premiumsFrom: 780, claimRatio: 82.3, networkHospitals: 14000, rating: 4, finproScore: 84, features: ["No Room Capping", "Restore Benefit", "Zero Copay"], missingFeatures: ["Pre/Post limited"] },
    { id: 3, name: "Arogya Supreme", insurer: "United India", type: "Health", coverageMin: "5L", premiumsFrom: 680, claimRatio: 88.2, networkHospitals: 7500, rating: 4, finproScore: 80, features: ["Zero Copay", "Pre/Post 30/60 days"], missingFeatures: ["Room Capping", "No Restore"] },
    { id: 4, name: "Niva Bupa ReAssure", insurer: "Niva Bupa", type: "Health", coverageMin: "3L", premiumsFrom: 760, claimRatio: 91.2, networkHospitals: 10000, rating: 5, finproScore: 88, features: ["No Room Capping", "Restore Benefit", "Pre/Post 60/90 days"], missingFeatures: ["Copay on Some"] },
    { id: 5, name: "Care Supreme", insurer: "Care Health", type: "Health", coverageMin: "5L", premiumsFrom: 690, claimRatio: 78.4, networkHospitals: 8500, rating: 3, finproScore: 72, features: ["Zero Copay", "Restore Benefit"], missingFeatures: ["Room Capping 1%", "Short Pre/Post"] },
    // Term
    { id: 6, name: "HDFC Life Click 2 Protect", insurer: "HDFC Life", type: "Term", coverageMin: "1 Cr", premiumsFrom: 750, claimRatio: 99.4, networkHospitals: 0, rating: 5, finproScore: 96, features: ["99.4% Claim Ratio", "Return of Premium Option", "Critical Illness Rider", "Monthly Income Payout"], missingFeatures: [] },
    { id: 7, name: "LIC Tech Term", insurer: "LIC", type: "Term", coverageMin: "50L", premiumsFrom: 820, claimRatio: 98.7, networkHospitals: 0, rating: 5, finproScore: 93, features: ["98.7% Claim Ratio", "Govt Backed Trust", "Flexible Payout Options"], missingFeatures: ["Online Only", "Health Rider Limited"] },
    { id: 8, name: "ICICI iProtect Smart", insurer: "ICICI Prudential", type: "Term", coverageMin: "1 Cr", premiumsFrom: 700, claimRatio: 97.9, networkHospitals: 0, rating: 5, finproScore: 91, features: ["97.9% Claim Ratio", "4 Payout Modes", "Terminal Illness Cover"], missingFeatures: ["Premium Return Expensive"] },
    { id: 9, name: "Max Life Smart Term", insurer: "Max Life", type: "Term", coverageMin: "1 Cr", premiumsFrom: 680, claimRatio: 99.5, networkHospitals: 0, rating: 5, finproScore: 92, features: ["99.5% Claim Ratio", "Critical Illness Rider", "Return of Premium"], missingFeatures: [] },
    { id: 10, name: "Bajaj Allianz eTouch", insurer: "Bajaj Allianz", type: "Term", coverageMin: "50L", premiumsFrom: 620, claimRatio: 97.1, networkHospitals: 0, rating: 4, finproScore: 85, features: ["97.1% Claim Ratio", "Affordable Premium"], missingFeatures: ["Fewer Riders", "Limited Flexibility"] },
]

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
    const color = score >= 90 ? "bg-emerald-600" : score >= 80 ? "bg-blue-600" : "bg-gray-500"
    return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-white text-sm font-bold ${color}`}>{score}</span>
}

export default function InsuranceRankingPage() {
    const [type, setType] = useState<"All" | "Health" | "Term">("All")
    const [sortBy, setSortBy] = useState<"finproScore" | "claimRatio" | "premiumsFrom">("finproScore")

    const filtered = PLANS
        .filter(p => type === "All" || p.type === type)
        .sort((a, b) => sortBy === "premiumsFrom" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy])

    const top1 = filtered[0]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-4 py-8">

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-rose-100 text-rose-600 rounded-xl"><Heart className="h-7 w-7" /></div>
                    <div>
                        <h1 className="text-3xl font-bold">Best Insurance Plans Ranked</h1>
                        <p className="text-muted-foreground">FinPro Score = Claim Ratio (40%) + Features (35%) + Affordability (25%)</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border p-4 mb-6 flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1"><Filter className="h-4 w-4" /> Type:</span>
                    {["All", "Health", "Term"].map(t => (
                        <Button key={t} size="sm" variant={type === t ? "default" : "outline"} onClick={() => setType(t as any)} className="h-8">{t}</Button>
                    ))}
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm font-medium text-muted-foreground">Sort:</span>
                        {[["finproScore", "FinPro Score"], ["claimRatio", "Claim Ratio"], ["premiumsFrom", "Lowest Premium"]].map(([k, l]) => (
                            <Button key={k} size="sm" variant={sortBy === k ? "default" : "ghost"} onClick={() => setSortBy(k as any)} className="h-8 text-xs">{l}</Button>
                        ))}
                    </div>
                </div>

                {/* Cards */}
                <div className="space-y-4">
                    {filtered.map((plan, i) => (
                        <div key={plan.id} className={`bg-white rounded-xl border-2 p-6 ${i === 0 ? "border-yellow-400 shadow-md" : "border-gray-100 hover:border-gray-200"} transition-all`}>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Rank + Name */}
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shrink-0 text-sm
                                        ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500"}`}>
                                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-lg">{plan.name}</h3>
                                            <Badge className={plan.type === "Health" ? "bg-rose-600" : "bg-indigo-600"}>{plan.type}</Badge>
                                            {i === 0 && <Badge className="bg-yellow-500">⭐ Top Pick</Badge>}
                                        </div>
                                        <div className="text-muted-foreground text-sm">{plan.insurer}</div>
                                        <div className="mt-1"><StarRating rating={plan.rating} /></div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase font-bold">Claim Ratio</div>
                                        <div className={`text-xl font-bold ${plan.claimRatio >= 95 ? "text-emerald-600" : plan.claimRatio >= 85 ? "text-blue-600" : "text-orange-500"}`}>{plan.claimRatio}%</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase font-bold">Cover From</div>
                                        <div className="text-xl font-bold">₹{plan.coverageMin}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase font-bold">Premium/mo</div>
                                        <div className="text-xl font-bold text-blue-600">₹{plan.premiumsFrom.toLocaleString('en-IN')}</div>
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="text-center shrink-0">
                                    <div className="text-xs text-muted-foreground mb-1">FinPro Score</div>
                                    <ScoreBadge score={plan.finproScore} />
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-2">
                                <div className="flex flex-wrap gap-2">
                                    {plan.features.map(f => (
                                        <span key={f} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 className="h-3 w-3" /> {f}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {plan.missingFeatures.map(f => (
                                        <span key={f} className="flex items-center gap-1 text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">
                                            <XCircle className="h-3 w-3" /> {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {plan.type === "Health" && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                    <ShieldCheck className="h-3 w-3" /> {plan.networkHospitals.toLocaleString('en-IN')} cashless hospitals
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2 text-xs text-blue-700">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span><b>Claim Settlement Ratio (CSR)</b> is the most critical metric — it shows what % of claims the insurer paid. Always pick a plan with CSR &gt; 95% for Life/Term insurance. For Health, also prioritize room-rent capping, restore benefit, and number of cashless hospitals.</span>
                </div>
            </main>
        </div>
    )
}
