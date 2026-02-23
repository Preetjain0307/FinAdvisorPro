"use client"

import { DashboardNavbar } from "@/components/dashboard-navbar"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Lightbulb, Users, School, Clock } from "lucide-react"

export default function OurStoryPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />

            <main className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            From Classroom to Cloud
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            The journey of four friends who turned a college project into a financial revolution.
                        </p>
                    </div>

                    {/* The Beginning */}
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <School className="h-6 w-6 text-yellow-500" />
                                The Origin at Thakur College
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                It all started in the corridors of <strong>Thakur College of Science and Commerce</strong>. Four friends—Preet, Sneha, Sanika, and Tuhin—shared a common frustration: financial planning was too complex for the average person.
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                What began as a discussion quickly turned into a mission. They envisioned a platform that could replace expensive financial advisors with intelligent, data-driven code.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border rotate-1">
                            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" alt="Students collaborating" className="rounded-xl object-cover h-64 w-full" />
                        </div>
                    </div>

                    {/* The Journey */}
                    <Card className="bg-white dark:bg-gray-950 border-blue-100 shadow-md">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">6 Months of Dedication</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Building Fin Advisor Pro wasn't easy. For <strong>6 months</strong>, the team worked tirelessly, balancing coding, research, and testing. From designing the "Smart Rating" algorithms to ensuring bank-grade security, every feature was crafted with precision.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* The Team */}
                    <div className="text-center space-y-6">
                        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                            <Users className="h-6 w-6 text-indigo-500" />
                            The Founders
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                "Preet Jain", "Sneha Dubey", "Sanika Rewde", "Tuhin Maji"
                            ].map((name, i) => (
                                <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border text-center">
                                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mb-2">
                                        {name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div className="font-semibold">{name}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            United by friendship and a shared vision, they successfully launched Fin Advisor Pro to help everyone master their wealth.
                        </p>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
