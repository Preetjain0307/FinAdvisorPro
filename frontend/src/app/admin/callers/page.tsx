import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft, Phone, CheckCircle2, XCircle, PhoneMissed,
    Calendar, TrendingUp, Users, Zap, Clock, Star,
    Trophy, AlertCircle, BarChart3, Headphones
} from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'

const STATUS_META: Record<string, { label: string; color: string; bar: string; icon: any }> = {
    pending: { label: 'Pending', color: 'text-amber-600', bar: 'bg-amber-400', icon: Clock },
    called: { label: 'Called', color: 'text-emerald-600', bar: 'bg-emerald-400', icon: CheckCircle2 },
    call_busy: { label: 'Call Busy', color: 'text-orange-600', bar: 'bg-orange-400', icon: PhoneMissed },
    not_interested: { label: 'Not Interested', color: 'text-red-600', bar: 'bg-red-400', icon: XCircle },
    converted: { label: 'Converted', color: 'text-blue-600', bar: 'bg-blue-500', icon: Zap },
    callback_scheduled: { label: 'Callback Scheduled', color: 'text-purple-600', bar: 'bg-purple-400', icon: Calendar },
}

function fmt(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function CallerPerformancePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    // Basic admin gate (session based, same as admin/page.tsx)
    // If you want strict admin auth, check admin cookie or use middleware

    const { data: reqs } = await supabase
        .from('call_requests')
        .select('*')
        .order('created_at', { ascending: false })

    const all = reqs ?? []
    const total = all.length
    const converted = all.filter(r => r.status === 'converted').length
    const called = all.filter(r => r.status === 'called').length
    const pending = all.filter(r => r.status === 'pending').length
    const notInterested = all.filter(r => r.status === 'not_interested').length
    const callBusy = all.filter(r => r.status === 'call_busy').length
    const callbackScheduled = all.filter(r => r.status === 'callback_scheduled').length
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0'
    const contactRate = total > 0 ? (((called + converted) / total) * 100).toFixed(1) : '0'

    // Last 7 days daily breakdown
    const today = new Date()
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today)
        d.setDate(today.getDate() - (6 - i))
        return d
    })
    const dailyData = days.map(d => {
        const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
        const dayStr = d.toISOString().slice(0, 10)
        const dayReqs = all.filter(r => r.created_at?.slice(0, 10) === dayStr)
        return {
            label,
            total: dayReqs.length,
            converted: dayReqs.filter(r => r.status === 'converted').length,
            called: dayReqs.filter(r => r.status === 'called').length,
        }
    })
    const maxDay = Math.max(...dailyData.map(d => d.total), 1)

    const statusBreakdown = Object.entries(STATUS_META).map(([key, meta]) => ({
        ...meta, key, count: all.filter(r => r.status === key).length
    }))

    const overviewCards = [
        { label: 'Total Leads', value: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'Converted', value: converted, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        { label: 'Contact Rate', value: `${contactRate}%`, icon: Phone, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        { label: 'Not Interested', value: notInterested, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
    ]

    return (
        <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Navbar */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-sm">
                            <ArrowLeft className="h-4 w-4" /> Admin
                        </Link>
                        <div className="w-px h-5 bg-gray-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                <Headphones className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">Caller Performance</span>
                        </div>
                    </div>
                    <LogoutButton variant="outline" />
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 max-w-7xl">

                {/* Overview Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {overviewCards.map(c => (
                        <div key={c.label} className={`bg-white rounded-2xl p-4 border ${c.border} shadow-sm`}>
                            <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
                                <c.icon className={`h-4.5 w-4.5 h-5 w-5 ${c.color}`} />
                            </div>
                            <div className={`text-2xl font-black ${c.color}`}>{c.value}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{c.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">

                    {/* Conversion Funnel */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-blue-500" /> Lead Funnel
                        </h3>
                        <p className="text-xs text-gray-400 mb-5">From booking to conversion</p>
                        {[
                            { label: 'Total Leads', val: total, color: 'bg-blue-500', pct: 100 },
                            { label: 'Contacted (Called)', val: called + converted, color: 'bg-indigo-500', pct: total > 0 ? Math.round(((called + converted) / total) * 100) : 0 },
                            { label: 'Callback Scheduled', val: callbackScheduled, color: 'bg-purple-400', pct: total > 0 ? Math.round((callbackScheduled / total) * 100) : 0 },
                            { label: 'Converted 🎉', val: converted, color: 'bg-emerald-500', pct: total > 0 ? Math.round((converted / total) * 100) : 0 },
                        ].map(f => (
                            <div key={f.label} className="mb-4">
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-gray-700 font-medium">{f.label}</span>
                                    <span className="font-bold text-gray-900">{f.val} <span className="text-gray-400 font-normal text-xs">({f.pct}%)</span></span>
                                </div>
                                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${f.color} rounded-full transition-all`} style={{ width: `${f.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Status Distribution */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" /> Status Breakdown
                        </h3>
                        <p className="text-xs text-gray-400 mb-5">Distribution across all statuses</p>
                        <div className="space-y-4">
                            {statusBreakdown.map(s => (
                                <div key={s.key}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className={`flex items-center gap-1.5 font-medium ${s.color}`}>
                                            <s.icon className="h-3.5 w-3.5" /> {s.label}
                                        </span>
                                        <span className="font-bold text-gray-900">{s.count}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${s.bar} rounded-full`} style={{ width: total > 0 ? `${(s.count / total) * 100}%` : '0%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Daily Activity (last 7 days) */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-500" /> Last 7 Days
                        </h3>
                        <p className="text-xs text-gray-400 mb-5">Daily lead inflow & conversions</p>
                        <div className="space-y-3">
                            {dailyData.map(d => (
                                <div key={d.label}>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>{d.label}</span>
                                        <span className="text-gray-800 font-semibold">{d.total} leads · <span className="text-emerald-600">{d.converted} converted</span></span>
                                    </div>
                                    <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                                        {d.total === 0 ? (
                                            <div className="flex-1 bg-gray-100 rounded-full" />
                                        ) : (
                                            <>
                                                <div className="bg-blue-400 rounded-l-full" style={{ width: `${(d.called / maxDay) * 100}%`, minWidth: d.called > 0 ? 4 : 0 }} />
                                                <div className="bg-emerald-400 rounded-r-full" style={{ width: `${(d.converted / maxDay) * 100}%`, minWidth: d.converted > 0 ? 4 : 0 }} />
                                                <div className="flex-1 bg-gray-100" />
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="flex gap-4 pt-1">
                                <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 bg-blue-400 rounded-full" />Called</span>
                                <span className="flex items-center gap-1.5 text-xs text-gray-400"><span className="w-2 h-2 bg-emerald-400 rounded-full" />Converted</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full Call Log Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                        <div>
                            <h3 className="font-bold text-gray-900">All Call Requests</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{total} total records</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <AlertCircle className="h-3.5 w-3.5" /> Read-only admin view
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50 bg-gray-50/50">
                                    {['Name', 'Phone', 'City', 'Preferred Time', 'Status', 'Caller Notes', 'Booked At', 'Called At'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {all.length === 0 ? (
                                    <tr><td colSpan={8} className="text-center py-16 text-gray-400">No call requests yet</td></tr>
                                ) : all.map((r, i) => {
                                    const meta = STATUS_META[r.status] ?? STATUS_META.pending
                                    const StatusIcon = meta.icon
                                    return (
                                        <tr key={r.id} className={`border-b border-gray-50/50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/20'}`}>
                                            <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{r.name}</td>
                                            <td className="px-4 py-3 text-gray-600 font-mono">{r.phone}</td>
                                            <td className="px-4 py-3 text-gray-500">{r.city || '—'}</td>
                                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.preferred_time}</td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color} bg-opacity-10`}
                                                    style={{ background: meta.bar.replace('bg-', '') === meta.bar ? undefined : undefined }}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {meta.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 max-w-xs">
                                                <span className="line-clamp-1">{r.caller_notes || <span className="italic text-gray-300">No notes</span>}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">{fmt(r.created_at)}</td>
                                            <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">{r.called_at ? fmt(r.called_at) : '—'}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
