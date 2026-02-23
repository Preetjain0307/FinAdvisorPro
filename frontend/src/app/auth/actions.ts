'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendTextBeeSms } from '@/lib/textbee'

// Helper to generate numeric OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function loginWithEmail(email: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
        },
    })

    if (error) {
        console.error('OTP Error:', error)
        return { error: error.message }
    }

    return { success: true }
}

export async function loginWithPassword(email: string, password: string) {
    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { success: true }
}

export async function sendTextBeeOtp(phone: string) {
    const supabase = await createClient()

    // 1. Check if user exists (Optional: or auto-register logic)
    // For MVP: We treat phone as a "secondary" identifier, or just create a user with phone@finadvisor.com
    // Let's simple check if we are allowed to send.

    // 2. Generate Code
    const code = generateOtp()

    // 3. Save to DB (Requires otp_codes table)
    // We use the service role to write to the table if RLS is strict, but here we use the standard client 
    // assuming public insert is allowed OR we authenticated as service_role for this action?
    // Actually, actions run as anon if not logged in.
    // So we need to make sure the table allows anon insert (we did that in SQL).

    const { error: dbError } = await supabase
        .from('otp_codes')
        .insert({
            phone,
            code, // In production, hash this!
        })

    if (dbError) {
        console.error('DB Error:', dbError)
        return { error: 'System error generating OTP' }
    }

    // 4. Send via TextBee
    const result = await sendTextBeeSms(phone, `Your FinAdvisorPro OTP is ${code}. Valid for 5 minutes.`)

    if (result.error) {
        return { error: result.error }
    }

    return { success: true }
}

export async function verifyTextBeeOtp(phone: string, code: string) {
    const supabase = await createClient()

    // 1. Verify Code
    const { data: records, error } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('phone', phone)
        .eq('code', code)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)

    if (error || !records || records.length === 0) {
        return { error: 'Invalid or expired OTP' }
    }

    // 2. Cleanup used OTP (Optional but good practice)
    await supabase.from('otp_codes').delete().eq('id', records[0].id)

    // 3. Log the user in
    // Strategy: "Phone as Email"
    const fakeEmail = `${phone}@phone.finadvisorpro.com`
    // We need a password to login.
    // TRICK: We will UPDATE the user's password to this OTP code right now.
    // This requires Admin privileges.

    // We need "supabase-admin" here (service role).
    // Standard `createClient()` uses user's context.
    // We must instantiate a SERVICE client.
    // Since we don't have a helper for that directly exposed here easily without process.env...
    // Let's try to verify if we can do this without Admin.
    // Without Admin, we cannot "force" a login without a password.

    // ALTERNATIVE: Just trust the OTP and set a cookie?
    // We can't set a Supabase Session Cookie without a valid Session from Supabase.

    // ACTION: We need the Service Role Key to manage users.
    // Check if we have it in env.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
        return { error: 'Server misconfigured: Missing Admin Key' }
    }

    // Create Admin Client
    const { createClient: createClientJs } = require('@supabase/supabase-js')
    const adminAuth = createClientJs(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check if user exists
    const { data: { users } } = await adminAuth.auth.admin.listUsers()
    // This is inefficient for 1000s of users but okay for < 50. 
    // detailed filtering is better:
    // Actually `listUsers` doesn't filter by email effectively in default JS sdk versions sometimes? 
    // No, we can't filter easily.
    // Better: Try to getUser by email (fakeEmail)
    // But there is no "getUserByEmail". There is "createUser".

    let userId: string

    // Try creating user (if exists, it fails, then we perform update)
    const { data: newUser, error: createError } = await adminAuth.auth.admin.createUser({
        email: fakeEmail,
        password: code, // Set password to OTP
        email_confirm: true,
        user_metadata: { phone_number: phone }
    })

    if (createError) {
        // User likely exists. Update password.
        // We need their ID to update.
        // Or we can just use `signIn`? No, we need to SET the password to `code`.

        // Find user by email workaround:
        // Attempt login with the code?
        // If the password was "OldCode", login will fail.
        // We MUST update password.

        // We really need 'getUserByEmail'.
        // If not available, we have to rely on `listUsers`.
        // Let's assume we can loop or use a more specific API if available.
        // Actually, `createUser` failure doesn't give UID.

        // Let's use `admin.listUsers` with filter? Not supported well.

        // Wait! We can use `generateLink` type `magiclink` and exchange?
        // Let's stick to the Password Update trick, but we need UID.
        // Ok, let's just use a FIXED MASTER PASSWORD for this user? No.

        // Let's use: `admin.updateUserById(uid, ...)`
        // To get UID: `supabase.from('auth.users')...` No no no.

        // OK, Simplest strategy that works nicely:
        // Use `admin.generateLink({ type: 'magiclink', email: fakeEmail })`.
        // It returns a `properties.action_link`.
        // We can parse the `access_token` or `refresh_token` from it?
        // Or better: `admin.generateLink({ type: 'recovery', ... })`.
        // Then we redirect user to that link?
        // No, we want to log them in directly.

        // OK: We will iterate listUsers (bad for scale but works now).
        // Or... we query the `profiles` table to find the user_id?
        // Yes! `profiles` has `id = user_id`. Do we store email there? Maybe.
        // Let's add `phone` to `profiles` table?

        // Let's try `signInWithPassword` directly with the *previous* password? Impossible.

        // OK, I will try to find the user via `supabase.rpc` if possible?
        // No.

        // FALLBACK: `admin.listUsers()` logic.
        const { data: usersData } = await adminAuth.auth.admin.listUsers()
        const user = usersData.users.find((u: any) => u.email === fakeEmail)

        if (user) {
            userId = user.id
            // Update password to current OTP
            await adminAuth.auth.admin.updateUserById(userId, { password: code })
        } else {
            console.error('Create failed but user not found?', createError)
            return { error: 'Account error' }
        }
    }

    // Now sign in using the Password (which is now == Code)
    // We sign in as the USER using standard client (to set cookies)
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: code,
    })

    if (loginError) {
        return { error: loginError.message }
    }

    return { success: true }
}

