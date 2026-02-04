
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function SIPCalculatorPage() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
    const [years, setYears] = useState(10)
    const [expectedReturn, setExpectedReturn] = useState(12)

    // SIP Calculation
    const months = years * 12
    const monthlyRate = expectedReturn / 12 / 100
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
    const totalInvested = monthlyInvestment * months
    const gains = futureValue - totalInvested

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto space-y-6">

                <div>
                    <h1 className="text-3xl font-bold">SIP Calculator</h1>
                    <p className="text-muted-foreground">Plan your systematic investment with ease</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    {/* Inputs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Investment Parameters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <Label>Monthly Investment</Label>
                                    <span className="font-semibold">₹{monthlyInvestment.toLocaleString()}</span>
                                </div>
                                <Slider
                                    value={[monthlyInvestment]}
                                    onValueChange={(val) => setMonthlyInvestment(val[0])}
                                    min={500}
                                    max={100000}
                                    step={500}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <Label>Time Period</Label>
                                    <span className="font-semibold">{years} years</span>
                                </div>
                                <Slider
                                    value={[years]}
                                    onValueChange={(val) => setYears(val[0])}
                                    min={1}
                                    max={30}
                                    step={1}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <Label>Expected Return (% p.a.)</Label>
                                    <span className="font-semibold">{expectedReturn}%</span>
                                </div>
                                <Slider
                                    value={[expectedReturn]}
                                    onValueChange={(val) => setExpectedReturn(val[0])}
                                    min={1}
                                    max={25}
                                    step={0.5}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
                        <CardHeader>
                            <CardTitle className="text-white">Projected Wealth</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-white/80 text-sm mb-2">Future Value</p>
                                <p className="text-4xl font-bold">₹{futureValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                                <div>
                                    <p className="text-white/80 text-sm">Total Invested</p>
                                    <p className="text-xl font-semibold">₹{totalInvested.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-white/80 text-sm">Estimated Gains</p>
                                    <p className="text-xl font-semibold">₹{gains.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                                </div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <p className="text-xs text-white/80 mb-2">Wealth Breakdown</p>
                                <div className="flex gap-2 h-4 rounded overflow-hidden">
                                    <div
                                        className="bg-white/40"
                                        style={{ width: `${(totalInvested / futureValue) * 100}%` }}
                                    ></div>
                                    <div
                                        className="bg-green-400"
                                        style={{ width: `${(gains / futureValue) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs mt-2">
                                    <span>Investment</span>
                                    <span>Returns</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Info */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p><strong>Note:</strong> This is an illustrative calculation based on assumed returns. Actual returns may vary.</p>
                            <p>SIP (Systematic Investment Plan) helps you invest a fixed amount regularly, benefiting from rupee cost averaging.</p>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
