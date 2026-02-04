'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, RefreshCw, PieChart } from 'lucide-react'
import Link from 'next/link'
import { fetchLivePrice } from '@/lib/market-data'

type PortfolioItem = {
    id: string
    quantity: number
    average_buy_price: number
    investments: {
        id: string
        name: string
        ticker_symbol: string
        current_price: number
    }
}

export function LivePortfolio({ initialPortfolio }: { initialPortfolio: PortfolioItem[] }) {
    const [portfolio, setPortfolio] = useState(initialPortfolio)
    const [livePrices, setLivePrices] = useState<Record<string, number>>({})
    const [loading, setLoading] = useState(false)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    // Calculate totals based on live prices or fallback to stored prices
    const totalValue = portfolio.reduce((sum, item) => {
        const price = livePrices[item.investments.ticker_symbol] || item.investments.current_price
        return sum + (item.quantity * price)
    }, 0)

    const totalInvested = portfolio.reduce((sum, item) => {
        return sum + (item.quantity * item.average_buy_price)
    }, 0)

    const gainLoss = totalValue - totalInvested
    const gainLossPercent = totalInvested > 0 ? ((gainLoss / totalInvested) * 100).toFixed(2) : '0'

    const fetchAllPrices = async () => {
        if (loading) return
        setLoading(true)

        const newPrices: Record<string, number> = {}

        // Fetch sequentially to be nice to rate limits if needed, 
        // but Queue system in market-data.ts handles throttling now!
        await Promise.all(portfolio.map(async (item) => {
            if (!item.investments.ticker_symbol) return

            try {
                const result = await fetchLivePrice(item.investments.ticker_symbol)
                if (result.success && result.data) {
                    newPrices[item.investments.ticker_symbol] = result.data.price
                }
            } catch (e) {
                console.error(`Failed to fetch ${item.investments.ticker_symbol}`)
            }
        }))

        setLivePrices(prev => ({ ...prev, ...newPrices }))
        setLastUpdated(new Date())
        setLoading(false)
    }

    // Initial fetch on mount
    useEffect(() => {
        if (portfolio.length > 0) {
            fetchAllPrices()
        }

        // Refresh every minute
        const interval = setInterval(fetchAllPrices, 60000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-6">
            {/* Live Net Worth Overview */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-white/90">Total Portfolio Value</CardTitle>
                            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
                                {loading ? 'Updating...' : 'Live'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-bold">₹{totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-1 ${gainLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                {gainLoss >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                <span className="font-semibold">₹{Math.abs(gainLoss).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                <span>({gainLossPercent}%)</span>
                            </div>
                            {lastUpdated && (
                                <span className="text-xs text-blue-200">
                                    Updated: {lastUpdated.toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Investment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Invested Amount</span>
                            <span className="font-semibold">₹{totalInvested.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Returns</span>
                            <span className={`font-semibold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {gainLoss >= 0 ? '+' : '-'}₹{Math.abs(gainLoss).toLocaleString()}
                            </span>
                        </div>
                        <Progress value={totalInvested > 0 ? (totalValue / (totalInvested * 1.5)) * 100 : 0} className="h-2" />
                    </CardContent>
                </Card>
            </div>

            {/* Portfolio Holdings */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>My Holdings</CardTitle>
                            <CardDescription>Real-time performance</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={fetchAllPrices} disabled={loading}>
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                            <Link href="/portfolio/add">
                                <Button size="sm">+ Add Investment</Button>
                            </Link>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {portfolio && portfolio.length > 0 ? (
                        <div className="space-y-4">
                            {portfolio.map((item) => {
                                const livePrice = livePrices[item.investments.ticker_symbol]
                                const priceToUse = livePrice || item.investments.current_price
                                const isLive = !!livePrice

                                const currentValue = item.quantity * priceToUse
                                const investedValue = item.quantity * item.average_buy_price
                                const itemGain = currentValue - investedValue
                                const itemGainPercent = ((itemGain / investedValue) * 100).toFixed(2)

                                return (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex-1">
                                            <div className="font-semibold flex items-center gap-2">
                                                {item.investments.name}
                                                {isLive && <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Live Price"></span>}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {item.quantity} units @ ₹{item.average_buy_price}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">₹{currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                            <div className={`text-sm ${itemGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {itemGain >= 0 ? '+' : '-'}₹{Math.abs(itemGain).toFixed(0)} ({itemGainPercent}%)
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No investments yet</p>
                            <Link href="/investments">
                                <Button className="mt-4">Start Investing</Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