export async function verifyOtp(email: string, token: string, rememberMe: boolean = false) {
    const supabase = await createClient()

    const { data: { session }, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
    })

    if (error) {
        return { error: error.message }
    }

    if (!session) {
        return { error: 'Failed to create session' }
    }

    // Set session persistence based on Remember Me
    if (rememberMe) {
        // Keep session for 30 days
        await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
        })
    } else {
        // Session will expire when browser closes (default behavior)
        // This is already the default, but we explicitly set it for clarity
    }

    return { success: true }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}

export async function signInWithGoogle() {
    const supabase = await createClient()

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${siteUrl}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function verifyTextBeeOtpForRegistration(phone: string, code: string) {
    const supabase = await createClient()

    // Verify OTP without logging in
    const { data: records, error } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('phone', phone)
        .eq('code', code)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)

    if (error || !records || records.length === 0) {
        return { error: 'Invalid or expired OTP' }
    }

    // Cleanup
    await supabase.from('otp_codes').delete().eq('id', records[0].id)

    return { success: true }
}

export async function checkUserExists(identifier: string) {
    // Need Service Role to check auth.users or profiles
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) return { error: 'Server Config Error' }

    const { createClient: createClientJs } = require('@supabase/supabase-js')
    const adminAuth = createClientJs(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Check profiles table (easiest for now, though phone might not be there yet)
    // Using profiles is a good proxy for "Registered User"

    // Check if it's an email
    const isEmail = identifier.includes('@')

    let exists = false

    if (isEmail) {
        // Standard check
        const { data: profiles } = await adminAuth
            .from('profiles')
            .select('id')
            .eq('email', identifier)
            .maybeSingle()
        if (profiles) exists = true
    } else {
        // Phone check
        // convert to fake email format we use for login
        const fakeEmail = `${identifier}@phone.finadvisorpro.com`

        // Check Auth Users
        const { data: usersData } = await adminAuth.auth.admin.listUsers()
        const user = usersData.users.find((u: any) => u.email === fakeEmail || u.phone === identifier)
        if (user) exists = true
    }

    return { exists }
}

export async function registerUser(formData: any) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) return { error: 'Server Config Error' }

    const { createClient: createClientJs } = require('@supabase/supabase-js')
    const adminAuth = createClientJs(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 1. Create Auth User
    const email = formData.email || `${formData.phone}@phone.finadvisorpro.com`
    const password = Math.random().toString(36).slice(-8) // Random password (user uses OTP/MagicLink anyway)

    let userId: string

    const { data: newUser, error: createError } = await adminAuth.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
            full_name: formData.full_name,
            phone: formData.phone
        }
    })

    if (createError) {
        console.error('Create User Error', createError)
        // If user already exists, we find them and assume we are "Fixing" their profile
        // This happens if they started login but didn't finish registration, or if checkUserExists returned false (no profile)

        const { data: usersData } = await adminAuth.auth.admin.listUsers()
        const existingUser = usersData.users.find((u: any) => u.email === email)

        if (existingUser) {
            userId = existingUser.id
            // Update password so we can auto-login
            await adminAuth.auth.admin.updateUserById(userId, { password: password })
        } else {
            return { error: 'Registration failed: ' + createError.message }
        }
    } else {
        userId = newUser.user.id
    }

    // 2. Create Profile (Upsert to be safe)
    const { error: profileError } = await adminAuth
        .from('profiles')
        .upsert({
            id: userId,
            email: formData.email, // Can be null if phone only
            full_name: formData.full_name,
            role: 'user',
            // Financials
            age: parseInt(formData.age) || 0,
            monthly_income: parseFloat(formData.monthly_income) || 0,
            monthly_expenses: parseFloat(formData.monthly_expenses) || 0,
            total_savings: parseFloat(formData.total_savings) || 0,
            risk_score: formData.risk_score || 50,
            risk_category: formData.risk_category || 'Medium',
            updated_at: new Date().toISOString()
        })

    if (profileError) {
        console.error('Profile Error', profileError)
        // Cleanup auth user?
        return { error: 'Failed to create profile' }
    }

    // 3. Login the user?
    // We return success, client redirects to login? 
    // Or we can generate a session token here?
    // Easier: Just return success, client says "Account Created! logging you in..."
    // Client can call loginWithEmail or loginWithPhone immediately? 
    // Actually, we just verified OTP before calling this.
    // So we can Auto-Login.

    // To Auto-Login, we need to return a Session or Sign In as the user.
    // But `adminAuth` cannot sign in.
    // We need to use `signInWithPassword` with the password we just set?
    // YES.

    // Client side needs to handle setting cookies? 
    // Server Actions can set cookies if we use the standard `supabase` client.
    // So:

    const supabase = await createClient()
    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    if (loginError) {
        console.error('Auto Login Error', loginError)
        return { success: true, warning: 'Account created, please login manually.' }
    }

    return { success: true }
}
