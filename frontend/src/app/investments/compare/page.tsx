
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

export default function ComparePage() {
    const [investments, setInvestments] = useState<any[]>([])
    const [selected, setSelected] = useState<string[]>([])
    const [comparing, setComparing] = useState<any[]>([])

    useEffect(() => {
        fetchInvestments()
    }, [])

    const fetchInvestments = async () => {
        const supabase = createClient()
        const { data } = await supabase.from('investments').select('*').order('name')
        if (data) setInvestments(data)
    }

    const handleToggle = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(i => i !== id))
        } else if (selected.length < 3) {
            setSelected([...selected, id])
        }
    }

    const handleCompare = () => {
        const items = investments.filter(inv => selected.includes(inv.id))
        setComparing(items)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="flex items-center gap-4">
                    <Link href="/investments">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Compare Investments</h1>
                        <p className="text-muted-foreground">Select up to 3 investments to compare side-by-side</p>
                    </div>
                </div>

                {comparing.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Select Investments ({selected.length}/3)</CardTitle>
                                <Button
                                    onClick={handleCompare}
                                    disabled={selected.length < 2}
                                >
                                    Compare Selected
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {investments.map((inv) => (
                                    <div
                                        key={inv.id}
                                        className={`p-4 border rounded-lg cursor-pointer transition ${selected.includes(inv.id) ? 'border-blue-600 bg-blue-50 dark:bg-blue-950' : 'hover:border-gray-400'
                                            }`}
                                        onClick={() => handleToggle(inv.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={selected.includes(inv.id)}
                                                onCheckedChange={() => handleToggle(inv.id)}
                                            />
                                            <div className="flex-1">
                                                <div className="font-semibold">{inv.name}</div>
                                                <Badge variant="outline" className="mt-1">{inv.type}</Badge>
                                                <div className="mt-2 text-sm">
                                                    <span className="text-yellow-500">★ {inv.rating_stars.toFixed(1)}</span>
                                                    <span className="mx-2">•</span>
                                                    <span className={inv.return_1y >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                        {inv.return_1y}% 1Y
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Comparison Results</h2>
                            <Button variant="outline" onClick={() => setComparing([])}>
                                Change Selection
                            </Button>
                        </div>

                        {/* Comparison Table */}
                        <div className="grid md:grid-cols-3 gap-4">
                            {comparing.map((inv) => (
                                <Card key={inv.id} className="border-2">
                                    <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                                        <CardTitle className="text-lg">{inv.name}</CardTitle>
                                        <Badge variant="outline">{inv.type}</Badge>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">

                                        {/* Rating */}
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">Overall Rating</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-bold">{inv.rating_stars.toFixed(1)}</span>
                                                <span className="text-yellow-500 text-2xl">★</span>
                                                <Badge>{inv.rating_grade}</Badge>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">Current Price</div>
                                            <div className="text-2xl font-semibold">₹{inv.current_price.toLocaleString()}</div>
                                        </div>

                                        {/* Returns */}
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-2">Returns</div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-sm">1 Year</span>
                                                    <span className={`font-semibold ${inv.return_1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {inv.return_1y >= 0 ? '+' : ''}{inv.return_1y}%
                                                    </span>
                                                </div>
                                                {inv.return_3y !== 0 && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm">3 Year</span>
                                                        <span className={`font-semibold ${inv.return_3y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {inv.return_3y >= 0 ? '+' : ''}{inv.return_3y}%
                                                        </span>
                                                    </div>
                                                )}
                                                {inv.return_5y !== 0 && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm">5 Year</span>
                                                        <span className={`font-semibold ${inv.return_5y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {inv.return_5y >= 0 ? '+' : ''}{inv.return_5y}%
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Risk */}
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">Risk Level</div>
                                            <Badge variant={inv.volatility_score < 30 ? 'default' : inv.volatility_score < 60 ? 'secondary' : 'destructive'}>
                                                {inv.volatility_score < 30 ? 'Low' : inv.volatility_score < 60 ? 'Medium' : 'High'} Risk
                                            </Badge>
                                            <div className="text-sm text-muted-foreground mt-1">Volatility: {inv.volatility_score}/100</div>
                                        </div>

                                        {/* Liquidity */}
                                        <div>
                                            <div className="text-sm text-muted-foreground mb-1">Liquidity</div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${inv.liquidity_score}%` }}
                                                />
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">{inv.liquidity_score}/100</div>
                                        </div>

                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Winner Analysis */}
                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    Best Choice Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {(() => {
                                    const bestReturn = comparing.reduce((max, inv) => inv.return_1y > max.return_1y ? inv : max, comparing[0])
                                    const lowestRisk = comparing.reduce((min, inv) => inv.volatility_score < min.volatility_score ? inv : min, comparing[0])
                                    const bestRating = comparing.reduce((max, inv) => inv.rating_stars > max.rating_stars ? inv : max, comparing[0])

                                    return (
                                        <>
                                            <p>🏆 <strong>Best Rating:</strong> {bestRating.name} ({bestRating.rating_stars.toFixed(1)}★)</p>
                                            <p>📈 <strong>Highest Return:</strong> {bestReturn.name} ({bestReturn.return_1y}%)</p>
                                            <p>🛡️ <strong>Lowest Risk:</strong> {lowestRisk.name} (Volatility: {lowestRisk.volatility_score})</p>
                                        </>
                                    )
                                })()}
                            </CardContent>
                        </Card>
                    </>
                )}

            </div>
        </div>
    )
}
