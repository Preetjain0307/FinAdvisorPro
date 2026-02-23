"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calculator, CheckCircle2, AlertTriangle, Sparkles, Coins, Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface CustomDeduction { id: string; name: string; amount: number }

export default function TaxPlanningPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [income, setIncome] = useState(1200000)
    const [section80C, setSection80C] = useState(150000)
    const [section80D, setSection80D] = useState(25000)
    const [hra, setHra] = useState(100000)
    const [others, setOthers] = useState<CustomDeduction[]>([])

    const [newDedName, setNewDedName] = useState("")
    const [newDedAmount, setNewDedAmount] = useState("")

    const supabase = createClient()

    const load = useCallback(async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const [{ data: prof }, { data: deds }] = await Promise.all([
            supabase.from("tax_profile").select("*").eq("user_id", user.id).single(),
            supabase.from("tax_deductions").select("*").eq("user_id", user.id).order("created_at", { ascending: true })
        ])

        if (prof) {
            setIncome(prof.annual_income)
            setSection80C(prof.section_80c)
            setSection80D(prof.section_80d)
            setHra(prof.hra_exemption)
        }
        if (deds) setOthers(deds)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    const saveProfile = async (field: { annual_income?: number; section_80c?: number; section_80d?: number; hra_exemption?: number }) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await supabase.from("tax_profile").upsert({
            user_id: user.id,
            annual_income: income,
            section_80c: section80C,
            section_80d: section80D,
            hra_exemption: hra,
            ...field // override with latest value
        })
    }

    const addDeduction = async () => {
        if (!newDedName || !newDedAmount) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase.from("tax_deductions")
            .insert({ user_id: user.id, name: newDedName, amount: Number(newDedAmount) })
            .select().single()

        if (error) { toast.error("Failed to add deduction"); return }
        setOthers([...others, data])
        setNewDedName(""); setNewDedAmount("")
        toast.success("Deduction added!")
    }

    const removeDeduction = async (id: string) => {
        await supabase.from("tax_deductions").delete().eq("id", id)
        setOthers(others.filter(o => o.id !== id))
    }

    // --- Tax Logic ---
    const totalDeductions = section80C + section80D + hra + others.reduce((s, x) => s + x.amount, 0)

    const calculateNewRegime = (gross: number) => {
        const taxable = Math.max(0, gross - 50000)
        let tax = 0
        if (taxable > 1500000) tax += (taxable - 1500000) * 0.30 + 150000
        else if (taxable > 1200000) tax += (taxable - 1200000) * 0.20 + 90000
        else if (taxable > 900000) tax += (taxable - 900000) * 0.15 + 45000
        else if (taxable > 600000) tax += (taxable - 600000) * 0.10 + 15000
        else if (taxable > 300000) tax += (taxable - 300000) * 0.05
        if (taxable <= 700000) tax = 0
        return tax
    }

    const calculateOldRegime = (gross: number) => {
        const taxable = Math.max(0, gross - 50000 - totalDeductions)
        let tax = 0
        if (taxable > 1000000) tax += (taxable - 1000000) * 0.30 + 112500
        else if (taxable > 500000) tax += (taxable - 500000) * 0.20 + 12500
        else if (taxable > 250000) tax += (taxable - 250000) * 0.05
        if (taxable <= 500000) tax = 0
        return tax
    }

    const taxNew = calculateNewRegime(income)
    const taxOld = calculateOldRegime(income)
    const diff = Math.abs(taxNew - taxOld)
    const betterRegime = taxNew < taxOld ? "New Regime" : "Old Regime"

    const ai = taxNew < taxOld
        ? { msg: `Switch to the New Regime! You save ₹${diff.toLocaleString('en-IN')} instantly.`, status: "New Regime Wins 🏆" }
        : { msg: `Stick to the Old Regime! Your deductions save you ₹${diff.toLocaleString('en-IN')} more.`, status: "Old Regime Wins 🏆" }

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900"><DashboardNavbar />
            <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <Card className="bg-slate-900 text-white border-0 mb-8 shadow-xl">
                    <CardContent className="p-6 flex gap-6 items-center">
                        <div className="p-4 bg-yellow-500/20 rounded-full border border-yellow-500/50">
                            <Sparkles className="h-8 w-8 text-yellow-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Tax Saver AI</h1>
                            <p className="text-slate-300 text-lg">{ai.msg}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <div className="text-sm text-slate-400">Projected Tax Savings</div>
                            <div className="text-3xl font-bold text-green-400">₹ {diff.toLocaleString('en-IN')}</div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Tax Inputs (FY 24-25)</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Annual Income (₹)</Label>
                                <Input type="number" value={income}
                                    onChange={e => setIncome(Number(e.target.value))}
                                    onBlur={() => saveProfile({ annual_income: income })}
                                    className="text-lg font-semibold" />
                            </div>

                            <div className="p-4 bg-slate-50 rounded-lg border space-y-4">
                                <div className="font-semibold text-sm text-slate-600 mb-2">Common Deductions (Old Regime)</div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "Section 80C (Max 1.5L)", val: section80C, set: setSection80C, field: "section_80c" as const },
                                        { label: "Section 80D (Health)", val: section80D, set: setSection80D, field: "section_80d" as const },
                                        { label: "HRA / Home Loan Interest", val: hra, set: setHra, field: "hra_exemption" as const },
                                    ].map(({ label, val, set, field }) => (
                                        <div key={field} className="space-y-2">
                                            <Label>{label}</Label>
                                            <Input type="number" value={val}
                                                onChange={e => set(Number(e.target.value))}
                                                onBlur={() => saveProfile({ [field]: val } as any)} />
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="font-semibold text-sm text-slate-600 mb-2">Other Deductions (e.g. 80G, 80EEB)</div>
                                    <div className="flex gap-2 mb-2">
                                        <Input placeholder="Name" value={newDedName} onChange={e => setNewDedName(e.target.value)} />
                                        <Input placeholder="Amount" type="number" value={newDedAmount} onChange={e => setNewDedAmount(e.target.value)} />
                                        <Button onClick={addDeduction} size="icon"><Plus className="h-4 w-4" /></Button>
                                    </div>
                                    <div className="space-y-2">
                                        {others.map(o => (
                                            <div key={o.id} className="flex justify-between items-center text-sm p-2 bg-white rounded border">
                                                <span>{o.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono">₹{o.amount.toLocaleString('en-IN')}</span>
                                                    <Trash2 className="h-3 w-3 text-red-500 cursor-pointer" onClick={() => removeDeduction(o.id)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Card className={`text-center ${betterRegime === 'Old Regime' ? 'ring-4 ring-green-500 border-green-500 bg-green-50' : 'opacity-75'}`}>
                                <CardContent className="pt-6">
                                    <div className="text-muted-foreground font-semibold mb-2">Old Regime Tax</div>
                                    <div className="text-3xl font-bold">₹ {Math.round(taxOld).toLocaleString('en-IN')}</div>
                                    {betterRegime === 'Old Regime' && <Badge className="mt-2 bg-green-600">Recommended</Badge>}
                                </CardContent>
                            </Card>
                            <Card className={`text-center ${betterRegime === 'New Regime' ? 'ring-4 ring-green-500 border-green-500 bg-green-50' : 'opacity-75'}`}>
                                <CardContent className="pt-6">
                                    <div className="text-muted-foreground font-semibold mb-2">New Regime Tax</div>
                                    <div className="text-3xl font-bold">₹ {Math.round(taxNew).toLocaleString('en-IN')}</div>
                                    {betterRegime === 'New Regime' && <Badge className="mt-2 bg-green-600">Recommended</Badge>}
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Coins className="h-5 w-5" /> Tax Saving Opportunities</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <SuggestionRow label="Section 80C (EPF, PPF, ELSS)" current={section80C} limit={150000} />
                                <SuggestionRow label="Section 80D (Health Insurance)" current={section80D} limit={25000} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

function SuggestionRow({ label, current, limit }: any) {
    const isMaxed = current >= limit
    const gap = Math.max(0, limit - current)
    return (
        <div className="flex justify-between items-center p-3 border rounded hover:bg-slate-50 transition-colors">
            <div>
                <div className="font-semibold">{label}</div>
                {!isMaxed && <div className="text-xs text-orange-600 mt-1 font-medium">Potential to save tax on ₹{gap.toLocaleString('en-IN')} more</div>}
                {isMaxed && <div className="text-xs text-green-600 mt-1 font-medium">Fully Utilized! Great job.</div>}
            </div>
            <div className="text-right">
                <div className="font-mono font-medium">₹{current.toLocaleString('en-IN')} / {limit / 1000}k</div>
                {isMaxed ? <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto mt-1" /> : <AlertTriangle className="h-5 w-5 text-orange-400 ml-auto mt-1" />}
            </div>
        </div>
    )
}
