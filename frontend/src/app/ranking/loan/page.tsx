"use client"

import { useState, useEffect } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Home, Percent, CheckCircle } from "lucide-react"
import { generateHomeLoans, MarketAsset } from "@/lib/market-data"

export default function LoanRankingPage() {
    const [loans, setLoans] = useState<MarketAsset[]>([])

    useEffect(() => {
        setLoans(generateHomeLoans().sort((a, b) => (a.interestRate || 10) - (b.interestRate || 10)))
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            <main className="container mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Home className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Best Home Loans (2025)</h1>
                        <p className="text-muted-foreground">Compare Interest Rates from Top Lenders.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Top Pick */}
                    <Card className="bg-blue-600 text-white lg:col-span-1 shadow-lg">
                        <CardHeader>
                            <CardTitle>AI Top Pick</CardTitle>
                            <CardDescription className="text-blue-100">Best balance of Rate & Service</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold mb-2">{loans[0]?.interestRate}%</div>
                            <div className="text-xl font-medium mb-4">{loans[0]?.name}</div>
                            <ul className="space-y-2 mb-6">
                                <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4" /> Zero Processing Fee</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4" /> Digital Sanction</li>
                            </ul>
                            <Button
                                className="w-full bg-white text-blue-700 hover:bg-blue-50"
                                onClick={() => loans[0]?.actionLink && window.open(loans[0].actionLink, '_blank')}
                            >
                                Apply Now
                            </Button>
                        </CardContent>
                    </Card>

                    {/* List */}
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>Lender Comparison</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Bank</TableHead>
                                        <TableHead>Interest Rate</TableHead>
                                        <TableHead>Processing Fee</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loans.map((loan) => (
                                        <TableRow key={loan.id}>
                                            <TableCell className="font-medium">{loan.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                                                    <Percent className="h-4 w-4 text-muted-foreground" />
                                                    {loan.interestRate}%
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">₹5,000 + GST</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => loan.actionLink && window.open(loan.actionLink, '_blank')}
                                                >
                                                    Apply
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
