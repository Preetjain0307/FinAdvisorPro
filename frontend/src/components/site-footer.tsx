'use client'

import Link from 'next/link'
import { Mail, Instagram, BarChart3, TrendingUp, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 0) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.1 }
    })
}

export function SiteFooter() {
    return (
        <footer
            id="contact"
            className="relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1235 50%, #0a0f1e 100%)' }}
        >
            {/* Top gradient border */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            {/* Glow orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="grid md:grid-cols-3 gap-12 mb-12">

                    {/* Company Info */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={0}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <BarChart3 className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                Fin Advisor Pro
                            </h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Born from a vision at <strong className="text-white">Thakur College</strong>. We make professional financial intelligence accessible to everyone through AI.
                        </p>
                        <div className="flex gap-3">
                            <motion.a
                                href="mailto:finadvisorproteam@gmail.com"
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all"
                            >
                                <Mail className="h-4 w-4" />
                            </motion.a>
                            <motion.a
                                href="https://www.instagram.com/finadvisorproteam"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/40 hover:bg-pink-500/10 transition-all"
                            >
                                <Instagram className="h-4 w-4" />
                            </motion.a>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={1}
                    >
                        <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-400" />
                            Quick Links
                        </h4>
                        <div className="space-y-3 text-sm">
                            {[
                                { href: '/about/story', label: 'Our Story' },
                                { href: '/about/advisors', label: 'Our Advisors' },
                                { href: '/market', label: 'Live Market' },
                                { href: '/calculators/sip', label: 'SIP Calculator' },
                                { href: '/login', label: 'Login' },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors duration-200 group"
                                >
                                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-1 transition-all duration-200 group-hover:translate-x-0.5" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={2}
                    >
                        <h4 className="font-semibold text-white mb-5">Contact Us</h4>
                        <div className="space-y-3 text-sm text-slate-400">
                            <p>
                                <a href="mailto:finadvisorproteam@gmail.com" className="hover:text-blue-400 transition-colors duration-200">
                                    📧 finadvisorproteam@gmail.com
                                </a>
                            </p>
                            <p>
                                <a href="https://instagram.com/finadvisorproteam" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors duration-200">
                                    📸 @finadvisorproteam
                                </a>
                            </p>
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium">Founders</p>
                                <p className="text-white/80 font-medium leading-relaxed">
                                    Preet Jain, Sneha Dubey,<br />
                                    Sanika Rewde, Tuhin Maji
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom bar */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <p>© 2024 <span className="text-slate-400 font-medium">Fin Advisor Pro</span>. Intelligent Wealth Management for All.</p>
                    <p className="text-xs">Made with ❤️ at Thakur College of Engineering</p>
                </div>
            </div>
        </footer>
    )
}
