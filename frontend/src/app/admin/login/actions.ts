'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function adminLogin(email: string, password: string, rememberMe: boolean = false) {
    console.log('[SERVER] adminLogin called')
    const supabase = await createClient()

    // Sign in with password (admin only)
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (authError) {
        console.error('[SERVER] Auth error:', authError.message)
        return { error: authError.message }
    }

    if (!user) {
        return { error: 'Login failed' }
    }

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError || profile?.role !== 'admin') {
        console.error('[SERVER] Not admin! Role:', profile?.role, 'Error:', profileError)
        // Not an admin, sign them out
        await supabase.auth.signOut()
        return { error: 'Unauthorized: Admin access only' }
    }

    // Handle Remember Me
    // Note: Session persistence is handled by client-side storage
    // The rememberMe flag can be passed to client if needed

    return { success: true, rememberMe }
}

export async function adminLogout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/admin/login')
}
