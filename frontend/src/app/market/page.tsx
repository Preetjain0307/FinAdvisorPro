"use client"

import { useState, useEffect } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, TrendingUp, TrendingDown, RefreshCw, Zap, Briefcase, CheckCircle2, Shield } from "lucide-react"
import { generateStocks, generateFDs, generateBonds, MarketAsset } from "@/lib/market-data"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MarketPage() {
    const [stocks, setStocks] = useState<MarketAsset[]>([])
    const [fds, setFds] = useState<MarketAsset[]>([])
    const [bonds, setBonds] = useState<MarketAsset[]>([])
    const [search, setSearch] = useState("")
    const [selectedId, setSelectedId] = useState<string | null>(null) // For AI Analysis
    const [lastUpdate, setLastUpdate] = useState(new Date())

    // Initial Load
    useEffect(() => {
        setStocks(generateStocks())
        setFds(generateFDs())
        setBonds(generateBonds())
    }, [])

    // Real-time Simulation Effect
    useEffect(() => {
        const interval = setInterval(() => {
            setStocks(prev => prev.map(stock => {
                const change = (Math.random() * 2 - 1)
                const newPrice = Math.max(1, stock.price + change)
                return { ...stock, price: newPrice, change: Number((stock.change + (change / 100)).toFixed(2)) }
            }))
            setLastUpdate(new Date())
        }, 3000) // Update every 3 seconds

        return () => clearInterval(interval)
    }, [])

    const renderPriceChange = (change: number) => {
        const isPos = change >= 0
        return (
            <div className={`flex items-center gap-1 ${isPos ? 'text-green-600' : 'text-red-600'}`}>
                {isPos ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-bold">{Math.abs(change).toFixed(2)}%</span>
            </div>
        )
    }

    const filteredStocks = stocks.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

    const SelectedAssetAnalysis = () => {
        if (!selectedId) return null
        const allAssets = [...stocks, ...fds, ...bonds]
        const asset = allAssets.find(a => a.id === selectedId)
        if (!asset) return null

        let verdict = "Neutral"
        let color = "text-yellow-600"
        if (asset.aiScore > 80) { verdict = "Strong Buy"; color = "text-green-600" }
        else if (asset.aiScore > 60) { verdict = "Buy"; color = "text-blue-600" }
        else if (asset.aiScore < 40) { verdict = "Sell"; color = "text-red-600" }

        return (
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-slate-900 sticky top-24">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <Badge className="bg-blue-600 hover:bg-blue-700">AI Analyst</Badge>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>Close</Button>
                    </div>
                    <CardTitle className="mt-2">{asset.name}</CardTitle>
                    <CardDescription>{asset.symbol} • AI Score: {asset.aiScore}/100</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-white dark:bg-black rounded-lg border">
                        <div className="text-sm text-gray-500 mb-1">Recommendation</div>
                        <div className={`text-2xl font-bold ${color} flex items-center gap-2`}>
                            {verdict}
                            {verdict.includes("Buy") && <CheckCircle2 className="h-6 w-6" />}
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        <p><strong>Why?</strong> Our algorithms detected {asset.change > 0 ? "positive momentum" : "a potential dip"} in recent trading patterns.</p>
                        {asset.pe && <p><strong>P/E Ratio:</strong> {asset.pe} (Industry Avg: 22.4) - {asset.pe < 22 ? "Undervalued" : "Premium Valuation"}.</p>}
                        {asset.interestRate && <p><strong>Yield:</strong> {asset.interestRate}% is {asset.interestRate > 7 ? "excellent" : "moderate"} for this risk class.</p>}
                    </div>

                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                            let url = asset.actionLink;
                            if (!url) {
                                if (asset.category === "Stock") url = `https://www.google.com/finance/quote/${asset.symbol}:NSE`;
                                else url = `https://www.google.com/search?q=${asset.name} interest rate`;
                            }
                            window.open(url, '_blank')
                        }}
                    >
                        View External Details ↗
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />

            <main className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Zap className="h-8 w-8 text-yellow-500 fill-current" />
                            Market Explorer
                        </h1>
                        <p className="text-muted-foreground">Real-time data for 50+ Assets. Powered by AI Analysis.</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Live Updates Active ({lastUpdate.toLocaleTimeString()})
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main List */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search stocks, bonds, or funds..."
                                    className="pl-10 bg-white"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <Tabs defaultValue="stocks" className="space-y-6">
                            <TabsList className="bg-white p-1 border">
                                <TabsTrigger value="stocks" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Stocks (50)</TabsTrigger>
                                <TabsTrigger value="fds" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Fixed Deposits</TabsTrigger>
                                <TabsTrigger value="bonds" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Bonds</TabsTrigger>
                            </TabsList>

                            {/* STOCKS TAB */}
                            <TabsContent value="stocks">
                                <Card>
                                    <ScrollArea className="h-[600px]">
                                        <Table>
                                            <TableHeader className="bg-gray-50 sticky top-0 z-10">
                                                <TableRow>
                                                    <TableHead className="w-[50px]">Select</TableHead>
                                                    <TableHead>Company</TableHead>
                                                    <TableHead className="text-right">Price</TableHead>
                                                    <TableHead className="text-right">24h Change</TableHead>
                                                    <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
                                                    <TableHead className="text-center">AI Score</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredStocks.map((stock) => (
                                                    <TableRow key={stock.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelectedId(stock.id)}>
                                                        <TableCell>
                                                            <div className={`w-4 h-4 rounded-full border ${selectedId === stock.id ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}></div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-bold">{stock.symbol}</div>
                                                            <div className="text-xs text-muted-foreground">{stock.name}</div>
                                                        </TableCell>
                                                        <TableCell className="text-right font-mono font-medium">₹{stock.price.toFixed(2)}</TableCell>
                                                        <TableCell className="text-right">{renderPriceChange(stock.change)}</TableCell>
                                                        <TableCell className="text-right hidden md:table-cell text-muted-foreground">{stock.marketCap}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant={stock.aiScore > 75 ? "default" : "secondary"} className={stock.aiScore > 75 ? "bg-green-600" : ""}>
                                                                {stock.aiScore}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </Card>
                            </TabsContent>

                            {/* FDS TAB */}
                            <TabsContent value="fds">
                                <Card>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Bank</TableHead>
                                                <TableHead>Interest Rate</TableHead>
                                                <TableHead>Lock-in</TableHead>
                                                <TableHead className="text-center">Safety Rating</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fds.map((fd) => (
                                                <TableRow key={fd.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelectedId(fd.id)}>
                                                    <TableCell className="font-medium">{fd.name}</TableCell>
                                                    <TableCell className="text-green-700 font-bold">{fd.interestRate}%</TableCell>
                                                    <TableCell>{fd.lockIn}</TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-1 text-blue-600">
                                                            <Shield className="h-4 w-4" /> AAA
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </TabsContent>

                            {/* BONDS TAB */}
                            <TabsContent value="bonds">
                                <Card>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Bond Name</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                                <TableHead className="text-right">Yield</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bonds.map((bond) => (
                                                <TableRow key={bond.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelectedId(bond.id)}>
                                                    <TableCell className="font-medium">{bond.name}</TableCell>
                                                    <TableCell><Badge variant="outline">{bond.category}</Badge></TableCell>
                                                    <TableCell className="text-right">₹{bond.price}</TableCell>
                                                    <TableCell className="text-right font-bold text-green-700">{bond.interestRate}%</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Sidebar: AI Analysis */}
                    <div className="lg:col-span-4">
                        {selectedId ? (
                            <SelectedAssetAnalysis />
                        ) : (
                            <Card className="border-dashed bg-gray-50/50 sticky top-24">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                                        <Briefcase className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Select an Asset</h3>
                                    <p className="max-w-[200px]">Click on any stock, bond, or FD to see AI-powered analysis and buy/sell ratings.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
