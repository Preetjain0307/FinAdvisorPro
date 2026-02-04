'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { addToPortfolio } from '@/app/portfolio/add/actions'
import { fetchLivePrice } from '@/lib/market-data'
import { RefreshCw } from 'lucide-react'

type Investment = {
    id: string
    name: string
    ticker_symbol: string
    current_price: number
    type: string
}

export function AddInvestmentForm({ investments }: { investments: Investment[] }) {
    const router = useRouter()
    const [selectedId, setSelectedId] = useState('')
    const [quantity, setQuantity] = useState('')
    const [buyPrice, setBuyPrice] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetchingPrice, setFetchingPrice] = useState(false)

    const handleInvestmentChange = (val: string) => {
        setSelectedId(val)
        // Auto-fill current price as buy price suggestion
        const inv = investments.find(i => i.id === val)
        if (inv) {
            setBuyPrice(inv.current_price.toString())
        }
    }

    const fetchLatestPrice = async () => {
        if (!selectedId) return
        const inv = investments.find(i => i.id === selectedId)
        if (!inv) return

        setFetchingPrice(true)
        try {
            const data = await fetchLivePrice(inv.ticker_symbol)
            if (data.success && data.data) {
                setBuyPrice(data.data.price.toString())
                toast.success(`Updated to live price: ₹${data.data.price}`)
            } else {
                toast.error('Could not fetch live price')
            }
        } catch (e) {
            toast.error('Failed to fetch price')
        } finally {
            setFetchingPrice(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await addToPortfolio({
                investment_id: selectedId,
                quantity: parseFloat(quantity),
                average_buy_price: parseFloat(buyPrice)
            })

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Investment added to portfolio!')
                router.push('/dashboard')
                router.refresh()
            }
        } catch (error) {
            toast.error('Failed to add investment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Investment to Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Select Investment</Label>
                        <Select value={selectedId} onValueChange={handleInvestmentChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose an investment" />
                            </SelectTrigger>
                            <SelectContent>
                                {investments.map((inv) => (
                                    <SelectItem key={inv.id} value={inv.id}>
                                        {inv.name} ({inv.ticker_symbol})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Quantity</Label>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="10"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <Label>Avg. Buy Price (₹)</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={buyPrice}
                                    onChange={(e) => setBuyPrice(e.target.value)}
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={fetchLatestPrice}
                                    disabled={!selectedId || fetchingPrice}
                                    title="Fetch current live price"
                                >
                                    <RefreshCw className={`h-4 w-4 ${fetchingPrice ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || !selectedId} className="flex-1">
                            {loading ? 'Adding...' : 'Add to Portfolio'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
