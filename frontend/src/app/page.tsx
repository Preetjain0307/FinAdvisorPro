
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, BarChart3, ShieldCheck, TrendingUp, Users, LineChart, Lock, Mail, Instagram } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

import { StockTicker } from '@/components/stock-ticker'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b bg-white dark:bg-gray-950 sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-700 dark:text-blue-500">
          <BarChart3 className="h-6 w-6" />
          <span>Fin Advisor Pro</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link href="#contact" className="hover:text-blue-600 transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="outline" size="sm" className="hidden sm:flex border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
              <ShieldCheck className="mr-2 h-4 w-4" /> Admin
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 md:py-32 px-6 text-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
              Master Your Wealth with <br />
              <span className="text-blue-600">AI-Powered Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The professional financial planner that adapts to your risk, goals, and market trends. Free forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/login">
                <Button size="lg" className="h-12 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg">
                  Start Investing Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard-demo">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-2">
                  View Live Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Live Market Ticker */}
        <StockTicker />

        {/* Features Grid */}
        <section id="features" className="py-20 px-6 bg-white dark:bg-gray-950">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Built for Smarter Investors</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg bg-blue-50/50 dark:bg-gray-900">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Smart Rating System</h3>
                  <p className="text-muted-foreground">Our AI evaluates risk, return, stability, and liquidity to give every asset a 1-5 star rating.</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-indigo-50/50 dark:bg-gray-900">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <LineChart className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Live Portfolio Tracking</h3>
                  <p className="text-muted-foreground">Real-time updates on your wealth, profit/loss analysis, and growth charts.</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-purple-50/50 dark:bg-gray-900">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">Bank-Grade Security</h3>
                  <p className="text-muted-foreground">Secured with Supabase Auth, Row Level Security, and encrypted data handling.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12" id="contact">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">Fin Advisor Pro</h3>
              <p className="text-gray-400 text-sm mb-4">
                AI-powered investment intelligence for everyone. Making wealth creation accessible.
              </p>
              <div className="flex gap-4">
                <a href="mailto:finadvisorproteam@gmail.com" className="text-gray-400 hover:text-white transition">
                  <Mail className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/finadvisorproteam" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link href="/about" className="block text-gray-400 hover:text-white transition">About Us</Link>
                <Link href="/investments" className="block text-gray-400 hover:text-white transition">Investments</Link>
                <Link href="/tools/sip" className="block text-gray-400 hover:text-white transition">SIP Calculator</Link>
                <Link href="/login" className="block text-gray-400 hover:text-white transition">Login</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>
                  <a href="mailto:finadvisorproteam@gmail.com" className="hover:text-blue-400 transition-colors">
                    Email: finadvisorproteam@gmail.com
                  </a>
                </p>
                <p>
                  <a href="https://instagram.com/finadvisorproteam" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    Instagram: @finadvisorproteam
                  </a>
                </p>
                <p className="pt-4">
                  <strong className="text-white">Founders:</strong><br />
                  Preet Jain, Sneha Dubey,<br />
                  Sanika Rewde, Tuhin Maji
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
            <p>© 2024 Fin Advisor Pro. Intelligent Wealth Management for All.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
