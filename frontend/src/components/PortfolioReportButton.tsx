'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { jsPDF } from "jspdf"

interface PortfolioReportButtonProps {
    portfolio: any[]
    profile: any
    goals: any[]
    totalValue: number
    totalInvested: number
    gainLoss: number
}

export default function PortfolioReportButton({
    portfolio,
    profile,
    goals,
    totalValue,
    totalInvested,
    gainLoss
}: PortfolioReportButtonProps) {

    const generatePDF = () => {
        const doc = new jsPDF()

        // Title
        doc.setFontSize(20)
        doc.setTextColor(37, 99, 235) // Blue
        doc.text('Fin Advisor Pro', 20, 20)

        doc.setFontSize(16)
        doc.setTextColor(0, 0, 0)
        doc.text('Portfolio Report', 20, 30)

        // User Info
        doc.setFontSize(12)
        doc.text(`Investor: ${profile?.full_name || 'N/A'}`, 20, 45)
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 52)

        // Portfolio Summary
        doc.setFontSize(14)
        doc.setTextColor(37, 99, 235)
        doc.text('Portfolio Summary', 20, 65)

        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0)
        doc.text(`Total Value: ₹${totalValue.toLocaleString()}`, 20, 75)
        doc.text(`Total Invested: ₹${totalInvested.toLocaleString()}`, 20, 82)
        doc.text(`Gain/Loss: ₹${gainLoss.toLocaleString()} (${((gainLoss / totalInvested) * 100).toFixed(2)}%)`, 20, 89)
        doc.text(`Risk Profile: ${profile?.risk_category || 'N/A'}`, 20, 96)

        // Holdings
        doc.setFontSize(14)
        doc.setTextColor(37, 99, 235)
        doc.text('Holdings', 20, 115)

        let yPos = 125
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 0)

        if (portfolio && portfolio.length > 0) {
            portfolio.forEach((item: any, index: number) => {
                const currentValue = item.quantity * item.investments.current_price
                const investedValue = item.quantity * item.average_buy_price
                const itemGain = currentValue - investedValue

                doc.text(`${index + 1}. ${item.investments.name}`, 20, yPos)
                doc.text(`   Qty: ${item.quantity} | Avg Price: ₹${item.average_buy_price}`, 20, yPos + 5)
                doc.text(`   Current: ₹${currentValue.toLocaleString()} | P&L: ₹${itemGain.toFixed(2)}`, 20, yPos + 10)
                yPos += 20

                if (yPos > 270) {
                    doc.addPage()
                    yPos = 20
                }
            })
        } else {
            doc.text('No holdings yet', 20, yPos)
            yPos += 10
        }

        // Goals
        if (goals && goals.length > 0) {
            yPos += 15
            if (yPos > 250) {
                doc.addPage()
                yPos = 20
            }

            doc.setFontSize(14)
            doc.setTextColor(37, 99, 235)
            doc.text('Financial Goals', 20, yPos)
            yPos += 10

            doc.setFontSize(10)
            doc.setTextColor(0, 0, 0)

            goals.forEach((goal: any, index: number) => {
                const progress = ((goal.current_amount || 0) / goal.target_amount) * 100
                doc.text(`${index + 1}. ${goal.name}`, 20, yPos)
                doc.text(`   Target: ₹${goal.target_amount.toLocaleString()} | Progress: ${progress.toFixed(1)}%`, 20, yPos + 5)
                yPos += 12
            })
        }

        // Footer
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text('This report is generated for informational purposes only.', 20, 285)
        doc.text('Past performance does not guarantee future results.', 20, 290)

        // Save
        doc.save(`portfolio-report-${new Date().toISOString().split('T')[0]}.pdf`)
    }

    return (
        <Button onClick={generatePDF} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
        </Button>
    )
}
