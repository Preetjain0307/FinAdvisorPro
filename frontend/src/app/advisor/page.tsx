"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, TrendingUp, Shield, Landmark, PieChart, ArrowRight, Loader2, AlertTriangle, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface RiskProfile { quiz_score: number; risk_category: string; completed: boolean }
interface BudgetSummary { monthly_income: number; monthly_expense: number }

// Recommendation data per risk category
const recommendations = {
    Conservative: {
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200",
        badge: "bg-emerald-100 text-emerald-800",
        tagline: "Capital protection first. You prefer steady, predictable returns.",
        allocation: [
            { label: "Debt Mutual Funds", pct: 50, color: "bg-emerald-500", why: "Low risk, better than FDs, tax-efficient after 3 years." },
            { label: "PPF / EPF / SSY", pct: 20, color: "bg-blue-500", why: "Government-backed, risk-free, 7.1%+ returns." },
            { label: "Gold / SGB", pct: 20, color: "bg-yellow-500", why: "Hedge against inflation & currency depreciation." },
            { label: "Large Cap Equity", pct: 10, color: "bg-purple-500", why: "Minimal equity exposure via Nifty 50 index funds." },
        ],
        funds: [
            { name: "HDFC Short Term Debt Fund", type: "Debt", returns: "7.2% (3 yr)", risk: "Low" },
            { name: "SBI Liquid Fund", type: "Liquid", returns: "6.8% (1 yr)", risk: "Very Low" },
            { name: "Sovereign Gold Bond", type: "Gold", returns: "8%+ (8 yr)", risk: "None" },
            { name: "UTI Nifty 50 Index Fund", type: "Equity", returns: "12% (5 yr)", risk: "Moderate" },
        ],
        dos: ["Build 12-month emergency fund first", "Maximize PPF contributions (₹1.5L/yr)", "Use SGB over physical gold for extra 2.5% annual interest"],
        donts: ["Avoid Mid/Small cap funds for now", "Don't invest in F&O or direct stocks", "Don't break long-term instruments early"],
    },
    Moderate: {
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-200",
        badge: "bg-blue-100 text-blue-800",
        tagline: "Balanced growth. You can handle short-term dips for better long-term gains.",
        allocation: [
            { label: "Large Cap Equity", pct: 40, color: "bg-blue-500", why: "Core of a moderate portfolio — growth with lower volatility." },
            { label: "Debt Funds / FDs", pct: 30, color: "bg-emerald-500", why: "Stability and liquidity during market downturns." },
            { label: "Mid Cap Equity", pct: 20, color: "bg-purple-500", why: "Higher return potential than large caps over 5+ years." },
            { label: "Gold / REIT", pct: 10, color: "bg-yellow-500", why: "Portfolio diversification and inflation hedge." },
        ],
        funds: [
            { name: "Mirae Asset Large Cap Fund", type: "Equity", returns: "14.5% (5 yr)", risk: "Moderate" },
            { name: "HDFC Mid-Cap Opportunities", type: "Equity", returns: "18.2% (5 yr)", risk: "Moderately High" },
            { name: "Parag Parikh Flexi Cap", type: "Equity", returns: "19.1% (5 yr)", risk: "Moderate" },
            { name: "ICICI Pru Short Term Fund", type: "Debt", returns: "7.4% (3 yr)", risk: "Low" },
        ],
        dos: ["SIP every month without timing the market", "Rebalance annually to maintain target allocation", "Increase SIP by 10% every year (step-up SIP)"],
        donts: ["Don't panic sell in market corrections", "Avoid ULIPs — they mix insurance + investment poorly", "Don't stay only in FDs for long-term goals"],
    },
    Aggressive: {
        color: "text-violet-600",
        bg: "bg-violet-50 border-violet-200",
        badge: "bg-violet-100 text-violet-800",
        tagline: "Maximum growth. You accept high volatility in pursuit of wealth creation.",
        allocation: [
            { label: "Mid & Small Cap", pct: 40, color: "bg-violet-500", why: "Highest wealth creation potential over 7-10 year horizon." },
            { label: "Large Cap / Flexi Cap", pct: 30, color: "bg-blue-500", why: "Diversified anchor to reduce portfolio volatility." },
            { label: "International / Thematic", pct: 20, color: "bg-orange-500", why: "Global diversification + high-growth sector bets." },
            { label: "Gold / Alternatives", pct: 10, color: "bg-yellow-500", why: "Hedge during global uncertainty." },
        ],
        funds: [
            { name: "Quant Small Cap Fund", type: "Small Cap", returns: "28.4% (5 yr)", risk: "Very High" },
            { name: "Nippon India Mid Cap Fund", type: "Mid Cap", returns: "23.1% (5 yr)", risk: "High" },
            { name: "Motilal Oswal Nasdaq 100", type: "International", returns: "21.8% (5 yr)", risk: "High" },
            { name: "ICICI Pru Technology Fund", type: "Thematic", returns: "24.5% (5 yr)", risk: "Very High" },
        ],
        dos: ["Invest with a minimum 7-10 year horizon", "Use SIPs to average cost during volatile periods", "Diversify across sectors — don't over-concentrate"],
        donts: ["Never invest emergency funds in equities", "Avoid leveraging (loans to invest)", "Don't exit during market crashes — that's when you should buy more"],
    },
}

