'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loginWithEmail, verifyOtp, signInWithGoogle, verifyTextBeeOtp, sendTextBeeOtp, checkUserExists, loginWithPassword } from '../auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, ArrowRight, Edit2, RotateCcw, BarChart3, Sparkles, TrendingUp, Shield, Zap, ChevronDown, Users } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const DEMO_USERS = [
    { name: 'Preet Jain', role: 'Software Engineer', email: 'preet.jain@demo.finadvisorpro.com', avatar: 'PJ', color: 'from-blue-500 to-indigo-600' },
    { name: 'Sneha Dubey', role: 'Product Manager', email: 'sneha.dubey@demo.finadvisorpro.com', avatar: 'SD', color: 'from-pink-500 to-rose-600' },
    { name: 'Sanika Rewde', role: 'Data Analyst', email: 'sanika.rewde@demo.finadvisorpro.com', avatar: 'SR', color: 'from-violet-500 to-purple-600' },
    { name: 'Tuhin Maji', role: 'Backend Developer', email: 'tuhin.maji@demo.finadvisorpro.com', avatar: 'TM', color: 'from-cyan-500 to-teal-600' },
    { name: 'Bikram Shrestha', role: 'Finance Analyst', email: 'bikram.shrestha@demo.finadvisorpro.com', avatar: 'BS', color: 'from-amber-500 to-orange-600' },
    { name: 'Haresh Prajapati', role: 'Business Owner', email: 'haresh.prajapati@demo.finadvisorpro.com', avatar: 'HP', color: 'from-green-500 to-emerald-600' },
    { name: 'Priyanshu Pandey', role: 'UI/UX Designer', email: 'priyanshu.pandey@demo.finadvisorpro.com', avatar: 'PP', color: 'from-fuchsia-500 to-pink-600' },
    { name: 'Vedant Upadhyay', role: 'DevOps Engineer', email: 'vedant.upadhyay@demo.finadvisorpro.com', avatar: 'VU', color: 'from-sky-500 to-blue-600' },
    { name: 'Bhumika Sharma', role: 'HR Manager', email: 'bhumika.sharma@demo.finadvisorpro.com', avatar: 'BS', color: 'from-rose-500 to-red-600' },
    { name: 'Kavya Menon', role: 'Doctor', email: 'kavya.menon@demo.finadvisorpro.com', avatar: 'KM', color: 'from-teal-500 to-cyan-600' },
]


const features = [
    { icon: TrendingUp, text: 'AI-powered portfolio insights', color: 'text-blue-400' },
    { icon: Shield, text: 'Bank-grade security & encryption', color: 'text-green-400' },
    { icon: Zap, text: 'Real-time market intelligence', color: 'text-yellow-400' },
    { icon: Sparkles, text: 'Personalized wealth planner', color: 'text-purple-400' },
]

