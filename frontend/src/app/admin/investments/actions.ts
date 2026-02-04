'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInvestment(data: any) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Verify admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('investments')
        .insert({
            name: data.name,
            type: data.type,
            ticker_symbol: data.ticker_symbol,
            current_price: data.current_price,
            return_1y: data.return_1y,
            return_3y: data.return_3y || null,
            return_5y: data.return_5y || null,
            volatility_score: data.volatility_score,
            liquidity_score: data.liquidity_score,
            rating_stars: data.rating_stars,
            rating_grade: data.rating_grade,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })

    if (error) {
        console.error('Error creating investment:', error)
        return { error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/investments')

    return { success: true }
}

export async function updateInvestment(id: string, data: any) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Verify admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('investments')
        .update({
            name: data.name,
            type: data.type,
            ticker_symbol: data.ticker_symbol,
            current_price: data.current_price,
            return_1y: data.return_1y,
            return_3y: data.return_3y || null,
            return_5y: data.return_5y || null,
            volatility_score: data.volatility_score,
            liquidity_score: data.liquidity_score,
            rating_stars: data.rating_stars,
            rating_grade: data.rating_grade,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating investment:', error)
        return { error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/investments')

    return { success: true }
}

export async function deleteInvestment(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Verify admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting investment:', error)
        return { error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/investments')

    return { success: true }
}
