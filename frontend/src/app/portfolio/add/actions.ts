'use server'

import { createClient } from '@/lib/supabase/server'

export async function addToPortfolio(data: { investment_id: string; quantity: number; average_buy_price: number }) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Verify investment exists
    const { data: investment } = await supabase
        .from('investments')
        .select('id')
        .eq('id', data.investment_id)
        .single()

    if (!investment) {
        return { error: 'Invalid investment selected' }
    }

    // Insert portfolio entry
    const { error } = await supabase
        .from('portfolios')
        .insert({
            user_id: user.id,
            investment_id: investment.id,
            quantity: data.quantity,
            average_buy_price: data.average_buy_price
        })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
