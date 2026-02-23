"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ChevronDown,
    Wallet,
    TrendingUp,
    Shield,
    Landmark,
    FileText,
    LayoutDashboard,
    ReceiptText,
    Calculator, Layers, Coins, Trophy, CreditCard, PieChart, Zap, BarChart2, Bitcoin, Home, Heart, Bot,
    Users, BarChart3, Settings2
} from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface DashboardNavbarProps {
    userProfile?: {
        full_name: string
    }
}

export function DashboardNavbar({ userProfile }: DashboardNavbarProps) {
    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/85 dark:bg-gray-950/85 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-white/5'
                    : 'bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-white/5'
                }`}
        >
            <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                {/* Brand / Logo Area */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 mr-2">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                <BarChart3 className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-extrabold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Fin Advisor Pro
                            </span>
                        </motion.div>
                    </Link>

                    {/* About Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="hidden sm:flex items-center gap-1 h-9 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <Users className="h-4 w-4" />
                                About
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-64">
                            <DropdownMenuItem asChild><Link href="/about/story">Our Story</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/about/advisors">Our Qualified Financial Advisors</Link></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Planning Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="hidden sm:flex items-center gap-1 h-9 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <PieChart className="h-4 w-4" />
                                Planning
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuLabel>Planning Modules</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link href="/planning/budget"><Wallet className="mr-2 h-4 w-4 text-blue-500" /> Income &amp; Expense</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/planning/investment"><TrendingUp className="mr-2 h-4 w-4 text-green-500" /> Investment</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/planning/insurance"><Shield className="mr-2 h-4 w-4 text-purple-500" /> Insurance</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/planning/loan"><Landmark className="mr-2 h-4 w-4 text-orange-500" /> Loans</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/planning/tax"><ReceiptText className="mr-2 h-4 w-4 text-yellow-600" /> Tax</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/planning/estate"><FileText className="mr-2 h-4 w-4 text-slate-500" /> Estate</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link href="/planning"><LayoutDashboard className="mr-2 h-4 w-4 text-indigo-600" /> Planning Centre</Link></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Calculators Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="hidden sm:flex items-center gap-1 h-9 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <Calculator className="h-4 w-4" />
                                Calculators
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60">
                            <DropdownMenuItem asChild><Link href="/calculators/sip"><TrendingUp className="mr-2 h-4 w-4 text-green-600" /> SIP Calculator (Adv)</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/calculators/emi"><Calculator className="mr-2 h-4 w-4 text-orange-600" /> EMI Calculator</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link href="/calculators/mf-overlap"><Layers className="mr-2 h-4 w-4" /> Mutual Fund Overlap</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/calculators/insurance-surrender"><Coins className="mr-2 h-4 w-4" /> Insurance Surrender</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/calculators/advance-tax"><Landmark className="mr-2 h-4 w-4" /> Advance Tax Calc</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/calculators" className="flex w-full items-center justify-center font-bold text-blue-600">
                                    View All Calculators →
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Rankings Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="hidden sm:flex items-center gap-1 h-9 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <Trophy className="h-4 w-4" />
                                Rankings
                                <ChevronDown className="h-3 w-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem asChild><Link href="/ranking/mutual-fund"><TrendingUp className="mr-2 h-4 w-4" /> Mutual Funds</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/ranking/credit-card"><CreditCard className="mr-2 h-4 w-4" /> Credit Cards</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/ranking/stocks"><BarChart2 className="mr-2 h-4 w-4 text-red-500" /> Top Stocks (Live)</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/ranking/crypto"><Bitcoin className="mr-2 h-4 w-4 text-orange-500" /> Crypto (Live)</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/ranking/loan"><Home className="mr-2 h-4 w-4 text-blue-600" /> Best Home Loans</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/ranking/insurance"><Heart className="mr-2 h-4 w-4 text-rose-500" /> Insurance Plans</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/ranking/nps"><Shield className="mr-2 h-4 w-4" /> NPS Ranking</Link></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Market */}
                    <Link href="/market">
                        <Button variant="ghost" className="hidden sm:flex items-center gap-1 h-9 text-gray-600 dark:text-gray-300 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                            <Zap className="h-4 w-4 text-yellow-500 fill-current" />
                            Market
                        </Button>
                    </Link>

                    {/* AI Advisor */}
                    <Link href="/advisor">
                        <Button variant="ghost" className="hidden sm:flex items-center gap-1 h-9 text-gray-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Bot className="h-4 w-4 text-blue-500" />
                            AI Advisor
                        </Button>
                    </Link>
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-none">
                            {userProfile?.full_name || 'Investor'}
                        </p>
                        <p className="text-xs text-blue-500 leading-none mt-0.5">Premium Member</p>
                    </div>
                    <Link href="/settings">
                        <Button variant="outline" size="sm" className="border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all gap-1.5">
                            <Settings2 className="h-3.5 w-3.5" />
                            Settings
                        </Button>
                    </Link>
                    <LogoutButton variant="outline" />
                </div>
            </div>
        </motion.header>
    )
}
