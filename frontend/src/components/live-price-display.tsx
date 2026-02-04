'use client'

import { useState, useEffect } from 'react'
import { fetchLivePrice, formatPriceChange, type MarketDataResponse } from '@/lib/market-data'
import { Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LivePriceDisplayProps {
    tickerSymbol: string
    storedPrice: number
    compact?: boolean
}

export function LivePriceDisplay({ tickerSymbol, storedPrice, compact = false }: LivePriceDisplayProps) {
    const [liveData, setLiveData] = useState<MarketDataResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const fetchPrice = async () => {
        setLoading(true)
        const data = await fetchLivePrice(tickerSymbol)
        setLiveData(data)
        setLastUpdated(new Date())
        setLoading(false)
    }

    useEffect(() => {
        fetchPrice()

        // Auto-refresh every 60 seconds
        const interval = setInterval(fetchPrice, 60000)

        return () => clearInterval(interval)
    }, [tickerSymbol])

    if (loading && !liveData) {
        // Show stored price while loading (non-blocking)
        return (
            <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                    <div className="text-3xl font-bold">₹{storedPrice.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground animate-pulse">
                        <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                        Fetching live...
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span>📊 Stored Price</span>
                    </div>
                </div>
            </div>
        )
    }

    // Fallback to stored price if API fails
    if (!liveData?.success || !liveData.data) {
        return (
            <div className="space-y-1">
                <div className="text-2xl font-bold">₹{storedPrice.toLocaleString()}</div>
                {liveData?.error && (
                    <div className="text-xs text-muted-foreground">
                        {liveData.rateLimited ? '⏳ Rate limited (Using Stored)' : '📊 Stored price'}
                    </div>
                )}
            </div>
        )
    }

    const { data } = liveData
    const changeInfo = formatPriceChange(data.change, data.changePercent)

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <span className="font-semibold">₹{data.price.toLocaleString()}</span>
                <span className={`text-xs ${changeInfo.color === 'green' ? 'text-green-600' : changeInfo.color === 'red' ? 'text-red-600' : 'text-gray-600'}`}>
                    {changeInfo.icon} {changeInfo.formatted}
                </span>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="flex items-baseline gap-3">
                <div className="text-3xl font-bold">₹{data.price.toLocaleString()}</div>
                <div className={`flex items-center gap-1 text-sm font-medium ${changeInfo.color === 'green' ? 'text-green-600' :
                        changeInfo.color === 'red' ? 'text-red-600' :
                            'text-gray-600'
                    }`}>
                    <span className="text-lg">{changeInfo.icon}</span>
                    <span>{changeInfo.formatted}</span>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Live • Updated {lastUpdated?.toLocaleTimeString()}</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={fetchPrice}
                    disabled={loading}
                >
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {data.price !== storedPrice && (
                <div className="text-xs text-muted-foreground">
                    Stored: ₹{storedPrice.toLocaleString()}
                </div>
            )}
        </div>
    )
}