export default function LoginPage() {
    const router = useRouter()
    const [step, setStep] = useState<'identifier' | 'otp'>('identifier')
    const [identifier, setIdentifier] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(0)
    const [demoLoading, setDemoLoading] = useState<string | null>(null)
    const [showDemo, setShowDemo] = useState(false)

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (timer > 0) interval = setInterval(() => setTimer(p => p - 1), 1000)
        return () => clearInterval(interval)
    }, [timer])

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

    const handleCheckUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { exists } = await checkUserExists(identifier)
            if (exists) {
                const isPhone = /^\+?[0-9]{10,15}$/.test(identifier)
                if (isPhone) { await sendTextBeeOtp(identifier); toast.success('OTP sent to your phone') }
                else { await loginWithEmail(identifier); toast.success('OTP sent to your email') }
                setStep('otp')
                setTimer(300)
            } else {
                const isPhone = /^\+?[0-9]{10,15}$/.test(identifier)
                const isEmail = identifier.includes('@')
                let query = ''
                if (isPhone) query = `?phone=${encodeURIComponent(identifier)}`
                if (isEmail) query = `?email=${encodeURIComponent(identifier)}`
                toast.info('Looks like you are new! Setting up your profile...')
                router.push(`/register${query}`)
            }
        } catch { toast.error('Error checking user') }
        finally { setLoading(false) }
    }

    const handleResendOtp = async () => {
        setLoading(true)
        try {
            const isPhone = /^\+?[0-9]{10,15}$/.test(identifier)
            if (isPhone) await sendTextBeeOtp(identifier)
            else await loginWithEmail(identifier)
            toast.success('OTP Resent')
            setTimer(300)
        } catch { toast.error('Failed to resend') }
        finally { setLoading(false) }
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const isPhone = /^\+?[0-9]{10,15}$/.test(identifier)
            const result = isPhone ? await verifyTextBeeOtp(identifier, otp) : await verifyOtp(identifier, otp)
            if (result?.error) toast.error(result.error)
            else { toast.success('Login Successful'); setTimeout(() => router.push('/dashboard'), 500) }
        } catch { toast.error('Verification failed') }
        finally { setLoading(false) }
    }

    const handleDemoLogin = async (email: string) => {
        setDemoLoading(email)
        try {
            const result = await loginWithPassword(email, 'Demo@1234')
            if (result?.error) { toast.error(result.error); return }
            toast.success('Logged in as demo user!')
            setTimeout(() => router.push('/dashboard'), 500)
        } catch { toast.error('Demo login failed') }
        finally { setDemoLoading(null) }
    }

    return (
        <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Left Panel — Branding */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
            >
                {/* Orbs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                {/* Grid */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />

                {/* Logo */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-extrabold text-xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Fin Advisor Pro
                    </span>
                </motion.div>

                {/* Center Content */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-4xl font-black text-white leading-tight mb-4">
                            Your Wealth,<br />
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Intelligently Managed</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Join thousands of smart investors making confident financial decisions with AI.
                        </p>
                    </div>
                    <div className="space-y-4">
                        {features.map((f, i) => (
                            <motion.div key={f.text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-center gap-3 text-slate-300">
                                <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${f.color}`}>
                                    <f.icon className="h-4 w-4" />
                                </div>
                                <span className="text-sm">{f.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom */}
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="relative z-10 text-slate-600 text-xs">
                    © 2024 Fin Advisor Pro · <Link href="/" className="hover:text-slate-400 transition-colors">Home</Link>
                </motion.p>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950">
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-extrabold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Fin Advisor Pro
                        </span>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'identifier' ? (
                            <motion.div key="identifier" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                                <div className="mb-8">
                                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Welcome back 👋</h1>
                                    <p className="text-gray-500 dark:text-gray-400">Sign in or create your free account</p>
                                </div>

                                <form onSubmit={handleCheckUser} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Email or Phone Number
                                        </Label>
                                        <Input
                                            placeholder="name@example.com or +919000000000"
                                            value={identifier}
                                            onChange={e => setIdentifier(e.target.value)}
                                            required
                                            className="h-12 text-base rounded-xl border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50 dark:bg-white/5"
                                            autoFocus
                                        />
                                    </div>
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Continue <ArrowRight className="h-4 w-4" /></>}
                                    </motion.button>
                                </form>

                                {/* ─── Demo Accounts Panel ─── */}
                                <div className="mt-6 rounded-2xl border border-blue-100 dark:border-blue-900/40 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setShowDemo(v => !v)}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-950/40 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            Try a Demo Account
                                        </span>
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showDemo ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {showDemo && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-3 grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                                                    {DEMO_USERS.map(u => (
                                                        <button
                                                            key={u.email}
                                                            type="button"
                                                            disabled={!!demoLoading}
                                                            onClick={() => handleDemoLogin(u.email)}
                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left disabled:opacity-60 border border-transparent hover:border-gray-100 dark:hover:border-white/10"
                                                        >
                                                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${u.color} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
                                                                {demoLoading === u.email
                                                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                                                    : u.avatar
                                                                }
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{u.name}</p>
                                                                <p className="text-xs text-gray-400 truncate">{u.role}</p>
                                                            </div>
                                                            <ArrowRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 ml-auto shrink-0" />
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-center text-[10px] text-gray-400 pb-2">All demo accounts use password: <span className="font-mono font-bold">Demo@1234</span></p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-white/10" />
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white dark:bg-gray-950 px-3 text-xs text-gray-400 uppercase tracking-wider">or</span>
                                    </div>
                                </div>

                                <motion.button
                                    type="button"
                                    onClick={() => signInWithGoogle()}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-12 text-base font-semibold rounded-xl border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                                >
                                    {/* Official Google G logo */}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </motion.button>

                                <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
                                    Don't have an account? Just enter your email above — we'll set you up.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                                <div className="mb-8">
                                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Check your inbox</h1>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        We sent a 6-digit code to{' '}
                                        <span className="font-semibold text-gray-900 dark:text-white">{identifier}</span>
                                    </p>
                                    <button onClick={() => setStep('identifier')}
                                        className="mt-1 text-blue-600 dark:text-blue-400 text-xs font-medium hover:underline flex items-center gap-1">
                                        <Edit2 className="h-3 w-3" /> Change
                                    </button>
                                </div>

                                <form onSubmit={handleVerify} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">6-digit code</Label>
                                        <Input
                                            type="text"
                                            placeholder="• • • • • •"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            required
                                            maxLength={6}
                                            autoFocus
                                            className="text-center text-3xl tracking-[0.7em] h-16 font-mono rounded-xl border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:border-blue-500"
                                        />
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full h-12 text-base font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Sign In →'}
                                    </motion.button>
                                </form>

                                <div className="mt-5 text-center text-sm">
                                    {timer > 0 ? (
                                        <p className="text-gray-400">Resend code in <span className="font-mono font-bold text-gray-900 dark:text-white">{formatTime(timer)}</span></p>
                                    ) : (
                                        <button onClick={handleResendOtp} disabled={loading}
                                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 mx-auto">
                                            <RotateCcw className="h-3.5 w-3.5" /> Resend code
                                        </button>
                                    )}
                                </div>

                                {/* OTP progress dots */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i < otp.length ? 'bg-blue-600 scale-110' : 'bg-gray-200 dark:bg-white/10'
                                            }`} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-400">
                        <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">← Back to Home</Link>
                        <Link href="/admin/login" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Admin Login →</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
