"use client"

import { useState, useEffect } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, RefreshCw, Bitcoin } from "lucide-react"
import { generateCrypto, MarketAsset } from "@/lib/market-data"

export default function CryptoRankingPage() {
    const [coins, setCoins] = useState<MarketAsset[]>([])
    const [lastUpdate, setLastUpdate] = useState(new Date())

    useEffect(() => {
        setCoins(generateCrypto())
        const interval = setInterval(() => {
            setCoins(prev => prev.map(c => {
                const change = (Math.random() * 10 - 5)
                return {
                    ...c,
                    price: Math.max(0.01, c.price + (c.price * change / 100)),
                    change: Number((c.change + (change / 10)).toFixed(2))
                }
            }))
            setLastUpdate(new Date())
        }, 1500) // Fast updates for crypto
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                            <Bitcoin className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Live Crypto Ranking</h1>
                            <p className="text-muted-foreground">Real-time prices and AI Market Sentiment.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Live
                    </div>
                </div>

                <Card>
                    <CardHeader><CardTitle>Top Coins by Market Cap</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset</TableHead>
                                    <TableHead className="text-right">Price (₹)</TableHead>
                                    <TableHead className="text-right">24h Change</TableHead>
                                    <TableHead className="text-right">Market Cap</TableHead>
                                    <TableHead className="text-center">AI Score</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {coins.map((coin) => (
                                    <TableRow key={coin.id}>
                                        <TableCell className="font-bold flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs">
                                                {coin.symbol[0]}
                                            </div>
                                            <div>
                                                <div>{coin.name}</div>
                                                <div className="text-xs text-muted-foreground font-normal">{coin.symbol}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">₹{coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</TableCell>
                                        <TableCell className="text-right">
                                            <div className={`flex items-center justify-end gap-1 ${coin.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {coin.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                {Math.abs(coin.change)}%
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground">{coin.marketCap}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={coin.aiScore > 50 ? "default" : "secondary"} className={coin.aiScore > 70 ? "bg-green-600" : ""}>
                                                {coin.aiScore}/100
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => coin.actionLink && window.open(coin.actionLink, '_blank')}
                                            >
                                                Trade / Info
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
