'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInvestment(data: {
    name: string
    type: string
    ticker_symbol: string
    current_price: number
    return_1y: number
    return_3y: number
    return_5y: number
    volatility_score: number
    liquidity_score: number
    rating_stars: number
    rating_grade: string
}) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('investments')
        .insert(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function updateInvestment(id: string, data: any) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('investments')
        .update(data)
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function deleteInvestment(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
}

export async function getAllInvestments() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('name')

    if (error) {
        return { error: error.message, data: [] }
    }

    return { data }
}
