'use client'

import { useEffect, useState } from 'react'
import { fetchLivePrice } from '@/lib/market-data'

type TickerItem = {
    displayName: string
    symbol: string | null // null = static item
    price?: number
    change?: number
    changePercent?: string
    isIndex?: boolean
}

// Exact items from the original design with "Imagination Data" (Mock values to show before live fetch)
const INITIAL_TICKER_ITEMS: TickerItem[] = [
    { displayName: 'NIFTY 50', symbol: null, price: 22150, change: 105.5, changePercent: '+0.45%', isIndex: true },
    { displayName: 'SENSEX', symbol: null, price: 73800, change: -85.2, changePercent: '-0.12%', isIndex: true },
    { displayName: 'HDFC BANK', symbol: 'HDFCBANK.NS', price: 1450.60, change: 12.5, changePercent: '+0.85%' },
    { displayName: 'RELIANCE', symbol: 'RELIANCE.NS', price: 2980.45, change: 24.0, changePercent: '+0.81%' },
    { displayName: 'GOLD', symbol: 'GOLDBEES.NS', price: 62500, change: -150, changePercent: '-0.24%' },
]

export function StockTicker() {
    const [items, setItems] = useState<TickerItem[]>(INITIAL_TICKER_ITEMS)

    useEffect(() => {
        const fetchAllPrices = async () => {
            const updatedItems = await Promise.all(
                INITIAL_TICKER_ITEMS.map(async (item) => {
                    // Skip static indices or if no symbol
                    if (!item.symbol) return item

                    try {
                        const data = await fetchLivePrice(item.symbol)
                        if (data.success && data.data) {
                            return {
                                ...item,
                                price: data.data.price,
                                change: data.data.change,
                                changePercent: data.data.changePercent
                            }
                        }
                    } catch (error) {
                        console.error(`Failed to fetch ${item.symbol}`, error)
                    }
                    return item
                })
            )
            setItems(updatedItems)
        }

        fetchAllPrices()
        const interval = setInterval(fetchAllPrices, 60000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-gray-900 text-white py-1 overflow-hidden">
            <div className="flex animate-marquee hover:pause whitespace-nowrap">
                {/* 2x Duplication for seamless scroll (Standard) */}
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-8 px-4 font-mono text-sm">
                        {items.map((item, index) => (
                            <TickerItemDisplay key={`${item.displayName}-${i}-${index}`} item={item} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

function TickerItemDisplay({ item }: { item: TickerItem }) {
    // Show static placeholders if live data hasn't loaded yet
    const price = item.price || 0
    const change = item.change || 0
    const percent = item.changePercent || '0.00%'

    // Determine color
    const isPositive = change >= 0
    const colorClass = isPositive ? 'text-green-400' : 'text-red-400'
    const arrow = isPositive ? '▲' : '▼'

    return (
        <span className={colorClass}>
            {item.displayName} {arrow} {price.toLocaleString()} ({percent})
        </span>
    )
}
