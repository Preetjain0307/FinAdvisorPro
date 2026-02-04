
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, PieChart, Target, Wallet, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"

// Demo data for showcase
const portfolioData = {
    totalValue: 547500,
    invested: 500000,
    returns: 47500,
    returnsPercent: 9.5,
}

const holdings = [
    { name: 'HDFC Bank', type: 'Stock', value: 125000, change: 12.5, isUp: true },
    { name: 'Nifty 50 Index Fund', type: 'Mutual Fund', value: 200000, change: 8.2, isUp: true },
    { name: 'SBI FD', type: 'Fixed Deposit', value: 100000, change: 7.0, isUp: true },
    { name: 'Sovereign Gold Bond', type: 'Gold', value: 75000, change: -2.1, isUp: false },
    { name: 'Tata Motors', type: 'Stock', value: 47500, change: 15.8, isUp: true },
]

const goals = [
    { name: 'Retirement Fund', target: 10000000, current: 547500, progress: 5.5 },
    { name: 'Dream House', target: 5000000, current: 200000, progress: 4 },
]

export default function DashboardDemoPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2 font-bold text-xl text-blue-700 dark:text-blue-400">
                        <BarChart3 className="h-6 w-6" />
                        <span>Fin Advisor Pro</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/dashboard-demo" className="text-blue-600">Dashboard</Link>
                        <Link href="/investments" className="text-gray-600 hover:text-blue-600">Investments</Link>
                        <Link href="/tools/sip" className="text-gray-600 hover:text-blue-600">SIP Calculator</Link>
                        <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Demo Mode</Badge>
                        <Link href="/login">
                            <Button variant="outline" size="sm">Exit Demo</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome, Demo User! 👋</h1>
                        <p className="text-muted-foreground">Here's your portfolio overview</p>
                    </div>
                    <Link href="/investments">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Browse Investments
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
                            <Wallet className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{portfolioData.totalValue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">+₹{portfolioData.returns.toLocaleString()} returns</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Returns</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">+{portfolioData.returnsPercent}%</div>
                            <p className="text-xs text-muted-foreground">₹{portfolioData.returns.toLocaleString()} profit</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Risk Profile</CardTitle>
                            <PieChart className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Medium</div>
                            <p className="text-xs text-muted-foreground">Balanced growth strategy</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Goals</CardTitle>
                            <Target className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2</div>
                            <p className="text-xs text-muted-foreground">Retirement, House</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Holdings & Goals */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Holdings Table */}
                    <Card className="lg:col-span-2 border-0 shadow-md">
                        <CardHeader>
                            <CardTitle>Your Holdings</CardTitle>
                            <CardDescription>Current investments in your portfolio</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {holdings.map((holding, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium">{holding.name}</p>
                                            <p className="text-sm text-muted-foreground">{holding.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">₹{holding.value.toLocaleString()}</p>
                                            <p className={`text-sm flex items-center justify-end ${holding.isUp ? 'text-green-600' : 'text-red-600'}`}>
                                                {holding.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                                {holding.change}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Goals Progress */}
                    <Card className="border-0 shadow-md">
                        <CardHeader>
                            <CardTitle>Goal Progress</CardTitle>
                            <CardDescription>Track your financial goals</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {goals.map((goal, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{goal.name}</span>
                                        <span className="text-muted-foreground">{goal.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all"
                                            style={{ width: `${goal.progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>₹{goal.current.toLocaleString()}</span>
                                        <span>₹{goal.target.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* AI Recommendations */}
                <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🤖 AI Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                                <p className="font-medium mb-1">Rebalance Alert</p>
                                <p className="text-sm text-muted-foreground">Your equity allocation is 5% above target. Consider moving to bonds.</p>
                            </div>
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                                <p className="font-medium mb-1">SIP Suggestion</p>
                                <p className="text-sm text-muted-foreground">Start ₹5,000/month SIP in Nifty 50 for retirement goal.</p>
                            </div>
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                                <p className="font-medium mb-1">Tax Savings</p>
                                <p className="text-sm text-muted-foreground">Invest ₹50,000 in ELSS to save up to ₹15,000 in taxes.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
