
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, TrendingUp, TrendingDown, Star, Filter } from 'lucide-react'
import Link from 'next/link'
import { LivePriceDisplay } from '@/components/live-price-display'

// Define Investment Type locally for now
type Investment = {
    id: string
    name: string
    type: string
    ticker_symbol: string
    current_price: number
    return_1y: number
    rating_stars: number
    rating_grade: string
    risk_level: string // Add this to DB schema if missing or use volatility
}

export default async function InvestmentExplorerPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; type?: string }>
}) {
    const supabase = await createClient()
    const params = await searchParams
    const query = params.q || ''
    const typeFilter = params.type || 'All'

    // Build Query
    let dbQuery = supabase.from('investments').select('*')

    if (query) {
        dbQuery = dbQuery.ilike('name', `%${query}%`)
    }

    if (typeFilter !== 'All') {
        dbQuery = dbQuery.eq('type', typeFilter)
    }

    const { data: investments, error } = await dbQuery

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1"> {/* Adjusted this div to take available space */}
                        <div className="flex justify-between items-center mb-2"> {/* Added flex container for title/button */}
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Investment Explorer</h1> {/* Kept original h1 styling */}
                                <p className="text-muted-foreground">Discover top-rated assets powered by AI analysis.</p> {/* Kept original p styling */}
                            </div>
                            <Link href="/investments/compare">
                                <Button variant="outline">Compare Investments</Button>
                            </Link>
                        </div>
                    </div>
                    <Button>
                        <Filter className="mr-2 h-4 w-4" /> Advanced Filters
                    </Button>
                </div>

                {/* Search & Tabs */}
                <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <form>
                            <Input
                                name="q"
                                placeholder="Search stocks, funds, or assets..."
                                className="pl-10 h-10 bg-gray-50 dark:bg-gray-900 border-0"
                                defaultValue={query}
                            />
                        </form>
                    </div>
                    <Tabs defaultValue={typeFilter} className="w-full md:w-auto">
                        <TabsList className="grid w-full md:w-auto grid-cols-4 md:flex gap-1">
                            <form>
                                <button type="submit" name="type" value="All" className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${typeFilter === 'All' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-900'}`}>All</button>
                                <button type="submit" name="type" value="Stock" className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${typeFilter === 'Stock' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-900'}`}>Stocks</button>
                                <button type="submit" name="type" value="Mutual Fund" className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${typeFilter === 'Mutual Fund' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-900'}`}>Funds</button>
                                <button type="submit" name="type" value="Gold" className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${typeFilter === 'Gold' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-900'}`}>Gold</button>
                            </form>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Results Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {investments?.map((inv: any) => (
                        <Card key={inv.id} className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: getRatingColor(inv.rating_stars) }}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge variant="outline" className="mb-2">{inv.type}</Badge>
                                        <CardTitle className="text-xl">{inv.name}</CardTitle>
                                        <CardDescription>{inv.ticker_symbol}</CardDescription>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-bold dark:bg-yellow-900/30 dark:text-yellow-400">
                                            <Star className="h-3 w-3 mr-1 fill-yellow-600 dark:fill-yellow-400" />
                                            {inv.rating_stars}
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1">Grade {inv.rating_grade}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="col-span-2">
                                        <p className="text-sm text-muted-foreground mb-2">Current Price</p>
                                        <LivePriceDisplay
                                            tickerSymbol={inv.ticker_symbol}
                                            storedPrice={inv.current_price}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">1Y Return</p>
                                        <p className={`text-lg font-bold flex items-center justify-end ${inv.return_1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {inv.return_1y >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                                            {inv.return_1y}%
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground">
                                        Risk: <span className="font-medium text-gray-900 dark:text-white">{getRiskLabel(inv.volatility_score)}</span>
                                    </div>
                                    <Link href={`/portfolio/add?investment=${inv.id}`}>
                                        <Button size="sm" variant="outline">Add to Portfolio</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {(!investments || investments.length === 0) && (
                        <div className="col-span-full text-center py-20 text-muted-foreground">
                            <p>No investments found matching "{query}".</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function getRatingColor(stars: number) {
    if (stars >= 4.5) return '#22c55e' // Green
    if (stars >= 3.5) return '#eab308' // Yellow
    return '#ef4444' // Red
}

function getRiskLabel(volatility: number) {
    if (volatility < 30) return 'Low'
    if (volatility < 60) return 'Medium'
    return 'High'
}
