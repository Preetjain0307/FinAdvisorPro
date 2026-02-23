"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { AlertTriangle, Bot, Target, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

interface Goal { id: string; name: string; target_amount: number; current_amount: number }

export default function InvestmentPlanningPage() {
    const [loading, setLoading] = useState(true)
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [step, setStep] = useState(1)
    const [score, setScore] = useState(0)

    const [goals, setGoals] = useState<Goal[]>([])
    const [newGoalName, setNewGoalName] = useState("")
    const [newGoalTarget, setNewGoalTarget] = useState("")
    const [newGoalCurrent, setNewGoalCurrent] = useState("")

    const supabase = createClient()

    const load = useCallback(async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const [{ data: riskProf }, { data: goalsData }] = await Promise.all([
            supabase.from("risk_profiles").select("*").eq("user_id", user.id).single(),
            supabase.from("investment_goals").select("*").eq("user_id", user.id).order("created_at", { ascending: true })
        ])

        if (riskProf && riskProf.completed) {
            setScore(riskProf.quiz_score)
            setQuizCompleted(true)
        }
        if (goalsData) setGoals(goalsData)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    const questions = [
        { text: "What is your Age Group?", options: [{ label: "Above 50", points: 10 }, { label: "35 - 50", points: 20 }, { label: "25 - 35", points: 30 }, { label: "Under 25", points: 40 }] },
        { text: "Investment Experience?", options: [{ label: "None", points: 5 }, { label: "Basic (FDs)", points: 10 }, { label: "Mutual Funds", points: 20 }, { label: "Stocks/F&O", points: 30 }] },
        { text: "Market drops 20%. You...", options: [{ label: "Panic & Sell", points: 0 }, { label: "Wait it out", points: 15 }, { label: "Buy more", points: 30 }] }
    ]

    const handleAnswer = async (points: number) => {
        const newScore = score + points
        if (step >= questions.length) {
            // Save to Supabase
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const riskCategory = newScore <= 20 ? "Conservative" : newScore <= 35 ? "Moderate" : "Aggressive"
            await supabase.from("risk_profiles").upsert({
                user_id: user.id,
                quiz_score: newScore,
                risk_category: riskCategory,
                completed: true
            }, { onConflict: "user_id" })

            setScore(newScore)
            setQuizCompleted(true)
            toast.success("Risk Profile Saved to your account!")
        } else {
            setScore(newScore)
            setStep(step + 1)
        }
    }

    const reset = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from("risk_profiles").upsert({ user_id: user.id, quiz_score: 0, completed: false }, { onConflict: "user_id" })
        }
        setStep(1); setScore(0); setQuizCompleted(false)
        toast.info("Quiz Reset")
    }

    const addGoal = async () => {
        if (!newGoalName || !newGoalTarget) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase.from("investment_goals")
            .insert({ user_id: user.id, name: newGoalName, target_amount: Number(newGoalTarget), current_amount: Number(newGoalCurrent) || 0 })
            .select().single()

        if (error) { toast.error("Failed to add goal"); return }
        setGoals([...goals, data])
        setNewGoalName(""); setNewGoalTarget(""); setNewGoalCurrent("")
        toast.success("Financial Goal Added")
    }

    const deleteGoal = async (id: string) => {
        await supabase.from("investment_goals").delete().eq("id", id)
        setGoals(goals.filter(g => g.id !== id))
        toast.error("Goal Removed")
    }

    // Risk allocation
    let riskLevel = "Moderate (Medium Risk)"
    let allocation: { name: string; value: number; color: string }[] = [{ name: "Equity (Large)", value: 50, color: "#3b82f6" }, { name: "Debt", value: 30, color: "#10b981" }, { name: "Gold", value: 20, color: "#f59e0b" }]
    if (score <= 20) {
        riskLevel = "Conservative (Low Risk)"
        allocation = [{ name: "Debt", value: 70, color: "#10b981" }, { name: "Gold/Hybrid", value: 20, color: "#f59e0b" }, { name: "Large Cap", value: 10, color: "#3b82f6" }]
    } else if (score > 35) {
        riskLevel = "Aggressive (High Risk)"
        allocation = [{ name: "Equity (Mid/Small)", value: 70, color: "#8b5cf6" }, { name: "Large Cap", value: 20, color: "#3b82f6" }, { name: "Alternatives", value: 10, color: "#f43f5e" }]
    }

    const getAISuggestion = () => {
        if (score <= 20) return "AI matches you to Conservative Profile (Score 0-20). Prioritize capital protection with Debt instruments."
        if (score > 35) return "AI matches you to Aggressive Profile (Score 36-100). You can handle volatility for higher long-term returns."
        return "AI matches you to Moderate Profile (Score 21-35). A balanced mix of Equity and Debt is ideal."
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900"><DashboardNavbar />
            <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                {!quizCompleted ? (
                    <div className="max-w-xl mx-auto mt-10">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center text-2xl">AI Risk Profiler</CardTitle>
                                <Progress value={((step - 1) / questions.length) * 100} className="h-2 mt-4" />
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <h2 className="text-lg font-medium text-center mb-4">{questions[step - 1].text}</h2>
                                {questions[step - 1].options.map((opt, i) => (
                                    <Button key={i} variant="outline" className="h-12 hover:bg-blue-50 border-2" onClick={() => handleAnswer(opt.points)}>
                                        {opt.label}
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="bg-slate-900 text-white border-0 shadow-xl">
                                <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6 text-blue-400" /> FinPro AI Analysis</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-4xl font-bold text-blue-400">{score}<span className="text-xl text-slate-500">/100</span></div>
                                    <div className="text-lg text-slate-300">{riskLevel} Profile</div>
                                    <div className="p-3 bg-blue-900/50 border border-blue-800 rounded text-sm text-blue-100 italic">
                                        "{getAISuggestion()}"
                                    </div>
                                    <Button onClick={reset} variant="secondary" className="w-full">Retake Analysis</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4 flex gap-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 mt-6">
                                    <AlertTriangle className="h-5 w-5 shrink-0" />
                                    <p><strong>Auto-Rebalance Alert:</strong> AI advises periodic rebalancing to maintain your target allocation.</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Goal Tracker</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2">
                                        <Input placeholder="Goal (e.g. Car)" value={newGoalName} onChange={e => setNewGoalName(e.target.value)} />
                                        <div className="flex gap-2">
                                            <Input placeholder="Target ₹" type="number" value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)} />
                                            <Input placeholder="Saved ₹" type="number" value={newGoalCurrent} onChange={e => setNewGoalCurrent(e.target.value)} />
                                        </div>
                                        <Button onClick={addGoal} size="sm">Add Goal</Button>
                                    </div>
                                    <div className="space-y-3 pt-2">
                                        {goals.map(g => {
                                            const pct = g.target_amount > 0 ? (g.current_amount / g.target_amount) * 100 : 0
                                            return (
                                                <div key={g.id} className="text-sm">
                                                    <div className="flex justify-between mb-1 font-medium">
                                                        <span>{g.name}</span>
                                                        <Trash2 className="h-3 w-3 text-red-400 cursor-pointer" onClick={() => deleteGoal(g.id)} />
                                                    </div>
                                                    <Progress value={pct} className="h-2" />
                                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                                        <span>₹{g.current_amount.toLocaleString('en-IN')}</span>
                                                        <span>{pct.toFixed(0)}% of ₹{g.target_amount.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-2">
                            <Card className="h-full">
                                <CardHeader><CardTitle>AI-Optimized Portfolio Allocation</CardTitle></CardHeader>
                                <CardContent className="flex flex-col items-center">
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie data={allocation} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" label>
                                                    {allocation.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
