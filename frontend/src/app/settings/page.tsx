"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Mail, Shield, TrendingUp, Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")

    // Read-only data from other tables
    const [riskCategory, setRiskCategory] = useState<string | null>(null)
    const [riskScore, setRiskScore] = useState<number | null>(null)
    const [budgetCount, setBudgetCount] = useState<number>(0)
    const [loanCount, setLoanCount] = useState<number>(0)

    const supabase = createClient()

    const load = useCallback(async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        setEmail(user.email || "")

        const [{ data: profile }, { data: rp }, { data: budget }, { data: loans }] = await Promise.all([
            supabase.from("profiles").select("full_name, phone").eq("id", user.id).single(),
            supabase.from("risk_profiles").select("risk_category, quiz_score, completed").eq("user_id", user.id).single(),
            supabase.from("budget_items").select("id").eq("user_id", user.id),
            supabase.from("loans").select("id").eq("user_id", user.id),
        ])

        if (profile) {
            setFullName(profile.full_name || "")
            setPhone(profile.phone || "")
        }
        if (rp?.completed) {
            setRiskCategory(rp.risk_category)
            setRiskScore(rp.quiz_score)
        }
        if (budget) setBudgetCount(budget.length)
        if (loans) setLoanCount(loans.length)

        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    const save = async () => {
        setSaving(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setSaving(false); return }

        const { error } = await supabase.from("profiles")
            .upsert({ id: user.id, full_name: fullName.trim(), phone: phone.trim() })

        if (error) {
            toast.error("Failed to save profile")
        } else {
            toast.success("Profile updated!")
        }
        setSaving(false)
    }

    const riskBadgeColor = riskCategory === "Aggressive"
        ? "bg-violet-100 text-violet-700"
        : riskCategory === "Moderate"
            ? "bg-blue-100 text-blue-700"
            : "bg-emerald-100 text-emerald-700"

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900"><DashboardNavbar />
            <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8 max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Profile & Settings</h1>
                    <p className="text-muted-foreground">Manage your personal information and view your financial summary.</p>
                </div>

                {/* Profile Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Personal Information</CardTitle>
                        <CardDescription>This info is used across your financial profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
                            <Input value={email} disabled className="bg-gray-100 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">Email is linked to your login and cannot be changed here.</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><User className="h-4 w-4" /> Full Name</Label>
                            <Input
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                placeholder="e.g. Preet Jain"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone Number</Label>
                            <Input
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="e.g. +91 98765 43210"
                                type="tel"
                            />
                        </div>
                        <Button onClick={save} disabled={saving} className="w-full gap-2">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Financial Summary Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Your Financial Snapshot</CardTitle>
                        <CardDescription>A summary of your data across planning modules.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 border rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">{budgetCount}</div>
                                <div className="text-sm text-muted-foreground mt-1">Budget Entries</div>
                            </div>
                            <div className="p-4 bg-slate-50 border rounded-lg text-center">
                                <div className="text-2xl font-bold text-orange-600">{loanCount}</div>
                                <div className="text-sm text-muted-foreground mt-1">Active Loans</div>
                            </div>
                        </div>

                        <div className="border-t" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Risk Profile</span>
                            </div>
                            {riskCategory ? (
                                <div className="flex items-center gap-2">
                                    <Badge className={riskBadgeColor}>{riskCategory}</Badge>
                                    <span className="text-sm text-muted-foreground">Score: {riskScore}/100</span>
                                </div>
                            ) : (
                                <Link href="/planning/investment">
                                    <Button variant="outline" size="sm">Take Quiz →</Button>
                                </Link>
                            )}
                        </div>

                        <div className="border-t" />

                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-muted-foreground">Get personalized fund recommendations</span>
                            <Link href="/advisor">
                                <Button variant="outline" size="sm" className="gap-1">
                                    <TrendingUp className="h-4 w-4" /> AI Advisor
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
