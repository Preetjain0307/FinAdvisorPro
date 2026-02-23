"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldAlert, CheckCircle2, Bot, ShieldCheck, Plus, Trash2, Calendar, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

interface Renewal { id: string; name: string; renewal_date: string; premium: number }

export default function InsurancePlanningPage() {
    const [profile, setProfile] = useState({ annual_income: 1200000, total_liabilities: 2500000, existing_cover: 5000000 })
    // Health audit checkboxes are UI preferences only — not saved to DB
    const [checks, setChecks] = useState({ no_room_capping: false, zero_copay: true, pre_post_covered: true, restoration_benefit: false })
    const [renewals, setRenewals] = useState<Renewal[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [newRenewalName, setNewRenewalName] = useState("")
    const [newRenewalDate, setNewRenewalDate] = useState("")
    const [newRenewalPrem, setNewRenewalPrem] = useState("")

    const supabase = createClient()

    const load = useCallback(async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const [{ data: prof }, { data: ren }] = await Promise.all([
            supabase.from("insurance_profile").select("*").eq("user_id", user.id).single(),
            supabase.from("insurance_renewals").select("*").eq("user_id", user.id).order("renewal_date", { ascending: true })
        ])
        if (prof) setProfile(prof)
        if (ren) setRenewals(ren)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    const saveProfile = async (updated: typeof profile) => {
        setSaving(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setSaving(false); return }
        await supabase.from("insurance_profile").upsert({ ...updated, user_id: user.id })
        setProfile(updated)
        setSaving(false)
        toast.success("Insurance profile saved!")
    }

    const toggle = (key: keyof typeof checks) => {
        setChecks(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const addRenewal = async () => {
        if (!newRenewalName || !newRenewalDate) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase.from("insurance_renewals")
            .insert({ user_id: user.id, name: newRenewalName, renewal_date: newRenewalDate, premium: Number(newRenewalPrem) })
            .select().single()

        if (error) { toast.error("Failed to add renewal"); return }
        setRenewals([...renewals, data])
        setNewRenewalName(""); setNewRenewalDate(""); setNewRenewalPrem("")
        toast.success("Renewal Reminder Set")
    }

    const deleteRenewal = async (id: string) => {
        await supabase.from("insurance_renewals").delete().eq("id", id)
        setRenewals(renewals.filter(r => r.id !== id))
    }

    const requiredCover = (profile.annual_income * 20) + profile.total_liabilities
    const gap = requiredCover - profile.existing_cover
    const verdict = gap > 0
        ? { status: "Critical Gap", msg: `AI Calculation: You are under-insured by ₹${(gap / 100000).toFixed(1)} Lakhs based on the 20x Income Rule.`, color: "text-red-400" }
        : { status: "Protected", msg: "AI Analysis: Your coverage is sufficient. Great work!", color: "text-green-400" }

    const auditItems = [
        { key: "no_room_capping", label: "No Room Rent Capping" },
        { key: "zero_copay", label: "Zero Co-payment" },
        { key: "pre_post_covered", label: "Pre/Post Hospitalization Covered" },
        { key: "restoration_benefit", label: "Restoration Benefit" },
    ] as const

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900"><DashboardNavbar />
            <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="mb-8"><h1 className="text-3xl font-bold">Insurance Planning</h1><p className="text-muted-foreground">Coverage analysis & renewal tracker — synced to your account.</p></div>

                <Tabs defaultValue="life" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                        <TabsTrigger value="life"><ShieldCheck className="h-4 w-4 mr-2" />Life Cover</TabsTrigger>
                        <TabsTrigger value="health"><Bot className="h-4 w-4 mr-2" />Health Audit</TabsTrigger>
                        <TabsTrigger value="renewals"><Calendar className="h-4 w-4 mr-2" />Renewals</TabsTrigger>
                    </TabsList>

                    <TabsContent value="life">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader><CardTitle>Coverage Inputs</CardTitle><CardDescription>Enter your financial details</CardDescription></CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { label: "Annual Income (₹)", key: "annual_income" },
                                        { label: "Total Liabilities (₹)", key: "total_liabilities" },
                                        { label: "Existing Cover (₹)", key: "existing_cover" },
                                    ].map(({ label, key }) => (
                                        <div key={key} className="space-y-2">
                                            <Label>{label}</Label>
                                            <Input type="number" value={(profile as any)[key]}
                                                onChange={e => setProfile({ ...profile, [key]: Number(e.target.value) })}
                                                onBlur={() => saveProfile(profile)} />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-900 text-white">
                                <CardHeader><CardTitle>AI Coverage Analysis</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div><div className="text-sm text-slate-400">Required Cover (20x Rule)</div><div className="text-3xl font-bold">₹{(requiredCover / 100000).toFixed(1)}L</div></div>
                                    <div><div className="text-sm text-slate-400">Existing Cover</div><div className="text-2xl font-bold text-blue-400">₹{(profile.existing_cover / 100000).toFixed(1)}L</div></div>
                                    <div className={`p-4 bg-slate-800 rounded-lg ${verdict.color}`}>
                                        <div className="font-bold">{verdict.status}</div>
                                        <div className="text-sm mt-1 text-slate-300">{verdict.msg}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="health">
                        <Card>
                            <CardHeader><CardTitle>Health Policy Audit Checklist</CardTitle><CardDescription>Check which features your health policy includes</CardDescription></CardHeader>
                            <CardContent className="space-y-4">
                                {auditItems.map(({ key, label }) => (
                                    <div key={key} className="flex items-center gap-4 p-3 border rounded-lg">
                                        <Checkbox checked={checks[key]} onCheckedChange={() => toggle(key)} />
                                        <span className="font-medium">{label}</span>
                                        {checks[key] ? <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" /> : <ShieldAlert className="h-4 w-4 text-red-500 ml-auto" />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="renewals">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader><CardTitle>Add Renewal Reminder</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2"><Label>Policy Name</Label><Input value={newRenewalName} onChange={e => setNewRenewalName(e.target.value)} placeholder="Star Health Plan" /></div>
                                    <div className="space-y-2"><Label>Renewal Date</Label><Input type="date" value={newRenewalDate} onChange={e => setNewRenewalDate(e.target.value)} /></div>
                                    <div className="space-y-2"><Label>Annual Premium (₹)</Label><Input type="number" value={newRenewalPrem} onChange={e => setNewRenewalPrem(e.target.value)} /></div>
                                    <Button onClick={addRenewal} className="w-full">Set Reminder</Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Upcoming Renewals</CardTitle></CardHeader>
                                <CardContent className="space-y-3">
                                    {renewals.length === 0 ? <p className="text-muted-foreground text-center py-4">No renewals added yet.</p> : renewals.map(r => (
                                        <div key={r.id} className="flex justify-between items-center p-3 border rounded-lg">
                                            <div>
                                                <div className="font-medium">{r.name}</div>
                                                <div className="text-sm text-muted-foreground">{new Date(r.renewal_date).toLocaleDateString('en-IN')}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">₹{r.premium.toLocaleString('en-IN')}</Badge>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteRenewal(r.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