const riskColors: Record<string, string> = {
    Conservative: "text-emerald-600",
    Moderate: "text-blue-600",
    Aggressive: "text-violet-600",
}

export default function AdvisorPage() {
    const [loading, setLoading] = useState(true)
    const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null)
    const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null)

    const supabase = createClient()

    const load = useCallback(async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const [{ data: rp }, { data: budget }] = await Promise.all([
            supabase.from("risk_profiles").select("*").eq("user_id", user.id).single(),
            supabase.from("budget_items").select("category, amount").eq("user_id", user.id),
        ])

        if (rp) setRiskProfile(rp)

        if (budget) {
            const income = budget.filter((b: any) => b.category === "Income").reduce((s: number, b: any) => s + b.amount, 0)
            const expense = budget.filter((b: any) => b.category !== "Income").reduce((s: number, b: any) => s + b.amount, 0)
            setBudgetSummary({ monthly_income: income, monthly_expense: expense })
        }

        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900"><DashboardNavbar />
            <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        </div>
    )

    // No risk quiz taken yet
    if (!riskProfile?.completed) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <Card className="max-w-lg mx-auto mt-16 text-center p-8">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Complete Your Risk Profile First</h2>
                    <p className="text-muted-foreground mb-6">Your AI Advisor needs to understand your risk tolerance before giving personalized recommendations.</p>
                    <Link href="/planning/investment">
                        <Button size="lg">Take the Risk Quiz →</Button>
                    </Link>
                </Card>
            </main>
        </div>
    )

    const category = (riskProfile.risk_category as keyof typeof recommendations) || "Moderate"
    const rec = recommendations[category] || recommendations.Moderate
    const surplus = budgetSummary ? budgetSummary.monthly_income - budgetSummary.monthly_expense : null
    const suggestedSIP = surplus ? Math.round(surplus * 0.3 / 500) * 500 : null

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8 space-y-8">

                {/* Hero */}
                <Card className="bg-slate-900 text-white border-0">
                    <CardContent className="p-6 flex items-center gap-6">
                        <div className="p-4 bg-blue-600/20 rounded-full border border-blue-500/50">
                            <Bot className="h-10 w-10 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-400 mb-1">Your AI Investment Advisor</div>
                            <h1 className="text-2xl font-bold mb-1">
                                You are a <span className={riskColors[category] || "text-blue-400"}>{category} Investor</span>
                            </h1>
                            <p className="text-slate-300">{rec.tagline}</p>
                        </div>
                        <div className="ml-auto text-right hidden md:block">
                            <div className="text-slate-400 text-sm">Risk Score</div>
                            <div className="text-4xl font-bold text-blue-400">{riskProfile.quiz_score}<span className="text-xl text-slate-500">/100</span></div>
                        </div>
                    </CardContent>
                </Card>

                {/* SIP Suggestion */}
                {suggestedSIP && suggestedSIP > 0 && (
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4 flex items-center gap-4">
                            <TrendingUp className="h-8 w-8 text-green-600 shrink-0" />
                            <div>
                                <div className="font-bold text-green-800">Recommended Monthly SIP</div>
                                <div className="text-2xl font-bold text-green-700">₹{suggestedSIP.toLocaleString('en-IN')}/month</div>
                                <div className="text-sm text-green-600">Based on your 30% monthly surplus of ₹{surplus?.toLocaleString('en-IN')} from Budget Planner</div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Portfolio Allocation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5" /> Recommended Allocation</CardTitle>
                            <CardDescription>AI-suggested portfolio for a {category} investor</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rec.allocation.map((a) => (
                                <div key={a.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium">{a.label}</span>
                                        <span className="font-bold">{a.pct}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${a.color} rounded-full`} style={{ width: `${a.pct}%` }} />
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">{a.why}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Top Fund Picks */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" /> Top Fund Picks for You</CardTitle>
                            <CardDescription>Handpicked by AI based on your {category} profile</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {rec.funds.map((f) => (
                                <div key={f.name} className={`p-3 border rounded-lg ${rec.bg}`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold text-sm">{f.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{f.type}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm text-green-600">{f.returns}</div>
                                            <Badge variant="outline" className="text-xs mt-0.5">{f.risk} Risk</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Do's & Don'ts */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-green-200">
                        <CardHeader><CardTitle className="text-green-700 flex items-center gap-2"><Shield className="h-5 w-5" /> Do's for {category} Investors</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {rec.dos.map((d, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500 font-bold mt-0.5">✓</span>
                                        <span>{d}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="border-red-200">
                        <CardHeader><CardTitle className="text-red-700 flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Don'ts for {category} Investors</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {rec.donts.map((d, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <span className="text-red-500 font-bold mt-0.5">✗</span>
                                        <span>{d}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA to explore rankings */}
                <Card className="bg-slate-900 text-white border-0">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <div className="font-bold text-lg mb-1">Ready to invest?</div>
                            <div className="text-slate-300 text-sm">Browse top-ranked funds and products filtered for your profile.</div>
                        </div>
                        <Link href="/ranking/mutual-fund">
                            <Button variant="secondary" className="gap-2">
                                Explore Rankings <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

            </main>
        </div>
    )
}
