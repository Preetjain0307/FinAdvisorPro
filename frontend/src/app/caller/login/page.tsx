"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Lock, Eye, EyeOff, AlertCircle, Loader2, Headphones } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const CALLER_EMAIL = "caller@finadvisorpro.com"
const CALLER_PASSWORD = "caller123"

export default function CallerLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const login = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setTimeout(() => {
            if (email.trim() === CALLER_EMAIL && password === CALLER_PASSWORD) {
                sessionStorage.setItem("callerAuth", "true")
                router.push("/caller")
            } else {
                setError("Invalid credentials. Contact your admin.")
            }
            setLoading(false)
        }, 500)
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #0f172a 100%)', fontFamily: "'Inter', sans-serif" }}
        >
            {/* Animated orbs */}
            <motion.div animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 7, repeat: Infinity }}
                className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <motion.div animate={{ y: [0, 20, 0], scale: [1, 1.15, 1] }} transition={{ duration: 9, repeat: Infinity, delay: 2 }}
                className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                        className="inline-flex relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                            <Headphones className="h-8 w-8 text-white" />
                        </div>
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-2xl bg-blue-500/30" />
                    </motion.div>
                    <h1 className="text-2xl font-black text-white mt-4">Caller Panel</h1>
                    <p className="text-slate-400 text-sm mt-1">Fin Advisor Pro — Consultation Management</p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
                    <h2 className="text-lg font-bold text-white mb-6">Sign In to Dashboard</h2>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-4">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={login} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</Label>
                            <Input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                type="email"
                                placeholder="caller@finadvisorpro.com"
                                required
                                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Password</Label>
                            <div className="relative">
                                <Input
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    type={showPass ? "text" : "password"}
                                    placeholder="••••••••••"
                                    required
                                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:border-blue-500 pr-10"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Signing in...</> : <><Lock className="h-4 w-4" /> Sign In</>}
                        </motion.button>
                    </form>

                    <div className="mt-5 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-slate-500 space-y-1">
                        <p className="font-semibold text-slate-400 mb-1.5">Default credentials</p>
                        <p className="font-mono text-blue-400">📧 caller@finadvisorpro.com</p>
                        <p className="font-mono text-blue-400">🔑 caller123</p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
