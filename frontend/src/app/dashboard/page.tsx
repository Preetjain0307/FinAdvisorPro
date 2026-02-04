
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, Sparkles, PieChart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import PortfolioReportButton from '@/components/PortfolioReportButton'
import PerformanceCharts from '@/components/PerformanceCharts'
import { LivePortfolio } from '@/components/live-portfolio'
import { LogoutButton } from '@/components/logout-button'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // If no profile, redirect to onboarding
    if (!profile) {
        redirect('/onboarding')
    }

    // Fetch user's portfolio
    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*, investments(*)')
        .eq('user_id', user.id)

    // Fetch user's goals
    const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)

    // Calculate portfolio value
    const totalValue = portfolio?.reduce((sum, item: any) => {
        return sum + (item.quantity * item.investments.current_price)
    }, 0) || 0

    // Mock gain/loss calculation (Server side fallback)
    const totalInvested = portfolio?.reduce((sum, item: any) => {
        return sum + (item.quantity * item.average_buy_price)
    }, 0) || 0

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-950 border-b sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back, {profile.full_name || 'Investor'}!</h1>
                        <p className="text-sm text-muted-foreground">Here's your financial snapshot</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/settings">
                            <Button variant="outline" size="sm">Settings</Button>
                        </Link>
                        <LogoutButton variant="outline" />
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-6 space-y-6">

                {/* Live Portfolio Overview & Holdings */}
                <LivePortfolio initialPortfolio={portfolio || []} />

                {/* Performance Charts */}
                <PerformanceCharts />

                {/* Goals Tracking */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Financial Goals</CardTitle>
                                <CardDescription>Track your targets</CardDescription>
                            </div>
                            <Link href="/goals/add">
                                <Button size="sm" variant="outline">+ Add Goal</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {goals && goals.length > 0 ? (
                            <div className="space-y-4">
                                {goals.map((goal: any) => {
                                    const progress = (goal.current_amount / goal.target_amount) * 100
                                    return (
                                        <div key={goal.id} className="space-y-2">
                                            <div className="flex justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Target className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">{goal.name}</span>
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    ₹{goal.current_amount?.toLocaleString() || 0} / ₹{goal.target_amount.toLocaleString()}
                                                </span>
                                            </div>
                                            <Progress value={progress} className="h-2" />
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No goals set yet</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <CardTitle>AI Recommendations</CardTitle>
                        </div>
                        <CardDescription>Personalized suggestions based on your risk profile</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                            <p className="font-medium mb-2">📈 Consider adding Gold ETF to diversify</p>
                            <p className="text-sm text-muted-foreground">Based on your {profile.risk_category} risk profile, gold can provide stability.</p>
                            <Link href="/investments">
                                <Button size="sm" className="mt-3" variant="outline">
                                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        {portfolio && portfolio.length > 0 && (
                            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                <p className="font-medium mb-2">✅ Portfolio looks balanced</p>
                                <p className="text-sm text-muted-foreground">You have a good mix of equity and stable assets.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </main>
        </div>
    )
}
