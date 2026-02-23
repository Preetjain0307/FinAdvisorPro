"use client"

import { useLocalStorage } from "@/hooks/use-local-storage"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    PieChart, Wallet, Shield, TrendingUp, Landmark, FileText, LayoutDashboard, ReceiptText, Printer
} from "lucide-react"
import Link from "next/link"

export default function PlanningCentrePage() {
    // --- REAL-TIME DATA INTEGRATION ---
    // We read from the same keys used in individual modules
    const [budgetItems] = useLocalStorage<any[]>("budget_items", [])
    const [loans] = useLocalStorage<any[]>("loan_items", [])
    const [invScore] = useLocalStorage<number>("inv_score", 0)
    const [assets] = useLocalStorage<any[]>("estate_assets", [])
    const [taxIncome] = useLocalStorage<number>("tax_income", 0)

    // --- SCORING ENGINE ---

    // 1. Savings Score (Target: 20% of income)
    const income = budgetItems?.filter(i => i.category === 'Income').reduce((s, i) => s + i.amount, 0) || 1
    const savings = budgetItems?.filter(i => i.category === 'Savings').reduce((s, i) => s + i.amount, 0) || 0
    const savingsRate = (savings / income) * 100
    const scoreSavings = Math.min(20, (savingsRate / 20) * 20) // Max 20 points

    // 2. Debt Score (Target: 0 Loans)
    const hasLoans = loans?.length > 0
    const scoreDebt = hasLoans ? 5 : 15 // Max 15 points

    // 3. Investment Score (Based on Risk Quiz completion)
    const scoreInvest = invScore > 0 ? 20 : 0 // Max 20 points

    // 4. Estate Score (Assets > 0 and Nominees assigned)
    const totalAssets = assets?.length || 0
    const withNominee = assets?.filter(a => a.nominee).length || 0
    const estateRatio = totalAssets > 0 ? withNominee / totalAssets : 0
    const scoreEstate = estateRatio * 10 // Max 10 points

    // 5. Insurance & Tax (Access Checks for now)
    const scoreInsurance = 10 // Placeholder until deep logic
    const scoreTax = taxIncome > 0 ? 10 : 0 // Max 10 if visited

    const totalScore = Math.round(scoreSavings + scoreDebt + scoreInvest + scoreEstate + scoreInsurance + scoreTax + 5) // +5 base

    const getHealthLabel = () => {
        if (totalScore >= 80) return { label: "Excellent", color: "text-green-500" }
        if (totalScore >= 50) return { label: "Good", color: "text-blue-500" }
        return { label: "Needs Improvement", color: "text-orange-500" }
    }
    const health = getHealthLabel()

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Financial Planning Centre</h1>
                        <p className="text-muted-foreground">Your 360° Financial Health Dashboard</p>
                    </div>
                    <Button onClick={handlePrint} variant="outline" className="gap-2 print:hidden">
                        <Printer className="h-4 w-4" /> Download Plan
                    </Button>
                </div>

                {/* Main Health Score */}
                <div className="grid lg:grid-cols-3 gap-8 mb-10">
                    <Card className="lg:col-span-2 bg-slate-900 text-white border-0 shadow-2xl">
                        <CardContent className="p-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold mb-2">Financial Health Score</h2>
                                <p className="text-slate-400 mb-6 max-w-md">
                                    Based on your Savings Rate ({savingsRate.toFixed(0)}%), Debt Status, Investment Profile, and Estate Readiness.
                                </p>
                                <div className={`text-5xl font-bold ${health.color}`}>{health.label}</div>
                            </div>
                            <div className="relative h-40 w-40 flex items-center justify-center">
                                <svg className="h-full w-full -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-700" />
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className={health.color} strokeDasharray={440} strokeDashoffset={440 - (440 * totalScore) / 100} strokeLinecap="round" />
                                </svg>
                                <div className="absolute text-3xl font-bold">{totalScore}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Score Breakdown</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <ScoreRow label="Savings & Budget" score={scoreSavings} max={20} />
                            <ScoreRow label="Debt Management" score={scoreDebt} max={15} />
                            <ScoreRow label="Investment Portfolio" score={scoreInvest} max={20} />
                            <ScoreRow label="Estate Planning" score={scoreEstate} max={10} />
                            <ScoreRow label="Tax Efficiency" score={scoreTax} max={10} />
                        </CardContent>
                    </Card>
                </div>

                {/* Tools Grid */}
                <h3 className="text-xl font-bold mb-6">Financial Tools Suite</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2">
                    <ToolCard
                        href="/planning/budget" icon={<Wallet className="h-8 w-8 text-blue-500" />}
                        title="Budget Planner" desc="Track cashflow, 50/30/20 analysis & emergency funds."
                        stat={`${savingsRate.toFixed(0)}% Savings Rate`}
                    />
                    <ToolCard
                        href="/planning/investment" icon={<TrendingUp className="h-8 w-8 text-purple-500" />}
                        title="Investment Planner" desc="Risk profiling, asset allocation & goal tracking."
                        stat={invScore > 0 ? "Profiled" : "Pending Action"}
                    />
                    <ToolCard
                        href="/planning/insurance" icon={<Shield className="h-8 w-8 text-indigo-500" />}
                        title="Insurance Planner" desc="Life cover calculator, policy audit & renewal tracker."
                        stat="Coverage Check"
                    />
                    <ToolCard
                        href="/planning/loan" icon={<Landmark className="h-8 w-8 text-red-500" />}
                        title="Loan Planner" desc="Debt payoff strategies (Snowball) & prepayment calculator."
                        stat={hasLoans ? `${loans.length} Active Loans` : "Debt Free"}
                    />
                    <ToolCard
                        href="/planning/tax" icon={<ReceiptText className="h-8 w-8 text-yellow-600" />}
                        title="Tax Planning" desc="Old vs New regime comparison & deduction optimizer."
                        stat={taxIncome > 0 ? "Optimized" : "Pending"}
                    />
                    <ToolCard
                        href="/planning/estate" icon={<FileText className="h-8 w-8 text-teal-500" />}
                        title="Estate Planner" desc="Will generation, asset-nominee mapping & legacy score."
                        stat={`${(estateRatio * 100).toFixed(0)}% Readiness`}
                    />
                </div>

            </main>
        </div>
    )
}

function ScoreRow({ label, score, max }: any) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span className="font-semibold">{score.toFixed(0)} / {max}</span>
            </div>
            <Progress value={(score / max) * 100} className="h-2" />
        </div>
    )
}

function ToolCard({ href, icon, title, desc, stat }: any) {
    return (
        <Link href={href} className="block group">
            <Card className="h-full hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-blue-500">
                <CardContent className="p-6">
                    <div className="mb-4 bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        {icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600">{title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{desc}</p>
                    <Badge variant="secondary">{stat}</Badge>
                </CardContent>
            </Card>
        </Link>
    )
}
