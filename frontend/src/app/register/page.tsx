'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { registerUser, sendTextBeeOtp, verifyTextBeeOtpForRegistration } from '../auth/actions'
import Link from 'next/link'
import { Loader2, ArrowLeft, User, Phone, Mail, Hash, CheckCircle2, BarChart3, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const initialEmail = searchParams.get('email') || ''
    const initialPhone = searchParams.get('phone') || ''

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [otpCode, setOtpCode] = useState('')
    const [timer, setTimer] = useState(0)

    const [formData, setFormData] = useState({
        full_name: '', email: initialEmail, phone: initialPhone,
        age: '', monthly_income: '0', monthly_expenses: '0',
        total_savings: '0', risk_score: 50, risk_category: 'Medium',
    })

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (timer > 0) interval = setInterval(() => setTimer(p => p - 1), 1000)
        return () => clearInterval(interval)
    }, [timer])

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

    const handleSendOtp = async () => {
        if (!formData.phone || formData.phone.length < 10) { toast.error('Please enter a valid phone number'); return }
        setLoading(true)
        const res = await sendTextBeeOtp(formData.phone)
        setLoading(false)
        if (res.error) toast.error(res.error)
        else { setOtpSent(true); setTimer(300); toast.success('OTP sent to ' + formData.phone) }
    }

    const handleVerifyOtp = async () => {
        setLoading(true)
        const res = await verifyTextBeeOtpForRegistration(formData.phone, otpCode)
        setLoading(false)
        if (res.error) toast.error(res.error)
        else { setOtpVerified(true); toast.success('Phone Verified! 🎉') }
    }

    const handleSubmit = async () => {
        if (formData.phone && !otpVerified) {
            if (step === 1) { setStep(2); if (!otpSent) handleSendOtp(); return }
            toast.error('Please verify your phone number'); return
        }
        setLoading(true)
        try {
            const result = await registerUser(formData)
            if (result.error) { toast.error(result.error); setLoading(false) }
            else { toast.success('Account created! Welcome.'); setTimeout(() => router.push('/dashboard'), 1000) }
        } catch { toast.error('Something went wrong'); setLoading(false) }
    }

    const update = (key: string, val: string) => setFormData(p => ({ ...p, [key]: val }))

    return (
        <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Left — Branding */}
            <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1e1b4b 100%)' }}>
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />

                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-extrabold text-xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Fin Advisor Pro
                    </span>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="relative z-10 space-y-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-4">
                            <Sparkles className="h-3 w-3" /> Free to join
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight">
                            Start your<br />
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                financial journey
                            </span>
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mt-3">
                            Create your profile in seconds and unlock AI-powered investment insights, tax planning, and wealth tracking.
                        </p>
                    </div>
                    <div className="space-y-3">
                        {[
                            'AI investment recommendations',
                            'Budget & expense tracking',
                            'Live market data & rankings',
                            'Insurance & tax planning',
                        ].map((feat, i) => (
                            <motion.div key={feat} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-center gap-2.5 text-sm text-slate-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                {feat}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="relative z-10 text-slate-600 text-xs">
                    © 2024 Fin Advisor Pro
                </motion.p>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950">
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md">

                    {/* Mobile Logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-extrabold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Fin Advisor Pro
                        </span>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2 mb-6">
                        {[1, 2].map(s => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-100 dark:bg-white/10'
                                }`} />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                                <div className="mb-6">
                                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">Create Profile</h1>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Step 1 of {formData.phone ? '2' : '1'} — Basic details</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5" /> Full Name
                                        </Label>
                                        <Input value={formData.full_name}
                                            onChange={e => update('full_name', e.target.value)}
                                            placeholder="e.g. Rahul Sharma" autoFocus
                                            className="h-11 rounded-xl border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:border-blue-500" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                            <Hash className="h-3.5 w-3.5" /> Age
                                        </Label>
                                        <Input type="number" value={formData.age}
                                            onChange={e => update('age', e.target.value)}
                                            placeholder="e.g. 28"
                                            className="h-11 rounded-xl border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:border-blue-500" />
                                    </div>

                                    {!initialEmail && (
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5" /> Email (optional)
                                            </Label>
                                            <Input type="email" value={formData.email}
                                                onChange={e => update('email', e.target.value)}
                                                placeholder="rahul@example.com"
                                                className="h-11 rounded-xl border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:border-blue-500" />
                                        </div>
                                    )}

                                    {!initialPhone && (
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5" /> Phone
                                            </Label>
                                            <Input value={formData.phone}
                                                onChange={e => update('phone', e.target.value)}
                                                placeholder="+91..."
                                                className="h-11 rounded-xl border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:border-blue-500" />
                                        </div>
                                    )}

                                    <motion.button type="button" onClick={handleSubmit}
                                        disabled={!formData.full_name || !formData.age || loading}
                                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> :
                                            (formData.phone ? 'Next: Verify Phone →' : 'Complete Registration →')}
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                                <div className="mb-6">
                                    <button onClick={() => setStep(1)}
                                        className="flex items-center gap-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm mb-3 transition-colors">
                                        <ArrowLeft className="h-4 w-4" /> Back
                                    </button>
                                    <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">Verify Phone</h1>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        Code sent to <span className="font-semibold text-gray-900 dark:text-white">{formData.phone}</span>
                                    </p>
                                </div>

                                {otpVerified ? (
                                    <div className="text-center py-6">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                                        <p className="font-bold text-gray-900 dark:text-white mb-1">Phone Verified!</p>
                                        <p className="text-sm text-gray-400 mb-5">Creating your account...</p>
                                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                            onClick={handleSubmit} disabled={loading}
                                            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60">
                                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Complete Registration →'}
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">6-digit OTP</Label>
                                            <Input value={otpCode} onChange={e => setOtpCode(e.target.value)}
                                                placeholder="• • • • • •" maxLength={6}
                                                className="text-center text-2xl tracking-[0.7em] h-14 font-mono rounded-xl border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:border-blue-500" />
                                        </div>

                                        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                            onClick={handleVerifyOtp} disabled={loading || !otpCode}
                                            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60">
                                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Create Account →'}
                                        </motion.button>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-400">{timer > 0 ? `Resend in ${formatTime(timer)}` : "Didn't get a code?"}</span>
                                            <button onClick={handleSendOtp} disabled={timer > 0 || loading}
                                                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline disabled:opacity-40 disabled:no-underline">
                                                Resend OTP
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-center text-xs text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Sign in</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <Suspense>
            <RegisterForm />
        </Suspense>
    )
}
