import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AddInvestmentForm } from '@/components/add-investment-form'

export default async function AddPortfolioPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch available investments
    const { data: investments } = await supabase
        .from('investments')
        .select('*')
        .order('name')

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-2xl mx-auto">
                <AddInvestmentForm investments={investments || []} />
            </div>
        </div>
    )
}
