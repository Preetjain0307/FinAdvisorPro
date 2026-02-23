"use client"

import { DashboardNavbar } from "@/components/dashboard-navbar"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Linkedin, Mail, Award, CheckCircle2 } from "lucide-react"

const ADVISORS = [
    {
        name: "Preet Jain",
        role: "Chief Investment Officer",
        specialty: "Equity Research & Portfolio Management",
        bio: "Preet leads our investment strategies, bringing over a decade of experience in identifying high-growth assets and managing risk for high-net-worth individuals.",
        rating: "4.9/5",
        clients: "500+"
    },
    {
        name: "Sneha Dubey",
        role: "Head of Financial Planning",
        specialty: "Retirement & Tax Planning",
        bio: "Sneha specializes in long-term wealth preservation. She is an expert in tax-efficient investing and structuring retirement corpuses for peace of mind.",
        rating: "4.9/5",
        clients: "450+"
    },
    {
        name: "Sanika Rewde",
        role: "Senior Wealth Architect",
        specialty: "Estate Planning & Insurance",
        bio: "Sanika ensures that wealth is protected and passed on efficiently. Her expertise covers complex legacy planning, trust formation, and comprehensive insurance audits.",
        rating: "4.8/5",
        clients: "400+"
    },
    {
        name: "Tuhin Maji",
        role: "Lead Technical Analyst",
        specialty: "Algorithmic Trading & Market Trends",
        bio: "Tuhin combines finance with technology, designing the core algorithms that power our AI recommendations and identifying short-term market opportunities.",
        rating: "4.8/5",
        clients: "350+"
    }
]

export default function AdvisorsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />

            <main className="container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Qualified Financial Advisors</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Real experts behind the AI. Our team of certified professionals ensures that every algorithm and recommendation meets the highest standards of fiduciary care.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {ADVISORS.map((advisor, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-600">
                            <CardHeader className="flex flex-row gap-4 items-start">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xl font-bold text-blue-700 border-2 border-white shadow-sm">
                                    {advisor.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CardTitle>{advisor.name}</CardTitle>
                                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 hover:bg-green-100 flex gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> Certified
                                        </Badge>
                                    </div>
                                    <CardDescription className="font-medium text-blue-600 mt-1">{advisor.role}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {advisor.bio}
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Specialty</div>
                                        <div className="font-medium text-sm">{advisor.specialty}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Client Rating</div>
                                        <div className="font-medium text-sm flex items-center justify-end gap-1">
                                            <Award className="h-4 w-4 text-yellow-500" />
                                            {advisor.rating}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button className="flex-1 bg-gray-900 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2">
                                        <Mail className="h-4 w-4" /> Book Consultation
                                    </button>
                                    <button className="px-4 py-2 border rounded-md hover:bg-gray-50 transition text-blue-700">
                                        <Linkedin className="h-4 w-4" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
