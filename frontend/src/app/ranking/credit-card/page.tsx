"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Star, ShieldCheck, Plane, CreditCard, ChevronDown, ChevronUp } from "lucide-react"

type CreditCard = {
    id: number
    name: string
    bank: string
    type: "Premium" | "Travel" | "Shopping" | "Fuel"
    rewardRate: number // %
    fee: number
    loungeAccess: boolean
    welomeBonus: string
    rating: number
    applyLink: string
}

const CARDS: CreditCard[] = [
    { id: 1, name: "Infinia Metal Edition", bank: "HDFC Bank", type: "Premium", rewardRate: 3.3, fee: 12500, loungeAccess: true, welomeBonus: "12,500 Points", rating: 4.9, applyLink: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/infinia-credit-card-metal-edition" },
    { id: 2, name: "Magnus", bank: "Axis Bank", type: "Travel", rewardRate: 4.8, fee: 10000, loungeAccess: true, welomeBonus: "Voucher worth ₹10k", rating: 4.7, applyLink: "https://www.axisbank.com/retail/cards/credit-card/magnus-credit-card" },
    { id: 3, name: "Ultimate", bank: "Standard Chartered", type: "Shopping", rewardRate: 3.3, fee: 5000, loungeAccess: true, welomeBonus: "5000 Points", rating: 4.5, applyLink: "https://www.sc.com/in/credit-cards/ultimate-card/" },
    { id: 4, name: "Cashback Card", bank: "SBI Card", type: "Shopping", rewardRate: 5.0, fee: 999, loungeAccess: false, welomeBonus: "Nil", rating: 4.6, applyLink: "https://www.sbicard.com/sbi-card-en/assets/cards/cashback-sbi-card.html" },
    { id: 5, name: "Regalia Gold", bank: "HDFC Bank", type: "Premium", rewardRate: 1.3, fee: 2500, loungeAccess: true, welomeBonus: "2500 Points", rating: 4.2, applyLink: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card" },
    { id: 6, name: "Rubyx", bank: "ICICI Bank", type: "Travel", rewardRate: 1.0, fee: 3000, loungeAccess: true, welomeBonus: "Vouchers worth ₹5k", rating: 3.9, applyLink: "https://www.icicibank.com/personal-banking/cards/credit-card/rubyx-credit-card" },
]

export default function CreditCardRankingPage() {
    const [sortConfig, setSortConfig] = useState<{ key: keyof CreditCard; direction: 'asc' | 'desc' }>({ key: 'rating', direction: 'desc' })

    const sortedData = [...CARDS].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
    })

    const requestSort = (key: keyof CreditCard) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Top Credit Cards (India 2024)</h1>
                            <p className="text-muted-foreground">Ranked by Reward Rate, Fees, and Perks.</p>
                        </div>
                    </div>
                </div>

                {/* Top Card Highlight */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {sortedData.slice(0, 3).map((card, idx) => (
                        <Card key={card.id} className={`relative overflow-hidden border-2 ${idx === 0 ? 'border-yellow-400 bg-yellow-50/50' : 'border-transparent'}`}>
                            {idx === 0 && (
                                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                                    <Trophy className="h-3 w-3" /> #1 Ranked
                                </div>
                            )}
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge variant="outline" className="mb-2">{card.type}</Badge>
                                        <CardTitle className="text-lg">{card.name}</CardTitle>
                                        <p className="text-sm text-gray-500">{card.bank}</p>
                                    </div>
                                    <div className="p-2 bg-white rounded-lg border shadow-sm">
                                        <div className="text-xs text-gray-400 font-bold text-center">RATING</div>
                                        <div className="text-lg font-bold text-green-600 text-center">{card.rating}</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2 text-sm mt-4">
                                    <div className="bg-white p-2 rounded border">
                                        <div className="text-gray-400 text-xs">Reward Rate</div>
                                        <div className="font-bold">{card.rewardRate}%</div>
                                    </div>
                                    <div className="bg-white p-2 rounded border">
                                        <div className="text-gray-400 text-xs">Annual Fee</div>
                                        <div className="font-bold">₹{card.fee}</div>
                                    </div>
                                </div>
                                {card.loungeAccess && (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-purple-600 bg-purple-50 p-2 rounded">
                                        <Plane className="h-3 w-3" /> Includes Lounge Access
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader><CardTitle>Full Comparison Table</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Rank</TableHead>
                                    <TableHead>Card Name</TableHead>
                                    <TableHead onClick={() => requestSort('rewardRate')} className="cursor-pointer hover:bg-slate-50">
                                        Reward Rate {sortConfig.key === 'rewardRate' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />)}
                                    </TableHead>
                                    <TableHead onClick={() => requestSort('fee')} className="cursor-pointer hover:bg-slate-50">
                                        Annual Fee {sortConfig.key === 'fee' && (sortConfig.direction === 'asc' ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />)}
                                    </TableHead>
                                    <TableHead>Welcome Bonus</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedData.map((card, idx) => (
                                    <TableRow key={card.id}>
                                        <TableCell className="font-medium text-center">
                                            {idx < 3 ? (
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    idx === 1 ? 'bg-slate-100 text-slate-700' :
                                                        'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {idx + 1}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 pl-2">{idx + 1}</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{card.name}</div>
                                            <div className="text-xs text-muted-foreground">{card.bank}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={card.rewardRate > 4 ? "default" : "secondary"}>
                                                {card.rewardRate}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell>₹{card.fee.toLocaleString()}</TableCell>
                                        <TableCell className="text-sm">{card.welomeBonus}</TableCell>
                                        <TableCell className="text-right flex gap-2 justify-end">
                                            <Button
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                onClick={() => window.open(card.applyLink, '_blank')}
                                            >
                                                Apply Now
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => alert(`${card.name} by ${card.bank}\n\nType: ${card.type}\nReard Rate: ${card.rewardRate}%\nAnnual Fee: ₹${card.fee}\n\nLounge Access: ${card.loungeAccess ? 'Yes' : 'No'}`)}>
                                                Details
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
