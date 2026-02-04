
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Users, Briefcase, BarChart, Settings } from 'lucide-react'
import Link from 'next/link'
import { LogoutButton } from '@/components/logout-button'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch stats
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: investmentCount } = await supabase.from('investments').select('*', { count: 'exact', head: true })

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen dark:bg-gray-900">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
                    <p className="text-muted-foreground">Manage users, investments, and risk engines.</p>
                </div>
                <LogoutButton variant="outline" />
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{investmentCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">AUM (Simulated)</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹1.2 Cr</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rating Engine</CardTitle>
                        <Settings className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Active</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Quick Actions</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/admin/investments">
                            <Button className="w-full justify-start" variant="outline">
                                📊 Manage Investments
                            </Button>
                        </Link>
                        <Link href="/admin/investments/add">
                            <Button className="w-full justify-start" variant="outline">
                                ➕ Add New Investment
                            </Button>
                        </Link>
                        <Link href="/admin/users">
                            <Button className="w-full justify-start" variant="outline">
                                👥 View All Users
                            </Button>
                        </Link>
                        <Link href="/admin/settings">
                            <Button className="w-full justify-start" variant="outline">
                                ⚙️ Rating Settings
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Management Tabs */}
            <Tabs defaultValue="investments" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="investments">Manage Investments</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="rating">Rating Engine</TabsTrigger>
                </TabsList>

                <TabsContent value="investments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Investment Database</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Investment management table coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Directory</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">User management table coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rating" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Rating Rules</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Rating engine controls coming soon...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
