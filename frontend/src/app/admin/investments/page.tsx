
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import DeleteInvestmentButton from './delete-button'

export default async function ManageInvestmentsPage() {
    const supabase = await createClient()

    const { data: investments } = await supabase
        .from('investments')
        .select('*')
        .order('name')

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Investments</h1>
                        <p className="text-muted-foreground">Add, edit, or remove investment options</p>
                    </div>
                    <Link href="/admin/investments/add">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Add Investment
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Investments ({investments?.length || 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>1Y Return</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Risk</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {investments?.map((inv: any) => (
                                    <TableRow key={inv.id}>
                                        <TableCell className="font-medium">{inv.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{inv.type}</Badge>
                                        </TableCell>
                                        <TableCell>₹{inv.current_price.toLocaleString()}</TableCell>
                                        <TableCell className={inv.return_1y >= 0 ? 'text-green-600' : 'text-red-600'}>
                                            {inv.return_1y}%
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <span className="font-semibold">{inv.rating_stars.toFixed(1)}</span>
                                                <span className="text-yellow-500">★</span>
                                                <span className="text-xs text-muted-foreground">({inv.rating_grade})</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={inv.volatility_score < 30 ? 'default' : inv.volatility_score < 60 ? 'secondary' : 'destructive'}>
                                                {inv.volatility_score < 30 ? 'Low' : inv.volatility_score < 60 ? 'Medium' : 'High'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Link href={`/admin/investments/edit/${inv.id}`}>
                                                <Button size="sm" variant="ghost">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <DeleteInvestmentButton id={inv.id} name={inv.name} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!investments || investments.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No investments yet. Click "Add Investment" to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
