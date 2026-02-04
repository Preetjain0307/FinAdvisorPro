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
import { registerUser, sendTextBeeOtp, verifyTextBeeOtpForRegistration } from '../auth/actions'
import Link from 'next/link'

export default function RegisterPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)
    const [otpCode, setOtpCode] = useState('')

    // Form data
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        age: '',
        monthly_income: '',
        monthly_expenses: '',
        total_savings: '',
        risk_score: 50,
        risk_category: 'Medium',
    })

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    const handleRiskQuiz = (answers: number[]) => {
        const score = answers.reduce((a, b) => a + b, 0)
        const category = score < 30 ? 'Low' : score < 60 ? 'Medium' : 'High'
        setFormData({ ...formData, risk_score: score, risk_category: category })
    }

    const handleSendOtp = async () => {
        if (!formData.phone || formData.phone.length < 10) {
            toast.error('Please enter a valid phone number')
            return
        }
        setLoading(true)
        const res = await sendTextBeeOtp(formData.phone)
        setLoading(false)
        if (res.error) {
            toast.error(res.error)
        } else {
            setOtpSent(true)
            toast.success('OTP Sent to ' + formData.phone)
        }
    }

    const handleVerifyOtp = async () => {
        setLoading(true)
        const res = await verifyTextBeeOtpForRegistration(formData.phone, otpCode)
        setLoading(false)
        if (res.error) {
            toast.error(res.error)
        } else {
            setOtpVerified(true)
            toast.success('Phone Verified!')
        }
    }

    const handleSubmit = async () => {
        if (!otpVerified) {
            toast.error('Please verify your phone number first')
            return
        }

        setLoading(true)
        try {
            const result = await registerUser(formData)

            if (result.error) {
                toast.error(result.error)
                setLoading(false)
            } else {
                toast.success('Account created! Welcome.')
                setTimeout(() => {
                    router.push('/dashboard')
                }, 1000)
            }
        } catch (error) {
            console.error('Register error:', error)
            toast.error('Something went wrong')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <CardTitle>Create Your Investor Profile</CardTitle>
                        <span className="text-sm text-muted-foreground">Step {step} of 3</span>
                    </div>
                    {/* Progress Bar: 33%, 66%, 100% */}
                    <Progress value={(step / 3) * 100} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Step 1: Personal & Financial Info */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Full Name</Label>
                                    <Input
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <Label>Age</Label>
                                    <Input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        placeholder="30"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Email (Optional)</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Monthly Income (₹)</Label>
                                    <Input
                                        type="number"
                                        value={formData.monthly_income}
                                        onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                                        placeholder="50000"
                                    />
                                </div>
                                <div>
                                    <Label>Monthly Expenses (₹)</Label>
                                    <Input
                                        type="number"
                                        value={formData.monthly_expenses}
                                        onChange={(e) => setFormData({ ...formData, monthly_expenses: e.target.value })}
                                        placeholder="30000"
                                    />
                                </div>
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

                            <Button onClick={handleNext} className="w-full">Continue</Button>
                            <div className="text-center text-sm">
                                Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
                            </div>
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

                    {/* Step 3: Verification & Submit */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-4">Verify Phone Number</h3>
                                <p className="text-sm text-muted-foreground mb-4">We need to verify your number to secure your account.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+919876543210"
                                        disabled={otpVerified}
                                    />
                                    {!otpVerified && (
                                        <Button variant="outline" onClick={handleSendOtp} disabled={loading || otpSent}>
                                            {otpSent ? 'Sent' : 'Send OTP'}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {otpSent && !otpVerified && (
                                <div className="space-y-2">
                                    <Label>Enter OTP</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value)}
                                            placeholder="123456"
                                        />
                                        <Button onClick={handleVerifyOtp} disabled={loading}>
                                            Verify
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {otpVerified && (
                                <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm font-medium text-center">
                                    ✅ Phone Verified Successfully
                                </div>
                            )}

                            <div className="flex gap-4 mt-6">
                                <Button onClick={handleBack} variant="outline" className="flex-1">Back</Button>
                                <Button onClick={handleSubmit} disabled={loading || !otpVerified} className="flex-1">
                                    Complete Registration
                                </Button>
                            </div>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    )
}
