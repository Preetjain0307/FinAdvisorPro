"use client"

import { useState, useEffect, useCallback } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { toast } from "sonner"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2, Sparkles, Zap, Pencil, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Loan {
    id: string
    name: string
    balance: number
    rate: number
}

export default function LoanPlanningPage() {
    const [loans, setLoans] = useState<Loan[]>([])
    const [loading, setLoading] = useState(true)
    const [strategy, setStrategy] = useLocalStorage<string>("loan_strategy", "avalanche")
    const [extraEmi, setExtraEmi] = useLocalStorage<number>("loan_extra_emi", 0)

    const [newName, setNewName] = useState("")
    const [newBalance, setNewBalance] = useState("")
    const [newRate, setNewRate] = useState("")

    const supabase = createClient()

    const loadLoans = useCallback(async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const { data, error } = await supabase
            .from("loans")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true })

        if (error) { toast.error("Failed to load loans"); setLoading(false); return }

        if (!data || data.length === 0) {
            // Seed defaults
            const defaults = [
                { name: "Home Loan", balance: 2500000, rate: 8.5 },
                { name: "Credit Card", balance: 45000, rate: 36.0 },
            ]
            const { data: inserted } = await supabase
                .from("loans")
                .insert(defaults.map(d => ({ ...d, user_id: user.id })))
                .select()
            setLoans(inserted || [])
        } else {
            setLoans(data)
        }
        setLoading(false)
    }, [])

    useEffect(() => { loadLoans() }, [loadLoans])

    const addLoan = async () => {
        if (!newName || !newBalance) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from("loans")
            .insert({ user_id: user.id, name: newName, balance: Number(newBalance), rate: Number(newRate) })
            .select().single()

        if (error) { toast.error("Failed to add loan"); return }
        setLoans([...loans, data])
        setNewName(""); setNewBalance(""); setNewRate("")
        toast.success("Liability Added Successfully")
    }

    const deleteLoan = async (id: string) => {
        const { error } = await supabase.from("loans").delete().eq("id", id)
        if (error) { toast.error("Failed to delete"); return }
        setLoans(loans.filter(l => l.id !== id))
        toast.error("Liability Removed")
    }

    const updateLoan = async (id: string, updated: Partial<Loan>) => {
        const { error } = await supabase.from("loans").update(updated).eq("id", id)
        if (error) { toast.error("Failed to update"); return }
        setLoans(loans.map(l => l.id === id ? { ...l, ...updated } : l))
        toast.success("Loan Updated")
    }

    const sortedLoans = [...loans].sort((a, b) => strategy === "avalanche" ? b.rate - a.rate : a.balance - b.balance)
    const totalDebt = loans.reduce((s, l) => s + l.balance, 0)
    const avgRate = loans.reduce((s, l) => s + l.rate, 0) / (loans.length || 1)
    const annualSavings = extraEmi * 12
    const yearsSaved = (annualSavings / totalDebt) * 5
    const interestSaved = annualSavings * yearsSaved * (avgRate / 100)

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="mb-8 p-6 bg-slate-900 rounded-xl text-white shadow-xl flex gap-6 items-center">
                    <div className="p-4 bg-blue-600 rounded-full animate-pulse">
                        <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-1">FinPro AI Debt Strategist</h2>
                        <p className="text-slate-300">
                            {loans.some(l => l.rate > 15)
                                ? "Analysis: You have high-interest toxic debt (>15%). AI strongly recommends the 'Avalanche' strategy."
                                : "Analysis: Your debt is managed. Use 'Snowball' to clear smaller loans and build momentum."}
                        </p>
                    </div>
                    <div className="ml-auto text-right">
                        <div className="text-xs text-slate-400 uppercase">Pre-payment potential</div>
                        <div className="text-2xl font-bold text-green-400">Save ~₹{Math.round(interestSaved).toLocaleString('en-IN')}</div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Add Liability</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <Input placeholder="Loan Name" value={newName} onChange={e => setNewName(e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input placeholder="Balance" type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)} />
                                    <Input placeholder="Rate %" type="number" value={newRate} onChange={e => setNewRate(e.target.value)} />
                                </div>
                                <Button onClick={addLoan} className="w-full">Add Loan</Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                            <CardHeader>
                                <CardTitle className="text-green-800 flex items-center gap-2"><Zap className="h-5 w-5" /> Turbo Charge</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Label>Add Extra Monthly Amount: ₹{extraEmi.toLocaleString('en-IN')}</Label>
                                <Slider value={[extraEmi]} onValueChange={v => setExtraEmi(v[0])} min={0} max={50000} step={500} />
                                <p className="text-xs text-green-700">Paying just ₹{extraEmi} extra can cut years off your tenure.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Tabs value={strategy} onValueChange={setStrategy} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="avalanche">Avalanche (Rate Focus)</TabsTrigger>
                                <TabsTrigger value="snowball">Snowball (Balance Focus)</TabsTrigger>
                            </TabsList>
                            {["avalanche", "snowball"].map(tab => (
                                <TabsContent key={tab} value={tab} className="space-y-4">
                                    {sortedLoans.map((l, i) => (
                                        <LoanCard key={l.id} loan={l} index={i}
                                            onDelete={() => deleteLoan(l.id)}
                                            onUpdate={(u: Partial<Loan>) => updateLoan(l.id, u)} />
                                    ))}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    )
}

function LoanCard({ loan, index, onDelete, onUpdate }: any) {
    const [editMode, setEditMode] = useState(false)
    const [editBalance, setEditBalance] = useState(loan.balance)
    const [editRate, setEditRate] = useState(loan.rate)

    return (
        <div className={`flex items-center p-4 border rounded-xl bg-white shadow-sm ${index === 0 ? 'border-l-4 border-l-blue-600' : ''}`}>
            <div className={`flex justify-center items-center w-8 h-8 rounded-full font-bold mr-4 ${index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {index + 1}
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center pr-4">
                    <h3 className="font-bold text-lg">{loan.name}</h3>
                    <div className="flex gap-2">
                        <Dialog open={editMode} onOpenChange={setEditMode}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Update Loan Details</DialogTitle></DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Outstanding Balance</Label>
                                        <Input type="number" value={editBalance} onChange={e => setEditBalance(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Interest Rate (%)</Label>
                                        <Input type="number" value={editRate} onChange={e => setEditRate(e.target.value)} />
                                    </div>
                                    <Button onClick={() => { onUpdate({ balance: Number(editBalance), rate: Number(editRate) }); setEditMode(false) }} className="w-full">Save Changes</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <div className="text-sm text-gray-600">Balance: <span className="font-semibold">₹{loan.balance.toLocaleString('en-IN')}</span></div>
                    <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">{loan.rate}% Interest</Badge>
                </div>
            </div>
            {index === 0 && <div className="ml-4 text-xs font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-full animate-pulse hidden sm:block">PAY THIS FIRST</div>}
        </div>
    )
}
