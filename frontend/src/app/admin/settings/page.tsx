'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'

export default function AdminSettingsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/admin">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Admin
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Rating Settings</CardTitle>
                        <CardDescription>Configure investment rating algorithm and parameters</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 text-muted-foreground">
                            <p>Rating settings coming soon!</p>
                            <p className="text-sm mt-2">Configure rating weights, thresholds, and algorithms</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
