'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitOnboarding(data: any) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Check if profile exists, if not create it (upsert)
    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            email: user.email,
            full_name: data.full_name,
            age: parseInt(data.age) || 0,
            monthly_income: parseFloat(data.monthly_income) || 0,
            monthly_expenses: parseFloat(data.monthly_expenses) || 0,
            total_savings: parseFloat(data.total_savings) || 0,
            risk_score: data.risk_score || 50,
            risk_category: data.risk_category || 'Medium',
            role: 'user',
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'id'
        })

    if (error) {
        console.error('Onboarding error:', error)
        return { error: error.message }
    }

    return { success: true }
}
