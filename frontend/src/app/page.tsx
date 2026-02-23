'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowRight, BarChart3, ShieldCheck, TrendingUp, LineChart, Lock,
  LayoutDashboard, Phone, ChevronDown, Sparkles, Zap, Globe, Award,
  Users, Star
} from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from '@/lib/supabase/client'
import { ConsultationModal } from '@/components/consultation-modal'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' as const }
  })
}
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.1 }
  })
}

/* ─── 3D tilt card ─── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const rotX = (-y / rect.height) * 12
    const rotY = (x / rect.width) * 12
    el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`
  }
  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }
  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

/* ─── Animated counter ─── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      let start = 0
      const step = target / 60
      const timer = setInterval(() => {
        start += step
        if (start >= target) { setCount(target); clearInterval(timer); return }
        setCount(Math.floor(start))
      }, 16)
      observer.disconnect()
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

/* ─── Floating orb ─── */
function FloatingOrb({ color, size, top, left, delay = 0 }: { color: string; size: number; top: string; left: string; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, top, left, background: color, filter: 'blur(80px)', opacity: 0.25 }}
      animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, -60])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const features = [
    {
      icon: TrendingUp,
      title: 'Smart Rating System',
      desc: 'Our AI evaluates risk, return, stability, and liquidity to give every asset a 1–5 star rating.',
      color: 'from-blue-500 to-cyan-500',
      glow: 'rgba(59,130,246,0.25)',
      badge: 'AI-Powered'
    },
    {
      icon: LineChart,
      title: 'Live Portfolio Tracking',
      desc: 'Real-time wealth updates, profit/loss analysis, and interactive growth charts.',
      color: 'from-indigo-500 to-purple-500',
      glow: 'rgba(99,102,241,0.25)',
      badge: 'Real-Time'
    },
    {
      icon: Lock,
      title: 'Bank-Grade Security',
      desc: 'Supabase Auth, Row Level Security, and encrypted data keeping your wealth safe.',
      color: 'from-violet-500 to-pink-500',
      glow: 'rgba(167,139,250,0.25)',
      badge: 'Encrypted'
    },
    {
      icon: BarChart3,
      title: 'SIP & EMI Calculators',
      desc: 'Advanced calculators for SIP, EMI, advance tax, gratuity, retirement — all built-in.',
      color: 'from-emerald-500 to-teal-500',
      glow: 'rgba(16,185,129,0.25)',
      badge: '10+ Tools'
    },
    {
      icon: Globe,
      title: 'Live Market Data',
      desc: 'Real-time stocks, crypto, mutual funds, forex, and commodities — all in one dashboard.',
      color: 'from-amber-500 to-orange-500',
      glow: 'rgba(245,158,11,0.25)',
      badge: 'Live'
    },
    {
      icon: Users,
      title: 'Expert Consultations',
      desc: 'Book free calls with certified financial advisors and get personalised guidance.',
      color: 'from-rose-500 to-pink-500',
      glow: 'rgba(244,63,94,0.25)',
      badge: 'Free'
    },
  ]

  const stats = [
    { icon: Users, value: 10000, suffix: '+', label: 'Active Investors' },
    { icon: Globe, value: 50, suffix: '+', label: 'Cities Served' },
    { icon: Award, value: 99, suffix: '%', label: 'Satisfaction Rate' },
    { icon: Star, value: 4, suffix: '.9★', label: 'Average Rating' },
  ]

  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence>
        {showModal && <ConsultationModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>

      {/* ─── Glassmorphism Navbar ─── */}
      <motion.header
        className={`px-6 h-16 flex items-center justify-between sticky top-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-white/10'
          : 'bg-transparent border-b border-transparent'
          }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2 font-extrabold text-xl">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">Fin Advisor Pro</span>
          </motion.div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {/* About */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors duration-200 outline-none group">
                About <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuItem asChild><Link href="/about/story" className="cursor-pointer">Our Story</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/about/advisors" className="cursor-pointer">Our Qualified Financial Advisors</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="#contact" className="hover:text-blue-500 transition-colors duration-200">Contact</Link>

          {/* Planning Tools */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors duration-200 outline-none group">
                Planning Tools <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuItem asChild><Link href="/planning/budget" className="cursor-pointer">Income &amp; Expense</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/planning/investment" className="cursor-pointer">Investment Planning</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/planning/insurance" className="cursor-pointer">Insurance Planning</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/planning/loan" className="cursor-pointer">Loan Planning</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/planning/estate" className="cursor-pointer">Will &amp; Estate</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/planning" className="cursor-pointer font-semibold text-blue-600">Planning Centre</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Calculators */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors duration-200 outline-none group">
                Calculators <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-60">
              <DropdownMenuItem asChild><Link href="/calculators/sip" className="cursor-pointer font-medium text-green-600">SIP Calculator (Smart)</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/calculators/emi" className="cursor-pointer font-medium text-orange-600">EMI Calculator</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/calculators/retirement" className="cursor-pointer">Retirement Planner</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/calculators/gratuity" className="cursor-pointer">Gratuity Calculator</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/calculators/refinance" className="cursor-pointer">Loan Refinance</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/calculators/advance-tax" className="cursor-pointer">Advance Tax Calc</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/calculators" className="flex w-full items-center justify-center font-bold text-blue-600">View All Calculators →</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Rankings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 hover:text-blue-500 transition-colors duration-200 outline-none group">
                Rankings <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              <DropdownMenuItem asChild><Link href="/ranking/mutual-fund" className="cursor-pointer">Mutual Funds</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/ranking/credit-card" className="cursor-pointer">Best Credit Cards</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/ranking/stocks" className="cursor-pointer text-red-600 font-medium">Live Top Stocks</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/ranking/crypto" className="cursor-pointer text-orange-600">Crypto Live</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/ranking/loan" className="cursor-pointer">Home Loans</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/ranking/insurance" className="cursor-pointer">Best Insurance</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/ranking/nps" className="cursor-pointer">NPS Funds</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/market" className="flex items-center gap-1 hover:text-blue-500 transition-colors duration-200">
            Market{' '}
            <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-400/20 text-yellow-600 border border-yellow-400/30 animate-pulse">LIVE</span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
          ) : user ? (
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg btn-glow">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </motion.div>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all outline-none"
                >
                  Login / Register
                  <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 mt-1 p-1.5">
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <LayoutDashboard className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">User Portal</div>
                      <div className="text-xs text-gray-400">Investors & members</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/login" className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer">
                    <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Admin Console</div>
                      <div className="text-xs text-gray-400">Platform management</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/caller/login" className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Caller Panel</div>
                      <div className="text-xs text-gray-400">Consultation agents</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.header>

      <main className="flex-1">
        {/* ─── HERO SECTION ─── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-bg">
          {/* Animated orbs */}
          <FloatingOrb color="#3b82f6" size={500} top="10%" left="-5%" delay={0} />
          <FloatingOrb color="#6366f1" size={400} top="50%" left="60%" delay={2} />
          <FloatingOrb color="#8b5cf6" size={300} top="70%" left="20%" delay={4} />
          <FloatingOrb color="#06b6d4" size={200} top="20%" left="80%" delay={1} />

          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />

          {/* Animated ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              className="w-[700px] h-[700px] rounded-full border border-indigo-500/10"
              animate={{ rotate: 360, scale: [1, 1.02, 1] }}
              transition={{ rotate: { duration: 30, repeat: Infinity, ease: 'linear' }, scale: { duration: 8, repeat: Infinity } }}
            />
            <motion.div
              className="absolute inset-8 rounded-full border border-blue-500/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Floating 3D cards in background */}
          <motion.div
            className="absolute top-1/4 right-[8%] hidden xl:block"
            animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="glass rounded-2xl p-4 w-48 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-green-400/30 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                </div>
                <span className="text-white/70 text-xs font-medium">Portfolio</span>
              </div>
              <p className="text-green-400 font-bold text-lg">+18.4%</p>
              <p className="text-white/40 text-xs">Annual Return</p>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-1/3 left-[8%] hidden xl:block"
            animate={{ y: [10, -10, 10], rotate: [2, -2, 2] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <div className="glass rounded-2xl p-4 w-44 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-400/30 flex items-center justify-center">
                  <Zap className="h-3 w-3 text-blue-400" />
                </div>
                <span className="text-white/70 text-xs font-medium">AI Score</span>
              </div>
              <p className="text-blue-400 font-bold text-lg">9.2 / 10</p>
              <div className="flex gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-blue-400' : 'bg-white/20'}`} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Third floating card */}
          <motion.div
            className="absolute top-[15%] left-[8%] hidden xl:block"
            animate={{ y: [0, -14, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          >
            <div className="glass rounded-2xl p-4 w-44 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-purple-400/30 flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-purple-400" />
                </div>
                <span className="text-white/70 text-xs font-medium">Risk Score</span>
              </div>
              <p className="text-purple-300 font-bold text-base">Low-Medium</p>
              <div className="flex items-center gap-1.5 mt-2">
                {['bg-purple-400', 'bg-purple-400', 'bg-purple-400', 'bg-white/20', 'bg-white/20'].map((c, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full ${c}`} />
                ))}
              </div>
              <p className="text-white/30 text-[10px] mt-1">Risk Appetite Profile</p>
            </div>
          </motion.div>

          {/* Hero content */}
          <motion.div
            className="relative z-10 text-center px-6 max-w-5xl mx-auto"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <motion.div variants={fadeIn} initial="hidden" animate="visible" custom={0}>
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-blue-200 border border-blue-400/30 bg-blue-500/10 mb-6 backdrop-blur-md shadow-lg shadow-blue-500/10">
                <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                </motion.span>
                AI-Powered Financial Planning · Free to Use
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6 text-white text-glow-white"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              Master Your Wealth
              <br />
              <span className="gradient-text-cool">with AI Intelligence</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-blue-100/70 max-w-2xl mx-auto mb-10 leading-relaxed"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              The professional financial planner that adapts to your risk, goals, and market trends.{' '}
              <span className="text-blue-300 font-semibold">Free forever.</span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              {user ? (
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59,130,246,0.6)' }}
                    whileTap={{ scale: 0.97 }}
                    className="h-14 px-10 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-2xl flex items-center gap-2 btn-glow"
                  >
                    Go to Dashboard <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>
              ) : (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59,130,246,0.6)' }}
                    whileTap={{ scale: 0.97 }}
                    className="h-14 px-10 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-2xl flex items-center gap-2 btn-glow"
                  >
                    Start Investing Now <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </Link>
              )}

              <motion.button
                onClick={() => setShowModal(true)}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(245,158,11,0.6)' }}
                whileTap={{ scale: 0.97 }}
                className="h-14 px-10 text-lg rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-2xl flex items-center gap-2"
              >
                <Phone className="h-5 w-5" /> Book Free Consultation
              </motion.button>

              <Link href="/dashboard-demo">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-14 px-10 text-lg rounded-2xl border-2 border-white/20 text-white/80 font-semibold hover:border-white/40 hover:text-white backdrop-blur-sm transition-all"
                >
                  View Live Demo
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </section>


        {/* ─── STATS SECTION ─── */}
        <section className="py-20 px-6" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1e 100%)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="text-center card-shimmer rounded-2xl border border-white/5 p-6"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 items-center justify-center mb-4">
                    <s.icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <p className="text-3xl font-black text-white">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-sm text-blue-200/50 mt-1 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* Dark-to-light bridge */}
        <div style={{ height: 80, background: 'linear-gradient(180deg, #0a0f1e 0%, #f8fafc 100%)' }} />

        {/* ─── FEATURES GRID ─── */}
        <section id="features" className="py-24 px-6 bg-white dark:bg-gray-950">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 mb-4">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                Built for{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smarter Investors
                </span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto text-lg">
                Everything you need to make confident financial decisions, all in one place.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <TiltCard className="h-full">
                    <div
                      className="h-full rounded-2xl p-8 border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group bg-white dark:bg-white/2"
                      style={{ background: `radial-gradient(ellipse at top left, ${f.glow} 0%, transparent 55%)` }}
                    >
                      {/* Animated shine on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)' }}
                      />

                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <f.icon className="h-7 w-7 text-white" />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${f.color} text-white shadow-sm`}>{f.badge}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{f.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{f.desc}</p>

                      {/* Bottom gradient accent */}
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA SECTION ─── */}
        {/* Light-to-dark bridge */}
        <div style={{ height: 80, background: 'linear-gradient(180deg, #f8fafc 0%, #0f172a 100%)' }} />
        <section className="py-24 px-6 relative overflow-hidden mesh-bg">
          <FloatingOrb color="#3b82f6" size={600} top="50%" left="50%" delay={0} />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Take Control of
                <br />
                <span className="gradient-text">Your Financial Future?</span>
              </h2>
              <p className="text-blue-100/60 text-lg mb-10">
                Join thousands of smart investors already using Fin Advisor Pro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59,130,246,0.6)' }}
                      whileTap={{ scale: 0.97 }}
                      className="h-14 px-10 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-2xl flex items-center gap-2 btn-glow"
                    >
                      Go to Dashboard <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59,130,246,0.6)' }}
                      whileTap={{ scale: 0.97 }}
                      className="h-14 px-10 text-lg rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-2xl flex items-center gap-2 btn-glow"
                    >
                      Get Started Free <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  </Link>
                )}
                <motion.button
                  onClick={() => setShowModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-14 px-10 text-lg rounded-2xl border-2 border-amber-500/40 text-amber-400 font-semibold hover:border-amber-400 hover:bg-amber-500/10 transition-all flex items-center gap-2"
                >
                  <Phone className="h-5 w-5" /> Talk to an Expert
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ─── Sticky Floating Button ─── */}
      {!user && (
        <motion.button
          onClick={() => setShowModal(true)}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 2, type: 'spring', stiffness: 300 }}
          whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(245,158,11,0.6)' }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-5 py-3 rounded-full shadow-2xl"
        >
          <Phone className="h-4 w-4" />
          Book Free Consultation
        </motion.button>
      )}

      <SiteFooter />
    </div>
  )
}
