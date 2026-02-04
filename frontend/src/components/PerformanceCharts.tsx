'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Sample performance data (in production, fetch from API)
const performanceData = [
    { month: 'Jan', portfolio: 500000, benchmark: 495000 },
    { month: 'Feb', portfolio: 510000, benchmark: 505000 },
    { month: 'Mar', portfolio: 515000, benchmark: 508000 },
    { month: 'Apr', portfolio: 520000, benchmark: 512000 },
    { month: 'May', portfolio: 535000, benchmark: 520000 },
    { month: 'Jun', portfolio: 547500, benchmark: 528000 },
]

const returnsData = [
    { period: '1M', returns: 2.3 },
    { period: '3M', returns: 5.8 },
    { period: '6M', returns: 9.5 },
    { period: '1Y', returns: 12.5 },
]

export default function PerformanceCharts() {
    return (
        <div className="grid md:grid-cols-2 gap-6">

            {/* Portfolio Growth Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Portfolio Growth</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                            <Legend />
                            <Line type="monotone" dataKey="portfolio" stroke="#2563eb" strokeWidth={2} name="Your Portfolio" />
                            <Line type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="NIFTY 50" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Returns by Period */}
            <Card>
                <CardHeader>
                    <CardTitle>Returns by Period</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={returnsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `${value}%`} />
                            <Bar dataKey="returns" fill="#2563eb" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    )
}
