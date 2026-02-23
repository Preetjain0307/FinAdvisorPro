
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Users, Briefcase, BarChart, Settings, Shield, Plus, Eye,
    Zap, TrendingUp, Activity, Headphones, Phone, CheckCircle2,
    Clock, XCircle, ArrowRight, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { LogoutButton } from '@/components/logout-button'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: investmentCount } = await supabase.from('investments').select('*', { count: 'exact', head: true })

    // Call request stats
    const { data: allCalls } = await supabase.from('call_requests').select('status, created_at')
    const totalCalls = allCalls?.length ?? 0
    const converted = allCalls?.filter(c => c.status === 'converted').length ?? 0
    const pendingCalls = allCalls?.filter(c => c.status === 'pending').length ?? 0
    const conversionRate = totalCalls > 0 ? ((converted / totalCalls) * 100).toFixed(1) : '0'

    // Today's leads
    const today = new Date().toISOString().slice(0, 10)
    const todayLeads = allCalls?.filter(c => c.created_at?.slice(0, 10) === today).length ?? 0

    const statCards = [
        { label: "Total Users", value: userCount || 0, icon: Users, color: "text-blue-400", bg: "from-blue-600/20 to-blue-600/5", border: "border-blue-500/20", glow: "shadow-blue-500/10" },
        { label: "Active Investments", value: investmentCount || 0, icon: Briefcase, color: "text-emerald-400", bg: "from-emerald-600/20 to-emerald-600/5", border: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
        { label: "Total Leads", value: totalCalls, icon: Phone, color: "text-cyan-400", bg: "from-cyan-600/20 to-cyan-600/5", border: "border-cyan-500/20", glow: "shadow-cyan-500/10" },
        { label: "Conversion Rate", value: `${conversionRate}%`, icon: Activity, color: "text-green-400", bg: "from-green-600/20 to-green-600/5", border: "border-green-500/20", glow: "shadow-green-500/10" },
    ]

    const quickActions = [
        { href: "/admin/investments", icon: BarChart, label: "Manage Investments", color: "text-blue-400", bg: "bg-blue-500/10 hover:bg-blue-500/20", border: "border-blue-500/10" },
        { href: "/admin/investments/add", icon: Plus, label: "Add New Investment", color: "text-emerald-400", bg: "bg-emerald-500/10 hover:bg-emerald-500/20", border: "border-emerald-500/10" },
        { href: "/admin/users", icon: Users, label: "View All Users", color: "text-purple-400", bg: "bg-purple-500/10 hover:bg-purple-500/20", border: "border-purple-500/10" },
        { href: "/admin/callers", icon: Headphones, label: "Caller Performance", color: "text-cyan-400", bg: "bg-cyan-500/10 hover:bg-cyan-500/20", border: "border-cyan-500/10" },
        { href: "/admin/settings", icon: Settings, label: "Rating Settings", color: "text-amber-400", bg: "bg-amber-500/10 hover:bg-amber-500/20", border: "border-amber-500/10" },
        { href: "/caller/login", icon: Phone, label: "Open Caller Panel", color: "text-pink-400", bg: "bg-pink-500/10 hover:bg-pink-500/20", border: "border-pink-500/10" },
    ]

    return (
        <div className="min-h-screen" style={{
            background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Grid overlay */}
            <div className="fixed inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }} />

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl" style={{ background: 'rgba(2,6,23,0.85)' }}>
                <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-white text-sm">Admin Console</span>
                            <span className="text-slate-600 text-xs ml-2">Fin Advisor Pro</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-500">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> System Online
                        </span>
                        <LogoutButton variant="outline" />
                    </div>
                </div>
            </header>

            <main className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">

                {/* Page Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
                        <Zap className="h-3 w-3" /> Admin Console
                    </div>
                    <h1 className="text-3xl font-black text-white mb-1">System Dashboard</h1>
                    <p className="text-slate-500">Manage users, investments, and platform configuration</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((s) => (
                        <div key={s.label}
                            className={`rounded-2xl border ${s.border} bg-gradient-to-b ${s.bg} p-5 shadow-xl ${s.glow} relative overflow-hidden`}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{s.label}</span>
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    <s.icon className={`h-4 w-4 ${s.color}`} />
                                </div>
                            </div>
                            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* Caller Snapshot Card */}
                <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-600/10 to-teal-600/5 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Headphones className="h-5 w-5 text-cyan-400" />
                                <span className="font-bold text-white">Caller Operations</span>
                                {pendingCalls > 0 && (
                                    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">
                                        <AlertCircle className="h-3 w-3" /> {pendingCalls} pending
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-6">
                                {[
                                    { label: "Total", val: totalCalls, icon: Phone, c: 'text-cyan-400' },
                                    { label: "Converted", val: converted, icon: CheckCircle2, c: 'text-emerald-400' },
                                    { label: "Pending", val: pendingCalls, icon: Clock, c: 'text-amber-400' },
                                    { label: "Today's Leads", val: todayLeads, icon: Zap, c: 'text-purple-400' },
                                ].map(m => (
                                    <div key={m.label}>
                                        <div className={`text-2xl font-black ${m.c}`}>{m.val}</div>
                                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                            <m.icon className={`h-3 w-3 ${m.c}`} /> {m.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Link href="/admin/callers">
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/20 text-cyan-400 text-sm font-semibold hover:bg-cyan-600/30 transition-all whitespace-nowrap">
                                View Full Report <ArrowRight className="h-4 w-4" />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-6 mb-8">

                    {/* Quick Actions */}
                    <div className="lg:col-span-1 space-y-2">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
                        {quickActions.map(a => (
                            <Link key={a.href} href={a.href}>
                                <div className={`flex items-center gap-3 p-3.5 rounded-xl border ${a.border} ${a.bg} transition-all cursor-pointer group`}>
                                    <a.icon className={`h-4 w-4 ${a.color} shrink-0`} />
                                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{a.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Management Tabs */}
                    <div className="lg:col-span-3">
                        <Tabs defaultValue="investments" className="space-y-4">
                            <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1">
                                <TabsTrigger value="investments" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-sm">
                                    Investments
                                </TabsTrigger>
                                <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-sm">
                                    Users
                                </TabsTrigger>
                                <TabsTrigger value="callers" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-sm">
                                    Caller Analytics
                                </TabsTrigger>
                                <TabsTrigger value="rating" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400 text-sm">
                                    Rating Engine
                                </TabsTrigger>
                            </TabsList>

                            {[
                                { key: "investments", icon: Briefcase, title: "Investment Database", desc: "Manage all investment instruments and data", action: { href: "/admin/investments", label: "Open Manager" }, color: "blue" },
                                { key: "users", icon: Users, title: "User Directory", desc: "View and manage all registered investors", action: { href: "/admin/users", label: "View Users" }, color: "purple" },
                                { key: "rating", icon: TrendingUp, title: "AI Rating Rules", desc: "Configure the platform's automated scoring engine", action: { href: "/admin/settings", label: "Configure Engine" }, color: "emerald" },
                            ].map(tab => (
                                <TabsContent key={tab.key} value={tab.key}>
                                    <div className="rounded-2xl border border-white/5 p-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-12 h-12 rounded-xl bg-${tab.color}-500/10 border border-${tab.color}-500/20 flex items-center justify-center`}>
                                                <tab.icon className={`h-6 w-6 text-${tab.color}-400`} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{tab.title}</h3>
                                                <p className="text-sm text-slate-500">{tab.desc}</p>
                                            </div>
                                        </div>
                                        <div className="py-6 text-center text-slate-600">
                                            <p className="text-sm mb-4">Content loads in sub-pages</p>
                                        </div>
                                        <Link href={tab.action.href}>
                                            <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-${tab.color}-600/20 border border-${tab.color}-500/20 text-${tab.color}-400 text-sm font-semibold hover:bg-${tab.color}-600/30 transition-all`}>
                                                <Eye className="h-4 w-4" />
                                                {tab.action.label}
                                            </button>
                                        </Link>
                                    </div>
                                </TabsContent>
                            ))}

                            {/* Caller Analytics Tab */}
                            <TabsContent value="callers">
                                <div className="rounded-2xl border border-white/5 p-8" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                            <Headphones className="h-6 w-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">Caller Performance Center</h3>
                                            <p className="text-sm text-slate-500">Conversion funnels, daily activity, full call log</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        {[
                                            { label: 'Leads', val: totalCalls, c: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                                            { label: 'Converted', val: converted, c: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                                            { label: 'Rate', val: `${conversionRate}%`, c: 'text-purple-400', bg: 'bg-purple-500/10' },
                                        ].map(m => (
                                            <div key={m.label} className={`${m.bg} rounded-xl p-4 text-center`}>
                                                <div className={`text-2xl font-black ${m.c}`}>{m.val}</div>
                                                <div className="text-xs text-slate-500 mt-1">{m.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/admin/callers">
                                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/20 text-cyan-400 text-sm font-semibold hover:bg-cyan-600/30 transition-all">
                                            <Eye className="h-4 w-4" /> Full Performance Report
                                        </button>
                                    </Link>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    )
}
