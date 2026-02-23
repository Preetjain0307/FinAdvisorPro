import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardNavbar } from '@/components/dashboard-navbar'
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Wallet, Landmark, Shield, TrendingUp, FileText, ReceiptText,
    ArrowRight, Bot, Calculator, Trophy, Zap, BarChart2,
    Target, CheckCircle2, AlertCircle, Clock, Star
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!profile) redirect('/onboarding')

    const [
        { data: budgetItems },
        { data: loans },
        { data: riskProfile },
        { data: investmentGoals },
        { data: estateAssets },
        { data: taxProfile },
        { data: insuranceProfile },
        { data: renewals },
    ] = await Promise.all([
        supabase.from('budget_items').select('*').eq('user_id', user.id),
        supabase.from('loans').select('*').eq('user_id', user.id),
        supabase.from('risk_profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('investment_goals').select('*').eq('user_id', user.id),
        supabase.from('estate_assets').select('*').eq('user_id', user.id),
        supabase.from('tax_profile').select('*').eq('user_id', user.id).single(),
        supabase.from('insurance_profile').select('*').eq('user_id', user.id).single(),
        supabase.from('insurance_renewals').select('*').eq('user_id', user.id),
    ])

    const income = budgetItems?.filter(b => b.category === 'Income').reduce((s, b) => s + b.amount, 0) ?? 0
    const expenses = budgetItems?.filter(b => b.category !== 'Income').reduce((s, b) => s + b.amount, 0) ?? 0
    const savings = income - expenses
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0
    const totalDebt = loans?.reduce((s, l) => s + l.balance, 0) ?? 0
    const loanCount = loans?.length ?? 0
    const totalAssets = estateAssets?.reduce((s, a) => s + (a.value ?? 0), 0) ?? 0
    const totalInvestGoals = investmentGoals?.length ?? 0
    const completedGoals = investmentGoals?.filter(g => g.current_amount >= g.target_amount).length ?? 0

    const today = new Date()
    const thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const upcomingRenewals = renewals?.filter(r => {
        const d = new Date(r.renewal_date)
        return d >= today && d <= thirtyDays
    }) ?? []

    const checks = [
        !!budgetItems?.length, !!loanCount, !!riskProfile?.completed,
        !!totalInvestGoals, !!estateAssets?.length,
        !!(taxProfile?.annual_income), !!(insuranceProfile?.annual_income),
    ]
    const profileScore = Math.round((checks.filter(Boolean).length / checks.length) * 100)

    const riskBadge = riskProfile?.completed
        ? { label: riskProfile.risk_category, color: riskProfile.risk_category === 'Aggressive' ? 'bg-violet-600' : riskProfile.risk_category === 'Moderate' ? 'bg-blue-600' : 'bg-emerald-600' }
        : null

    const firstName = profile?.full_name?.split(' ')[0] || 'Investor'
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

    const metrics = [
        {
            label: "Monthly Income", value: income > 0 ? `₹${(income / 1000).toFixed(1)}k` : "Not set",
            icon: Wallet, gradient: "from-emerald-500 to-teal-600",
            sub: `Saves ₹${(savings / 1000).toFixed(1)}k/mo (${savingsRate}%)`, href: "/planning/budget",
            glow: "shadow-emerald-500/15"
        },
        {
            label: "Total Debt", value: totalDebt > 0 ? `₹${(totalDebt / 100000).toFixed(1)}L` : "No loans",
            icon: Landmark, gradient: "from-orange-500 to-red-500",
            sub: loanCount > 0 ? `${loanCount} active loan${loanCount > 1 ? 's' : ''}` : "Debt free 🎉", href: "/planning/loan",
            glow: "shadow-orange-500/15"
        },
        {
            label: "Net Worth (Assets)", value: totalAssets > 0 ? `₹${(totalAssets / 100000).toFixed(1)}L` : "Not tracked",
            icon: TrendingUp, gradient: "from-blue-500 to-indigo-600",
            sub: estateAssets?.length ? `${estateAssets.length} assets recorded` : "Add assets →", href: "/planning/estate",
            glow: "shadow-blue-500/15"
        },
        {
            label: "Profile Score", value: `${profileScore}%`,
            icon: Star, gradient: "from-violet-500 to-purple-600",
            sub: profileScore === 100 ? "Complete ✅" : `${7 - checks.filter(Boolean).length} sections pending`, href: "/settings",
            glow: "shadow-violet-500/15"
        },
    ]

    const planningModules = [
        { href: "/planning/budget", icon: Wallet, label: "Budget", sub: budgetItems?.length ? `${budgetItems.length} entries` : "Set up", gradient: "from-emerald-500 to-teal-600", glow: "hover:shadow-emerald-500/20" },
        { href: "/planning/investment", icon: TrendingUp, label: "Investment", sub: riskBadge ? riskBadge.label : "Take quiz", gradient: "from-blue-500 to-indigo-600", glow: "hover:shadow-blue-500/20" },
        { href: "/planning/loan", icon: Landmark, label: "Loans", sub: loanCount ? `${loanCount} loans` : "No loans", gradient: "from-orange-500 to-red-500", glow: "hover:shadow-orange-500/20" },
        { href: "/planning/insurance", icon: Shield, label: "Insurance", sub: renewals?.length ? `${renewals.length} policies` : "Add policy", gradient: "from-purple-500 to-violet-600", glow: "hover:shadow-purple-500/20" },
        { href: "/planning/tax", icon: ReceiptText, label: "Tax", sub: taxProfile?.annual_income ? `₹${(taxProfile.annual_income / 100000).toFixed(1)}L income` : "Set income", gradient: "from-yellow-500 to-amber-600", glow: "hover:shadow-yellow-500/20" },
        { href: "/planning/estate", icon: FileText, label: "Estate", sub: estateAssets?.length ? `${estateAssets.length} assets` : "Add assets", gradient: "from-slate-500 to-slate-600", glow: "hover:shadow-slate-500/20" },
    ]

    const quickTools = [
        { href: "/ranking/mutual-fund", icon: Trophy, label: "Fund Rankings", gradient: "from-yellow-500 to-amber-500" },
        { href: "/ranking/stocks", icon: BarChart2, label: "Stock Rankings", gradient: "from-indigo-500 to-blue-500" },
        { href: "/market", icon: Zap, label: "Market Explorer", gradient: "from-amber-500 to-orange-500" },
        { href: "/calculators/sip", icon: TrendingUp, label: "SIP Calculator", gradient: "from-green-500 to-emerald-500" },
        { href: "/calculators/emi", icon: Calculator, label: "EMI Calculator", gradient: "from-red-500 to-rose-500" },
        { href: "/advisor", icon: Bot, label: "AI Advisor", gradient: "from-blue-500 to-cyan-500" },
    ]

    return (
        <div className="min-h-screen" style={{ background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            <DashboardNavbar userProfile={profile} />

            <main className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">

                {/* Welcome Banner */}
                <div className="relative rounded-3xl overflow-hidden mb-8"
                    style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e40af 100%)' }}>
                    {/* Animated orbs */}
                    <div className="absolute right-0 top-0 w-64 h-full opacity-20"
                        style={{ background: 'radial-gradient(circle at 80% 50%, #818cf8 0%, transparent 70%)' }} />
                    <div className="absolute left-1/2 bottom-0 w-48 h-32 opacity-10"
                        style={{ background: 'radial-gradient(circle, #a5f3fc 0%, transparent 70%)' }} />
                    {/* Grid */}
                    <div className="absolute inset-0 pointer-events-none opacity-5" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 md:p-8">
                        <div>
                            <div className="text-blue-200 text-sm mb-1 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                {greeting}, {firstName} 👋
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">Your Financial Dashboard</h1>
                            <p className="text-blue-200 text-sm">Everything you need to master your financial future</p>
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <Link href="/advisor">
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-xl hover:bg-blue-50 transition-all">
                                    <Bot className="h-4 w-4" /> AI Advisor
                                </button>
                            </Link>
                            <Link href="/planning">
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all">
                                    Planning <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {metrics.map(m => (
                        <Link href={m.href} key={m.label}>
                            <div className={`bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg ${m.glow} border border-gray-100 transition-all hover:-translate-y-1 cursor-pointer h-full`}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{m.label}</span>
                                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center shadow-md`}>
                                        <m.icon className="h-4.5 w-4.5 text-white h-5 w-5" />
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-gray-900 mb-0.5">{m.value}</div>
                                <div className="text-xs text-gray-400">{m.sub}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">

                    {/* Profile Completeness */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Profile Score</h3>
                            <span className={`text-lg font-black ${profileScore === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                                {profileScore}%
                            </span>
                        </div>
                        <Progress value={profileScore} className="h-2 mb-5" />
                        <div className="space-y-3">
                            {[
                                { label: "Budget Setup", done: checks[0], href: "/planning/budget" },
                                { label: "Loans Tracked", done: checks[1], href: "/planning/loan" },
                                { label: "Risk Quiz Done", done: checks[2], href: "/planning/investment" },
                                { label: "Investment Goals", done: checks[3], href: "/planning/investment" },
                                { label: "Estate Assets", done: checks[4], href: "/planning/estate" },
                                { label: "Tax Profile", done: checks[5], href: "/planning/tax" },
                                { label: "Insurance Profile", done: checks[6], href: "/planning/insurance" },
                            ].map(item => (
                                <Link href={item.href} key={item.label}
                                    className="flex items-center justify-between hover:opacity-70 transition-opacity">
                                    <div className="flex items-center gap-2.5 text-sm">
                                        {item.done
                                            ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                            : <AlertCircle className="h-4 w-4 text-gray-200 shrink-0" />}
                                        <span className={item.done ? "text-gray-700" : "text-gray-400"}>{item.label}</span>
                                    </div>
                                    {!item.done && <ArrowRight className="h-3 w-3 text-gray-300" />}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Planning Modules */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Planning Modules</h3>
                            <span className="text-xs text-gray-400">Click to manage</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {planningModules.map(m => (
                                <Link href={m.href} key={m.label}>
                                    <div className={`p-4 rounded-xl border border-gray-100 hover:shadow-md ${m.glow} transition-all cursor-pointer group`}>
                                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${m.gradient} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                                            <m.icon className="h-4.5 w-4.5 text-white h-5 w-5" />
                                        </div>
                                        <div className="font-bold text-sm text-gray-900">{m.label}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">

                    {/* Investment Goals */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Target className="h-4 w-4" /> Investment Goals
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5">{totalInvestGoals} goal{totalInvestGoals !== 1 ? 's' : ''} · {completedGoals} completed</p>
                            </div>
                            <Link href="/planning/investment">
                                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all">
                                    Manage <ArrowRight className="h-3 w-3" />
                                </button>
                            </Link>
                        </div>

                        {investmentGoals && investmentGoals.length > 0 ? (
                            <div className="space-y-4">
                                {investmentGoals.slice(0, 4).map((goal: any) => {
                                    const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
                                    return (
                                        <div key={goal.id}>
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="font-semibold text-gray-900">{goal.name}</span>
                                                <span className="text-gray-400 text-xs">₹{(goal.current_amount / 1000).toFixed(0)}k / ₹{(goal.target_amount / 1000).toFixed(0)}k</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className={`text-xs font-bold w-8 text-right ${pct >= 100 ? 'text-emerald-600' : 'text-blue-600'}`}>{pct}%</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <Target className="h-10 w-10 text-gray-100 mx-auto mb-3" />
                                <p className="text-sm text-gray-400 mb-3">No goals set yet</p>
                                <Link href="/planning/investment">
                                    <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all">
                                        Add your first goal →
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">

                        {/* Risk Profile */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-gray-900">Risk Profile</span>
                                <TrendingUp className="h-4 w-4 text-gray-300" />
                            </div>
                            {riskBadge ? (
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className={`${riskBadge.color} text-white text-sm px-3 py-1 rounded-full font-semibold`}>
                                            {riskBadge.label}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400 mb-2">Score: {riskProfile?.quiz_score}/100</div>
                                    <Link href="/advisor">
                                        <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
                                            <Bot className="h-3 w-3" /> View AI Recommendations
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-400 mb-2">Not completed</p>
                                    <Link href="/planning/investment">
                                        <button className="w-full py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all">
                                            Take Risk Quiz →
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Upcoming Renewals */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" /> Renewals (30 days)
                                </span>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${upcomingRenewals.length > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {upcomingRenewals.length}
                                </span>
                            </div>
                            {upcomingRenewals.length > 0 ? (
                                <div className="space-y-2">
                                    {upcomingRenewals.slice(0, 3).map(r => (
                                        <div key={r.id} className="flex justify-between text-xs">
                                            <span className="font-medium text-gray-700 truncate">{r.name}</span>
                                            <span className="text-red-500 shrink-0 ml-2">
                                                {new Date(r.renewal_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400">No renewals this month 🎉</p>
                            )}
                            <Link href="/planning/insurance">
                                <button className="mt-3 text-xs text-blue-600 hover:underline font-medium">
                                    Manage Insurance →
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Tools */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-gray-900">Quick Tools</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Rankings, calculators & market insights</p>
                        </div>
                        <Link href="/calculators">
                            <button className="text-xs text-blue-600 hover:underline font-medium">All Calculators →</button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {quickTools.map(t => (
                            <Link href={t.href} key={t.label}>
                                <div className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer group text-center">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                        <t.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700 leading-tight">{t.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    )
}
