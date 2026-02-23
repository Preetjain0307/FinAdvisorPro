'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { adminLogin } from './actions'
import { toast } from 'sonner'
import { Shield, Lock, Mail, Loader2, BarChart3, Activity, Users, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const stats = [
    { icon: Users, label: 'Total Users', value: '10k+' },
    { icon: Activity, label: 'Live Sessions', value: '247' },
    { icon: TrendingUp, label: 'AUM Tracked', value: '₹1.2Cr' },
]

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) { toast.error('Please enter email and password'); return }
        setLoading(true)
        try {
            const result = await adminLogin(email, password, rememberMe)
            if (result.error) { toast.error(result.error); setLoading(false) }
            else {
                toast.success('Welcome back, Admin!')
                if (typeof window !== 'undefined') {
                    if (rememberMe) localStorage.setItem('admin-remember', 'true')
                    else sessionStorage.setItem('admin-session', 'true')
                }
                router.push('/admin')
            }
        } catch { toast.error('Login failed. Please try again.'); setLoading(false) }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 70%, #020617 100%)', fontFamily: "'Inter', sans-serif" }}
        >
            {/* Animated orbs */}
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl pointer-events-none" />
            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 rounded-full blur-3xl pointer-events-none" />

            {/* Grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }} />

            <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">

                {/* Left — branding */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
                    className="hidden lg:block space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                            <BarChart3 className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <p className="font-extrabold text-xl text-white">Fin Advisor Pro</p>
                            <p className="text-xs text-blue-400 font-medium tracking-wider uppercase">Admin Console</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                            Restricted Access Area
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight">
                            System Administration
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                Control Panel
                            </span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Manage users, investments, AI rating engines, and platform configuration from a single secure interface.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {stats.map(s => (
                            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 text-center">
                                <s.icon className="h-4 w-4 text-blue-400 mx-auto mb-1.5" />
                                <p className="text-lg font-bold text-white">{s.value}</p>
                                <p className="text-xs text-slate-500">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right — login card */}
                <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40"
                >
                    {/* Shield icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl opacity-25 blur-md" />
                        </div>
                    </div>

                    <div className="text-center mb-7">
                        <h1 className="text-2xl font-black text-white mb-1">Admin Portal</h1>
                        <p className="text-slate-400 text-sm">Secure access for administrators only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" /> Email
                            </Label>
                            <Input
                                type="email"
                                placeholder="admin@finadvisor.pro"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                                required
                                autoComplete="username"
                                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:border-blue-500 focus:bg-white/8"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                <Lock className="h-3.5 w-3.5" /> Password
                            </Label>
                            <Input
                                type="password"
                                placeholder="Enter admin password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={loading}
                                required
                                autoComplete="current-password"
                                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Checkbox id="remember" checked={rememberMe}
                                onCheckedChange={v => setRememberMe(v as boolean)} disabled={loading} />
                            <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                                Remember me on this device
                            </label>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Signing in...</> : 'Sign In as Admin →'}
                        </motion.button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-white/5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 p-3 space-y-1 text-center">
                        <p className="text-xs text-slate-500">Default credentials</p>
                        <p className="font-mono text-xs text-yellow-400">admin@finadvisor.pro / admin@123</p>
                        <p className="text-xs text-yellow-600">⚠️ Change password after first login</p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
