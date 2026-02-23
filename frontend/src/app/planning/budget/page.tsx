"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { Trash2, ShieldAlert, Sparkles, Pencil, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

type BudgetCategory = "Income" | "Need" | "Want" | "Savings"

interface BudgetItem {
    id: string
    name: string
    amount: number
    category: BudgetCategory
}

export default function BudgetPlanningPage() {
    const [items, setItems] = useState<BudgetItem[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [newItemName, setNewItemName] = useState("")
    const [newItemAmount, setNewItemAmount] = useState("")
    const [newItemCategory, setNewItemCategory] = useState<BudgetCategory>("Need")
    const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)

    const supabase = createClient()

    // Load from Supabase on mount
    const loadItems = useCallback(async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const { data, error } = await supabase
            .from("budget_items")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true })

        if (error) { toast.error("Failed to load budget data"); setLoading(false); return }

        // If no data yet, seed with defaults
        if (!data || data.length === 0) {
            const defaults = [
                { name: "Salary", amount: 80000, category: "Income" as BudgetCategory },
                { name: "Rent", amount: 25000, category: "Need" as BudgetCategory },
                { name: "Groceries", amount: 10000, category: "Need" as BudgetCategory },
                { name: "Dining Out", amount: 8000, category: "Want" as BudgetCategory },
                { name: "SIP Investment", amount: 10000, category: "Savings" as BudgetCategory },
                { name: "Emergency Fund", amount: 120000, category: "Savings" as BudgetCategory },
            ]
            const { data: inserted } = await supabase
                .from("budget_items")
                .insert(defaults.map(d => ({ ...d, user_id: user.id })))
                .select()
            setItems(inserted || [])
        } else {
            setItems(data)
        }
        setLoading(false)
    }, [])

    useEffect(() => { loadItems() }, [loadItems])

    // --- calculations ---
    const totalIncome = items.filter(i => i.category === "Income").reduce((s, i) => s + i.amount, 0)
    const totalNeeds = items.filter(i => i.category === "Need").reduce((s, i) => s + i.amount, 0)
    const totalWants = items.filter(i => i.category === "Want").reduce((s, i) => s + i.amount, 0)
    const totalSavings = items.filter(i => i.category === "Savings" && i.name !== "Emergency Fund").reduce((s, i) => s + i.amount, 0)
    const emergencyCorpus = items.find(i => i.name === "Emergency Fund")?.amount || 0
    const monthlyExpenses = totalNeeds + totalWants
    const emergencyTarget = monthlyExpenses * 6
    const emergencyProgress = emergencyTarget > 0 ? (emergencyCorpus / emergencyTarget) * 100 : 0
    const needsPct = totalIncome > 0 ? (totalNeeds / totalIncome) * 100 : 0
    const wantsPct = totalIncome > 0 ? (totalWants / totalIncome) * 100 : 0
    const savingsPct = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0

    const getAISuggestion = () => {
        if (emergencyProgress < 50) return { title: "🚨 Critical: Vulnerable Details", msg: "Your Emergency Fund is dangerously low (<3 months). Pause extra investments and divert all surplus cash here first.", color: "bg-red-100 text-red-800 border-red-200" }
        if (wantsPct > 35) return { title: "⚠️ Lifestyle Inflation Alert", msg: `You are spending ${wantsPct.toFixed(0)}% on Wants (Target: 30%). FinPro AI suggests cutting back on lifestyle expenses.`, color: "bg-orange-100 text-orange-800 border-orange-200" }
        if (savingsPct < 20) return { title: "📉 Low Savings Rate", msg: "Your savings rate is below 20%. Try the 'Pay Yourself First' method.", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
        return { title: "✅ Financial Health: Excellent", msg: "Great job! Your ratios are optimal. Consider checking the Investment Planner.", color: "bg-green-100 text-green-800 border-green-200" }
    }
    const aiInsight = getAISuggestion()

    const addItem = async () => {
        if (!newItemName || !newItemAmount) return
        setSaving(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setSaving(false); return }

        const { data, error } = await supabase
            .from("budget_items")
            .insert({ user_id: user.id, name: newItemName, amount: Number(newItemAmount), category: newItemCategory })
            .select()
            .single()

        if (error) { toast.error("Failed to add item"); setSaving(false); return }
        setItems([...items, data])
        setNewItemName("")
        setNewItemAmount("")
        toast.success("Transaction Added!")
        setSaving(false)
    }

    const deleteItem = async (id: string) => {
        const { error } = await supabase.from("budget_items").delete().eq("id", id)
        if (error) { toast.error("Failed to delete"); return }
        setItems(items.filter(i => i.id !== id))
        toast.error("Transaction Deleted")
    }

    const saveEdit = async () => {
        if (!editingItem) return
        const { error } = await supabase
            .from("budget_items")
            .update({ name: editingItem.name, amount: editingItem.amount, category: editingItem.category })
            .eq("id", editingItem.id)
        if (error) { toast.error("Failed to update"); return }
        setItems(items.map(i => i.id === editingItem.id ? editingItem : i))
        setEditingItem(null)
        toast.success("Transaction Updated Successfully")
    }

    const chartData = [
        { name: "Needs", value: totalNeeds, color: "#3b82f6" },
        { name: "Wants", value: totalWants, color: "#f59e0b" },
        { name: "Savings", value: totalSavings, color: "#10b981" },
    ]

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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Smart Budget Tracker</h1>
                    <p className="text-muted-foreground">AI-Powered Cashflow Analysis — synced to your account.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Input */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-yellow-400" /> FinPro AI Insight</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`p-4 rounded-lg border ${aiInsight.color} bg-opacity-95 text-sm font-medium`}>
                                    <div className="font-bold mb-1">{aiInsight.title}</div>
                                    {aiInsight.msg}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Add Entry</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Item Name</Label>
                                    <Input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="e.g. Salary" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount (₹)</Label>
                                    <Input type="number" value={newItemAmount} onChange={e => setNewItemAmount(e.target.value)} placeholder="50000" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={newItemCategory} onValueChange={(v: any) => setNewItemCategory(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Income">Income (+)</SelectItem>
                                            <SelectItem value="Need">Need (Fixed)</SelectItem>
                                            <SelectItem value="Want">Want (Lifestyle)</SelectItem>
                                            <SelectItem value="Savings">Savings/Invest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={addItem} className="w-full" disabled={saving}>
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Transaction"}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="max-h-[320px] overflow-auto">
                            <CardContent className="pt-6 space-y-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between p-2 text-sm border-b items-center group">
                                        <div>
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-xs text-gray-400">{item.category}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={item.category === 'Income' ? "text-green-600 font-semibold" : "font-semibold"}>
                                                ₹{item.amount.toLocaleString('en-IN')}
                                            </span>
                                            <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingItem(item)}>
                                                            <Pencil className="h-3 w-3 text-blue-500" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader><DialogTitle>Edit Transaction</DialogTitle></DialogHeader>
                                                        {editingItem && (
                                                            <div className="space-y-4">
                                                                <div className="space-y-2">
                                                                    <Label>Name</Label>
                                                                    <Input value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Amount</Label>
                                                                    <Input type="number" value={editingItem.amount} onChange={e => setEditingItem({ ...editingItem, amount: Number(e.target.value) })} />
                                                                </div>
                                                                <Button onClick={saveEdit} className="w-full">Save Changes</Button>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteItem(item.id)}>
                                                    <Trash2 className="h-3 w-3 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Analysis */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <MetricCard label="Total Income" amount={totalIncome} />
                            <MetricCard label="Expenses" amount={monthlyExpenses} alert={monthlyExpenses > totalIncome} />
                            <MetricCard label="Savings Rate" amount={savingsPct.toFixed(0) + "%"} highlight />
                        </div>

                        <Card className="bg-indigo-50 border-indigo-100">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2 font-semibold text-indigo-900">
                                        <ShieldAlert className="h-5 w-5" /> Emergency Fund Progress
                                    </div>
                                    <span className="text-sm font-medium">{emergencyProgress.toFixed(0)}%</span>
                                </div>
                                <Progress value={emergencyProgress} className="h-3 bg-indigo-200" />
                                <div className="flex justify-between mt-2 text-xs text-indigo-700">
                                    <span>Current: ₹{emergencyCorpus.toLocaleString('en-IN')}</span>
                                    <span>Target: ₹{emergencyTarget.toLocaleString('en-IN')} (6 Months)</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>50/30/20 Rule Analysis</CardTitle></CardHeader>
                            <CardContent className="h-[250px] flex">
                                <div className="flex-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                                                {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 flex flex-col justify-center gap-4 text-sm">
                                    <LegendItem color={needsPct > 50 ? "text-red-500" : "text-blue-500"} label={`Needs (${needsPct.toFixed(0)}%)`} target="Target: 50%" />
                                    <LegendItem color={wantsPct > 30 ? "text-red-500" : "text-orange-500"} label={`Wants (${wantsPct.toFixed(0)}%)`} target="Target: 30%" />
                                    <LegendItem color={savingsPct < 20 ? "text-red-500" : "text-green-500"} label={`Savings (${savingsPct.toFixed(0)}%)`} target="Target: 20%" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

function MetricCard({ label, amount, alert, highlight }: any) {
    return (
        <Card className={`${alert ? 'bg-red-50 border-red-200' : highlight ? 'bg-green-50 border-green-200' : ''}`}>
            <CardContent className="p-6 text-center">
                <div className="text-xs text-muted-foreground uppercase">{label}</div>
                <div className={`text-2xl font-bold ${alert ? 'text-red-700' : highlight ? 'text-green-700' : ''}`}>
                    {typeof amount === 'number' ? `₹${amount.toLocaleString('en-IN')}` : amount}
                </div>
            </CardContent>
        </Card>
    )
}

function LegendItem({ color, label, target }: any) {
    return (
        <div className="flex items-center justify-between border-b pb-2">
            <span className={`font-semibold ${color}`}>{label}</span>
            <span className="text-gray-400 text-xs">{target}</span>
        </div>
    )
}
