'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Phone } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export function PhoneLoginForm() {
    const router = useRouter()
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [loading, setLoading] = useState(false)
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

    useEffect(() => {
        // Initialize ReCaptcha on mount
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {
                    // reCAPTCHA solved
                }
            });
        }
    }, [])

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const appVerifier = window.recaptchaVerifier
            // Format phone number if needed (ensure +91 for India)
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`

            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier)
            setConfirmationResult(confirmation)
            setStep('otp')
            toast.success('OTP sent successfully!')
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Failed to send OTP')
            // Reset recaptcha
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear()
                window.recaptchaVerifier = undefined
            }
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        if (!confirmationResult) return

        try {
            const result = await confirmationResult.confirm(otp)
            const user = result.user

            // Success! Authentication complete.
            // Here you would typically sync with your Supabase DB via a Server Action
            // For now, we trust the client login

            toast.success('Phone verification successful!')
            setTimeout(() => {
                router.push('/dashboard')
            }, 1000)

        } catch (error) {
            console.error(error)
            toast.error('Invalid code')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div id="recaptcha-container"></div>

            {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <div className="flex gap-2">
                            <div className="flex items-center justify-center px-3 border rounded-md bg-muted text-muted-foreground text-sm font-medium">
                                +91
                            </div>
                            <Input
                                type="tel"
                                placeholder="98765 43210"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))} // Only numbers
                                required
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">We'll send a 6-digit code for verification.</p>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || phoneNumber.length < 10}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Phone className="mr-2 h-4 w-4" />
                        Send Code via SMS
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Enter Verification Code</Label>
                        <Input
                            type="text"
                            placeholder="123456"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            required
                            className="text-center text-lg tracking-widest"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Verify & Login
                    </Button>
                    <Button variant="ghost" type="button" onClick={() => setStep('phone')} className="w-full">
                        Change Number
                    </Button>
                </form>
            )}
        </div>
    )
}

// Add types for window object to support recaptcha
declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}
