'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
    Phone, Loader2, LogOut, Search, ChevronDown, ChevronUp, Clock,
    CheckCircle2, XCircle, PhoneMissed, Calendar, Zap, Users,
    TrendingUp, Star, Target, BarChart3, Bell, Filter,
    MessageSquare, RefreshCw, Headphones, ArrowRight, Trophy
} from 'lucide-react'

type CallRequest = {
    id: string
    name: string
    email: string
    phone: string
    city: string
    preferred_time: string
    preferred_date: string | null
    message: string | null
    status: string
    caller_notes: string | null
    called_at: string | null
    created_at: string
}

const STATUSES = [
    { value: 'pending', label: 'Pending', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
    { value: 'called', label: 'Called', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
    { value: 'call_busy', label: 'Call Busy', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', dot: 'bg-orange-400' },
    { value: 'not_interested', label: 'Not Interested', color: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-400' },
    { value: 'converted', label: 'Converted ✓', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', dot: 'bg-blue-500' },
    { value: 'callback_scheduled', label: 'Callback Scheduled', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', dot: 'bg-purple-400' },
]

const CREDS = { email: 'caller@finadvisorpro.com', password: 'caller123' }

const statusMeta = (s: string) => STATUSES.find(st => st.value === s) ?? STATUSES[0]

function timeSince(d: string) {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
    if (mins < 60) return `${mins}m ago`
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
    return `${Math.floor(mins / 1440)}d ago`
}

function fmt(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function CallerPage() {
    const router = useRouter()
    const [requests, setRequests] = useState<CallRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [notes, setNotes] = useState<Record<string, string>>({})
    const [saving, setSaving] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | 'week'>('all')

    useEffect(() => {
        const s = typeof window !== 'undefined' ? sessionStorage.getItem('callerAuth') : null
        if (s !== 'true') { router.push('/caller/login'); return }
        fetchAll()
    }, [])

    const fetchAll = useCallback(async () => {
        setLoading(true)
        const supabase = createClient()
        const { data } = await supabase
            .from('call_requests')
            .select('*')
            .order('created_at', { ascending: false })
        setRequests(data ?? [])
        const initNotes: Record<string, string> = {}
        data?.forEach(r => { initNotes[r.id] = r.caller_notes ?? '' })
        setNotes(initNotes)
        setLoading(false)
    }, [])

    const updateStatus = async (id: string, status: string) => {
        setSaving(id)
        const supabase = createClient()
        await supabase
            .from('call_requests')
            .update({ status, called_at: new Date().toISOString(), caller_notes: notes[id] ?? '' })
            .eq('id', id)
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status, called_at: new Date().toISOString() } : r))
        toast.success(`Status updated to "${statusMeta(status).label}"`)
        setSaving(null)
    }

    const saveNotes = async (id: string) => {
        setSaving(id + '_notes')
        const supabase = createClient()
        await supabase.from('call_requests').update({ caller_notes: notes[id] }).eq('id', id)
        setRequests(prev => prev.map(r => r.id === id ? { ...r, caller_notes: notes[id] } : r))
        toast.success('Notes saved')
        setSaving(null)
    }

    const logout = () => { sessionStorage.removeItem('callerAuth'); router.push('/caller/login') }

    // Filtering
    const today = new Date().toISOString().slice(0, 10)
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
    const filtered = requests.filter(r => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.phone.includes(search) || r.email.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus === 'all' || r.status === filterStatus
        const matchPeriod = filterPeriod === 'all' ||
            (filterPeriod === 'today' && r.created_at?.slice(0, 10) === today) ||
            (filterPeriod === 'week' && r.created_at >= weekAgo)
        return matchSearch && matchStatus && matchPeriod
    })

    // Personal Stats
    const total = requests.length
    const convertedAll = requests.filter(r => r.status === 'converted').length
    const calledAll = requests.filter(r => r.status === 'called').length
    const pendingAll = requests.filter(r => r.status === 'pending').length
    const todayHandled = requests.filter(r => (r.called_at ?? r.updated_at ?? r.created_at)?.slice(0, 10) === today && r.status !== 'pending').length
    const conversionRate = total > 0 ? ((convertedAll / total) * 100).toFixed(1) : '0'
    const todayLeads = requests.filter(r => r.created_at?.slice(0, 10) === today).length

    const statsRow = [
        { label: 'Total Leads', val: total, icon: Users, c: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
        { label: 'Converted', val: convertedAll, icon: Trophy, c: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Pending', val: pendingAll, icon: Clock, c: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        { label: "Today's Leads", val: todayLeads, icon: Zap, c: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        { label: 'Handled Today', val: todayHandled, icon: CheckCircle2, c: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
        { label: 'Conv. Rate', val: `${conversionRate}%`, icon: TrendingUp, c: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
    ]

    return (
        <div className="min-h-screen" style={{
            background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Grid overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-40" style={{
                backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }} />

            {/* Sticky Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl" style={{ background: 'rgba(2,6,23,0.9)' }}>
                <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                            <Headphones className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-white text-sm">Caller Panel</span>
                            <span className="text-slate-600 text-xs ml-2">caller@finadvisorpro.com</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={fetchAll} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors" title="Refresh">
                            <RefreshCw className="h-4 w-4" />
                        </button>
                        {pendingAll > 0 && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                                <Bell className="h-3 w-3" /> {pendingAll} pending
                            </span>
                        )}
                        <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 text-sm hover:text-white hover:border-white/20 transition-all">
                            <LogOut className="h-3.5 w-3.5" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">

                {/* Stats Row */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                    {statsRow.map(s => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-xl border ${s.bg} p-4 text-center`}
                        >
                            <div className={`text-2xl font-black ${s.c}`}>{s.val}</div>
                            <div className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1">
                                <s.icon className={`h-3 w-3 ${s.c}`} /> {s.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Search + Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search name, phone, email…"
                            className="w-full pl-9 pr-4 h-10 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-all"
                        />
                    </div>

                    {/* Period filter */}
                    <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                        {(['all', 'today', 'week'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setFilterPeriod(p)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterPeriod === p ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {p === 'all' ? 'All time' : p === 'today' ? 'Today' : 'This week'}
                            </button>
                        ))}
                    </div>

                    {/* Status filter pills */}
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filterStatus === 'all' ? 'bg-white/15 text-white border-white/20' : 'border-white/10 text-slate-500 hover:text-slate-300'}`}
                        >
                            All
                        </button>
                        {STATUSES.map(s => (
                            <button
                                key={s.value}
                                onClick={() => setFilterStatus(s.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filterStatus === s.value ? `${s.color}` : 'border-white/10 text-slate-500 hover:text-slate-300'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 text-sm ml-auto">
                        <Filter className="h-3.5 w-3.5" />
                        <span>{filtered.length} results</span>
                    </div>
                </div>

                {/* Call Request List */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 text-slate-600">
                        <Phone className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p>No requests match your filters</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((req, i) => {
                            const meta = statusMeta(req.status)
                            const isExpanded = expandedId === req.id
                            const isNew = !req.called_at
                            const isPending = req.status === 'pending'

                            return (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03, duration: 0.3 }}
                                    className={`rounded-2xl border overflow-hidden transition-all ${isPending
                                        ? 'border-amber-500/30 bg-amber-500/5'
                                        : 'border-white/8 bg-white/3'
                                        }`}
                                    style={{ background: isPending ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.03)' }}
                                >
                                    {/* Card Header */}
                                    <div
                                        className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-white/3 transition-colors"
                                        onClick={() => setExpandedId(isExpanded ? null : req.id)}
                                    >
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${isPending ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/8 text-slate-300 border border-white/10'}`}>
                                            {req.name.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-white text-sm">{req.name}</span>
                                                {isNew && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">NEW</span>}
                                                {req.status === 'converted' && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">CONVERTED</span>}
                                            </div>
                                            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                                <span className="text-xs text-slate-400 font-mono">{req.phone}</span>
                                                {req.city && <span className="text-xs text-slate-500">📍 {req.city}</span>}
                                                <span className="text-xs text-slate-600">{timeSince(req.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Status badge */}
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${meta.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                                {meta.label}
                                            </span>
                                            <span className="text-slate-600">{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
                                        </div>
                                    </div>

                                    {/* Expanded Panel */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden border-t border-white/5"
                                            >
                                                <div className="p-5 space-y-5 bg-black/20">
                                                    {/* Info Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {[
                                                            { l: 'Email', v: req.email },
                                                            { l: 'Preferred Time', v: req.preferred_time },
                                                            { l: 'Preferred Date', v: req.preferred_date ?? '—' },
                                                            { l: 'Booked', v: fmt(req.created_at) },
                                                        ].map(f => (
                                                            <div key={f.l}>
                                                                <div className="text-xs text-slate-600 mb-0.5">{f.l}</div>
                                                                <div className="text-sm text-slate-200 font-medium">{f.v}</div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {req.message && (
                                                        <div className="bg-white/5 rounded-xl p-3">
                                                            <div className="text-xs text-slate-500 mb-1">Client Message</div>
                                                            <p className="text-sm text-slate-300 leading-relaxed">{req.message}</p>
                                                        </div>
                                                    )}

                                                    {/* Notes */}
                                                    <div>
                                                        <label className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
                                                            <MessageSquare className="h-3 w-3" /> Caller Notes
                                                        </label>
                                                        <textarea
                                                            value={notes[req.id] ?? ''}
                                                            onChange={e => setNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                                                            placeholder="Add notes about this call — outcome, follow-up needed, client interest level…"
                                                            rows={3}
                                                            className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-white/20 resize-none transition-all"
                                                        />
                                                        <button
                                                            onClick={() => saveNotes(req.id)}
                                                            disabled={saving === req.id + '_notes'}
                                                            className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-white/8 border border-white/10 text-slate-400 hover:text-white hover:bg-white/12 transition-all flex items-center gap-1.5"
                                                        >
                                                            {saving === req.id + '_notes' ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                                                            Save Notes
                                                        </button>
                                                    </div>

                                                    {/* Status Actions */}
                                                    <div>
                                                        <label className="text-xs text-slate-500 mb-2 block">Update Status</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {STATUSES.map(s => (
                                                                <button
                                                                    key={s.value}
                                                                    onClick={() => updateStatus(req.id, s.value)}
                                                                    disabled={saving === req.id || req.status === s.value}
                                                                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${req.status === s.value
                                                                        ? `${s.color} opacity-100 cursor-default scale-105 shadow-lg`
                                                                        : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20 hover:bg-white/5'
                                                                        }`}
                                                                >
                                                                    {saving === req.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
                                                                    {s.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Quick Action Buttons */}
                                                    <div className="flex gap-3">
                                                        <a href={`tel:${req.phone}`}
                                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/30 transition-all"
                                                        >
                                                            <Phone className="h-4 w-4" /> Call Now
                                                        </a>
                                                        <a href={`mailto:${req.email}`}
                                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-semibold hover:bg-blue-500/30 transition-all"
                                                        >
                                                            <ArrowRight className="h-4 w-4" /> Email Client
                                                        </a>
                                                        {req.called_at && (
                                                            <span className="ml-auto flex items-center gap-1 text-xs text-slate-600">
                                                                <Clock className="h-3 w-3" /> Last action: {fmt(req.called_at)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
