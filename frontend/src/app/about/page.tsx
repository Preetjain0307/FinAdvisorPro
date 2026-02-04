
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Instagram, ArrowRight, Target, Users, Award, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    const founders = [
        { name: "Preet Jain", role: "Co-Founder & CEO", expertise: "Financial Engineering" },
        { name: "Sneha Dubey", role: "Co-Founder & CTO", expertise: "AI & Machine Learning" },
        { name: "Sanika Rewde", role: "Co-Founder & CFO", expertise: "Investment Strategy" },
        { name: "Tuhin Maji", role: "Co-Founder & COO", expertise: "Operations & Growth" },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-950 border-b">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-blue-600">Fin Advisor Pro</Link>
                    <Link href="/">
                        <Button variant="ghost">← Back to Home</Button>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 space-y-16">

                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto">
                    <Badge className="mb-4">About Us</Badge>
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Democratizing Financial Intelligence
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        We're on a mission to make sophisticated investment analysis accessible to everyone,
                        powered by cutting-edge AI and data science.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-2">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Target className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Our Mission</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                To empower individuals with institutional-grade investment insights through AI-driven analysis,
                                making wealth creation accessible to all, regardless of their financial background.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-2">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Our Vision</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                A world where every investor, from beginners to experts, has the tools and confidence
                                to build wealth intelligently, backed by transparent, data-driven recommendations.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* What We Do */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold mb-6 text-center">What Makes Us Different</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">AI-Powered Ratings</h3>
                            <p className="text-sm text-muted-foreground">
                                Proprietary algorithm analyzing returns, risk, stability, and liquidity
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">Personalized Advice</h3>
                            <p className="text-sm text-muted-foreground">
                                Risk-profiled recommendations tailored to your unique financial goals
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">100% Free</h3>
                            <p className="text-sm text-muted-foreground">
                                No hidden fees, no subscriptions - premium features for everyone
                            </p>
                        </div>
                    </div>
                </div>

                {/* Meet the Team */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-3">Meet the Founding Team</h2>
                        <p className="text-muted-foreground">
                            A passionate team of finance and tech experts committed to your financial success
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {founders.map((founder, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition">
                                <CardContent className="pt-6">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                                        {founder.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <h3 className="font-bold text-lg">{founder.name}</h3>
                                    <p className="text-sm text-blue-600 font-medium mb-2">{founder.role}</p>
                                    <p className="text-xs text-muted-foreground">{founder.expertise}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Have questions? Want to collaborate? We'd love to hear from you!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                        <a href="mailto:finadvisorproteam@gmail.com" className="flex items-center gap-2 text-white hover:text-blue-200 transition">
                            <Mail className="h-5 w-5" />
                            <span>finadvisorproteam@gmail.com</span>
                        </a>
                        <span className="hidden sm:block text-blue-300">•</span>
                        <a href="https://www.instagram.com/finadvisorproteam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-blue-200 transition">
                            <Instagram className="h-5 w-5" />
                            <span>@finadvisorproteam</span>
                        </a>
                    </div>

                    <Link href="/login">
                        <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                            Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                        <div className="text-sm text-muted-foreground">Investments Analyzed</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-indigo-600 mb-2">50K+</div>
                        <div className="text-sm text-muted-foreground">Portfolio Combinations</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
                        <div className="text-sm text-muted-foreground">Free Forever</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-pink-600 mb-2">24/7</div>
                        <div className="text-sm text-muted-foreground">AI Analysis</div>
                    </div>
                </div>

            </main>
        </div>
    )
}
