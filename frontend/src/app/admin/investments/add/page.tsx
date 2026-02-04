'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { createInvestment } from '../actions'
import { RefreshCw } from 'lucide-react'
import { fetchLivePrice } from '@/lib/market-data'

export default function AddInvestmentPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        type: 'Stock',
        ticker_symbol: '',
        current_price: '',
        return_1y: '',
        return_3y: '',
        return_5y: '',
        volatility_score: '',
        liquidity_score: '',
    })
    const [fetchingPrice, setFetchingPrice] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Calculate rating
        const rating_stars = calculateRating(
            parseFloat(formData.return_1y),
            parseFloat(formData.volatility_score),
            parseFloat(formData.liquidity_score)
        )
        const rating_grade = getRatingGrade(rating_stars)

        try {
            const result = await createInvestment({
                ...formData,
                current_price: parseFloat(formData.current_price),
                return_1y: parseFloat(formData.return_1y),
                return_3y: parseFloat(formData.return_3y || '0'),
                return_5y: parseFloat(formData.return_5y || '0'),
                volatility_score: parseFloat(formData.volatility_score),
                liquidity_score: parseFloat(formData.liquidity_score),
                rating_stars,
                rating_grade
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Investment created successfully!')
                router.push('/admin')
            }
        } catch (error) {
            toast.error('Failed to create investment')
        } finally {
            setLoading(false)
        }
    }

    const handleFetchLivePrice = async () => {
        if (!formData.ticker_symbol) {
            toast.error('Please enter a ticker symbol first')
            return
        }

        setFetchingPrice(true)
        try {
            const result = await fetchLivePrice(formData.ticker_symbol)

            if (result.success && result.data) {
                setFormData({ ...formData, current_price: result.data.price.toString() })
                toast.success(`Fetched live price: ₹${result.data.price}`)
            } else {
                toast.error(result.error || 'Failed to fetch price')
            }
        } catch (error) {
            toast.error('Network error. Please try again.')
        } finally {
            setFetchingPrice(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Investment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Investment Name *</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="HDFC Bank"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Type *</Label>
                                    <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Stock">Stock</SelectItem>
                                            <SelectItem value="Mutual Fund">Mutual Fund</SelectItem>
                                            <SelectItem value="Gold">Gold</SelectItem>
                                            <SelectItem value="Bond">Bond</SelectItem>
                                            <SelectItem value="FD">Fixed Deposit</SelectItem>
                                            <SelectItem value="Crypto">Cryptocurrency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Ticker Symbol *</Label>
                                    <Input
                                        value={formData.ticker_symbol}
                                        onChange={(e) => setFormData({ ...formData, ticker_symbol: e.target.value })}
                                        placeholder="HDFCBANK.NS"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Current Price (₹) *</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={formData.current_price}
                                            onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                                            placeholder="1450.00"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={handleFetchLivePrice}
                                            disabled={fetchingPrice || !formData.ticker_symbol}
                                            title="Fetch Live Price"
                                        >
                                            <RefreshCw className={`h-4 w-4 ${fetchingPrice ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Click refresh to fetch live price</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>1Y Return (%) *</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.return_1y}
                                        onChange={(e) => setFormData({ ...formData, return_1y: e.target.value })}
                                        placeholder="12.5"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>3Y Return (%)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.return_3y}
                                        onChange={(e) => setFormData({ ...formData, return_3y: e.target.value })}
                                        placeholder="35.0"
                                    />
                                </div>
                                <div>
                                    <Label>5Y Return (%)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={formData.return_5y}
                                        onChange={(e) => setFormData({ ...formData, return_5y: e.target.value })}
                                        placeholder="80.0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Volatility Score (0-100) *</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.volatility_score}
                                        onChange={(e) => setFormData({ ...formData, volatility_score: e.target.value })}
                                        placeholder="45"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Lower = Less risky</p>
                                </div>
                                <div>
                                    <Label>Liquidity Score (0-100) *</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.liquidity_score}
                                        onChange={(e) => setFormData({ ...formData, liquidity_score: e.target.value })}
                                        placeholder="85"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Higher = More liquid</p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? 'Creating...' : 'Create Investment'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function calculateRating(return1y: number, volatility: number, liquidity: number) {
    // Simple rating algorithm: (Return * 0.4) - (Risk * 0.3) + (Liquidity * 0.3)
    const returnScore = Math.min(return1y / 20, 5) // Max 5 stars for 20% return
    const riskScore = (100 - volatility) / 20 // Inverse volatility
    const liquidityScore = liquidity / 20

    const rating = (returnScore * 0.4) + (riskScore * 0.3) + (liquidityScore * 0.3)
    return Math.min(Math.max(rating, 1), 5) // Clamp between 1-5
}

function getRatingGrade(stars: number) {
    if (stars >= 4.5) return 'A+'
    if (stars >= 4.0) return 'A'
    if (stars >= 3.5) return 'B+'
    if (stars >= 3.0) return 'B'
    if (stars >= 2.5) return 'C+'
    if (stars >= 2.0) return 'C'
    return 'D'
}
