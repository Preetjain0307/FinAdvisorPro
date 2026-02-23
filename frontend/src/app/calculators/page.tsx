"use client"

import Link from "next/link"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Calculator, TrendingUp, Landmark, Shield, Wallet,
    Layers, Coins, ArrowRightLeft, Clock, Banknote
} from "lucide-react"

const TOOLS = [
    {
        category: "Investments",
        items: [
            { name: "SIP Calculator", url: "/calculators/sip", icon: TrendingUp, desc: "Calculate returns with Step-Up SIP options.", badge: "Popular" },
            { name: "Mutual Fund Overlap", url: "/calculators/mf-overlap", icon: Layers, desc: "Check portfolio overlap between two schemes.", badge: "New" },
            { name: "Lumpsum Calculator", url: "/calculators/lumpsum", icon: Wallet, desc: "Calculate one-time investment growth." },
            { name: "SWP Calculator", url: "/calculators/swp", icon: Banknote, desc: "Plan monthly withdrawals for retirement." },
        ]
    },
    {
        category: "Loans & Tax",
        items: [
            { name: "EMI Calculator", url: "/calculators/emi", icon: Calculator, desc: "Plan loan EMIs with payment breakdown.", badge: "Essential" },
            { name: "Loan Prepayment", url: "/planning/loan", icon: Clock, desc: "See how extra payments reduce tenure." },
            { name: "Loan Refinance", url: "/calculators/refinance", icon: ArrowRightLeft, desc: "Should you switch your loan to a lower rate?", badge: "New" },
            { name: "Advance Tax", url: "/calculators/advance-tax", icon: Landmark, desc: "Estimate quarterly tax liability." },
            { name: "Old vs New Regime", url: "/planning/tax", icon: Landmark, desc: "Compare tax savings under both regimes.", badge: "Updated" },
        ]
    },
    {
        category: "Insurance & Retirement",
        items: [
            { name: "Insurance Surrender", url: "/calculators/insurance-surrender", icon: Coins, desc: "Calculate loss on stopping a policy early." },
            { name: "Gratuity Calculator", url: "/calculators/gratuity", icon: Wallet, desc: "Estimate gratuity amount based on service.", badge: "New" },
            { name: "Retirement Corpus", url: "/calculators/retirement", icon: Shield, desc: "How much do you need to retire peacefully?" },
        ]
    }
]

export default function CalculatorHubPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />

            <main className="container mx-auto px-6 py-12">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                        Financial Calculators & Tools
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        A complete suite of tools designed to make your personal financial planning effortless and precise.
                    </p>
                </div>

                <div className="space-y-12">
                    {TOOLS.map((section, idx) => (
                        <div key={idx}>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                                {section.category}
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {section.items.map((tool, tIdx) => (
                                    <Link key={tIdx} href={tool.url} className="group">
                                        <Card className="h-full hover:shadow-lg transition-all border-slate-200 dark:border-slate-800 group-hover:border-blue-300 dark:group-hover:border-blue-700">
                                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                    <tool.icon className="h-6 w-6" />
                                                </div>
                                                {tool.badge && (
                                                    <Badge variant={tool.badge === "New" ? "default" : "secondary"} className={tool.badge === "New" ? "bg-blue-600" : ""}>
                                                        {tool.badge}
                                                    </Badge>
                                                )}
                                            </CardHeader>
                                            <CardContent>
                                                <CardTitle className="mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</CardTitle>
                                                <CardDescription>{tool.desc}</CardDescription>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
