
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { submitOnboarding } from './actions'

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // Form data
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        monthly_income: '',
        monthly_expenses: '',
        total_savings: '',
        risk_score: 50,
        risk_category: 'Medium',
        goals: [] as Array<{ name: string; target_amount: string; deadline: string }>
    })

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    const handleRiskQuiz = (answers: number[]) => {
        const score = answers.reduce((a, b) => a + b, 0)
        const category = score < 30 ? 'Low' : score < 60 ? 'Medium' : 'High'
        setFormData({ ...formData, risk_score: score, risk_category: category })
    }

    const handleSubmit = async () => {
        console.log('Complete Setup clicked!')
        console.log('Form data:', formData)

        setLoading(true)
        try {
            console.log('Submitting onboarding...')
            const result = await submitOnboarding(formData)
            console.log('Result:', result)

            if (result.error) {
                console.error('Error from server:', result.error)
                toast.error(result.error)
                setLoading(false)
            } else {
                toast.success('Profile created successfully!')
                setTimeout(() => {
                    router.push('/dashboard')
                }, 500)
            }
        } catch (error) {
            console.error('Caught error:', error)
            toast.error('Something went wrong')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <CardTitle>Welcome to Fin Advisor Pro</CardTitle>
                        <span className="text-sm text-muted-foreground">Step {step} of 3</span>
                    </div>
                    <Progress value={(step / 3) * 100} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label>Full Name</Label>
                                <Input
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Age</Label>
                                    <Input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        placeholder="30"
                                    />
                                </div>
                                <div>
                                    <Label>Monthly Income (₹)</Label>
                                    <Input
                                        type="number"
                                        value={formData.monthly_income}
                                        onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                                        placeholder="50000"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Monthly Expenses (₹)</Label>
                                    <Input
                                        type="number"
                                        value={formData.monthly_expenses}
                                        onChange={(e) => setFormData({ ...formData, monthly_expenses: e.target.value })}
                                        placeholder="30000"
                                    />
                                </div>
                                <div>
                                    <Label>Total Savings (₹)</Label>
                                    <Input
                                        type="number"
                                        value={formData.total_savings}
                                        onChange={(e) => setFormData({ ...formData, total_savings: e.target.value })}
                                        placeholder="100000"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleNext} className="w-full">Continue</Button>
                        </div>
                    )}

                    {/* Step 2: Risk Quiz */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">1. How do you react to market downturns?</h3>
                                <RadioGroup onValueChange={(val) => {
                                    const answers = [parseInt(val), 0, 0]
                                    handleRiskQuiz(answers)
                                }}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="10" id="r1a" />
                                        <Label htmlFor="r1a">Panic and sell immediately</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="25" id="r1b" />
                                        <Label htmlFor="r1b">Wait and see</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="40" id="r1c" />
                                        <Label htmlFor="r1c">Buy more at lower prices</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                <p className="text-sm font-medium">Your Risk Profile: <span className="text-blue-600">{formData.risk_category}</span></p>
                                <p className="text-xs text-muted-foreground mt-1">Score: {formData.risk_score}/100</p>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={handleBack} variant="outline" className="flex-1">Back</Button>
                                <Button onClick={handleNext} className="flex-1">Continue</Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Goals */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-4">Set Your Financial Goals (Optional)</h3>
                                <p className="text-sm text-muted-foreground mb-4">You can add goals later from your dashboard</p>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={handleBack} variant="outline" className="flex-1">Back</Button>
                                <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                                    {loading ? 'Creating Profile...' : 'Complete Setup'}
                                </Button>
                            </div>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    )
}
