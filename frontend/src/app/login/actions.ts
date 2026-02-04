'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginWithEmail(email: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            // set this to false if you do not want the user to be automatically signed up
            shouldCreateUser: true,
            emailRedirectTo: 'http://localhost:3000/auth/callback',
        },
    })

    if (error) {
        redirect('/error')
    }

    // If successful, Supabase usually sends the email. 
    // We can redirect to a "Verify OTP" page or just tell the user to check their email.
    // For standard Magic Link:
    // return { success: true }

    // For OTP (Code):
    // You normally need a separate Verify step/form. 
    // Let's assume we want to just send the OTP first.

    return { success: true }
}

export async function verifyOtp(email: string, token: string) {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
    })

    if (error) {
        return { error: error.message }
    }

    redirect('/dashboard')
}
